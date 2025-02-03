import { useState } from "react";
import InterviewStart from "./InterviewStart";
import InterviewChat from "./InterviewChat";
import { SocketService } from "../../services/socketService";

const Interview = () => {
    const [step, setStep] = useState<number>(1);
    const [questions, setQuestions] = useState<string[]>([]);
    const socketService = SocketService.getInstance();

    const handleStartInterview = async (numQuestions: number) => {
        try {
            socketService.startInterview(numQuestions);
            socketService.onInterviewStarted((data) => {
                console.log(data);
                setQuestions(data.questions);
                setStep(2);
            });
        } catch (error) {
            console.error('Failed to start interview:', error);
        }
    };

    return (
        <div>
            {step === 1 ? (
                <InterviewStart 
                    onStart={handleStartInterview}
                />
            ) : (
                <InterviewChat questions={questions} />
            )}
        </div>
    );
};

export default Interview;