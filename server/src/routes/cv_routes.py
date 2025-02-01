from flask import Blueprint, request, jsonify
from services.cv.cv_service import CVService

cv_blueprint = Blueprint('cv', __name__)
cv_service = None

def init_cv_routes(upload_folder):
    global cv_service
    cv_service = CVService(upload_folder)

@cv_blueprint.route("/upload", methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        filename = cv_service.save_file(file)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cv_blueprint.route('/files', methods=['GET'])
def list_files():
    try:
        files = cv_service.list_files()
        return jsonify({'files': files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500