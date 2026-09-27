import { useState, useEffect, useCallback, useMemo } from 'react';
import { FoodDietType, SwiggyAddress, SwiggyPastOrder, SwiggyRestaurant } from '../types/swiggy';
import { FoodRecommendation, UserPromptContext, AIProvider } from '../types/ai';
import { swiggyMcp } from '../services/swiggy/mcpClient';
import { getFoodRecommendations } from '../services/ai';
import { KeyVault } from '../services/storage/keyVault';

export function getTimeSlot(): 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'late-night' {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 19) return 'snack';
  if (hour >= 19 && hour < 23) return 'dinner';
  return 'late-night';
}

export function useDecideEngine() {
  const [mood, setMood] = useState<string>('Exhausted after work 🥱');
  const [userQuery, setUserQuery] = useState<string>('');
  const [diet, setDiet] = useState<FoodDietType>('all');
  const [maxBudget, setMaxBudget] = useState<number | undefined>(undefined);
  const [selectedAddress, setSelectedAddress] = useState<SwiggyAddress>({
    id: 'addr_default',
    tag: 'Home',
    addressLine: '100ft Road, Indiranagar',
    landmark: 'Near Metro Station',
    city: 'Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    pincode: '560038'
  });

  // Data states
  const [pastOrders, setPastOrders] = useState<SwiggyPastOrder[]>([]);
  const [restaurants, setRestaurants] = useState<SwiggyRestaurant[]>([]);
  const [addresses, setAddresses] = useState<SwiggyAddress[]>([]);
  const [cards, setCards] = useState<FoodRecommendation[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likedCards, setLikedCards] = useState<FoodRecommendation[]>([]);
  const [dislikedCards, setDislikedCards] = useState<FoodRecommendation[]>([]);
  const [finalWinner, setFinalWinner] = useState<FoodRecommendation | null>(null);

  // Status states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [detectedMood, setDetectedMood] = useState<string>('');
  const [activeProvider, setActiveProvider] = useState<AIProvider>(KeyVault.getActiveProvider());
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // Initialize Swiggy data
  useEffect(() => {
    async function loadSwiggyData() {
      try {
        const [orders, rests, addrs] = await Promise.all([
          swiggyMcp.getPastOrders(),
          swiggyMcp.getRestaurants(),
          swiggyMcp.getAddresses()
        ]);
        setPastOrders(orders);
        setRestaurants(rests);
        setAddresses(addrs);
        if (addrs.length > 0) {
          setSelectedAddress(addrs[0]);
        }
      } catch (e: any) {
        console.error('Error loading Swiggy data:', e);
      }
    }
    loadSwiggyData();
  }, []);

  // Update active provider from vault
  const refreshActiveProvider = useCallback(() => {
    setActiveProvider(KeyVault.getActiveProvider());
  }, []);

  const timeSlot = useMemo(() => getTimeSlot(), []);
  const currentTimeString = useMemo(() => {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Run AI Decision Engine
  const generateRecommendations = useCallback(async (customQuery?: string, customMood?: string) => {
    setIsLoading(true);
    setError(null);
    setFallbackNotice(null);

    const effectiveQuery = customQuery !== undefined ? customQuery : userQuery;
    const effectiveMood = customMood !== undefined ? customMood : mood;

    const context: UserPromptContext = {
      userQuery: effectiveQuery,
      mood: effectiveMood,
      timeSlot,
      currentTimeString,
      location: {
        city: selectedAddress.city,
        locality: selectedAddress.landmark || selectedAddress.addressLine
      },
      dietPreference: diet,
      maxBudget,
      pastOrders
    };

    try {
      const result = await getFoodRecommendations(context, restaurants);
      setCards(result.data.recommendations || []);
      setCurrentIndex(0);
      setAiSummary(result.data.aiSummary || '');
      setDetectedMood(result.data.detectedMood || effectiveMood);
      setIsFallback(result.isFallback);
      if (result.fallbackReason) {
        setFallbackNotice(result.fallbackReason);
      }
      setLikedCards([]);
      setDislikedCards([]);
      setFinalWinner(null);
    } catch (err: any) {
      console.error('Failed to generate recommendations:', err);
      setError(err.message || 'Something went wrong while consulting AI.');
    } finally {
      setIsLoading(false);
    }
  }, [userQuery, mood, timeSlot, currentTimeString, selectedAddress, diet, maxBudget, pastOrders, restaurants]);

  // Swipe Action Handlers
  const handleSwipeRight = useCallback((card: FoodRecommendation) => {
    setLikedCards(prev => [...prev, card]);
    // Choose as final winner directly or advance
    setFinalWinner(card);
  }, []);

  const handleSwipeLeft = useCallback((card: FoodRecommendation) => {
    setDislikedCards(prev => [...prev, card]);
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handleSuperLike = useCallback((card: FoodRecommendation) => {
    setLikedCards(prev => [...prev, card]);
    setFinalWinner(card);
  }, []);

  // Voice/Text feedback refinement (e.g. "Too heavy, show me soup or light snacks")
  const handleRefineWithFeedback = useCallback(async (feedbackText: string) => {
    const refinedQuery = `${userQuery ? userQuery + ' — ' : ''}Refinement: ${feedbackText} (Exclude already passed items: ${dislikedCards.map(c => c.dishName).join(', ')})`;
    await generateRecommendations(refinedQuery, mood);
  }, [userQuery, dislikedCards, mood, generateRecommendations]);

  const resetDecision = useCallback(() => {
    setFinalWinner(null);
    setCurrentIndex(0);
    setLikedCards([]);
    setDislikedCards([]);
  }, []);

  return {
    mood,
    setMood,
    userQuery,
    setUserQuery,
    diet,
    setDiet,
    maxBudget,
    setMaxBudget,
    selectedAddress,
    setSelectedAddress,
    addresses,
    pastOrders,
    restaurants,
    cards,
    currentCard: cards[currentIndex] || null,
    currentIndex,
    totalCards: cards.length,
    likedCards,
    dislikedCards,
    finalWinner,
    setFinalWinner,
    isLoading,
    error,
    aiSummary,
    detectedMood,
    activeProvider,
    isFallback,
    fallbackNotice,
    timeSlot,
    refreshActiveProvider,
    generateRecommendations,
    handleSwipeRight,
    handleSwipeLeft,
    handleSuperLike,
    handleRefineWithFeedback,
    resetDecision
  };
}
