import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Clock, Heart, Send, Mic } from 'lucide-react';
import { FoodRecommendation } from '../types/ai';

interface ConversationalUIProps {
  cards: FoodRecommendation[];
  onSelectCard: (card: FoodRecommendation) => void;
  onVoiceFeedback: (text: string) => void;
  onQuickChip: (chip: string) => void;
  onMicClick?: () => void;
  isThinking: boolean;
  isListening?: boolean;
  showInputBar?: boolean;
  className?: string;
}

const QUICK_MOOD_PROMPTS = [
  '🥱 Long exhausting day, need comfort food',
  '🌙 Late night cheesy burger or fries',
  '🥗 Light & fresh high-protein bowl',
  '🌶️ Hot spicy Andhra biryani',
  '🥞 Crispy ghee podi dosa'
];

export const ConversationalUI: React.FC<ConversationalUIProps> = ({
  cards,
  onSelectCard,
  onVoiceFeedback,
  onQuickChip,
  onMicClick,
  isThinking,
  isListening = false,
  showInputBar = true,
  className = "w-full max-w-2xl mx-auto px-4 pb-28 flex flex-col items-center"
}) => {
  const [inputText, setInputText] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onVoiceFeedback(inputText.trim());
      setInputText('');
    }
  };

  return (
    <>
      {/* Dynamic Contextual Cards Container (Positioned in main scroll area) */}
      <div className={className}>
        <AnimatePresence mode="popLayout">
          {cards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="w-full space-y-4 mb-4"
            >
              <div className="flex items-center justify-between text-xs px-2">
                <span className="font-extrabold text-[#FC8019] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Hand-picked via Swiggy MCP
                </span>
                <span className="text-gray-400 font-medium">
                  Tap card or speak to choose
                </span>
              </div>

              {/* Glowing Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {cards.map((card, idx) => (
                  <motion.div
                    key={card.id || idx}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectCard(card)}
                    className="group relative bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl rounded-3xl p-4 border border-gray-200/90 dark:border-gray-800 shadow-lg hover:shadow-glow-orange hover:border-[#FC8019]/60 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top info & Image */}
                    <div className="flex gap-3 mb-3">
                      <img
                        src={card.imageUrl}
                        alt={card.dishName}
                        className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              card.isVeg ? 'bg-green-600' : 'bg-red-600'
                            }`}
                          />
                          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase truncate">
                            {card.cuisine}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight truncate">
                          {card.dishName}
                        </h4>
                        <p className="text-xs font-bold text-[#FC8019] truncate">
                          {card.restaurantName}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {card.rating}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-[#FC8019]" />
                            {card.deliveryTimeMinutes}m
                          </span>
                          <span>•</span>
                          <span className="font-extrabold text-gray-900 dark:text-white">
                            ₹{card.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Fit Reason */}
                    <div className="p-2.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 text-[11px] text-gray-700 dark:text-gray-300 font-medium leading-snug">
                      <span className="text-[#FC8019] font-bold mr-1">Why this fits:</span>
                      "{card.aiFitReason}"
                    </div>

                    {/* Action row */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 text-xs font-bold">
                      <span className="text-[#FC8019] flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3 h-3" />
                        {card.moodMatchScore}% Fit
                      </span>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl bg-[#FC8019] text-white flex items-center gap-1 shadow-sm hover:brightness-110 active:scale-95 transition-all text-xs"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Choose</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Sticky Text & Voice Input Bar at the Bottom of the Page (Only when showInputBar is enabled) */}
      {showInputBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0A0D14]/85 backdrop-blur-2xl border-t border-gray-200/80 dark:border-gray-800/80 py-2.5 px-4 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-2">
            
            {/* Quick Ambient Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0 mr-1">
                Quick:
              </span>
              {QUICK_MOOD_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onQuickChip(prompt)}
                  className="px-2.5 py-1 rounded-xl bg-gray-100/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:border-[#FC8019] hover:text-[#FC8019] border border-transparent transition-all whitespace-nowrap text-[11px] font-semibold"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form with Send and Mic */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/90 rounded-2xl p-1.5 border border-gray-200 dark:border-gray-700/80 shadow-inner">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isThinking}
                placeholder={
                  cards.length > 0
                    ? "Tweak suggestions: 'Something spicier', 'Show me Truffles'..."
                    : "Tell the AI: 'I'm tired, want warm comfort food under ₹400'..."
                }
                className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
              {onMicClick && (
                <button
                  type="button"
                  onClick={onMicClick}
                  className={`p-2 rounded-xl text-xs transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-gray-500 hover:text-[#FC8019]'
                  }`}
                  title="Speak craving"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-2 px-3 rounded-xl bg-[#FC8019] text-white shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 text-xs font-bold flex items-center gap-1"
                title="Send to AI"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
