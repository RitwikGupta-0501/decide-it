import { UserPromptContext, AIRankingResponse } from '../../types/ai';
import { SwiggyRestaurant } from '../../types/swiggy';
import { callOpenAI } from './openai';

export async function callGroq(
  apiKey: string,
  model: string,
  context: UserPromptContext,
  restaurants: SwiggyRestaurant[]
): Promise<AIRankingResponse> {
  const modelName = model || 'llama-3.3-70b-versatile';
  return callOpenAI(apiKey, modelName, context, restaurants, 'https://api.groq.com/openai/v1');
}

export async function callOpenRouter(
  apiKey: string,
  model: string,
  context: UserPromptContext,
  restaurants: SwiggyRestaurant[]
): Promise<AIRankingResponse> {
  const modelName = model || 'google/gemini-2.5-flash';
  return callOpenAI(apiKey, modelName, context, restaurants, 'https://openrouter.ai/api/v1');
}
