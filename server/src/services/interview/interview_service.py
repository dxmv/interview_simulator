import requests
import json
import os
from services.interview.interview_llm import InterviewLLM

class InterviewService:
    def __init__(self):
        self.num_questions = 0
        self.questions = []
        self.current_question_index = 0
        self.ollama_api_url = "http://localhost:11434/api/generate"
        self.llm_service = InterviewLLM()

    def start_interview(self, num_questions):
        '''
        Start the interview with the given number of questions.
        '''
        self.num_questions = num_questions
        self.questions = self.llm_service.generate_interview_questions(num_questions)
        self.current_question_index = 0
        return self.questions

    def evaluate_answer(self, answer):
        '''
        Evaluate the candidate's answer using the LLM.
        '''
        return self.llm_service.evaluate_answer(self.questions[self.current_question_index], answer)

    def get_next_question(self):
        '''
        Get the next question in the interview.
        '''
        self.current_question_index += 1
        if self.current_question_index < len(self.questions):
            return self.questions[self.current_question_index]
        else:
            return None