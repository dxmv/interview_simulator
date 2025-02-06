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
        if (evaluation.get('move_to_next') and self.current_question_index == len(self.interview_data) - 1) or evaluation.get('end_interview'):
            questions = [data["question"] for data in self.interview_data.values()]
            answers = [data["answer"] for data in self.interview_data.values()]
            final_evaluation = self.llm_service._evaluate_whole_interview(questions, answers)
            return {
                "response": evaluation.get('response') if evaluation.get('end_interview') else "Thank you for completing the interview!",
                "move_to_next": False,
                "end_interview": True,
                "final_evaluation": final_evaluation
            }
            
        return evaluation

    def save_interview(self, data)->bool:
        '''
        Save the interview to the database.
        '''
        print(f"Saving interview: {data}")
        file_path = '/Users/dimitrijestepanovic/Projects/WebApps/interviewer/server/src/uploads/interviews.json'
        try:
            # Create the uploads directory if it doesn't exist
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            # Load existing interviews or create a new list
            interviews = []
            if os.path.exists(file_path):
                with open(file_path, 'r') as file:
                    try:
                        interviews = json.load(file)
                    except json.JSONDecodeError:
                        interviews = []

            # Convert datetime to string for JSON serialization
            if isinstance(data.get('date'), str):
                data['date'] = data['date']
            
            # Append the new interview data
            data["id"] = len(interviews) + 1
            interviews.append(data)

            # Save the updated interviews back to the file
            with open(file_path, 'w') as file:
                json.dump(interviews, file, indent=4, default=str)
            
            print(f"Interview saved to {file_path}")
            return True
        except Exception as e:
            print(f"Error saving interview: {str(e)}")
            return False

    def delete_interview(self, id):
        '''
        Delete the interview with the given id.
        '''
        try:
            file_path = '/Users/dimitrijestepanovic/Projects/WebApps/interviewer/server/src/uploads/interviews.json'
            with open(file_path, 'r') as file:
                interviews = json.load(file)
            interviews = [interview for interview in interviews if interview["id"] != id]
            with open(file_path, 'w') as file:
                json.dump(interviews, file, indent=4, default=str)
            return True
        except Exception as e:
            print(f"Error deleting interview: {str(e)}")
            return False


    def get_interviews(self):
        '''
        Get all interviews.
        '''
        file_path = '/Users/dimitrijestepanovic/Projects/WebApps/interviewer/server/src/uploads/interviews.json'
        with open(file_path, 'r') as file:
            return json.load(file)

    def get_next_question(self):
        '''
        Get the next question in the interview.
        '''
        self.current_question_index += 1
        if self.current_question_index < len(self.interview_data):
            return self.interview_data[self.current_question_index]["question"]
        return None