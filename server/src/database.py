from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_jwt_extended import create_access_token
from sqlalchemy.dialects.postgresql import JSONB

# Initialize SQLAlchemy instance
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, email, password):
        self.email = email
        self.password = password

    def __repr__(self):
        return f'<User {self.email}>'

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def get_token(self):
        return create_access_token(identity=str(self.id))

class CV(db.Model):
    __tablename__ = 'cvs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    personal_info = db.Column(JSONB, nullable=False)
    skills = db.Column(JSONB, nullable=False)
    education = db.Column(JSONB, nullable=False)
    work_experience = db.Column(JSONB, nullable=False)
    projects = db.Column(JSONB, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with User
    user = db.relationship('User', backref=db.backref('cv', uselist=False))

    def __repr__(self):
        return f'<CV {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'personal_info': self.personal_info,
            'skills': self.skills,
            'education': self.education,
            'work_experience': self.work_experience,
            'projects': self.projects,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Interview(db.Model):
    __tablename__ = 'interviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    messages = db.Column(JSONB, nullable=False, default=list)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    summary = db.Column(db.Text, nullable=True)
    grade = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with User
    user = db.relationship('User', backref=db.backref('interviews', lazy=True))

    def __repr__(self):
        return f'<Interview {self.id} for user {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'messages': self.messages,
            'date': self.date.isoformat() if self.date else None,
            'summary': self.summary,
            'grade': self.grade,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 