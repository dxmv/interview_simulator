import { useState } from 'react';
import { Message } from '../../types/chat_types';
import { PrimaryButton } from '../reusable/PrimaryButton';

const InterviewChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: newMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        
        // TODO: Send message to backend and handle AI response
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
            <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-4 ${
                            message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}
                    >
                        <div
                            className={`inline-block p-3 rounded-lg ${
                                message.sender === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <PrimaryButton
                    onClick={handleSendMessage}
                    text="Send"
                    disabled={!newMessage.trim()}
                />
            </div>
        </div>
    );
};

export default InterviewChat;