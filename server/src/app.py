from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO


# import routes
from routes.cv_routes import cv_blueprint, init_cv_routes
from routes.interview_routes import interview_blueprint, init_interview_routes
from routes.user_routes import user_blueprint, init_user_routes



if __name__ == "__main__":
    # Initialize Flask app
    app = Flask(__name__)

    # Allow requests from all origins
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    socketio = SocketIO(app, cors_allowed_origins="*")

    # Configure upload folder
    UPLOAD_FOLDER = 'uploads'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # Initialize routes
    init_cv_routes(UPLOAD_FOLDER)
    init_interview_routes(socketio)

    # Register blueprints
    app.register_blueprint(cv_blueprint, url_prefix='/api/cv')
    app.register_blueprint(interview_blueprint, url_prefix='/api/interview')
    app.register_blueprint(user_blueprint, url_prefix='/api/user')
    socketio.run(app, debug=True)
