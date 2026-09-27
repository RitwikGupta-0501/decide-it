import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type OrbVisualState = 'loading' | 'morphing' | 'idle' | 'listening' | 'thinking' | 'speaking';

interface AmbientVoiceOrbProps {
  state: OrbVisualState;
  loadingProgress: number;
  ambientText: string;
  isSessionStarted: boolean;
  activeMode: 'voice' | 'text' | 'unstarted';
  liveTranscript?: string;
  aiSpokenText?: string;
  onStartVoice: () => void;
  onSelectTextInstead: () => void;
  onOrbClick: () => void;
  hideDialogue?: boolean;
}

export const AmbientVoiceOrb: React.FC<AmbientVoiceOrbProps> = ({
  state,
  loadingProgress,
  ambientText,
  isSessionStarted,
  activeMode,
  liveTranscript,
  aiSpokenText,
  onStartVoice,
  onSelectTextInstead,
  onOrbClick,
  hideDialogue = false
}) => {
  const isLoading = state === 'loading';
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';
  
  let icon = 'mic';
  let label = 'Tap to Start';
  let iconClass = 'material-symbols-outlined text-primary-accent text-3xl transition-transform group-hover:scale-110';
  
  if (isLoading) {
    icon = 'hourglass_empty';
    label = 'Loading';
    iconClass = 'material-symbols-outlined text-on-surface-muted text-3xl transition-transform animate-pulse group-hover:scale-110';
  } else if (!isSessionStarted) {
    icon = 'play_arrow';
    label = 'Start';
  } else if (isListening) {
    icon = 'graphic_eq';
    label = 'Listening';
  } else if (isThinking) {
    icon = 'psychology';
    label = 'Thinking';
    iconClass = 'material-symbols-outlined text-amber-400 text-3xl transition-transform animate-pulse group-hover:scale-110';
  } else if (isSpeaking) {
    icon = 'volume_up';
    label = 'Speaking';
  } else {
    icon = 'mic';
    label = 'Tap to Speak';
    iconClass = 'material-symbols-outlined text-on-surface-muted text-3xl transition-transform group-hover:scale-110';
  }

  return (
    <>
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes glow-expand {
          0%, 100% { transform: scale(0.96); opacity: 0.35; filter: blur(36px); }
          50% { transform: scale(1.15); opacity: 0.65; filter: blur(48px); }
        }
        @keyframes aura-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-aura {
          animation: subtle-pulse 4.5s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow-expand 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: aura-rotate 24s linear infinite;
        }
      `}</style>

      {/* Ambient Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[520px] bg-gradient-to-b from-primary-accent/15 via-[#ff782e]/5 to-transparent blur-[140px] rounded-full"></div>
        <div className="absolute bottom-10 left-1/4 w-[420px] h-[360px] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <section className="w-full flex flex-col items-center text-center mt-4 md:mt-8 mb-12 relative z-10">
        {/* Voice Orb Art */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center mb-8">
          {/* Deep Ambient Blur Aura */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-primary-accent/30 via-orange-400/20 to-purple-500/10 ${(isListening || isSpeaking || isThinking) ? 'animate-glow' : 'opacity-50'}`}></div>
          
          {/* Rotating gradient border aura */}
          <div className={`absolute inset-2 rounded-full p-[1.5px] bg-gradient-to-r from-primary-accent via-orange-400/50 to-primary-accent/20 ${(isListening || isSpeaking || isThinking) ? 'animate-spin-slow opacity-80' : 'opacity-20'}`}>
            <div className="w-full h-full rounded-full bg-surface"></div>
          </div>
          
          {/* Inner Soft Pulse Ring */}
          <div className={`absolute inset-4 rounded-full border border-primary-accent/30 ${(isListening || isSpeaking) ? 'animate-aura' : ''}`}></div>
          
          {/* Center Breathing Core */}
          <button 
            aria-label="Toggle voice state" 
            onClick={isLoading ? undefined : !isSessionStarted ? onStartVoice : onOrbClick}
            className={`relative z-10 w-24 h-24 rounded-full bg-surface-subtle hover:bg-surface-card border ${isListening || isSpeaking ? 'border-primary-accent/40 shadow-[0_0_40px_rgba(255,82,0,0.22)]' : 'border-white/10'} flex flex-col items-center justify-center transition-transform active:scale-95 group`}
            id="orb-trigger" 
            type="button"
          >
            <span className={iconClass} id="orb-mic-icon">{icon}</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-muted mt-1" id="orb-label">{label}</span>
          </button>
        </div>

        {/* Dialogue Typography: Minimal, Large & Calm */}
        {(!hideDialogue && (liveTranscript || aiSpokenText || isListening || isSpeaking)) && (
          <div className="max-w-2xl mx-auto flex flex-col gap-3 px-4">
            {/* User Voice Transcript */}
            <p className="text-sm md:text-base font-normal text-on-surface-muted tracking-normal min-h-[1.5rem]">
              {liveTranscript ? `“${liveTranscript}”` : ''}
            </p>
            
            {/* Assistant Voice Response */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-white leading-snug min-h-[3rem]">
              {aiSpokenText || ''}
            </h1>
          </div>
        )}
      </section>
    </>
  );
};
