import { io, Socket } from 'socket.io-client';
import { AnswerEvaluation } from '../types/interview';
import { Message as ChatMessage } from '../types/chat_types';
import { getToken } from '../auth/local_storage';
export class SocketService {
    private socket: typeof Socket;
    private static instance: SocketService;
    private token: string;

    private constructor() {
        this.token = getToken() || '';
        this.socket = io('http://127.0.0.1:5000',{auth: {token: `Bearer ${this.token}`}});


        // Basic connection logging
        this.socket.on('connected', () => console.log('Connected to server'));
        this.socket.on('connect_error', (error: any) => console.error('Connection error:', error));
    }

    public getSocket(): typeof Socket {
        return this.socket;
    }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public startInterview(numQuestions: number) {
        this.socket.emit('start_interview', {  num_questions: numQuestions });
    }

    public submitAnswer(answer: string) {
        this.socket.emit('answer_submission', { answer });
    }

    public saveInterview(data: {messages: ChatMessage[], date: Date, summary: string, grade: number}) {
        this.socket.emit('save_interview', {token: `Bearer ${this.token}`, ...data});
    }

    public onInterviewStarted(callback: (data: {
        total_questions: number;
        questions: string[];
    }) => void) {
        this.socket.on('interview_started', callback);
    }

    public onMessage(callback: (data: AnswerEvaluation) => void) {
        this.socket.on('message', callback);
    }

    public onInterviewEnded(callback: (data: { response: string }) => void) {
        this.socket.on('interview_ended', callback);
    }


    public disconnect() {
        this.socket.disconnect();
    }
}

