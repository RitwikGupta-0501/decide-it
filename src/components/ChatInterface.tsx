import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Sparkles, Star, Clock, Heart, ArrowLeft, Utensils } from 'lucide-react';
import { FoodRecommendation } from '../types/ai';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  cards?: FoodRecommendation[];
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSelectCard: (card: FoodRecommendation) => void;
  onSwitchToVoice: () => void;
  isThinking: boolean;
}

const QUICK_PROMPTS = [
  '🥱 Long exhausting day, need comfort food',
  '🌙 Late night burger or loaded biryani',
  '🥗 Light & fresh high-protein bowl',
  '🌶️ Hot spicy Andhra biryani',
  '🥞 Crispy ghee podi dosa'
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onSelectCard,
  onSwitchToVoice,
  isThinking
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isThinking) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleChipClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto flex flex-col h-[calc(100vh-68px)]"
    >
      {/* Top Chat Bar with Switch to Voice */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-[#0A0D14]/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FC8019] to-[#ff9a47] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              decideIT Chat Assistant
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected to Swiggy MCP
            </span>
          </div>
        </div>

        {/* Switch to Voice Button */}
        <button
          onClick={onSwitchToVoice}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FC8019] border border-orange-200 dark:border-orange-900/60 hover:bg-[#FC8019] hover:text-white transition-all text-xs font-bold shadow-sm active:scale-95"
          title="Switch to Gemini Live Voice Mode"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Switch to Voice</span>
        </button>
      </div>

      {/* Message History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-3xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#FC8019] to-[#ff9a47] text-white rounded-br-sm'
                  : 'bg-white dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/80 rounded-bl-sm'
              }`}
            >
              <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
            </div>

            <span className="text-[10px] text-gray-400 mt-1 px-1">
              {msg.timestamp}
            </span>

            {/* Embedded Recommendation Cards if present */}
            {msg.cards && msg.cards.length > 0 && (
              <div className="w-full mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {msg.cards.map((card, idx) => (
                  <div
                    key={card.id || idx}
                    onClick={() => onSelectCard(card)}
                    className="group bg-white dark:bg-gray-900 rounded-2xl p-3 border border-gray-200 dark:border-gray-800 hover:border-[#FC8019] shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex gap-2.5 mb-2">
                      <img
                        src={card.imageUrl}
                        alt={card.dishName}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              card.isVeg ? 'bg-green-600' : 'bg-red-600'
                            }`}
                          />
                          <span className="text-[10px] font-bold text-gray-400 uppercase truncate">
                            {card.cuisine}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {card.dishName}
                        </h4>
                        <p className="text-[11px] font-bold text-[#FC8019] truncate">
                          {card.restaurantName}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                          <span className="text-emerald-600 font-bold">★ {card.rating}</span>
                          <span>•</span>
                          <span>₹{card.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-[10px] text-gray-700 dark:text-gray-300 mb-2">
                      "{card.aiFitReason}"
                    </div>

                    <button
                      type="button"
                      className="w-full py-1.5 rounded-xl bg-[#FC8019] text-white font-bold text-[11px] flex items-center justify-center gap-1 hover:brightness-105 active:scale-95 transition-all shadow-sm"
                    >
                      <Heart className="w-3 h-3 fill-white" />
                      <span>Order This</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#FC8019] p-3 rounded-2xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 w-fit">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Consulting Swiggy MCP & crafting meal options...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Bottom Dock: Quick Chips & Text Input */}
      <div className="p-3 border-t border-gray-200/80 dark:border-gray-800/80 bg-white/90 dark:bg-[#0A0D14]/90 backdrop-blur-xl space-y-2">
        {/* Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">Try:</span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleChipClick(prompt)}
              className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:text-[#FC8019] text-gray-600 dark:text-gray-300 border border-transparent hover:border-[#FC8019]/40 whitespace-nowrap text-[11px] font-semibold transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-2xl p-1.5 border border-gray-200 dark:border-gray-700 shadow-inner">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isThinking}
            placeholder="Type your mood or craving: 'I'm tired, want comfort food'..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="p-2 px-3.5 rounded-xl bg-[#FC8019] text-white shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-40 text-xs font-bold flex items-center gap-1"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
