from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify

def jwt_required(fn):
    '''
    Decorator to ensure that the request is authenticated
    '''
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()  # This will verify the 'Bearer' token
            current_user_id = get_jwt_identity()
            if not current_user_id:
                return jsonify({'error': 'Invalid token'}), 401
            return fn(*args, **kwargs)
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return jsonify({'error': 'Authentication failed'}), 401
    return wrapper