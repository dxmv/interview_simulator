from database import User
from flask_jwt_extended import get_jwt_identity

class UserService:

    def __init__(self, db):
        self.db = db


    def register_user(self, user_data):
        '''
        Register a new user
        '''
        new_user = User(email=user_data['email'], password=user_data['password'])
        self.db.session.add(new_user)
        self.db.session.commit()
        return new_user

    def get_user(self):
        '''
        Get the current user
        '''
        user_id = get_jwt_identity()
        if user_id is None:
            raise ValueError('User not found')
        return User.query.filter_by(id=user_id).first()

    def update_user(self, user_data):
        '''
        Update the current user's email
        '''
        if 'email' not in user_data:
            raise ValueError('Email is required')

        user_id = get_jwt_identity()
        if user_id is None:
            raise ValueError('User not found')

        try:
            # Check if email is already taken
            existing_user = User.query.filter_by(email=user_data['email']).first()
            if existing_user and str(existing_user.id) != user_id:
                raise ValueError('Email is already taken')

            # Get the user from the database
            user = User.query.filter_by(id=user_id).first()
            if not user:
                raise ValueError('User not found')

            # Update the user's email
            user.email = user_data['email']

            # Commit the changes to the database
            self.db.session.commit()
            return user

        except Exception as e:
            self.db.session.rollback()
            print(f"Error updating user: {str(e)}")
            raise ValueError(f"Failed to update user: {str(e)}")

    def login_user(self, credentials):
        '''
        Login a user
        '''
        user = User.query.filter_by(email=credentials['email']).first()
        if not user:
            raise ValueError('Invalid email or password')
            
        if user.password != credentials['password']:  # In production, use proper password hashing!
            raise ValueError('Invalid email or password')
            
        return user

    def delete_user(self):
        '''
        Delete the current user
        '''
        user_id = get_jwt_identity()
        if user_id is None:
            raise ValueError('User not found')
        
        try:
            user = User.query.filter_by(id=user_id).first()
            if not user:
                raise ValueError('User not found')
            
            # Delete the user - related records will be deleted automatically
            self.db.session.delete(user)
            self.db.session.commit()
                
        except Exception as e:
            self.db.session.rollback()
            print(f"Error deleting user: {str(e)}")
            raise ValueError(f"Failed to delete user: {str(e)}")

    def change_password(self, password_data):
        '''
        Change the user's password
        '''
        user_id = get_jwt_identity()
        if user_id is None:
            raise ValueError('User not found')

        try:
            # Get the user from the database
            user = User.query.filter_by(id=user_id).first()
            if not user:
                raise ValueError('User not found')

            # Verify current password
            if user.password != password_data['current_password']:  # In production, use proper password hashing!
                raise ValueError('Current password is incorrect')

            # Update the password
            user.password = password_data['new_password']  # In production, hash the password!
            self.db.session.commit()
            return user

        except Exception as e:
            self.db.session.rollback()
            print(f"Error changing password: {str(e)}")
            raise ValueError(f"Failed to change password: {str(e)}")
