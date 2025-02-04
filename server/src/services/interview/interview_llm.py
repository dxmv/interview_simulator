from services.llm.llm_client import LLMClient
import json
import os

class InterviewLLM:
    def __init__(self):
        self.llm_client = LLMClient()

    def generate_interview_questions(self, num_questions):
        '''
        Generate interview questions based on the CV analysis using Mistral.
        '''
        try:
            # Read the CV analysis from the JSON file
            cv_analysis_path = os.path.join('uploads', 'cv_analysis.json')
            with open(cv_analysis_path, 'r') as f:
                cv_data = json.load(f)

            system_prompt = self._create_questions_prompt(num_questions, cv_data)
            response = self.llm_client.get_completion(system_prompt, stream=True, temperature=0.5)
            questions = self.llm_client.extract_json_from_response(response)
            
            # Ensure exactly num_questions are returned
            if len(questions) > num_questions:
                questions = questions[:num_questions]
            elif len(questions) < num_questions:
                questions.extend(self._get_generic_questions()[:num_questions - len(questions)])
            
            return questions

        except Exception as e:
            print(f"Error generating questions: {str(e)}")
            return self._get_fallback_questions(num_questions)

    def evaluate_answer(self, current_question, answer):
        '''
        Evaluate the candidate's answer using the LLM.
        Returns a dictionary containing the response and move_to_next flag
        '''
        prompt = self._create_evaluation_prompt(current_question, answer)
        response = self.llm_client.get_completion(prompt, temperature=2)
        print(f"Evaluation response: {response}")
        
        # Parse the JSON response from the LLM
        try:
            return self.llm_client.extract_json_from_response(response)
        except ValueError as e:
            print(f"Failed to parse LLM response: {str(e)}")
            # Fallback response if JSON parsing fails
            return {
                "response": "I apologize, but I'm having trouble processing that response. Could you please elaborate?",
                "move_to_next": False
            }

    def _create_questions_prompt(self, num_questions, cv_data):
        '''
        Create the prompt for the interview questions
        '''

        return f"""
        You are conducting a behavioral interview for a software engineering position. 
        You are a senior software engineer with 20 years of experience.
        Generate exactly {num_questions} interview questions based on the candidate's CV. 
        No more, no less than {num_questions} questions.
        
        Rules for generating questions:
        1. Focus on technical, behavioral and soft skills aspects and problem-solving
        2. Include questions about specific technologies they've used
        3. Ask about their projects and how they implemented certain features
        4. Include questions about their work experience and technical challenges
        5. Include questions about their soft skills and how they work in a team
        6. Return ONLY an array of strings with exactly {num_questions} questions in valid JSON format
        
        CV Data:
        {json.dumps(cv_data, indent=2)}"""

    def _create_evaluation_prompt(self, current_question, answer):
        '''
        Create the prompt for the evaluation of the candidate's answer
        '''

        return f"""
        You are conducting a behavioral interview for a software engineering position. 
        You are a senior software engineer with 20 years of experience. You must respond to the candidate's answer and provide a follow-up question if needed.
        Current question: {current_question}
        Candidate's answer: {answer}
        
        Provide a response in valid JSON format with the following structure:
        {{
            "response": string,        // A follow-up question if needed, or brief acknowledgment if answer is complete
            "move_to_next": boolean,   // true if ready for next question, false if follow-up needed
            "end_interview": boolean   // true if interview should be concluded, false otherwise
        }}
        
        Guidelines:
        - The response should be a follow-up question if the candidate's answer is not complete or needs clarification
        - The response should be a brief acknowledgment if the answer is complete
        - If the answer needs clarification (move_to_next: false):
          * Ask a specific follow-up question to get more details
          * Focus on technical aspects that weren't fully explained
        - Set end_interview to true if:
          * The candidate has demonstrated clear unsuitability for the role
          * The responses indicate a significant mismatch in skills or experience
          * The candidate is rude or disrespectful
          * The candidate is not interested in the role
          * The candidate uses inappropriate language
        
        Return ONLY the JSON object, no additional text.
        """

    def _get_generic_questions(self):
        '''
        Get generic questions for the interview
        '''

        return [
            "Tell me about your most challenging technical project.",
            "What is your experience with Python?",
            "How do you approach problem-solving?",
            "Describe a difficult bug you've fixed.",
            "What are your thoughts on code quality?"
        ]

    def _get_fallback_questions(self, num_questions):
        '''
        Get fallback questions for the interview
        '''

        return self._get_generic_questions()[:num_questions]