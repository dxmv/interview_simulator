from flask import Blueprint, request, jsonify
from services.interview.interview_service import InterviewService
from flask_cors import cross_origin

interview_blueprint = Blueprint('interview', __name__)
interview_service = None

def init_interview_routes():
    global interview_service
    interview_service = InterviewService()

@interview_blueprint.route("/", methods=['POST'])
def start_interview():
    '''
    Start an interview with the given number of questions
    '''
    try:
        num_questions = request.json.get('num_questions')
        interview_service.start_interview(num_questions)
        return jsonify({'message': 'Interview started successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

