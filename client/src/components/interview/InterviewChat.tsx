import { useState, useEffect, useRef } from 'react';
import { Message as MessageType } from '../../types/chat_types';
import { PrimaryButton } from '../reusable/PrimaryButton';
import { SocketService } from '../../services/socketService';
import Message from '../reusable/Message';
import { AnswerEvaluation } from '../../types/interview';

const InterviewChat = ({ questions }: { questions: string[] }) => {
    const [messages, setMessages] = useState<MessageType[]>([{
        id: Date.now().toString(),
        content: "Welcome to your technical interview!\nI'll be asking you questions based on your CV and experience.\nPlease provide detailed answers, and we'll discuss various aspects of your background.\n\n",
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
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [isInterviewEnded, setIsInterviewEnded] = useState<boolean>(false);

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

            // Only add next question if it exists
            if (data.next_question !== null) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '_next',
                    content: data.next_question,
                    sender: 'ai',
                    timestamp: new Date()
                }]);
            }
        };

        const handleInterviewEnded = (data: { response: string }) => {
            setMessages(prev => [...prev, {
                id: Date.now().toString() + '_end',
                content: "We're ending the interview now. Thank you for your time!",
                sender: 'ai',
                timestamp: new Date()
            }]);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + '_end',
                content: data.response,
                sender: 'ai',
                timestamp: new Date()
            }]);
            setIsInterviewEnded(true);
        };

        socketService.onMessage(handleMessage);
        socketService.onInterviewEnded(handleInterviewEnded);

        return () => {
            socketService.getSocket().off('message', handleMessage);
            socketService.getSocket().off('interview_ended', handleInterviewEnded);
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

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

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
            <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isInterviewEnded}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
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