export class VoiceSynthesisService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static selectedVoice: SpeechSynthesisVoice | null = null;
  private static isSpeakingNow: boolean = false;

  static init() {
    if (!this.synth) return;

    const pickBestVoice = () => {
      const voices = this.synth?.getVoices() || [];
      if (voices.length === 0) return;

      // Priority 1: Indian English natural voices
      // Priority 2: Natural / Google / Samantha English voices
      // Priority 3: Any English voice
      this.selectedVoice =
        voices.find(v => v.lang.includes('en-IN') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
        voices.find(v => v.lang.includes('en-IN')) ||
        voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Premium'))) ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0] || null;
    };

    pickBestVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = pickBestVoice;
    }
  }

  static isSpeaking(): boolean {
    return this.isSpeakingNow;
  }

  static speak(
    text: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
    }
  ): void {
    if (!this.synth) {
      callbacks?.onEnd?.();
      return;
    }

    try {
      this.synth.cancel(); // Prevent queue jamming bug in Chromium
    } catch {}

    const utterance = new SpeechSynthesisUtterance(text);
    if (!this.selectedVoice) {
      this.init();
    }
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.rate = 1.02; // Warm conversational pace
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeakingNow = true;
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeakingNow = false;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or canceled:', e);
      this.isSpeakingNow = false;
      callbacks?.onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Failed to invoke speech synthesis:', e);
      this.isSpeakingNow = false;
      callbacks?.onEnd?.();
    }
  }

  static stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
      this.isSpeakingNow = false;
    }
  }
}
