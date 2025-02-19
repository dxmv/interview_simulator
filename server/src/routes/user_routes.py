from flask import Blueprint, request, jsonify
from services.user.user_service import UserService
from utils.auth import jwt_required
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
@jwt_required
def get_profile():
    '''
    Get user profile
    '''
    try:
        print("Getting profile")
        user = user_service.get_user()
        return jsonify({'user': user.to_dict()}), 200
    except ValueError as e:
        print(e)
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@user_blueprint.route("/profile", methods=['PUT'])
@jwt_required
def update_profile():
    '''
    Update user profile
    '''
    try:
        user = user_service.update_user(request.json)
        return jsonify({'user': user.to_dict()}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_blueprint.route("/delete", methods=['DELETE'])
@jwt_required
def delete_user():
    '''
    Delete user
    '''
    try:
        user_service.delete_user()
        return jsonify({'message': 'User deleted successfully'}), 200
    except ValueError as e:
        print(e)
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@user_blueprint.route("/password", methods=['PUT'])
@jwt_required
def change_password():
    '''
    Change user password
    '''
    try:
        if not request.json or not 'current_password' in request.json or not 'new_password' in request.json:
            raise ValueError('Current password and new password are required')
            
        user = user_service.change_password(request.json)
        return jsonify({'message': 'Password changed successfully'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
