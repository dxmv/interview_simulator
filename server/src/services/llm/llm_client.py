import requests
import json
from typing import Dict, Any, Optional

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
            print(f"Getting single response with payload: {payload}")
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

    def extract_json_from_response(self, response: str) -> Dict[str, Any]:
        '''
        Extract a JSON object from a response string
        '''
        print(f"Extracting JSON from response: {response}")
        try:
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            # Try array if object not found
            if start_idx == -1:
                start_idx = response.find('[')
                end_idx = response.rfind(']') + 1
            
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No valid JSON found in response")
            
            json_str = response[start_idx:end_idx]
            return json.loads(json_str)
            
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Failed to parse JSON: {str(e)}")
            print(f"Response text: {response}")
            raise ValueError("Failed to get valid JSON from response") 