import React, { useState } from 'react';

interface FloatingAdjustmentPillProps {
  cartTotal: number;
  isListening: boolean;
  onSubmitText: (text: string) => void;
  onMicClick: () => void;
  onCheckout: () => void;
  viewMode?: 'landing' | 'voice' | 'chat';
}

import { AnimatePresence, motion } from 'framer-motion';

export const FloatingAdjustmentPill: React.FC<FloatingAdjustmentPillProps> = ({
  cartTotal,
  isListening,
  onSubmitText,
  onMicClick,
  onCheckout,
  viewMode = 'chat'
}) => {
  const [value, setValue] = useState('');

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (value.trim()) {
      onSubmitText(value.trim());
      setValue('');
    }
  };

  const hasInput = value.trim().length > 0;

  return (
    <aside className="fixed bottom-4 left-0 right-0 z-40 px-margin flex justify-center pointer-events-none">
      <motion.div 
        layout
        transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
        className={`pointer-events-auto bg-surface-container-lowest/90 backdrop-blur-2xl rounded-full p-2 flex items-center justify-between gap-2 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_24px_rgba(255,87,17,0.15),inset_0_1px_0_rgba(255,255,255,0.12)] ${viewMode === 'chat' ? 'w-full max-w-3xl pl-4' : 'w-auto'}`}
      >
        <AnimatePresence mode="popLayout">
          {viewMode === 'chat' && (
            <motion.form 
              key="text-input-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleFormSubmit} 
              className="flex items-center gap-space-xs flex-grow min-w-0"
            >
              <span className="material-symbols-outlined text-primary-container text-[18px] shrink-0">
                auto_fix_high
              </span>
              <input
                id="biteai-text-input"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask BiteAI to refine, swap dishes, or filter dietary..."
                className="bg-transparent border-0 outline-none w-full font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:ring-0 truncate"
              />
            </motion.form>
          )}
        </AnimatePresence>

        {/* Control Group: Voice Toggle, Send, and Sticky Cart CTA */}
        <motion.div layout className="flex items-center gap-1.5 flex-shrink-0">
          {/* Switch to Voice Trigger */}
          <motion.button
            layout
            transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
            type="button"
            onClick={onMicClick}
            className={`h-9 rounded-full flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
              viewMode === 'voice' ? 'px-3 gap-1.5' : 'w-9'
            } ${
              isListening
                ? 'bg-primary-container/20 text-primary-container border border-primary-container/40'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
            title={viewMode === 'chat' ? 'Voice input' : (isListening ? 'Pause voice' : 'Resume voice')}
          >
            <span className={`material-symbols-outlined text-[18px] shrink-0 ${isListening ? 'animate-pulse' : ''}`}>mic</span>
            <AnimatePresence mode="popLayout">
              {viewMode === 'voice' && (
                <motion.span 
                  key="mic-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[11px] font-bold tracking-wide uppercase whitespace-nowrap"
                >
                  {isListening ? 'Space to pause' : 'Space to speak'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Submit Prompt Action (Only in chat mode) */}
          <AnimatePresence mode="popLayout">
            {viewMode === 'chat' && (
              <motion.button
                key="submit-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="button"
                onClick={() => handleFormSubmit()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  hasInput
                    ? 'bg-primary-container text-on-primary shadow-[0_0_12px_rgba(255,87,17,0.35)]'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface hover:text-primary'
                }`}
                title="Send text command"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Direct Swiggy Tray Pill */}
          <button
            type="button"
            onClick={onCheckout}
            className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-container hover:bg-primary-container/90 text-on-primary font-label-lg text-label-lg font-bold shadow-[0_0_16px_rgba(255,87,17,0.35)] transition-all transform active:scale-95 ml-1 cursor-pointer"
          >
            <span className="font-headline-sm text-headline-sm leading-none">₹{cartTotal}</span>
            <span className="text-on-primary-container/80 text-[12px] font-normal leading-none">|</span>
            <span className="flex items-center">
              Order <span className="material-symbols-outlined text-[18px] ml-0.5">arrow_forward</span>
            </span>
          </button>
        </motion.div>
      </motion.div>
    </aside>
  );
};
