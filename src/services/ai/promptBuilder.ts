import { UserPromptContext } from '../../types/ai';
import { SwiggyRestaurant } from '../../types/swiggy';

export function buildSystemPrompt(): string {
  return `You are decideIT, an elite Indian food intelligence AI designed to eliminate dinner indecision on Swiggy.
Your job is to analyze the user's emotional state / mood, current time of day, location, dietary constraints, and past Swiggy order history, and recommend a curated deck of exactly 4 to 6 dishes that will hit the spot right now.

You must respond ONLY with a valid JSON object matching this schema:
{
  "detectedMood": "Short description of detected mood and hunger intent",
  "aiSummary": "Warm, engaging 1-sentence summary of why these choices were picked",
  "suggestedAction": "Quick hint on next steps",
  "recommendations": [
    {
      "dishName": "Exact name of dish",
      "restaurantName": "Restaurant name",
      "restaurantId": "id of restaurant from catalog",
      "cuisine": "Cuisine category",
      "price": 320,
      "originalPrice": 360,
      "rating": 4.6,
      "totalRatingsString": "50K+ ratings",
      "deliveryTimeMinutes": 25,
      "distanceKm": 2.1,
      "isVeg": false,
      "imageUrl": "valid image url",
      "swiggyUrl": "valid swiggy url",
      "aiFitReason": "1 punchy sentence explaining why this specifically fits their mood, time, and history",
      "moodMatchScore": 96,
      "flavorProfile": ["Savory", "Spicy", "Warm"],
      "tags": ["Comfort Food", "Bestseller"],
      "chefNote": "Pair with raita or extra cheese"
    }
  ]
}

Strict Rules:
1. Prioritize dishes matching the user's diet (if Veg, ONLY return isVeg: true).
2. Consider the time of day (e.g. late night calls for comfort, burgers, biryani or rolls; morning calls for breakfast classics; afternoon for wholesome lunch bowls; evening for tea & crispy snacks).
3. Connect with their past order patterns (e.g., if they frequently order spicy food or biryani, acknowledge that preference).
4. Return ONLY valid JSON, with no markdown code fences or backticks.`;
}

export function buildUserPrompt(context: UserPromptContext, availableRestaurants: SwiggyRestaurant[]): string {
  // Format past orders context
  const pastOrdersSummary = context.pastOrders.slice(0, 5).map(o => {
    const itemNames = o.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    return `- ${o.restaurantName} (${o.cuisine}): ${itemNames} on ${o.dayOfWeek} (${o.timeSlot}) - Rated: ${o.ratingGiven || 'N/A'}/5`;
  }).join('\n');

  // Format catalog of available restaurants & menus
  const catalogSummary = availableRestaurants.map(r => {
    const menuItems = r.menu.map(m => `  * [${m.id}] ${m.name} (₹${m.price}, ${m.isVeg ? 'Veg' : 'Non-Veg'}, ${m.category}): ${m.description} [img: ${m.imageUrl}]`).join('\n');
    return `Restaurant: ${r.name} (ID: ${r.id}, Rating: ${r.avgRating}, Distance: ${r.distanceKm}km, ETA: ${r.deliveryTimeMinutes}m, URL: ${r.swiggyUrl})\nCuisines: ${r.cuisines.join(', ')}\nMenuItems:\n${menuItems}`;
  }).join('\n\n');

  return `User Context & Request:
- Current Query: "${context.userQuery || 'Suggest what I should eat'}"
- Selected Mood Tag: ${context.mood || 'Spontaneous'}
- Local Time: ${context.currentTimeString} (Slot: ${context.timeSlot})
- Current Location: ${context.location.locality}, ${context.location.city}
- Dietary Preference: ${context.dietPreference}
- Spice Preference: ${context.spicePreference || 'any'}
- Max Budget: ${context.maxBudget ? '₹' + context.maxBudget : 'Flexible'}

User's Recent Swiggy Orders:
${pastOrdersSummary || 'No past order history available.'}

Available Local Restaurants and Menus:
${catalogSummary}

Select the 4-6 most optimal dishes from the available catalog that satisfy the user's mood, dietary constraint, and time of day. Populate the imageUrl and swiggyUrl directly from the corresponding restaurant and item.`;
}
