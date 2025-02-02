import requests
import json
import os

class InterviewService:
    def __init__(self):
        self.num_questions = 0
        self.questions = []
        self.current_question_index = 0
        self.ollama_api_url = "http://localhost:11434/api/generate"

    def start_interview(self, num_questions):
        '''
        Start the interview with the given number of questions.
        '''
        self.num_questions = num_questions
        self.questions = self.generate_questions(num_questions)
        self.current_question_index = 0
        return self.questions

    def generate_questions(self, num_questions):
        '''
        Generate interview questions based on the CV analysis using Mistral.
        '''
        try:
            # Read the CV analysis from the JSON file
            cv_analysis_path = os.path.join('uploads', 'cv_analysis.json')
            with open(cv_analysis_path, 'r') as f:
                cv_data = json.load(f)

            system_prompt = f"""You are a technical interviewer. Generate exactly {num_questions} interview questions based on the candidate's CV. 
            No more, no less than {num_questions} questions.
            
            Rules for generating questions:
            1. Focus on technical aspects and problem-solving
            2. Include questions about specific technologies they've used
            3. Ask about their projects and how they implemented certain features
            4. Include questions about their work experience and technical challenges
            5. Return ONLY an array of strings with exactly {num_questions} questions in valid JSON format
            6. Format: ["question 1", "question 2", ...]
            
            CV Data:
            {json.dumps(cv_data, indent=2)}"""

            payload = {
                "model": "mistral",
                "prompt": system_prompt,
                "stream": True,
                "options": {
                    "temperature": 0.2,
                    "num_predict": 2000
                }
            }
            print("Generating questions...")

            response = requests.post(self.ollama_api_url, json=payload, stream=True)
            response.raise_for_status()
            
            full_response = ""
            for line in response.iter_lines():
                if not line:
                    continue
                
                try:
                    line_data = json.loads(line.decode('utf-8'))
                    if 'response' in line_data:
                        print(f"Line response: {line_data['response']}")
                        full_response += line_data['response']
                    if line_data.get('done', True):
                        break
                except json.JSONDecodeError:
                    continue

            # Extract the JSON array from the response
            start_idx = full_response.find('[')
            end_idx = full_response.rfind(']') + 1
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No valid JSON array found in response")
            
            json_str = full_response[start_idx:end_idx]
            questions = json.loads(json_str)
            
            # Ensure exactly num_questions are returned
            if len(questions) > num_questions:
                questions = questions[:num_questions]
            elif len(questions) < num_questions:
                # Add generic questions if we don't have enough
                generic_questions = [
                    "Tell me about your most challenging technical project.",
                    "What is your experience with Python?",
                    "How do you approach problem-solving?",
                    "Describe a difficult bug you've fixed.",
                    "What are your thoughts on code quality?"
                ]
                questions.extend(generic_questions[:num_questions - len(questions)])
            
            return questions

        except Exception as e:
            print(f"Error generating questions: {str(e)}")
            # Fallback questions in case of error
            fallback_questions = [
                "Tell me about your most challenging technical project.",
                "What is your experience with Python?",
                "How do you approach problem-solving?",
                "Describe a difficult bug you've fixed.",
                "What are your thoughts on code quality?"
            ]
            return fallback_questions[:num_questions]
        

