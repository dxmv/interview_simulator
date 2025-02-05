import requests
import json
from typing import Dict, Any, Optional
import re

class LLMClient:
    def __init__(self):
        self.ollama_api_url = "http://localhost:11434/api/generate"
        self.default_temperature = 0.2
        self.default_model = "mistral"

    def get_completion(self, 
                      prompt: str, 
                      stream: bool = False, 
                      temperature: Optional[float] = None,
                      **kwargs) -> str:
        '''
        Get a completion from the LLM
        '''
        payload = {
            "model": self.default_model,
            "prompt": prompt,
            "stream": stream,
            "options": {
                "temperature": temperature or self.default_temperature,
                **kwargs
            }
        }

        if stream:
            return self._get_streaming_response(payload)
        else:
            return self._get_single_response(payload)

    def _get_single_response(self, payload: Dict[str, Any]) -> str:
        '''
        Get a single response from the LLM
        '''
        try:
            print(f"Getting single response")
            response = requests.post(self.ollama_api_url, json=payload)
            response.raise_for_status()
            print(f"Response: {response.json()['response']}")
            return response.json()['response']
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")
            raise ValueError(f"Failed to communicate with Ollama: {str(e)}")

    def _get_streaming_response(self, payload: Dict[str, Any]) -> str:
        '''
        Get a streaming response from the LLM
        '''
        print(f"Getting streaming response")
        try:
            response = requests.post(self.ollama_api_url, json=payload, stream=True)
            response.raise_for_status()
            
            full_response = ""
            for line in response.iter_lines():
                if not line:
                    continue

                try:
                    line_data = json.loads(line.decode('utf-8'))
                    if 'response' in line_data:
                        print(f"Received response: {line_data['response']}")
                        full_response += line_data['response']
                    if line_data.get('done', True):
                        break
                except json.JSONDecodeError:
                    continue
            
            return full_response

        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")
            raise ValueError(f"Failed to communicate with Ollama: {str(e)}")

    def extract_json_from_response(self, response: str) -> dict:
        """
        Extract JSON from LLM response, handling both array and object responses
        """
        try:
            # First try to find JSON within the response using regex
            json_match = re.search(r'\[.*\]|\{.*\}', response.strip(), re.DOTALL)
            if json_match:
                json_str = json_match.group()
                # Parse the JSON string - could be array or object
                parsed = json.loads(json_str)
                # If it's an array and we expect an object, take first item
                if isinstance(parsed, list) and len(parsed) > 0:
                    return parsed  # Return the whole array if it's a list of questions
                return parsed
            raise ValueError("No JSON found in response")
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {str(e)}")
            raise ValueError(f"Invalid JSON format: {str(e)}")
        except Exception as e:
            print(f"Error extracting JSON: {str(e)}")
            raise ValueError(f"Failed to extract JSON: {str(e)}") 