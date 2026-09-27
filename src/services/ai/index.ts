import { AIProvider, UserPromptContext, AIRankingResponse } from '../../types/ai';
import { SwiggyRestaurant } from '../../types/swiggy';
import { KeyVault } from '../storage/keyVault';
import { generateMockRecommendations } from './mockAI';
import { callGemini } from './gemini';
import { callOpenAI } from './openai';
import { callAnthropic } from './anthropic';
import { callGroq, callOpenRouter } from './groq';

export interface AIServiceResult {
  data: AIRankingResponse;
  usedProvider: AIProvider;
  isFallback: boolean;
  fallbackReason?: string;
}

export async function getFoodRecommendations(
  context: UserPromptContext,
  restaurants: SwiggyRestaurant[],
  overrideProvider?: AIProvider
): Promise<AIServiceResult> {
  const configs = KeyVault.getConfigs();
  const activeProvider = overrideProvider || KeyVault.getActiveProvider();
  const config = configs[activeProvider];

  // If mock selected or no API key provided, use smart mock engine directly
  if (activeProvider === 'mock' || !config || !config.apiKey || config.apiKey.trim() === '') {
    const data = await generateMockRecommendations(context, restaurants);
    return {
      data,
      usedProvider: 'mock',
      isFallback: activeProvider !== 'mock',
      fallbackReason: activeProvider !== 'mock' ? `No API key configured for ${activeProvider}. Using built-in smart engine.` : undefined
    };
  }

  try {
    let data: AIRankingResponse;

    switch (activeProvider) {
      case 'gemini':
        data = await callGemini(config.apiKey, config.model, context, restaurants);
        break;
      case 'openai':
        data = await callOpenAI(config.apiKey, config.model, context, restaurants);
        break;
      case 'anthropic':
        data = await callAnthropic(config.apiKey, config.model, context, restaurants);
        break;
      case 'groq':
        data = await callGroq(config.apiKey, config.model, context, restaurants);
        break;
      case 'openrouter':
        data = await callOpenRouter(config.apiKey, config.model, context, restaurants);
        break;
      default:
        data = await generateMockRecommendations(context, restaurants);
        break;
    }

    // Ensure we have recommendations
    if (!data.recommendations || data.recommendations.length === 0) {
      throw new Error('AI provider returned 0 recommendations');
    }

    return {
      data,
      usedProvider: activeProvider,
      isFallback: false
    };
  } catch (err: any) {
    console.warn(`Provider ${activeProvider} failed:`, err);
    // Graceful fallback to smart heuristic engine
    const fallbackData = await generateMockRecommendations(context, restaurants);
    return {
      data: fallbackData,
      usedProvider: 'mock',
      isFallback: true,
      fallbackReason: `${activeProvider.toUpperCase()} error: ${err.message}. Showing smart heuristic results.`
    };
  }
}
