from services.llm.llm_client import LLMClient
import json
import cv_parser

class CVAnalyzer:
    def __init__(self):
        self.llm_client = LLMClient()

    def analyze_cv(self, cv_text: str) -> dict:
        """
        Analyze the CV using local Ollama with Mistral model to return structured JSON data.
        """
        system_prompt = """You are a CV analyzer. Your task is to analyze the CV and return ONLY a JSON object with the following structure:
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

        prompt = f"{system_prompt}\n\nCV Content:\n{cv_text}"
        
        try:
            response = self.llm_client.get_completion(
                prompt, 
                stream=True, 
                num_predict=2000
            )
            return self.llm_client.extract_json_from_response(response)
                
        except ValueError as e:
            print(f"Analysis failed: {str(e)}")
            raise ValueError(f"Failed to analyze CV: {str(e)}")

def save_json_to_file(data: dict, file_path: str) -> None:
    """
    Save a JSON-compatible dictionary to a JSON file.

    Args:
        data (dict): The JSON data to save.
        file_path (str): The path to the file where the JSON data will be saved.
    """
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        print(f"JSON data successfully saved to {file_path}")
    except Exception as e:
        print(f"Failed to save JSON data to {file_path}: {str(e)}")

if __name__ == "__main__":
    cv_text = cv_parser.extract_text_from_pdf("/Users/dimitrijestepanovic/Projects/WebApps/interviewer/server/src/uploads/CV.pdf")
    cv_analyzer = CVAnalyzer()
    analysis = cv_analyzer.analyze_cv(cv_text)
    print(json.dumps(analysis, indent=2))
    # Save the analysis result to a JSON file
    save_json_to_file(analysis, "/Users/dimitrijestepanovic/Projects/WebApps/interviewer/server/src/uploads/cv_analysis.json")