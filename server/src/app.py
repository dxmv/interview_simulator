from flask import Flask
from flask_cors import CORS
from routes.cv_routes import cv_blueprint, init_cv_routes
from routes.interview_routes import interview_blueprint, init_interview_routes
from flask_socketio import SocketIO


if __name__ == "__main__":
    # Initialize Flask app
    app = Flask(__name__)

    # Allow requests from all origins
    CORS(app)
    socketio = SocketIO(app, cors_allowed_origins="*")

    # Configure upload folder
    UPLOAD_FOLDER = 'uploads'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # Initialize routes
    init_cv_routes(UPLOAD_FOLDER)
    init_interview_routes(socketio)

    # Register blueprints
    app.register_blueprint(cv_blueprint, url_prefix='/cv')
    app.register_blueprint(interview_blueprint, url_prefix='/interview')
    socketio.run(app, debug=True)