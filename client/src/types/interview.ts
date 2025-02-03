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
    response: string;
    next_question: string;
    sender: "ai";
}