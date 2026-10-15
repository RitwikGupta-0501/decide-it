import React, { useState, useEffect } from 'react';
import { CuratedFoodCard, CuratedItemData } from './CuratedFoodCard';
import { DockedChatPanel } from './DockedChatPanel';
import { QuickBiteTile, QuickBiteData } from './QuickBiteTile';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

// Mock Quick Bites Data
const mockQuickBites: QuickBiteData[] = [
  {
    id: 'qb1',
    name: 'Truffles Peri Peri French Fries',
    restaurant: 'Truffles Bistro',
    eta: '28 MINS',
    description: 'Twice-fried golden potato wedges seasoned with tangy African bird\'s eye chili powder.',
    price: 130,
    originalPrice: 160,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABoU3WvZqSRRvI-lFk9geqrGIlVH6bhYX-uR4L_FpEmtv33mLpdKc-4BKCLuCUiF1hWwMwIIPhzV7nGHm_F0pHXTwY5r_3YRFAu7yFjVZTtUREf6j3NOZJETrOfSkrIbTriVBMbM96lqyOL5p_3Jjhn7p4gN8uVEcwqdICPshOJqe9w6eJkLxWDgvXf4UFkGTyy1DSsJCjn3y07AIXzn725ySYGl0NXgyTc3m3PY_x-gFGHgmNKEO7'
  },
  {
    id: 'qb2',
    name: 'Meghana Chicken 65 Starter',
    restaurant: 'Meghana Foods',
    eta: '24 MINS',
    description: 'Crisp pan-fried boneless cubes infused with tempered curry leaves and South Indian dry chili spice.',
    price: 260,
    originalPrice: 315,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAskSz3aHf6pv1GGJTuiqpUvWuaNyn4leUjKvKP29MHIRcZivQSWsthPrhoBBlJcqifaHl_bvw7MabTFHtF8ZMlvkyYPOhkVZ8sZWaKtReFW1p9Bv-1mA3knRNVtvNIoNjV7d6HN2VqbUH5xJb3JCENzEHuMTK2dt7hxRuCbtMLPLmHiHLcaxNnoMcOFYGvUhjWtY0O8z_qo4ccv8jdeM5QDlSaUEBbtG1PDap_dzla14IF9OLYZ0X'
  },
  {
    id: 'qb3',
    name: 'Belgian Dark Chocolate Mousse',
    restaurant: 'The Dessert Co.',
    eta: '20 MINS',
    description: 'Velvety 70% dark cocoa whipped to airy perfection with salted caramel drizzle.',
    price: 150,
    originalPrice: 180,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8BMYBPSBK4MMWrSKGJA2-fjdbkwe7ELpNu36JoEUv94HvMYqCU0x0jDngt71t6te7BJVoSJOSs4MgNm0U6XuGJDYpQQzuHL3_V2yYYTw8ct4kJL4ymkJlRDUiMziHUU4m-zUsS6rJBeoooDZc6BaZm6Q29Sj1n_mmXwa1CX9L4IKH6r41YVWtl4F2WypjfvKNqdvGganDQIJJIEa5ipE88u7ugjQz-1Z_DrpmnWkoAbVg7cyZgNqW'
  }
];

