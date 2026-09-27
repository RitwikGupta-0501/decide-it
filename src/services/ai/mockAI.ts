import { UserPromptContext, AIRankingResponse, FoodRecommendation } from '../../types/ai';
import { SwiggyRestaurant } from '../../types/swiggy';

export async function generateMockRecommendations(
  context: UserPromptContext,
  restaurants: SwiggyRestaurant[]
): Promise<AIRankingResponse> {
  // Simulate slight network latency for realistic feel
  await new Promise(r => setTimeout(r, 600));

  const queryLower = (context.userQuery + ' ' + context.mood).toLowerCase();
  const isVegOnly = context.dietPreference === 'veg';

  const scoredItems: { item: any; restaurant: SwiggyRestaurant; score: number; reason: string; flavors: string[] }[] = [];

  // Flatten all items
  for (const rest of restaurants) {
    for (const item of rest.menu) {
      if (isVegOnly && !item.isVeg) continue;
      if (context.maxBudget && item.price > context.maxBudget) continue;

      let score = 75;
      let reason = `Top-rated choice from ${rest.name} (${rest.avgRating}★)`;
      let flavors = ['Savory', 'Fresh'];

      // Mood & Time Slot Heuristics
      if (queryLower.includes('exhaust') || queryLower.includes('rough') || queryLower.includes('comfort') || queryLower.includes('tired')) {
        if (item.name.toLowerCase().includes('butter') || item.name.toLowerCase().includes('cheese') || item.name.toLowerCase().includes('biryani')) {
          score += 20;
          reason = `Pure comfort food to unwind after a demanding day. Rich, soul-satisfying flavors.`;
          flavors = ['Warm & Rich', 'Comforting', 'Hearty'];
        }
      } else if (queryLower.includes('health') || queryLower.includes('light') || queryLower.includes('fresh') || queryLower.includes('salad') || queryLower.includes('gym')) {
        if (item.category.toLowerCase().includes('bowl') || item.name.toLowerCase().includes('bowl') || item.name.toLowerCase().includes('tofu')) {
          score += 25;
          reason = `High-protein, clean ingredients packed with fresh greens and wholesome grains.`;
          flavors = ['Crisp & Clean', 'Herbaceous', 'Energizing'];
        } else {
          score -= 10;
        }
      } else if (queryLower.includes('spic') || queryLower.includes('andhra') || queryLower.includes('fiery')) {
        if ((item.spicyLevel || 0) >= 2 || item.name.toLowerCase().includes('meghana') || item.name.toLowerCase().includes('peri peri') || item.name.toLowerCase().includes('diavola')) {
          score += 22;
          reason = `Fiery Andhra & chili spices guaranteed to satisfy your craving for bold heat.`;
          flavors = ['Fiery Heat', 'Aromatic Spices', 'Zesty'];
        }
      } else if (queryLower.includes('sweet') || queryLower.includes('dessert') || queryLower.includes('shake')) {
        if (item.category.toLowerCase().includes('dessert') || item.name.toLowerCase().includes('shake')) {
          score += 30;
          reason = `Indulgent sweet treat crafted with hazelnut and chocolate to elevate your dopamine.`;
          flavors = ['Sweet Indulgence', 'Velvety', 'Decadent'];
        }
      } else if (queryLower.includes('rain') || queryLower.includes('chai') || queryLower.includes('snack') || context.timeSlot === 'snack') {
        if (item.name.toLowerCase().includes('chai') || item.name.toLowerCase().includes('samosa') || item.name.toLowerCase().includes('pakoda') || item.name.toLowerCase().includes('idli')) {
          score += 20;
          reason = `Warm freshly brewed kadak chai and hot crispy snacks—unbeatable for tea time.`;
          flavors = ['Warm & Spiced', 'Crispy', 'Soothing'];
        }
      } else if (context.timeSlot === 'breakfast') {
        if (item.category.toLowerCase().includes('dosa') || item.category.toLowerCase().includes('idli')) {
          score += 25;
          reason = `Crispy ghee podi classic from Bengaluru's iconic breakfast hotspot.`;
          flavors = ['Desi Ghee', 'Crispy & Golden', 'Traditional'];
        }
      } else if (context.timeSlot === 'late-night') {
        if (item.name.toLowerCase().includes('burger') || item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('pizza')) {
          score += 20;
          reason = `Late night savior: hot, fast delivery in ${rest.deliveryTimeMinutes} mins with molten cheese.`;
          flavors = ['Cheesy', 'Savory', 'Late Night Fuel'];
        }
      }

      // Past order alignment bonus
      const orderedBefore = context.pastOrders.some(po => po.restaurantId === rest.id || po.items.some(pi => pi.name === item.name));
      if (orderedBefore) {
        score += 8;
        reason += ` Matches your past 5★ order frequency!`;
      }

      // Bestseller bonus
      if (item.isBestseller) score += 5;

      scoredItems.push({
        item,
        restaurant: rest,
        score: Math.min(99, score),
        reason,
        flavors
      });
    }
  }

  // Sort descending by score
  scoredItems.sort((a, b) => b.score - a.score);

  // Take top 5 diverse recommendations
  const topPicked = scoredItems.slice(0, 5);

  const recommendations: FoodRecommendation[] = topPicked.map((pick, idx) => ({
    id: `rec_${pick.item.id}_${idx}`,
    dishName: pick.item.name,
    restaurantName: pick.restaurant.name,
    restaurantId: pick.restaurant.id,
    cuisine: pick.restaurant.cuisines.join(', '),
    price: pick.item.price,
    originalPrice: pick.item.originalPrice,
    rating: pick.restaurant.avgRating,
    totalRatingsString: pick.restaurant.totalRatingsString,
    deliveryTimeMinutes: pick.restaurant.deliveryTimeMinutes,
    distanceKm: pick.restaurant.distanceKm,
    isVeg: pick.item.isVeg,
    imageUrl: pick.item.imageUrl,
    swiggyUrl: pick.restaurant.swiggyUrl,
    aiFitReason: pick.reason,
    moodMatchScore: pick.score,
    flavorProfile: pick.flavors,
    tags: pick.item.tags || ['Chef Recommended'],
    chefNote: pick.item.description
  }));

  const detectedMood = context.mood || (queryLower.includes('exhaust') ? 'Exhausted & Seeking Comfort' : 'Craving Good Food');

  return {
    recommendations,
    detectedMood,
    aiSummary: `Curated ${recommendations.length} standout dishes tailored to your ${context.timeSlot} mood in ${context.location.locality}.`,
    suggestedAction: 'Swipe right on what you crave, or swipe left to skip.'
  };
}
