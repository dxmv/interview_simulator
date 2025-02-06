import { Message as MessageType } from "../../types/chat_types";
import Message from "../reusable/Message";

/**
 * Component that displays messages in a chat
 * @param messages: MessageType[]
 * @param messagesEndRef: React.RefObject<HTMLDivElement>
 */
const InterviewMessages = ({ messages,messagesEndRef }: { messages: MessageType[],messagesEndRef:React.RefObject<HTMLDivElement> }) => {
    
    return (
        <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default InterviewMessages;