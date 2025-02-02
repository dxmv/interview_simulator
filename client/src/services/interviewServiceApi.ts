const API_URL = 'http://127.0.0.1:5000/interview'

export const startInterview = async (numQuestions: number) => {
    const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        body: JSON.stringify({ num_questions: numQuestions }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
};