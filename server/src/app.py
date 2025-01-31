from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# Configure CORS to allow specific endpoints and methods
CORS(app, resources={
    r"/cv/*": {
        "origins": ["http://localhost:5173"],  # Your React app's URL
        "methods": ["POST", "OPTIONS", "GET"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/cv/upload", methods=['POST'])
def upload_file():
    try:
        # Check if a file was included in the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        
        # If user doesn't select file, browser might submit empty file
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file:
            filename = file.filename
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            return jsonify({
                'message': 'File uploaded successfully',
                'filename': filename
            }), 200
        
        return jsonify({'error': 'File type not allowed'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/cv/files', methods=['GET'])
def list_files():
    files = []
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if allowed_file(filename):
            files.append(filename)
    return jsonify({'files': files})

if __name__ == "__main__":
    app.run(debug=True)