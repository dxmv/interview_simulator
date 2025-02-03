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