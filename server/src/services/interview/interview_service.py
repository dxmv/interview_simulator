from database import db, Interview
from services.interview.interview_llm import InterviewLLM
from datetime import datetime

class InterviewService:
    def __init__(self):
        self.num_questions = 0
        self.interview_data = {}  # Map to store questions and answers
        self.current_question_index = 0
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

    def save_interview(self, data) -> bool:
        '''
        Save the interview to the database.
        '''
        try:
            user_id = data.get('user_id')
            if not user_id:
                raise ValueError('User not authenticated')

            # Create new interview
            new_interview = Interview(
                user_id=user_id,
                messages=data.get('messages', []),
                date=datetime.utcnow(),
                summary=data.get('summary'),
                grade=data.get('grade')
            )

            print(new_interview)  # Debug log
            db.session.add(new_interview)
            db.session.commit()
            print("Interview saved successfully")  # Debug log
            
            return True
        except Exception as e:
            print(f"Error saving interview: {str(e)}")
            db.session.rollback()
            return False

    def delete_interview(self, interview_id):
        '''
        Delete the interview with the given id.
        '''
        try:
            user_id = get_jwt_identity()
            if not user_id:
                raise ValueError('User not authenticated')

            interview = Interview.query.filter_by(id=interview_id, user_id=user_id).first()
            if not interview:
                raise ValueError('Interview not found')

            db.session.delete(interview)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Error deleting interview: {str(e)}")
            db.session.rollback()
            return False

    def get_interviews(self):
        '''
        Get all interviews for the current user.
        '''
        try:
            user_id = get_jwt_identity()
            if not user_id:
                raise ValueError('User not authenticated')

            interviews = Interview.query.filter_by(user_id=user_id).order_by(Interview.date.desc()).all()
            return [interview.to_dict() for interview in interviews]
        except Exception as e:
            print(f"Error getting interviews: {str(e)}")
            return []

    def get_next_question(self):
        '''
        Get the next question in the interview.
        '''
        self.current_question_index += 1
        if self.current_question_index < len(self.interview_data):
            return self.interview_data[self.current_question_index]["question"]
        return None