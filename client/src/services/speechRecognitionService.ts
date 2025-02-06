import { SpeechRecognition } from "../types/speech_types";

export class SpeechRecognitionService {
    private static instance: SpeechRecognitionService;
    private recognition: SpeechRecognition;
    private isListening: boolean = false;

    private constructor() {
        // Check if browser supports speech recognition
        if (!('webkitSpeechRecognition' in window)) {
            throw new Error('Speech recognition not supported');
        }

        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
    }

    public static getInstance(): SpeechRecognitionService {
        if (!SpeechRecognitionService.instance) {
            SpeechRecognitionService.instance = new SpeechRecognitionService();
        }
        return SpeechRecognitionService.instance;
    }

    public startListening(onResult: (text: string) => void, onEnd: () => void): void {
        if (this.isListening) return;

        this.isListening = true;
        this.recognition.start();

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                }
            }
            if (finalTranscript) {
                onResult(finalTranscript);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            onEnd();
        };
    }

    public stopListening(): void {
        if (!this.isListening) return;
        this.recognition.stop();
        this.isListening = false;
    }
} 