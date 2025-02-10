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
    "technical_skills": string[],
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
        Analyzes the CV and saves it to the database (without saving the file)
        '''
        print(file)
        if not file or file.filename == '':
            raise ValueError('No file selected')

        user_id = get_jwt_identity()
        if not user_id:
            raise ValueError('User not authenticated')

        # Process the file in memory
        cv_text = extract_text_from_pdf(file)  # Uses the file object directly
        cv_data = self.analyze_cv(cv_text)

        # Database logic remains unchanged
        existing_cv = CV.query.filter_by(user_id=user_id).first()
        if existing_cv:
            existing_cv.personal_info = cv_data['personal_info']
            existing_cv.skills = {'technical': cv_data['technical_skills']}
            existing_cv.education = cv_data['education']
            existing_cv.work_experience = cv_data['work_experience']
            existing_cv.projects = cv_data['projects']
        else:
            new_cv = CV(
                user_id=user_id,
                personal_info=cv_data['personal_info'],
                skills={'technical': cv_data['technical_skills']},
                education=cv_data['education'],
                work_experience=cv_data['work_experience'],
                projects=cv_data['projects']
            )
            db.session.add(new_cv)

        try:
            db.session.commit()
            return "CV processed successfully"  # No filename needed
        except Exception as e:
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