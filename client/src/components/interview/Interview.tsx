import { useState } from "react";
import InterviewStart from "./InterviewStart";
import InterviewChat from "./InterviewChat";

const Interview = () => {
    const [step, setStep] = useState<number>(1);
    const [questions, setQuestions] = useState<string[]>([]);

    return (
        <div>
            {step === 1 ? (
                <InterviewStart 
                    setStep={setStep} 
                    setQuestions={setQuestions}
                />
            ) : (
                <InterviewChat questions={questions} />
            )}
        </div>
    );
};

export default Interview;