import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, Star, RotateCcw, ArrowLeft, ArrowRight, Mic, Sparkles, Send } from 'lucide-react';
import { FoodRecommendation } from '../types/ai';
import { FoodCard } from './FoodCard';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface FoodCardStackProps {
  cards: FoodRecommendation[];
  currentIndex: number;
  onSwipeLeft: (card: FoodRecommendation) => void;
  onSwipeRight: (card: FoodRecommendation) => void;
  onSuperLike: (card: FoodRecommendation) => void;
  onRefineFeedback: (feedback: string) => void;
  onReset: () => void;
  detectedMood: string;
  aiSummary: string;
}

export const FoodCardStack: React.FC<FoodCardStackProps> = ({
  cards,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  onRefineFeedback,
  onReset,
  detectedMood,
  aiSummary
}) => {
  const [feedbackInput, setFeedbackInput] = useState('');
  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];

  // Voice feedback hook
  const { isListening, transcript, startListening, stopListening } = useVoiceInput((finalText) => {
    setFeedbackInput(finalText);
    onRefineFeedback(finalText);
  });

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't intercept when typing in inputs
      }
      if (!currentCard) return;

      if (e.key === 'ArrowLeft') {
        onSwipeLeft(currentCard);
      } else if (e.key === 'ArrowRight') {
        onSwipeRight(currentCard);
      } else if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        onSuperLike(currentCard);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, onSwipeLeft, onSwipeRight, onSuperLike]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackInput.trim()) {
      onRefineFeedback(feedbackInput.trim());
      setFeedbackInput('');
    }
  };

  const isDeckFinished = currentIndex >= cards.length;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FC8019]/10 text-[#FC8019] text-xs font-bold border border-[#FC8019]/20 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{detectedMood || 'AI Suggestions'}</span>
        </div>
        {aiSummary && (
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto line-clamp-1">
            {aiSummary}
          </p>
        )}
      </div>

      {/* Card Stack Container */}
      <div className="relative w-full h-[520px] sm:h-[550px] max-w-sm mb-4">
        {!isDeckFinished ? (
          <AnimatePresence>
            {/* Background / Next Card */}
            {nextCard && (
              <div key={nextCard.id} className="absolute inset-0 scale-95 translate-y-3 opacity-60">
                <FoodCard
                  card={nextCard}
                  isFront={false}
                  onSwipeLeft={() => {}}
                  onSwipeRight={() => {}}
                />
              </div>
            )}

            {/* Front Card */}
            {currentCard && (
              <FoodCard
                key={currentCard.id}
                card={currentCard}
                isFront={true}
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
              />
            )}
          </AnimatePresence>
        ) : (
          /* Empty Deck State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center justify-center text-center shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-[#FC8019] mb-4">
              <RotateCcw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
              That's all the cards!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
              Didn't find the perfect match? Tell the AI what you'd like different, or reshuffle the recommendations.
            </p>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FC8019] text-white font-bold text-sm shadow-glow-orange hover:brightness-105 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reshuffle Options</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Swipe Action Buttons (Mobile & Web) */}
      {!isDeckFinished && currentCard && (
        <div className="w-full flex items-center justify-center gap-4 sm:gap-6 mb-4">
          {/* Pass Button */}
          <button
            onClick={() => onSwipeLeft(currentCard)}
            className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 text-rose-500 border border-rose-200 dark:border-rose-900 shadow-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-90 transition-all flex items-center justify-center group"
            title="Pass (Swipe Left or Left Arrow)"
          >
            <X className="w-7 h-7 stroke-[2.5] group-hover:scale-110 transition-transform" />
          </button>

          {/* Super Like / Star Button */}
          <button
            onClick={() => onSuperLike(currentCard)}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 text-amber-500 border border-amber-200 dark:border-amber-900 shadow-md hover:bg-amber-50 dark:hover:bg-amber-950/40 active:scale-90 transition-all flex items-center justify-center group"
            title="Super Like / Instant Winner (Spacebar)"
          >
            <Star className="w-6 h-6 fill-amber-400 stroke-[2] group-hover:scale-110 transition-transform" />
          </button>

          {/* Want This Button */}
          <button
            onClick={() => onSwipeRight(currentCard)}
            className="w-14 h-14 rounded-full bg-emerald-500 text-white shadow-glow-green shadow-lg hover:bg-emerald-600 active:scale-90 transition-all flex items-center justify-center group"
            title="I Want This! (Swipe Right or Right Arrow)"
          >
            <Heart className="w-7 h-7 fill-white stroke-[2] group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Progress & Keyboard Hints */}
      {!isDeckFinished && (
        <div className="flex items-center justify-between w-full max-w-xs text-[11px] text-gray-500 dark:text-gray-400 mb-4 px-2 font-medium">
          <div className="flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Pass</span>
          </div>
          <span className="font-bold text-gray-700 dark:text-gray-300">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div className="flex items-center gap-1">
            <span>Want it</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Voice/Text Feedback Refinement Bar */}
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md">
        <form onSubmit={handleFeedbackSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            value={isListening ? transcript : feedbackInput}
            onChange={(e) => setFeedbackInput(e.target.value)}
            placeholder={isListening ? "Listening to feedback..." : "Tweak: 'Show lighter' or 'Spicier'..."}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-xl text-xs transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-[#FC8019]'
            }`}
            title="Speak feedback"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={!feedbackInput.trim()}
            className="p-2 rounded-xl bg-[#FC8019] text-white disabled:opacity-40 transition-all hover:brightness-105"
            title="Refine deck"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
