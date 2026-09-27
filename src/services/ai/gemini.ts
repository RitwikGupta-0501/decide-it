import { UserPromptContext, AIRankingResponse } from '../../types/ai';
import { SwiggyRestaurant } from '../../types/swiggy';
import { buildSystemPrompt, buildUserPrompt } from './promptBuilder';

export async function callGemini(
  apiKey: string,
  model: string,
  context: UserPromptContext,
  restaurants: SwiggyRestaurant[]
): Promise<AIRankingResponse> {
  const modelName = model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;

  const systemInstruction = buildSystemPrompt();
  const userContent = buildUserPrompt(context, restaurants);

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\n${userContent}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error (HTTP ${response.status})`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini returned an empty response');
  }

  return cleanAndParseJsonResponse(rawText);
}

export function cleanAndParseJsonResponse(raw: string): AIRankingResponse {
  let cleaned = raw.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  const parsed = JSON.parse(cleaned);

  // Validate and assign fallback IDs if missing
  if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
    parsed.recommendations = parsed.recommendations.map((rec: any, idx: number) => ({
      ...rec,
      id: rec.id || `rec_gemini_${Date.now()}_${idx}`,
      moodMatchScore: rec.moodMatchScore || 90,
      flavorProfile: rec.flavorProfile || ['Delicious'],
      tags: rec.tags || ['Recommended']
    }));
  }

  return parsed as AIRankingResponse;
}
