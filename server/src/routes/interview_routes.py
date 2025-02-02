from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, emit
from services.interview.interview_service import InterviewService
from flask_cors import cross_origin
import requests

interview_blueprint = Blueprint('interview', __name__)
interview_service = None
socketio = None

def init_interview_routes(socket: SocketIO):
    global interview_service, socketio
    interview_service = InterviewService()
    socketio = socket
    
    # Move socket event handlers inside init function
    @socketio.on('connect')
    def handle_connect():
        emit('connected', {'data': 'Connected successfully'})

    @socketio.on('message')
    def handle_message(data):
        try:
            current_question = interview_service.questions[interview_service.current_question_index]
            
            prompt = f"""You are conducting a technical interview. 
            Current question: {current_question}
            Candidate's answer: {data['message']}
            
            Provide a response that:
            1. Briefly evaluates their answer
            2. Asks a relevant follow-up question if needed
            3. If satisfied, moves to the next question from the list
            
            Return ONLY your response, no additional formatting."""
            
            payload = {
                "model": "mistral",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7
                }
            }
            
            response = requests.post(interview_service.ollama_api_url, json=payload)
            ai_response = response.json()['response']
            
            if interview_service.current_question_index < len(interview_service.questions) - 1:
                interview_service.current_question_index += 1
                
            emit('message', {'content': ai_response, 'sender': 'ai'})
            
        except Exception as e:
            print(f"Error handling message: {str(e)}")
            emit('message', {
                'content': "I apologize, but I encountered an error. Could you please rephrase your response?",
                'sender': 'ai'
            })

@interview_blueprint.route("/", methods=['POST'])
@cross_origin()
def start_interview():
    '''
    Start an interview with the given number of questions
    '''
    try:
        print("Starting interview")
        num_questions = request.json.get('num_questions')
        print(f"Number of questions: {num_questions}")
        questions = interview_service.start_interview(num_questions)
        return jsonify({
            'message': 'Interview started successfully',
            'questions': questions
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

