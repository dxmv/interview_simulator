import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface InterviewStartProps {
    onStart: (numQuestions: number) => void;
}

export default function InterviewStart({ onStart }: InterviewStartProps) {
    const [numQuestions, setNumQuestions] = useState<number>(2);

    return (
      <div className="bg-gray-100 p-4 rounded-md w-full h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Step 1: Start Interview</h1>
        <div className="mb-4">
          <Input
            id="numQuestions"
            type="number"
            min={1}
            max={10}
            value={numQuestions}
            label="Number of Questions"
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          />
        </div>
        <Button onClick={() => onStart(numQuestions)}>Start Interview</Button>
      </div>
    );
}