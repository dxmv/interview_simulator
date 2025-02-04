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