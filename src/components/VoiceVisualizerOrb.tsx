import React from 'react';

interface VoiceVisualizerOrbProps {
  state: 'listening' | 'speaking' | 'thinking' | 'idle';
  onClick?: () => void;
}

export const VoiceVisualizerOrb: React.FC<VoiceVisualizerOrbProps> = ({
  state,
  onClick
}) => {
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  
  let icon = 'mic';
  let label = 'Tap to Start';
  let iconClass = 'material-symbols-outlined text-primary-container text-3xl transition-transform group-hover:scale-110';
  
  if (isListening) {
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
    iconClass = 'material-symbols-outlined text-on-surface-variant text-3xl transition-transform group-hover:scale-110';
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

      {/* Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[520px] bg-gradient-to-b from-primary-container/15 via-[#ff782e]/5 to-transparent blur-[140px] rounded-full"></div>
        <div className="absolute bottom-10 left-1/4 w-[420px] h-[360px] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center mb-8 mx-auto z-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-container/30 via-orange-400/20 to-purple-500/10 animate-glow"></div>
        <div className="absolute inset-2 rounded-full p-[1.5px] bg-gradient-to-r from-primary-container via-orange-400/50 to-primary-container/20 animate-spin-slow opacity-80">
          <div className="w-full h-full rounded-full bg-surface"></div>
        </div>
        <div className="absolute inset-4 rounded-full border border-primary-container/30 animate-aura"></div>
        
        <button 
          aria-label="Toggle voice state" 
          onClick={onClick}
          className="relative z-10 w-24 h-24 rounded-full bg-surface-container hover:bg-surface-container-high border border-primary-container/40 shadow-[0_0_40px_rgba(255,82,0,0.22)] flex flex-col items-center justify-center transition-transform active:scale-95 group"
          type="button"
        >
          <span className={iconClass}>{icon}</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant mt-1">{label}</span>
        </button>
      </div>
    </>
  );
};
