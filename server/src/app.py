from flask import Flask
from flask_cors import CORS
from routes.cv_routes import cv_blueprint, init_cv_routes

app = Flask(__name__)

# Configure CORS to allow specific endpoints and methods
CORS(app, resources={
    r"/cv/*": {
        "origins": ["http://localhost:5173"],  # Your React app's URL
        "methods": ["POST", "OPTIONS", "GET"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize CV routes
init_cv_routes(UPLOAD_FOLDER)

# Register blueprints
app.register_blueprint(cv_blueprint, url_prefix='/cv')

if __name__ == "__main__":
    app.run(debug=True)