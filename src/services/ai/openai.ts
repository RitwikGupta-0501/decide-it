import { UserPromptContext, AIRankingResponse } from '../../types/ai';
import { SwiggyRestaurant } from '../../types/swiggy';
import { buildSystemPrompt, buildUserPrompt } from './promptBuilder';
import { cleanAndParseJsonResponse } from './gemini';

export async function callOpenAI(
  apiKey: string,
  model: string,
  context: UserPromptContext,
  restaurants: SwiggyRestaurant[],
  baseUrl: string = 'https://api.openai.com/v1'
): Promise<AIRankingResponse> {
  const modelName = model || 'gpt-4o-mini';
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const messages = [
    { role: 'system', content: buildSystemPrompt() },
    { role: 'user', content: buildUserPrompt(context, restaurants) }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI API error (HTTP ${response.status})`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('OpenAI returned an empty response');
  }

  return cleanAndParseJsonResponse(rawText);
}
