import { UserPromptContext, AIRankingResponse } from '../../types/ai';
import { SwiggyRestaurant } from '../../types/swiggy';
import { buildSystemPrompt, buildUserPrompt } from './promptBuilder';
import { cleanAndParseJsonResponse } from './gemini';

export async function callAnthropic(
  apiKey: string,
  model: string,
  context: UserPromptContext,
  restaurants: SwiggyRestaurant[]
): Promise<AIRankingResponse> {
  const modelName = model || 'claude-3-5-haiku-latest';
  const url = 'https://api.anthropic.com/v1/messages';

  const systemPrompt = buildSystemPrompt() + '\nOutput ONLY raw JSON with no conversational text or markdown ticks.';
  const userContent = buildUserPrompt(context, restaurants);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Anthropic API error (HTTP ${response.status})`);
  }

  const data = await response.json();
  const rawText = data?.content?.[0]?.text;
  if (!rawText) {
    throw new Error('Anthropic returned an empty response');
  }

  return cleanAndParseJsonResponse(rawText);
}
