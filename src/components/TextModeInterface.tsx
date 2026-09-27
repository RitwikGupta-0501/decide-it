import React, { useState } from 'react';
import { CuratedFoodCard, CuratedItemData } from './CuratedFoodCard';
import { FloatingAdjustmentPill } from './FloatingAdjustmentPill';

interface TextModeInterfaceProps {
  activeQuery: string;
  onUpdateQuery?: (newQuery: string) => void;
  curatedItems: CuratedItemData[];
  cartItemIds: string[];
  cartTotal: number;
  onToggleAdd: (item: CuratedItemData) => void;
  onSelectCard: (item: CuratedItemData) => void;
  onSubmitAdjustment: (text: string) => void;
  onMicClick: () => void;
  onCheckout: () => void;
}

export const TextModeInterface: React.FC<TextModeInterfaceProps> = ({
  activeQuery,
  onUpdateQuery,
  curatedItems,
  cartItemIds,
  cartTotal,
  onToggleAdd,
  onSelectCard,
  onSubmitAdjustment,
  onMicClick,
  onCheckout
}) => {
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(activeQuery);

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedPrompt.trim()) {
      onUpdateQuery?.(editedPrompt.trim());
      onSubmitAdjustment(editedPrompt.trim());
      setIsEditingPrompt(false);
    }
  };

  return (
    <div className="w-full flex flex-col relative overflow-x-hidden min-w-0 pb-28 md:pb-24">
      {/* Dynamic Ambient Back-Surface Aura Dispersions */}
      <div className="absolute -top-12 left-1/4 w-[480px] h-[360px] bg-gradient-to-br from-primary-container/15 via-tertiary-container/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[420px] h-[320px] bg-gradient-to-bl from-secondary-container/10 via-primary-container/5 to-transparent blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* Primary Canvas Container */}
      <div className="w-full max-w-[1280px] mx-auto px-margin md:px-margin-lg pt-space-lg flex flex-col gap-space-xl">
        {/* Central Hero Conversational Block */}
        <section className="w-full flex flex-col items-center justify-center relative">
          <div className="w-full max-w-3xl flex flex-col gap-space-md">
            {/* User Query Capsule */}
            {isEditingPrompt ? (
              <form
                onSubmit={handleSavePrompt}
                className="flex items-center justify-between self-start w-full sm:w-auto bg-surface-container-high/70 backdrop-blur-xl px-space-md py-space-xs rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center gap-space-xs flex-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Prompt
                  </span>
                  <input
                    type="text"
                    value={editedPrompt}
                    onChange={(e) => setEditedPrompt(e.target.value)}
                    className="bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface ml-space-xs font-medium italic focus:ring-0 flex-1 min-w-[240px]"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="ml-space-md px-2 py-0.5 rounded-full text-primary-container font-label-sm text-label-sm font-bold hover:bg-surface-container-highest transition-colors"
                >
                  Done
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between self-start w-full sm:w-auto bg-surface-container-high/70 backdrop-blur-xl px-space-md py-space-xs rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Prompt
                  </span>
                  <span className="font-body-md text-body-md text-on-surface ml-space-xs font-medium italic">
                    &ldquo;{activeQuery}&rdquo;
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingPrompt(true)}
                  aria-label="Edit Prompt"
                  className="ml-space-md w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                </button>
              </div>
            )}

            {/* AI Engine Response & Reasoning Shell */}
            <div className="w-full bg-surface-container/75 backdrop-blur-2xl rounded-xl p-space-lg md:p-space-xl shadow-[0_16px_36px_-10px_rgba(0,0,0,0.65)] relative overflow-hidden">
              {/* Subtle Glow Highlight Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80" />
              <div className="flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center justify-between gap-space-xs" />
                {/* Natural Language Synthesis */}
                <div className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-on-surface leading-snug">
                  I found three exceptional spots nearby. Meghana’s fiery Andhra biryani is arriving in{' '}
                  <span className="text-primary-container font-bold underline decoration-primary-container/40 decoration-2 underline-offset-4">
                    24 minutes
                  </span>
                  .
                </div>

                {/* Filter Badges / Extracted Semantic Parameters */}
                <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
                  <span className="px-space-sm py-space-xs rounded-full bg-surface-container-low font-label-sm text-label-sm text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary-container">
                      local_fire_department
                    </span>
                    High Spice (Andhra)
                  </span>
                  <span className="px-space-sm py-space-xs rounded-full bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">timer</span>
                    Under 30 mins
                  </span>
                  <span className="px-space-sm py-space-xs rounded-full bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">soup_kitchen</span>
                    Comfort Food
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Feed Header Section */}
        <section className="w-full flex flex-col gap-space-md">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                Curated For Your Craving
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <span>Sort: Confidence Metric</span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tune</span>
            </div>
          </div>

          {/* Recommendation Cards 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md">
            {curatedItems.map((item) => (
              <CuratedFoodCard
                key={item.id}
                item={item}
                isAdded={cartItemIds.includes(item.id)}
                onToggleAdd={onToggleAdd}
                onClickCard={onSelectCard}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Persistent Floating Bottom Input & Quick Action Pill Dock */}
      <FloatingAdjustmentPill
        cartTotal={cartTotal}
        isListening={false}
        onSubmitText={onSubmitAdjustment}
        onMicClick={onMicClick}
        onCheckout={onCheckout}
      />
    </div>
  );
};
