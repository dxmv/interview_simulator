import requests
import json
import os
from services.interview.interview_llm import InterviewLLM

class InterviewService:
    def __init__(self):
        self.num_questions = 0
        self.interview_data = {}  # Map to store questions and answers
        self.current_question_index = 0
        self.ollama_api_url = "http://localhost:11434/api/generate"
        self.llm_service = InterviewLLM()

    def start_interview(self, num_questions):
        '''
        Start the interview with the given number of questions.
        '''
        self.num_questions = num_questions
        questions = ["Tell me about yourself.","What are your strengths?","What are your weaknesses?","What are your goals?","What are your hobbies?"]
        
        # Initialize interview data map
        self.interview_data = {
            idx: {
                "question": question,
                "answer": None
            } for idx, question in enumerate(questions)
        }
        
        self.current_question_index = 0
        return [{"question": q, "answer": ""} for q in questions]

    def evaluate_answer(self, answer):
        '''
        Evaluate the candidate's answer using the LLM.
        '''
        current_question = self.interview_data[self.current_question_index]["question"]
        evaluation = self.llm_service.evaluate_answer(current_question, answer)
        
        # Store the answer in our map
        self.interview_data[self.current_question_index]["answer"] = answer
        
        # If this was the last question, do final evaluation
        if evaluation.get('move_to_next') and self.current_question_index == len(self.interview_data) - 1 or evaluation.get('end_interview'):
            questions = [data["question"] for data in self.interview_data.values()]
            answers = [data["answer"] for data in self.interview_data.values()]
            final_evaluation = self.llm_service._evaluate_whole_interview(questions, answers)
            return {
                "response": "Thank you for completing the interview!",
                "move_to_next": False,
                "end_interview": True,
                "final_evaluation": final_evaluation
            }
            
        return evaluation

    def get_next_question(self):
        '''
        Get the next question in the interview.
        '''
        self.current_question_index += 1
        if self.current_question_index < len(self.interview_data):
            return self.interview_data[self.current_question_index]["question"]
        return None