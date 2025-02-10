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
            # Verify the JWT token in the request
            verify_jwt_in_request()
            # Optionally, log the identity of the authenticated user
            identity = get_jwt_identity()
            print(f"Authenticated user: {identity}")
            return fn(*args, **kwargs)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return jsonify({'error': 'Authentication failed'}), 401
    return wrapper