from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from database import db, User
from flask_jwt_extended import JWTManager
from datetime import timedelta
# import routes
from routes.cv_routes import cv_blueprint, init_cv_routes
from routes.interview_routes import interview_blueprint, init_interview_routes
from routes.user_routes import user_blueprint, init_user_routes

# Load environment variables from .env file
load_dotenv()

if __name__ == "__main__":
    # Initialize Flask app
    app = Flask(__name__)

    # Configure database
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise ValueError("No DATABASE_URL found in environment variables")
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize database
    db.init_app(app)
    
    # Create all database tables
    with app.app_context():
        db.create_all()

    # Allow requests from all origins
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    socketio = SocketIO(app, cors_allowed_origins="*")

    # Configure upload folder
    UPLOAD_FOLDER = 'uploads'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # Initialize routes
    init_cv_routes()
    init_interview_routes(socketio)
    init_user_routes(db)

    # Register blueprints
    app.register_blueprint(cv_blueprint, url_prefix='/api/cv')
    app.register_blueprint(interview_blueprint, url_prefix='/api/interview')
    app.register_blueprint(user_blueprint, url_prefix='/api/user')

    # Configure JWT
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')  # Change in production
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)  # Token expires in 1 hour
    app.config['JWT_IDENTITY_CLAIM'] = 'sub'
    jwt = JWTManager(app)

    socketio.run(app, debug=True)