interface TextModeInterfaceProps {
  activeQuery: string;
  onUpdateQuery?: (newQuery: string) => void;
  curatedItems: CuratedItemData[];
  cartItemIds: string[];
  cartTotal: number;
  onToggleAdd: (item: any) => void;
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
  onToggleAdd,
  onSelectCard,
  onSubmitAdjustment
}) => {
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(activeQuery);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedPrompt.trim()) {
      onUpdateQuery?.(editedPrompt.trim());
      onSubmitAdjustment(editedPrompt.trim());
      setIsEditingPrompt(false);
    }
  };

  return (
    <div className="w-full flex flex-col relative overflow-visible min-w-0 pb-28 md:pb-24">
      {/* Dynamic Ambient Back-Surface Aura Dispersions */}
      <div className="absolute -top-12 left-1/4 w-[480px] h-[360px] bg-gradient-to-br from-primary-container/15 via-tertiary-container/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[420px] h-[320px] bg-gradient-to-bl from-secondary-container/10 via-primary-container/5 to-transparent blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* Primary Canvas Container */}
      <div className="w-full max-w-[1280px] mx-auto px-margin md:px-margin-lg pt-space-lg flex flex-col gap-space-xl">
        
        {/* Active Filter Ribbon & Context Pill - Visible when scrolled */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm"
            >
              <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm">
                <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
                  <span className="text-on-surface-variant font-semibold">Parsed Criteria:</span>
                </div>
                <div className="flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/30 hover:bg-surface-container-high transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[14px] text-error">local_fire_department</span>
                  <span>High Spice (Andhra / Fiery)</span>
                  <button className="hover:text-primary transition-colors flex items-center ml-0.5"><span className="material-symbols-outlined text-[13px] text-on-surface-variant">close</span></button>
                </div>
                <div className="flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/30 hover:bg-surface-container-high transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[14px] text-secondary-container">bolt</span>
                  <span>Under 30 Mins</span>
                  <button className="hover:text-primary transition-colors flex items-center ml-0.5"><span className="material-symbols-outlined text-[13px] text-on-surface-variant">close</span></button>
                </div>
                <button className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary hover:underline transition-colors px-1.5 py-0.5">Clear All</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid grid-cols-1 ${isScrolled ? 'lg:grid-cols-12' : ''} gap-gutter-md items-start transition-all duration-700 ease-in-out`}>
          
          {/* LEFT SECTION: Catalog (Full width initially, 7/8 cols when scrolled) */}
          <motion.div layout className={`flex flex-col gap-space-xl ${isScrolled ? 'lg:col-span-7 xl:col-span-8' : 'w-full'}`}>
            
            {/* Central Hero Conversational Block - Only visible at top */}
            <AnimatePresence mode="popLayout">
              {!isScrolled && (
                <motion.section 
                  layoutId="ai-conversational-block"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full flex flex-col items-center justify-center relative"
                >
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
                          className="ml-space-md w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit</span>
                        </button>
                      </div>
                    )}

                    {/* AI Engine Response */}
                    <div className="w-full bg-surface-container/75 backdrop-blur-2xl rounded-xl p-space-lg md:p-space-xl shadow-[0_16px_36px_-10px_rgba(0,0,0,0.65)] relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-80" />
                      <div className="flex flex-col gap-space-md">
                        <div className="font-headline-md md:font-headline-lg text-on-surface leading-snug">
                          I found three exceptional spots nearby. Meghana’s fiery Andhra biryani is arriving in{' '}
                          <span className="text-primary-container font-bold underline decoration-primary-container/40 decoration-2 underline-offset-4">
                            24 minutes
                          </span>.
                        </div>
                        <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
                          <span className="px-space-sm py-space-xs rounded-full bg-surface-container-low font-label-sm text-label-sm text-primary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-primary-container">local_fire_department</span> High Spice (Andhra)
                          </span>
                          <span className="px-space-sm py-space-xs rounded-full bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">timer</span> Under 30 mins
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Curated Feed Section */}
            <motion.section layout className="w-full flex flex-col gap-space-md">
              <div className="flex items-end justify-between">
                <div className="flex flex-col gap-0.5">
                  <h2 className={`font-headline-lg text-headline-lg text-on-surface tracking-tight transition-all ${isScrolled ? 'mt-0.5' : ''}`}>
                    {isScrolled ? 'Top Recommendations' : 'Curated For Your Craving'}
                  </h2>
                </div>
                <div className="hidden sm:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                  <span>{isScrolled ? 'Sorted by arrival velocity' : 'Sort: Confidence Metric'}</span>
                  {!isScrolled && <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tune</span>}
                </div>
              </div>

              {/* Recommendation Cards */}
              <div className={`grid grid-cols-1 md:grid-cols-2 ${isScrolled ? 'xl:grid-cols-3' : 'xl:grid-cols-3'} gap-space-md`}>
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
            </motion.section>
            
            {/* Quick Bites & Sides (Only visible when scrolled) */}
            <AnimatePresence>
              {isScrolled && (
                <motion.section 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="flex flex-col gap-space-md pt-space-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Quick Bites & Sides</h3>
                    <a className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-0.5" href="#">
                      Explore 16 more sides
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                  </div>
                  
                  <div className="flex flex-col gap-space-sm">
                    {mockQuickBites.map((bite) => (
                      <QuickBiteTile 
                        key={bite.id}
                        item={bite}
                        isAdded={cartItemIds.includes(bite.id)}
                        onToggleAdd={onToggleAdd}
                      />
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT SECTION: Docked AI Chat Panel */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                className="lg:col-span-5 xl:col-span-4 sticky top-24 self-start hidden lg:block"
              >
                <DockedChatPanel activeQuery={activeQuery} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
