// Web Speech API interface definitions
interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface SpeechRecognitionHookResult {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export class SpeechEngine {
  private recognition: any = null;
  private isSupported: boolean = false;
  private onTranscriptUpdate?: (text: string, isFinal: boolean) => void;
  private onErrorCallback?: (err: string) => void;
  private onStateChange?: (listening: boolean) => void;
  private isDesiredListening: boolean = false;
  private silenceTimer: any = null;
  private latestTranscript: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindowWithSpeech;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isSupported = true;
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.maxAlternatives = 1;
          this.recognition.lang = 'en-IN'; // Indian English / Global

          this.recognition.onstart = () => {
            this.onStateChange?.(true);
          };

          this.recognition.onresult = (event: any) => {
            let accumulated = '';
            for (let i = 0; i < event.results.length; ++i) {
              accumulated += event.results[i][0].transcript + ' ';
            }

            const cleanText = accumulated.trim();
            if (cleanText) {
              this.latestTranscript = cleanText;
              // Immediate real-time transcript update to UI
              this.onTranscriptUpdate?.(cleanText, false);

              // Reset silence timer on every spoken syllable
              if (this.silenceTimer) {
                clearTimeout(this.silenceTimer);
              }

              // Natural continuous hands-free VAD: After 1300ms pause, finalize turn
              this.silenceTimer = setTimeout(() => {
                if (this.latestTranscript.trim().length > 2 && this.isDesiredListening) {
                  const finalText = this.latestTranscript.trim();
                  this.latestTranscript = '';
                  this.onTranscriptUpdate?.(finalText, true);
                }
              }, 1300);
            }
          };

          this.recognition.onerror = (event: any) => {
            // Ignore non-fatal browser events like no-speech or aborted during turn handover
            if (event.error === 'no-speech' || event.error === 'aborted') {
              return;
            }
            console.warn('Speech recognition warning:', event.error);
            if (event.error === 'not-allowed') {
              this.onErrorCallback?.('Microphone access denied. Please grant microphone permissions in browser.');
              this.isDesiredListening = false;
              this.onStateChange?.(false);
            }
          };

          this.recognition.onend = () => {
            // Continuous hands-free loop: If user wanted listening, seamlessly keep going
            if (this.isDesiredListening) {
              try {
                this.recognition.start();
              } catch (e) {
                setTimeout(() => {
                  if (this.isDesiredListening) {
                    try { this.recognition.start(); } catch {}
                  }
                }, 200);
              }
            } else {
              this.onStateChange?.(false);
            }
          };
        } catch (e) {
          console.warn('SpeechRecognition initialization failed:', e);
          this.isSupported = false;
        }
      }
    }
  }

  get supported(): boolean {
    return this.isSupported;
  }

  setCallbacks(
    onTranscript: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onState: (listening: boolean) => void
  ) {
    this.onTranscriptUpdate = onTranscript;
    this.onErrorCallback = onError;
    this.onStateChange = onState;
  }

  start() {
    this.isDesiredListening = true;
    if (!this.isSupported || !this.recognition) {
      this.onErrorCallback?.('Speech recognition is not supported in this browser.');
      return;
    }
    try {
      this.recognition.start();
    } catch (e: any) {
      if (e.name !== 'InvalidStateError') {
        this.onErrorCallback?.(e.message || 'Could not start microphone');
      }
    }
  }

  stop() {
    this.isDesiredListening = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.onStateChange?.(false);
  }

  reset() {
    this.latestTranscript = '';
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }
}
