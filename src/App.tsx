import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { VoiceVisualizerOrb } from './components/VoiceVisualizerOrb';
import { AmbientVoiceOrb, OrbVisualState } from './components/AmbientVoiceOrb';
import { CuratedFoodCard, CuratedItemData } from './components/CuratedFoodCard';
import { FloatingAdjustmentPill } from './components/FloatingAdjustmentPill';
import { TextModeInterface } from './components/TextModeInterface';
import { ChatInterface, ChatMessage } from './components/ChatInterface';
import { OrderScreen } from './components/OrderScreen';
import { SettingsModal } from './components/SettingsModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { useDecideEngine } from './hooks/useDecideEngine';
import { useVoiceInput } from './hooks/useVoiceInput';
import { VoiceSynthesisService } from './services/speech/speechSynthesis';
import { FoodRecommendation } from './types/ai';

const INITIAL_CURATED_CARDS: CuratedItemData[] = [
  {
    id: 'curated_1',
    restaurantName: 'Meghana Foods',
    dishName: 'Special Andhra Chicken Biryani',
    price: 340,
    originalPrice: 390,
    rating: 4.5,
    deliveryTimeMinutes: 24,
    badge: 'TOP MATCH',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'curated_2',
    restaurantName: 'Truffles',
    dishName: 'Spicy Crunchy Chicken Burger',
    price: 290,
    rating: 4.4,
    deliveryTimeMinutes: 28,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'curated_3',
    restaurantName: 'Faasos',
    dishName: 'Double Cheese Meatball Wrap',
    price: 230,
    rating: 4.3,
    deliveryTimeMinutes: 18,
    badge: 'FASTEST',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80'
  }
];

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // View Mode: 'landing' | 'voice' | 'chat'
  const [viewMode, setViewMode] = useState<'landing' | 'voice' | 'chat'>('voice');

  // Ambient Loading & Orb Morph States
  const [orbState, setOrbState] = useState<OrbVisualState>('idle');
  const [loadingProgress, setLoadingProgress] = useState(100);

  // User query and hero narrative state (matching reference mockup)
  const [activeQuery, setActiveQuery] = useState<string>(
    'Something spicy and comforting that arrives in under 30 minutes.'
  );
  const [heroNarrative, setHeroNarrative] = useState({
    line1: 'I found three exceptional spots nearby.',
    line2: 'Meghana’s fiery Andhra biryani is arriving',
    eta: '24 minutes'
  });

  // Curated Food Cards & Cart State
  const [curatedItems, setCuratedItems] = useState<CuratedItemData[]>(INITIAL_CURATED_CARDS);
  const [cartItemIds, setCartItemIds] = useState<string[]>(['curated_1', 'curated_3']); // Initial 2 items totaling ₹570

  // Chat message history (synced across Voice & Chat)
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const {
    mood,
    selectedAddress,
    setSelectedAddress,
    addresses,
    pastOrders,
    cards,
    finalWinner,
    setFinalWinner,
    isLoading,
    refreshActiveProvider,
    generateRecommendations
  } = useDecideEngine();

  // Voice Input hook with continuous speech & hands-free VAD
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceInput((finalText) => {
    handleUserInput(finalText, 'voice');
  });

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Compute Cart Total
  const cartTotal = curatedItems
    .filter((item) => cartItemIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const cartCount = cartItemIds.length;

  // Toggle Cart Item Add/Remove
  const handleToggleAdd = (item: CuratedItemData) => {
    setCartItemIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  // Start continuous, hands-free voice mode
  const handleStartVoice = () => {
    setViewMode('voice');
    resetTranscript();
    VoiceSynthesisService.stop();
    const greeting = "Hey! What kind of food are you craving right now?";
    VoiceSynthesisService.speak(greeting, {
      onStart: () => setOrbState('speaking'),
      onEnd: () => {
        setOrbState('listening');
        resetTranscript();
        startListening();
      }
    });
  };

  // Switch to Traditional Chat Interface
  const handleSelectTextMode = () => {
    VoiceSynthesisService.stop();
    stopListening();
    setViewMode('chat');
    setOrbState('idle');
  };

  const createFoodRecommendation = (item: CuratedItemData, priceOverride?: number): FoodRecommendation => ({
    id: item.id,
    restaurantName: item.restaurantName,
    restaurantId: `rest_${item.id}`,
    dishName: item.dishName,
    price: priceOverride ?? item.price,
    cuisine: 'Curated Selection',
    isVeg: false,
    rating: item.rating,
    totalRatingsString: '1.2K+ ratings',
    deliveryTimeMinutes: item.deliveryTimeMinutes,
    distanceKm: 2.4,
    imageUrl: item.imageUrl,
    swiggyUrl: 'https://www.swiggy.com',
    aiFitReason: 'Curated directly for your craving via Swiggy MCP.',
    moodMatchScore: 98,
    flavorProfile: ['Spicy', 'Rich', 'Comforting'],
    tags: ['Bestseller', 'Fast Delivery']
  });

  // Universal handler for both Voice speech & Text adjustments
  const handleUserInput = async (text: string, source: 'voice' | 'chat' = 'chat') => {
    if (!text.trim()) return;

    if (source === 'voice') {
      stopListening();
    }

    setActiveQuery(text);
    setOrbState('thinking');
    VoiceSynthesisService.stop();

    // Check if user is referencing an existing item
    const lower = text.toLowerCase();
    const match = curatedItems.find(
      (c) =>
        lower.includes(c.restaurantName.toLowerCase()) ||
        lower.includes(c.dishName.toLowerCase())
    );

    if (match && (lower.includes('order') || lower.includes('pick') || lower.includes('choose') || lower.includes('checkout'))) {
      setFinalWinner(createFoodRecommendation(match));
      return;
    }

    // Call decision engine
    await generateRecommendations(text, mood);

    // Update hero statement with user query
    setHeroNarrative({
      line1: 'I found three exceptional spots nearby.',
      line2: `${match ? match.restaurantName : 'Meghana'}’s culinary pick is arriving`,
      eta: '24 minutes'
    });

    setOrbState('idle');

    // Natural voice feedback response
    const speech = `I found 3 great spots matching your request for ${text}. Meghana's biryani is arriving in 24 minutes. Tap checkout or add adjustments!`;
    VoiceSynthesisService.speak(speech, {
      onStart: () => setOrbState('speaking'),
      onEnd: () => {
        setOrbState('listening');
        resetTranscript();
        startListening();
      }
    });
  };

  // Sync decision engine cards to curatedItems when recommendations arrive
  useEffect(() => {
    if (cards.length > 0) {
      const newItems: CuratedItemData[] = cards.slice(0, 3).map((c, idx) => ({
        id: c.id || `rec_${idx}`,
        restaurantName: c.restaurantName,
        dishName: c.dishName,
        price: c.price,
        originalPrice: Math.round(c.price * 1.15),
        rating: c.rating,
        deliveryTimeMinutes: c.deliveryTimeMinutes,
        badge: idx === 0 ? 'TOP MATCH' : idx === 2 ? 'FASTEST' : undefined,
        imageUrl: c.imageUrl
      }));
      setCuratedItems(newItems);
      setCartItemIds([newItems[0].id]);
    }
  }, [cards]);

  const handleCheckout = () => {
    const selectedItem = curatedItems.find((i) => cartItemIds.includes(i.id)) || curatedItems[0];
    setFinalWinner(createFoodRecommendation(selectedItem, cartTotal));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#F1F5F9] font-sans antialiased relative selection:bg-[#FF5200] selection:text-white">
      {/* Subtle Dot Matrix Background Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Navbar with Bite AI Branding & Segmented Toggle */}
      <Navbar
        selectedAddress={selectedAddress}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        viewMode={viewMode}
        onSwitchMode={(mode) => {
          if (mode === 'voice') handleStartVoice();
          else handleSelectTextMode();
        }}
        cartCount={cartCount}
        onOpenCart={handleCheckout}
      />

      {/* Main Experience Router */}
      <main className="flex-1 flex flex-col items-center justify-start max-w-6xl mx-auto w-full px-4 sm:px-6 pt-24 pb-36 relative z-10">
        <AnimatePresence mode="wait">
          {finalWinner ? (
            /* Final Order Screen */
            <motion.div
              key="order-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45 }}
              className="w-full flex justify-center py-6"
            >
              <OrderScreen
                card={finalWinner}
                deliveryAddress={selectedAddress}
                onBack={() => {
                  setFinalWinner(null);
                  setOrbState('idle');
                }}
              />
            </motion.div>
          ) : viewMode === 'chat' ? (
            /* EXACT TEXT MODE INTERFACE MATCHING REFERENCE MOCKUP media_1790548631654.png */
            <TextModeInterface
              key="text-mode-view"
              activeQuery={transcript || activeQuery}
              onUpdateQuery={(newQ) => setActiveQuery(newQ)}
              curatedItems={curatedItems}
              cartItemIds={cartItemIds}
              cartTotal={cartTotal}
              onToggleAdd={handleToggleAdd}
              onSelectCard={(clicked) => {
                setFinalWinner(createFoodRecommendation(clicked));
              }}
              onSubmitAdjustment={(text) => handleUserInput(text, 'chat')}
              onMicClick={handleStartVoice}
              onCheckout={handleCheckout}
            />
          ) : (
            /* EXACT POST-QUERY VOICE MODE INTERFACE MATCHING REFERENCE MOCKUP */
            <motion.div
              key="voice-post-query-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center space-y-6"
            >
              <section className="w-full flex flex-col items-center text-center mt-4 md:mt-8 mb-8 z-10">
                {/* 1. Center Soundwave Visualizer Orb */}
                <VoiceVisualizerOrb
                  state={
                    orbState === 'speaking'
                      ? 'speaking'
                      : isListening
                      ? 'listening'
                      : orbState === 'thinking'
                      ? 'thinking'
                      : 'idle'
                  }
                  onClick={() => {
                    if (isListening) stopListening();
                    else startListening();
                  }}
                />

                {/* 2 & 3. Dialogue Typography: Minimal, Large & Calm */}
                <div className="max-w-2xl mx-auto flex flex-col gap-3 text-center px-4 relative z-10">
                  <p className="text-sm md:text-base font-normal text-on-surface-variant tracking-normal">
                    {transcript || activeQuery ? `“${transcript || activeQuery}”` : ''}
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-white leading-snug">
                    {heroNarrative.line1} {heroNarrative.line2}{' '}
                    <span className="text-primary-container font-medium">
                      in {heroNarrative.eta}
                    </span>.
                  </h1>
                </div>
              </section>

              {/* 4. Section Category Heading */}
              <div className="w-full pt-4 pb-1 px-1">
                <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-400">
                  CURATED FOR YOUR CRAVING
                </h3>
              </div>

              {/* 5. 3 Curated Recommendation Cards Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
                {curatedItems.map((item) => (
                  <CuratedFoodCard
                    key={item.id}
                    item={item}
                    isAdded={cartItemIds.includes(item.id)}
                    onToggleAdd={handleToggleAdd}
                    onClickCard={(clicked) => {
                      setFinalWinner(createFoodRecommendation(clicked));
                    }}
                  />
                ))}
              </div>

              {/* 6. Floating Bottom Pill Component */}
              <FloatingAdjustmentPill
                cartTotal={cartTotal}
                isListening={isListening}
                onSubmitText={(text) => handleUserInput(text, 'voice')}
                onMicClick={() => {
                  if (isListening) stopListening();
                  else startListening();
                }}
                onCheckout={handleCheckout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings, History & Location Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigChanged={refreshActiveProvider}
      />
      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={pastOrders}
      />
      <LocationPickerModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={setSelectedAddress}
      />
    </div>
  );
}

export default App;
