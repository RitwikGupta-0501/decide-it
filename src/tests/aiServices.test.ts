import { describe, expect, test } from 'bun:test';
import { buildSystemPrompt, buildUserPrompt } from '../services/ai/promptBuilder';
import { cleanAndParseJsonResponse } from '../services/ai/gemini';
import { generateMockRecommendations } from '../services/ai/mockAI';
import { MOCK_RESTAURANTS, MOCK_PAST_ORDERS } from '../services/swiggy/mockData';
import { UserPromptContext } from '../types/ai';

describe('AI Services & Heuristics Engine', () => {
  const sampleContext: UserPromptContext = {
    userQuery: 'I had a brutal day at work, need comfort food',
    mood: 'Exhausted after work 🥱',
    timeSlot: 'dinner',
    currentTimeString: '20:30',
    location: {
      city: 'Bengaluru',
      locality: 'Indiranagar'
    },
    dietPreference: 'all',
    pastOrders: MOCK_PAST_ORDERS
  };

  test('should construct system prompt requiring strict JSON schema', () => {
    const sysPrompt = buildSystemPrompt();
    expect(sysPrompt).toContain('decideIT');
    expect(sysPrompt).toContain('"detectedMood"');
    expect(sysPrompt).toContain('"recommendations"');
  });

  test('should format user prompt with location, past orders, and restaurants', () => {
    const userPrompt = buildUserPrompt(sampleContext, MOCK_RESTAURANTS);
    expect(userPrompt).toContain('Indiranagar');
    expect(userPrompt).toContain('Exhausted after work');
    expect(userPrompt).toContain('Meghana Foods');
    expect(userPrompt).toContain('Truffles');
  });

  test('should clean and parse JSON with markdown code fences', () => {
    const jsonStr = `\`\`\`json
{
  "detectedMood": "Craving Burger",
  "aiSummary": "Selected Truffles Burger",
  "suggestedAction": "Swipe right",
  "recommendations": [
    {
      "dishName": "All American Burger",
      "restaurantName": "Truffles",
      "restaurantId": "rest_blr_truffles",
      "cuisine": "American",
      "price": 290,
      "rating": 4.7,
      "totalRatingsString": "100K+ ratings",
      "deliveryTimeMinutes": 24,
      "distanceKm": 1.8,
      "isVeg": false,
      "imageUrl": "https://img.url",
      "swiggyUrl": "https://swiggy.url",
      "aiFitReason": "Great comfort meal",
      "moodMatchScore": 95,
      "flavorProfile": ["Cheesy"],
      "tags": ["Comfort"]
    }
  ]
}
\`\`\``;

    const parsed = cleanAndParseJsonResponse(jsonStr);
    expect(parsed.detectedMood).toBe('Craving Burger');
    expect(parsed.recommendations.length).toBe(1);
    expect(parsed.recommendations[0].dishName).toBe('All American Burger');
  });

  test('should filter out non-veg dishes when user selects Veg diet', async () => {
    const vegContext: UserPromptContext = {
      ...sampleContext,
      dietPreference: 'veg'
    };

    const result = await generateMockRecommendations(vegContext, MOCK_RESTAURANTS);
    expect(result.recommendations.length).toBeGreaterThan(0);

    for (const rec of result.recommendations) {
      expect(rec.isVeg).toBe(true);
    }
  });

  test('should prioritize comfort food when mood is exhausted', async () => {
    const result = await generateMockRecommendations(sampleContext, MOCK_RESTAURANTS);
    expect(result.recommendations.length).toBeGreaterThan(0);

    // Highest rated recommendation should have high mood score
    const top = result.recommendations[0];
    expect(top.moodMatchScore).toBeGreaterThanOrEqual(85);
    expect(top.aiFitReason.length).toBeGreaterThan(10);
  });
});
