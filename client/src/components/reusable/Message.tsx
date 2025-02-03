import { Message as ChatMessage } from "../../types/chat_types";

interface MessageProps {
    message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
    return (
        <div
            className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
        >
            <div
                className={`inline-block p-3 rounded-lg ${
                    message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.sender === 'system'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                }`}
            >
                {message.content}
            </div>
        </div>
    );
}
