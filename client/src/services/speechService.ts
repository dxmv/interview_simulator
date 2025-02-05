export class SpeechService {
    private static instance: SpeechService;
    private synthesis: SpeechSynthesis;
    private speaking: boolean = false;
    private queue: string[] = [];

    private constructor() {
        this.synthesis = window.speechSynthesis;
    }

    public static getInstance(): SpeechService {
        if (!SpeechService.instance) {
            SpeechService.instance = new SpeechService();
        }
        return SpeechService.instance;
    }

    public speak(text: string): void {
        if (this.speaking) {
            this.queue.push(text);
            return;
        }

        this.speakText(text);
    }

    private speakText(text: string): void {
        this.speaking = true;
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Use a more natural voice if available
        const voices = this.synthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        // Attach the onend event to the utterance
        utterance.onend = () => {
            this.speaking = false;
            // Check if there are more items in the queue
            if (this.queue.length > 0) {
                this.speakNext();
            }
        };

        this.synthesis.speak(utterance);
    }

    private speakNext(): void {
        if (this.queue.length > 0) {
            const nextText = this.queue.shift();
            if (nextText) {
                this.speakText(nextText);
            }
        }
    }

    public stop(): void {
        this.synthesis.cancel();
        this.queue = [];
        this.speaking = false;
    }
} 