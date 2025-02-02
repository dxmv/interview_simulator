export interface Message {
    id: string;
    content: string;
    sender: 'ai' | 'user';
    timestamp: Date;
} 