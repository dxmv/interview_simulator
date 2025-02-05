import { io, Socket } from 'socket.io-client';
import { AnswerEvaluation } from '../types/interview';

export class SocketService {
    private socket: typeof Socket;
    private static instance: SocketService;

    private constructor() {
        this.socket = io('http://127.0.0.1:5000');

        // Basic connection logging
        this.socket.on('connect', () => console.log('Connected to server'));
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
        this.socket.emit('start_interview', { num_questions: numQuestions });
    }

    public submitAnswer(answer: string) {
        this.socket.emit('answer_submission', { answer });
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

