import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechEngine } from '../services/speech/speechRecognition';

export function useVoiceInput(onFinalTranscript?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<SpeechEngine | null>(null);
  const onFinalRef = useRef(onFinalTranscript);

  useEffect(() => {
    onFinalRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    const engine = new SpeechEngine();
    engineRef.current = engine;

    engine.setCallbacks(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal && onFinalRef.current) {
          onFinalRef.current(text);
        }
      },
      (err) => {
        setError(err);
        setIsListening(false);
      },
      (listening) => {
        setIsListening(listening);
        if (listening) setError(null);
      }
    );

    return () => {
      engine.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    engineRef.current?.start();
  }, []);

  const stopListening = useCallback(() => {
    engineRef.current?.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
    engineRef.current?.reset();
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported: engineRef.current?.supported ?? false,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript
  };
}
