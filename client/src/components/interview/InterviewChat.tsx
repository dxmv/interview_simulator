import { useState, useEffect, useRef } from 'react';
import { Message as MessageType } from '../../types/chat_types';
import { PrimaryButton } from '../reusable/PrimaryButton';
import { SocketService } from '../../services/socketService';
import { SpeechService } from '../../services/speechService';
import { SpeechRecognitionService } from '../../services/speechRecognitionService';
import { Mic, MicOff } from 'lucide-react';
import InterviewMessages from './InterviewMessages';
import { AnswerEvaluation, InterviewEvaluation } from '../../types/interview';

const InterviewChat = ({ questions }: { questions: string[] }) => {
    const [messages, setMessages] = useState<MessageType[]>([{
        id: Date.now().toString(),
        // content: "Welcome to your behavioral interview!\nI'll be asking you questions based on your CV and experience.\nPlease provide detailed answers, and we'll discuss various aspects of your background.\n\n",
        content: "Welcome",
        sender: 'ai',
        timestamp: new Date()
    },{
        id: Date.now().toString() + '1',
        content: questions[0],
        sender: 'ai',
        timestamp: new Date()
    }]);
    const [newMessage, setNewMessage] = useState('');
    const socketService = SocketService.getInstance();
    const speechService = SpeechService.getInstance();
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [isInterviewEnded, setIsInterviewEnded] = useState<boolean>(false);
    const [isListening, setIsListening] = useState(false);
    const speechRecognitionService = SpeechRecognitionService.getInstance();

    const handleSpeech =  (text: string) => {
        if (true) {
             speechService.speak(text);
        }
    };

    useEffect(() => {
        // Set up socket listeners
        const handleMessage = (data: AnswerEvaluation) => {
            // Add AI's response
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                content: data.response,
                sender: 'ai',
                timestamp: new Date()
            }]);

            // Speak the AI's response
            handleSpeech(data.response);

            // Only add next question if it exists
            if (data.next_question !== null) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '_next',
                    content: data.next_question,
                    sender: 'ai',
                    timestamp: new Date()
                }]);
                // Speak the next question after a short delay
                setTimeout(() => handleSpeech(data.next_question!), 1000);
            }
        };

        const handleInterviewEnded = (data: { response: string; evaluation?: InterviewEvaluation }) => {
            setMessages(prev => [...prev, {
                id: Date.now().toString() + '_end',
                content: data.response,
                sender: 'ai',
                timestamp: new Date()
            }]);
            handleSpeech(data.response);
            
            if (data.evaluation) {
                const evaluationContent = `
        Final Evaluation:
        Overall Score: ${data.evaluation.overall_score}/10 \n
        Technical Strength: ${data.evaluation.technical_strength} \n
        Communication: ${data.evaluation.communication} \n
        Strengths: ${data.evaluation.areas_of_strength.join(', ')} \n
        Areas for Improvement: ${data.evaluation.areas_for_improvement.join(', ')} \n
        Hiring Recommendation: ${data.evaluation.hiring_recommendation} \n
        
        Summary: ${data.evaluation.summary}`;
        
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '_evaluation',
                    content: evaluationContent,
                    sender: 'system',
                    timestamp: new Date()
                }]);
                handleSpeech(evaluationContent);
            }
            
            setIsInterviewEnded(true);
            socketService.saveInterview({messages: messages, date: new Date(), summary: data.evaluation?.summary || '', grade: data.evaluation?.overall_score || 0});
        };

        const initialSpeech = () => {
            const initialMessage = messages[0];
            const nextMessage = messages[1];
            
            if (initialMessage.content) {
                speechService.speak(initialMessage.content);
            }
            if (nextMessage.content) {
                speechService.speak(nextMessage.content);
            }
        };
        initialSpeech();

        socketService.onMessage(handleMessage);
        socketService.onInterviewEnded(handleInterviewEnded);

        return () => {
            socketService.getSocket().off('message', handleMessage);
            socketService.getSocket().off('interview_ended', handleInterviewEnded);
            speechService.stop();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        speechService.stop();
        // Only send to server, don't add message locally
        socketService.submitAnswer(newMessage);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: newMessage,
            sender: 'user',
            timestamp: new Date()
        }]);
        setNewMessage('');
    };

    const handleVoiceInput = () => {
        if (isListening) {
            speechRecognitionService.stopListening();
            setIsListening(false);
            return;
        }

        setIsListening(true);
        speechRecognitionService.startListening(
            (text) => {
                setNewMessage((prev) => prev + text);
            },
            () => {
                setIsListening(false);
            }
        );
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
            <InterviewMessages messages={messages} messagesEndRef={messagesEndRef} />
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isInterviewEnded}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleVoiceInput}
                    disabled={isInterviewEnded}
                    className={`p-2 rounded-md ${
                        isListening ? 'bg-red-500' : 'bg-blue-500'
                    } text-white`}
                >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <PrimaryButton
                    onClick={handleSendMessage}
                    text="Send"
                    disabled={!newMessage.trim() || isInterviewEnded}
                />
            </div>
        </div>
    );
};

export default InterviewChat;