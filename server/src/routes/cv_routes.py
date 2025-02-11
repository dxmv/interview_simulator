from flask import Blueprint, request, jsonify
from services.cv.cv_service import CVService
from utils.auth import jwt_required

cv_blueprint = Blueprint('cv', __name__)
cv_service = None

def init_cv_routes():
    global cv_service
    cv_service = CVService()

@cv_blueprint.route("/upload", methods=['POST'])
@jwt_required
def save_cv():
    '''
    Save a cv to the database
    '''
    try:
        print("s")
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        cv = cv_service.save_cv(file)
        
        return jsonify({
            'message': 'CV analyzed successfully',
            'cv': cv
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cv_blueprint.route('/', methods=['GET'])
@jwt_required
def get_cv_analysis():
    '''Get CV analysis for current user'''
    try:
        print("get cv analysis")
        cv_analysis = cv_service.get_cv_analysis()
        return jsonify(cv_analysis)
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cv_blueprint.route('/update', methods=['POST'])
@jwt_required
def update_cv():
    '''Update CV analysis for current user'''
    try:
        print("update cv")
        cv_analysis = cv_service.update_cv_analysis(request.json)
        return jsonify(cv_analysis), 200
    except ValueError as e:
        print(e)
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500