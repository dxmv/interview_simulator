export interface Message {
    id: string;
    content: string;
    sender: 'ai' | 'user' | 'system';
    timestamp: Date;
} 