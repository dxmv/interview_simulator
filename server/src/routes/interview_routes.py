from flask import Blueprint, request, jsonify
from flask_socketio import SocketIO, emit, disconnect
from services.interview.interview_service import InterviewService
from flask_cors import cross_origin
from utils.auth import jwt_required
from flask_jwt_extended import decode_token

interview_blueprint = Blueprint('interview', __name__)
interview_service = None
socketio = None

def init_interview_routes(socket: SocketIO):
    global interview_service, socketio
    interview_service = InterviewService()
    socketio = socket
    handle_socket_events()

def verify_socket_token(data):
    """Verify JWT token from socket data"""
    try:
        auth = data.get('token')
        if not auth or not auth.startswith('Bearer '):
            print("No token or invalid token format")
            return None
        
        token = auth.split(' ')[1]  # Get the token part after 'Bearer '
        decoded_token = decode_token(token)  # Decode the token
        user_id = decoded_token.get('sub')  # Extract user_id from the token
        print(f"Verified user_id: {user_id}")  # Debug log
        return user_id
    except Exception as e:
        print(f"Socket authentication error: {str(e)}")
        return None

def handle_socket_events():

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
                'questions': [q['question'] for q in questions],
            })
        except Exception as e:
            print(f"Error starting interview: {str(e)}")
            emit('error', {'message': f"Failed to start interview: {str(e)}"})

    @socketio.on('answer_submission')
    def handle_answer(data):
        '''Handle candidate's answer submission'''
        try:
            answer = data.get('answer')
            evaluation_result = interview_service.evaluate_answer(answer)
            
            if evaluation_result.get('end_interview'):
                final_evaluation = evaluation_result.get('final_evaluation')
                if final_evaluation:
                    emit('interview_ended', {
                        'response': evaluation_result['response'],
                        'evaluation': final_evaluation
                    })
                    return
                
            next_question = interview_service.get_next_question() if evaluation_result.get('move_to_next') else None
            
            emit('message', {
                'response': evaluation_result['response'],
                'next_question': next_question,
                'sender': 'ai'
            })
                
        except Exception as e:
            print(f"Error processing answer: {str(e)}")
            emit('error', {'message': f"Error processing answer: {str(e)}"})
    
    @socketio.on('save_interview')
    def handle_save_interview(data):
        '''Handle interview saving'''
        try:
            print("Received save_interview data:", data)  # Debug log
            user_id = verify_socket_token(data)
            print(f"User ID from token: {user_id}")  # Debug log
            
            if not user_id:
                print("No user_id found in token")  # Debug log
                emit('error', {'message': 'Authentication required'})
                return
            
            data['user_id'] = user_id  # Add user_id to the data
            saved = interview_service.save_interview(data)
            if saved:
                emit('interview_saved', {'message': 'Interview saved successfully'})
            else:
                emit('error', {'message': 'Failed to save interview'})
        except Exception as e:
            print(f"Error saving interview: {str(e)}")
            emit('error', {'message': f"Error saving interview: {str(e)}"})

@interview_blueprint.route('/', methods=['GET'])
@jwt_required
def get_interviews():
    try:
        print("Getting interviews")
        interviews = interview_service.get_interviews()
        return jsonify(interviews)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interview_blueprint.route('/<int:id>', methods=['DELETE'])
@jwt_required
def delete_interview(id: int):
    try:
        deleted = interview_service.delete_interview(id)
        if deleted:
            print("Deleted interview")
            interviews = interview_service.get_interviews()
            return jsonify(interviews)
        else:
            return jsonify({'error': 'Failed to delete interview'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500




