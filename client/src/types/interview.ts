export interface InterviewState {
    isStarted: boolean;
    currentQuestionIndex: number;
    totalQuestions: number;
    questions: string[];
    currentQuestion: string;
    evaluation: string;
    isCompleted: boolean;
    error: string | null;
} 

export interface AnswerEvaluation {
    response: string;      // This will contain the follow-up question or acknowledgment
    next_question: string | null;
    sender: "ai";
}

export interface InterviewEvaluation {
    overall_score: number;
    technical_strength: string;
    communication: string;
    areas_of_strength: string[];
    areas_for_improvement: string[];
    hiring_recommendation: string;
    summary: string;
}

export interface InterviewEndResponse {
    response: string;
    evaluation?: InterviewEvaluation;
}