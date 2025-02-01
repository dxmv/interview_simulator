import requests
import json
import cv_parser

class CVAnalyzer:
    def __init__(self):
        self.ollama_api_url = "http://localhost:11434/api/generate"

    def analyze_cv(self, cv_text: str) -> dict:
        """
        Analyze the CV using local Ollama with Mistral model to return structured JSON data.
        """
        system_prompt = """You are a CV analyzer. Your task is to analyze the CV and return ONLY a JSON object with the following structure:
{
    "personal_info": {
        "name": string,
    },
    "professional_summary": {
        "years_of_experience": number,
        "seniority_level": string,
        "current_role": string or null
    },
    "skills": {
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
    }],
    "languages": string[]
}

Do not include any explanations or additional text, only return the valid JSON object."""

        prompt = f"{system_prompt}\n\nCV Content:\n{cv_text}"
        
        payload = {
            "model": "mistral",
            "prompt": prompt,
            "stream": True,
            "options": {
                "temperature": 0.2,
                "num_predict": 500
            }
        }
        try:
            response = requests.post(self.ollama_api_url, json=payload, stream=True)
            response.raise_for_status()
            
            full_response = ""
            for line in response.iter_lines():
                print(line)
                if not line:
                    continue
                
                try:
                    # Decode the line and parse it as JSON
                    line_data = json.loads(line.decode('utf-8'))
                    if 'response' in line_data:
                        full_response += line_data['response']
                    if line_data.get('done', True):
                        break
                except json.JSONDecodeError as e:
                    print(f"Error parsing line: {e}")
                    continue
            print(full_response)
            # Extract the JSON object from the full response
            try:
                start_idx = full_response.find('{')
                end_idx = full_response.rfind('}') + 1
                if start_idx == -1 or end_idx == 0:
                    raise ValueError("No valid JSON object found in response")
                
                json_str = full_response[start_idx:end_idx]
                analysis = json.loads(json_str)
                return analysis
            
            except (json.JSONDecodeError, ValueError) as e:
                print(f"Failed to parse JSON: {str(e)}")
                print(f"Response text: {full_response}")
                raise ValueError("Failed to get valid JSON response from Mistral")
                
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")
            raise ValueError(f"Failed to communicate with Ollama: {str(e)}")

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