import { Message as MessageType } from "../../types/chat_types";
import { X } from 'lucide-react';
import Message from "../reusable/Message";

interface InterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: MessageType[];
}

const InterviewModal = ({ isOpen, onClose, messages }: InterviewModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] m-4 flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Interview Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InterviewModal;