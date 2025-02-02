import { useState } from "react";
import InterviewStart from "./InterviewStart";
import InterviewChat from "./InterviewChat";

const Interview = () => {
    const [step, setStep] = useState<number>(1);
    return (
        <div>
            {step === 1 ? <InterviewStart setStep={setStep} /> : <InterviewChat />}
        </div>
    )
}

export default Interview;