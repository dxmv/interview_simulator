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
            cv_analysis_path = os.path.join('uploads', 'cv_analysis.json')
            with open(cv_analysis_path, 'r') as f:
                cv_data = json.load(f)

            system_prompt = self._create_questions_prompt(num_questions, cv_data)
            response = self.llm_client.get_completion(system_prompt, stream=True, temperature=0.2)
            questions = self.llm_client.extract_json_from_response(response)
            
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
        print(f"Current question: {current_question}")
        print(f"Answer: {answer}")
        prompt = self._create_evaluation_prompt(current_question, answer)
        response = self.llm_client.get_completion(prompt, temperature=0.7) 
        print(f"Evaluation response: {response}")
        
        try:
            return self.llm_client.extract_json_from_response(response)
        except ValueError as e:
            print(f"Failed to parse LLM response: {str(e)}")
            return {
                "response": "Could you please elaborate on that? I'd like to understand your approach better.",
                "move_to_next": False,
                "end_interview": False
            }

    def _create_questions_prompt(self, num_questions, cv_data):
        '''
        Create the prompt for the interview questions
        '''
        prompt_for_questions = f"""
        return exactly {num_questions} interview questions as a json array (no extraneous text). heed these constraints:

        {{
            "distribution": {{
                "technical": 60,
                "behavioral": 40
            }},
            "diversity_rules": [
                "no repeated question forms",
                "cover at least 3 distinct cv sections",
                "vary the wording: how, what, explain, describe, etc"
            ],
            "cv_data": {json.dumps(cv_data)},
            "output_format": {{
                "type": "array<string>",
                "length": {num_questions}
            }}
        }}

        be sure each question references the candidate's actual tech or projects from cv_data in some. prompt them to give multi-part or deep answers. return ONLY the json array.
        """
        return prompt_for_questions

    def _evaluate_whole_interview(self, questions, answers):
        """
        Evaluate the entire interview and provide a comprehensive assessment
        """
        prompt = f"""You are a senior technical interviewer. Analyze this complete interview and provide a final evaluation.
        Return ONLY a JSON object with this structure:

        {{
            "overall_score": number,  // 1-10 rating
            "technical_strength": string,  // Brief assessment of technical abilities
            "communication": string,  // Brief assessment of communication skills
            "areas_of_strength": string[], // 2-3 key strengths
            "areas_for_improvement": string[], // 2-3 improvement areas
            "hiring_recommendation": string, // "Strong Yes", "Yes", "Maybe", "No"
            "summary": string  // 2-3 sentence overall summary
        }}

        Interview Content:
        {json.dumps([{"question": q, "answer": a} for q, a in zip(questions, answers)])}
        """
        
        response = self.llm_client.get_completion(prompt, temperature=0.3)
        return self.llm_client.extract_json_from_response(response)

    def _create_evaluation_prompt(self, current_question, answer):
        return f"""You are conducting a job interview for a software engineering role. Analyze this single response and output ONLY a JSON object.

CURRENT QUESTION: "{current_question}"
CANDIDATE ANSWER: "{answer}"

OUTPUT THIS EXACT JSON STRUCTURE:
{{
    "response": string,      // Your reply to the candidate
    "move_to_next": boolean, // Move to next question?
    "end_interview": boolean // End the interview?
}}

EVALUATION CRITERIA:
1. GOOD ANSWER (move_to_next = true) if:
   - Clear, structured response
   - Includes real examples
   - Shows relevant experience
   - Matches question asked
   → Respond with brief positive acknowledgment

2. NEEDS FOLLOW-UP (move_to_next = false) if:
   - Answer is incomplete
   - Missing examples
   - Unclear explanation
   - Off-topic response
   → Ask ONE specific follow-up about missing information

3. STOP INTERVIEW (end_interview = true) if:
   - Completely inappropriate
   - Shows clear dishonesty
   - Extremely unprofessional
   → End politely but firmly

EXAMPLE RESPONSES:

For incomplete answer:
{{
    "response": "You mentioned working on a team project - could you describe your specific role and contributions?",
    "move_to_next": false,
    "end_interview": false
}}

For good answer:
{{
    "response": "Thank you for that detailed example. I particularly appreciate how you highlighted the measurable results.",
    "move_to_next": true,
    "end_interview": false
}}

IMPORTANT:
- Keep responses under 30 words
- Be specific in follow-up questions
- Stay professional and encouraging
- Return ONLY the JSON object

RETURN EXACTLY ONE JSON OBJECT WITH NO OTHER TEXT."""

    def _get_generic_questions(self):
        return [
            "Walk me through your most complex technical implementation.",
            "Describe a time you had to make an architectural trade-off.",
            "How do you ensure code quality in large projects?",
            "Explain a challenging bug you resolved and your process.",
            "Describe a successful cross-functional collaboration experience."
        ]

    def _get_fallback_questions(self, num_questions):
        return self._get_generic_questions()[:num_questions]