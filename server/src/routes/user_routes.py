from flask import Blueprint, request, jsonify
from services.user.user_service import UserService

user_blueprint = Blueprint('user', __name__)
user_service = None

def init_user_routes(db):
    global user_service
    user_service = UserService(db)

@user_blueprint.route("/register", methods=['POST'])
def register():
    '''
    Register a new user
    '''
    try:
        user = user_service.register_user(request.json)
        return jsonify(user.to_dict()), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_blueprint.route("/login", methods=['POST'])
def login():
    '''
    Login a user
    '''
    try:
        if not request.json or not 'email' in request.json or not 'password' in request.json:
            raise ValueError('Email and password are required')
            
        user = user_service.login_user(request.json)
        token = user.get_token()
        return jsonify({
            'token': token,
            'user': user.to_dict()
        }), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_blueprint.route("/profile", methods=['GET'])
def get_profile():
    '''
    Get user profile
    '''
    try:
        print("Getting profile")
        user = user_service.get_user(1)
        return jsonify({'user': user.to_dict()}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_blueprint.route("/profile", methods=['PUT'])
def update_profile():
    '''
    Update user profile
    '''
    try:
        # TODO: Implement update profile
        pass
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
