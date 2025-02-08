from database import User

class UserService:

    def __init__(self, db):
        self.db = db


    def register_user(self, user_data):
        new_user = User(email=user_data['email'], password=user_data['password'])
        self.db.session.add(new_user)
        self.db.session.commit()
        return new_user

    def get_user(self, id: int):
        return self.db.get_or_404(User, id)

    def update_user(self, user):
        pass

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
