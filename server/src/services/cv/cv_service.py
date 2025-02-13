import os
import json
from database import db, CV
from services.llm.llm_client import LLMClient
from flask_jwt_extended import get_jwt_identity
from services.cv.cv_parser import extract_text_from_pdf

class CVService:
    def __init__(self):
        '''
        Initialize the CV service
        '''
        self.llm_client = LLMClient()
    
    def get_cv_prompt(self) -> str:
        return """You are a CV analyzer. Your task is to analyze the CV and return ONLY a JSON object with the following structure:
{
    "personal_info": {
        "name": string,
    },
    "skills":{
        "technical": string[],
        "soft": string[]
    },
    "education": [{
        "degree": string,
        "institution": string,
        "year": number or null
    }],
    "work_experience": [{
        "company": string,
        "role": string,
        "duration": string,
        "key_responsibilities": string[]
    }],
    "projects": [{
        "name": string,
        "description": string,
        "technologies": string[]
    }],
}

Do not include any explanations or additional text, only return the valid JSON object."""

    def save_cv(self, file):
        '''
        Analyzes the CV and saves/updates it in the database
        Returns the CV analysis
        '''
        if not file or file.filename == '':
            raise ValueError('No file selected')

        user_id = get_jwt_identity()
        if not user_id:
            raise ValueError('User not authenticated')

        # Process the file in memory
        cv_text = extract_text_from_pdf(file)
        cv_data = self.analyze_cv(cv_text)

        # Get or create CV record
        cv = CV.query.filter_by(user_id=user_id).first()
        if not cv:
            cv = CV(user_id=user_id)
            db.session.add(cv)

        # Update CV data
        cv.personal_info = cv_data['personal_info']
        cv.skills = cv_data['skills']
        cv.education = cv_data['education']
        cv.work_experience = cv_data['work_experience']
        cv.projects = cv_data['projects']

        try:
            db.session.commit()
            return cv.to_dict()
        except Exception as e:
            print(f'Failed to save CV: {str(e)}')
            db.session.rollback()
            raise ValueError(f'Failed to save CV: {str(e)}')

    def analyze_cv(self, cv_text: str) -> dict:
        """Analyze CV text using LLM"""
        try:
            prompt = f"{self.get_cv_prompt()}\n\nCV Content:\n{cv_text}"
            response = self.llm_client.get_completion(prompt)
            return self.llm_client.extract_json_from_response(response)
        except ValueError as e:
            raise ValueError(f"Failed to analyze CV: {str(e)}")

    def get_cv_analysis(self):
        '''
        Returns the analysis of the CV
        '''
        user_id = get_jwt_identity()
        if not user_id:
            raise ValueError('User not authenticated')

        cv = CV.query.filter_by(user_id=user_id).first()
        if not cv:
            raise ValueError('No CV found for user')

        return cv.to_dict()

    def update_cv_analysis(self, cv_analysis: dict):
        '''
        Updates the CV analysis
        '''
        user_id = get_jwt_identity()
        if not user_id:
            raise ValueError('User not authenticated')

        cv = CV.query.filter_by(user_id=user_id).first()
        if not cv:
            raise ValueError('No CV found for user')

        try:
            cv.personal_info = cv_analysis['personal_info']
            cv.skills = cv_analysis['skills']
            cv.education = cv_analysis['education']
            cv.work_experience = cv_analysis['work_experience']
            cv.projects = cv_analysis['projects']

            db.session.commit()
            return cv.to_dict()
        except Exception as e:
            db.session.rollback()
            raise ValueError(f'Failed to update CV analysis: {str(e)}')