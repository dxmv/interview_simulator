from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, emit
from services.interview.interview_service import InterviewService
from flask_cors import cross_origin

interview_blueprint = Blueprint('interview', __name__)
interview_service = None
socketio = None

def init_interview_routes(socket: SocketIO):
    global interview_service, socketio
    interview_service = InterviewService()
    socketio = socket
    handle_socket_events()

def handle_socket_events():
    @socketio.on('connect')
    def handle_connect():
        '''Handle the connection event'''
        print("Client connected")
        emit('connected', {'data': 'Connected successfully'})

    @socketio.on('disconnect')
    def handle_disconnect():
        '''Handle the disconnection event'''
        print("Client disconnected")

    @socketio.on('start_interview')
    def handle_start_interview(data):
        '''Handle interview initialization'''
        try:
            num_questions = data.get('num_questions', 5)
            questions = interview_service.start_interview(num_questions)
            print(f"Starting interview with {num_questions} questions")
            
            emit('interview_started', {
                'total_questions': len(questions),
                'questions': questions,
                'current_question': {
                    'index': 0,
                    'text': questions[0]
                }
            })
        except Exception as e:
            print(f"Error starting interview: {str(e)}")
            emit('error', {'message': f"Failed to start interview: {str(e)}"})

    @socketio.on('answer_submission')
    def handle_answer(data):
        '''Handle candidate's answer submission'''
        try:
            answer = data.get('answer')
            print(f"Received answer: {answer}")
            
            # Emit user's message first
            emit('message', {'content': answer, 'sender': 'user'})
            
            # Then emit AI response
            emit('message', {'content': f"Answer received: {answer}", 'sender': 'ai'})
                
        except Exception as e:
            print(f"Error processing answer: {str(e)}")
            emit('error', {'message': f"Error processing answer: {str(e)}"})


