import { useState } from 'react';
import { PrimaryButton } from '../reusable/PrimaryButton'
import { startInterview } from '../../services/interviewServiceApi';

interface InterviewStartProps {
    setStep: (step: number) => void;
    setQuestions: (questions: string[]) => void;
}

export default function InterviewStart({ setStep, setQuestions }: InterviewStartProps) {
    const [numQuestions, setNumQuestions] = useState<number>(5);

    const handleStartInterview = async () => {
        try {
            const response = await startInterview(numQuestions);
            setQuestions(response.questions);
            setStep(2);
        } catch (error) {
            console.error('Failed to start interview:', error);
        }
    };
  
    return (
      <div className="bg-gray-100 p-4 rounded-md w-full h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Step 2: Start Interview</h1>
        <div className="mb-4">
          <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
            Number of Questions
          </label>
          <input
            type="number"
            id="numQuestions"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <PrimaryButton 
          onClick={handleStartInterview} 
          text="Start Interview" 
          disabled={numQuestions < 1} 
        />
      </div>
    );
}