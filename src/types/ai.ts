import { FoodDietType, SwiggyPastOrder } from './swiggy';

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'openrouter' | 'mock';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  customEndpoint?: string;
  isValidated?: boolean;
}

export interface FoodRecommendation {
  id: string;
  dishName: string;
  restaurantName: string;
  restaurantId: string;
  cuisine: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatingsString: string;
  deliveryTimeMinutes: number;
  distanceKm: number;
  isVeg: boolean;
  imageUrl: string;
  swiggyUrl: string;
  aiFitReason: string;
  moodMatchScore: number; // 0 - 100
  flavorProfile: string[];
  tags: string[];
  chefNote?: string;
}

export interface UserPromptContext {
  userQuery: string;
  mood: string;
  timeSlot: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'late-night';
  currentTimeString: string;
  location: {
    city: string;
    locality: string;
  };
  dietPreference: FoodDietType;
  maxBudget?: number;
  spicePreference?: 'mild' | 'medium' | 'spicy' | 'any';
  pastOrders: SwiggyPastOrder[];
}

export interface AIRankingResponse {
  recommendations: FoodRecommendation[];
  detectedMood: string;
  aiSummary: string;
  suggestedAction: string;
}
