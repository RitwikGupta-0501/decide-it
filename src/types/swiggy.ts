export type FoodDietType = 'veg' | 'non-veg' | 'vegan' | 'jain' | 'all';

export interface SwiggyMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  isVeg: boolean;
  isBestseller?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3; // 0=mild, 1=medium, 2=spicy, 3=extra spicy
  imageUrl: string;
  category: string;
  restaurantId: string;
  restaurantName: string;
  tags?: string[];
}

export interface SwiggyRestaurant {
  id: string;
  name: string;
  slug: string;
  cuisines: string[];
  avgRating: number;
  totalRatingsString: string;
  costForTwo: number;
  deliveryTimeMinutes: number;
  distanceKm: number;
  locality: string;
  city: string;
  headerDiscount?: string;
  imageUrl: string;
  isVegOnly?: boolean;
  menu: SwiggyMenuItem[];
  swiggyUrl: string;
}

export interface SwiggyPastOrder {
  orderId: string;
  date: string; // ISO date
  restaurantName: string;
  restaurantId: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
  }[];
  totalAmount: number;
  ratingGiven?: number;
  cuisine: string;
  dayOfWeek: string;
  timeSlot: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'late-night';
}

export interface SwiggyAddress {
  id: string;
  tag: 'Home' | 'Work' | 'Other';
  addressLine: string;
  landmark: string;
  city: string;
  lat: number;
  lng: number;
  pincode: string;
}

export interface SwiggyMcpServerConfig {
  endpoint: string; // e.g. https://mcp.swiggy.com/food or custom URL
  authToken?: string;
  enabled: boolean;
  useMockFallback: boolean;
}

export interface SwiggyCartItem {
  menuItem: SwiggyMenuItem;
  restaurant: SwiggyRestaurant;
  quantity: number;
  customization?: string;
}
