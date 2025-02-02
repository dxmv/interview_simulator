import { io, Socket } from 'socket.io-client';
import { Message } from '../types/chat_types';
import { ServerToClientEvents,ClientToServerEvents } from '../types/socket_types';

const API_URL = 'http://127.0.0.1:5000/interview';
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const startInterview = async (numQuestions: number) => {
    const response = await fetch(`${API_URL}/`, {
        method: 'POST',
        body: JSON.stringify({ num_questions: numQuestions }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    
    // Initialize socket connection after successful interview start
    socket = io('http://127.0.0.1:5000');
    return data;
};

export const sendMessage = (message: string) => {
    if (!socket) {
        throw new Error('Socket connection not initialized');
    }
    socket.emit('message', { message });
};

export const subscribeToMessages = (callback: (message: Message) => void) => {
    if (!socket) {
        throw new Error('Socket connection not initialized');
    }
    
    socket.on('message', (message: Message) => {
        callback({
            id: Date.now().toString(),
            content: message.content,
            sender: message.sender,
            timestamp: new Date()
        });
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};