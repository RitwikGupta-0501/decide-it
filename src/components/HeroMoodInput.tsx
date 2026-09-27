import React, { useState } from 'react';
import { Mic, MicOff, Search, Sparkles, Clock, MapPin, Leaf, Flame, ShieldAlert } from 'lucide-react';
import { FoodDietType } from '../types/swiggy';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface HeroMoodInputProps {
  mood: string;
  setMood: (m: string) => void;
  userQuery: string;
  setUserQuery: (q: string) => void;
  diet: FoodDietType;
  setDiet: (d: FoodDietType) => void;
  timeSlot: string;
  locationName: string;
  isLoading: boolean;
  onDecide: (customQuery?: string, customMood?: string) => void;
  fallbackNotice?: string | null;
}

const PRESET_MOODS = [
  { label: 'Exhausted after work', emoji: '🥱', query: 'I had a really long tiring day, need warm hearty comfort food' },
  { label: 'Late night cravings', emoji: '🌙', query: 'Late night munchies, hot cheese burgers or loaded biryani' },
  { label: 'Healthy & fresh', emoji: '🥗', query: 'Wholesome fresh salad or grilled protein bowl with clean carbs' },
  { label: 'Spicy comfort', emoji: '🌶️', query: 'Fiery Andhra spices, hot curry or spicy pepperoni pizza' },
  { label: 'Tea & Crispy Snacks', emoji: '☕', query: 'Hot ginger chai with crispy samosas or pakodas for evening' },
  { label: 'Weekend feast with friends', emoji: '🍕', query: 'Gourmet woodfired pizza and rich dessert for a party' },
  { label: 'Crispy South Indian Breakfast', emoji: '🥞', query: 'Hot crispy ghee podi masala dosa and soft button idlis' },
  { label: 'Pocket friendly binge', emoji: '💸', query: 'Super tasty filling meal under ₹250' }
];

export const HeroMoodInput: React.FC<HeroMoodInputProps> = ({
  mood,
  setMood,
  userQuery,
  setUserQuery,
  diet,
  setDiet,
  timeSlot,
  locationName,
  isLoading,
  onDecide,
  fallbackNotice
}) => {
  const [activeSpeechSample, setActiveSpeechSample] = useState<string | null>(null);

  const { isListening, transcript, isSupported, startListening, stopListening, setTranscript } = useVoiceInput(
    (finalText) => {
      setUserQuery(finalText);
      onDecide(finalText, mood);
    }
  );

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_MOODS[0]) => {
    const fullMood = `${preset.label} ${preset.emoji}`;
    setMood(fullMood);
    setUserQuery(preset.query);
    onDecide(preset.query, fullMood);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onDecide();
    }
  };

  // Format time of day display label
  const getTimeSlotBadge = () => {
    switch (timeSlot) {
      case 'breakfast':
        return '☀️ Morning Breakfast Hours';
      case 'lunch':
        return '🍛 Lunch Rush Hours';
      case 'snack':
        return '☕ Evening Snack & Chai Time';
      case 'dinner':
        return '🍲 Prime Dinner Hours';
      default:
        return '🌙 Late Night Cravings Window';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-6 pb-4">
      {/* Context banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/60 px-3 py-1 rounded-full border border-gray-200/60 dark:border-gray-700/60">
          <Clock className="w-3.5 h-3.5 text-[#FC8019]" />
          <span>{getTimeSlotBadge()}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/60 px-3 py-1 rounded-full border border-gray-200/60 dark:border-gray-700/60">
          <MapPin className="w-3.5 h-3.5 text-[#FC8019]" />
          <span>Delivering to {locationName}</span>
        </div>
      </div>

      {/* Main Headline */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          Stop arguing, <span className="text-[#FC8019] bg-gradient-to-r from-[#FC8019] to-[#ff9a47] bg-clip-text text-transparent">start eating.</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Tell us your mood or craving. Our AI analyzes your Swiggy order history, location, and time to hand-pick the winning meal in seconds.
        </p>
      </div>

      {fallbackNotice && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{fallbackNotice}</span>
        </div>
      )}

      {/* Input Box with Voice & Text */}
      <div className="relative bg-white dark:bg-gray-900/90 rounded-3xl p-3 sm:p-4 shadow-xl border border-gray-200/80 dark:border-gray-800 backdrop-blur-xl">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={isListening ? transcript : userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={isListening ? "Listening... Speak your mood or craving..." : "E.g., I'm super tired, want warm comfort food under ₹400..."}
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm sm:text-base font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/80 border transition-all focus:outline-none focus:ring-2 focus:ring-[#FC8019] ${
                  isListening ? 'border-red-400 ring-2 ring-red-300 animate-pulse' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
            </div>

            {/* Voice Record Button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-3.5 rounded-2xl transition-all flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-bounce'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#FC8019] hover:text-white'
              }`}
              title={isListening ? "Stop listening" : "Speak your mood"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Submit / Decide CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="hidden sm:flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#FC8019] to-[#ff9a47] text-white shadow-glow-orange shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>DecideIT</span>
                </>
              )}
            </button>
          </div>

          {/* Voice status indicator */}
          {isListening && (
            <div className="flex items-center justify-between text-xs px-2 text-red-500 font-semibold animate-pulse">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Listening to your voice... Speak freely!
              </span>
              <button
                type="button"
                onClick={stopListening}
                className="underline hover:text-red-700"
              >
                Done Speaking
              </button>
            </div>
          )}

          {/* Controls Bar: Diet Filter & Mobile Decide Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
            {/* Diet Filter */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDiet('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  diet === 'all'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                All Diets
              </button>
              <button
                type="button"
                onClick={() => setDiet('veg')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  diet === 'veg'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/40'
                }`}
              >
                <Leaf className="w-3 h-3" />
                <span>Pure Veg</span>
              </button>
              <button
                type="button"
                onClick={() => setDiet('non-veg')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                  diet === 'non-veg'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Non-Veg</span>
              </button>
            </div>

            {/* Mobile Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="sm:hidden flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#FC8019] to-[#ff9a47] text-white shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Decide For Me</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preset Mood Chips */}
      <div className="mt-4">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
          Or Tap Your Current Mood:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_MOODS.map((preset) => {
            const isSelected = mood.startsWith(preset.label);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all border ${
                  isSelected
                    ? 'bg-[#FC8019] text-white border-[#FC8019] shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-gray-700 hover:border-[#FC8019] hover:text-[#FC8019]'
                }`}
              >
                <span>{preset.emoji}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
