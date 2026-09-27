import { SwiggyRestaurant, SwiggyPastOrder, SwiggyAddress } from '../../types/swiggy';

export const MOCK_ADDRESSES: SwiggyAddress[] = [
  {
    id: 'addr_101',
    tag: 'Home',
    addressLine: 'Flat 402, Green Glen Heights, 12th Main',
    landmark: 'Opposite Cult Fitness, Indiranagar',
    city: 'Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    pincode: '560038'
  },
  {
    id: 'addr_102',
    tag: 'Work',
    addressLine: 'WeWork Galaxy, 43 Residency Road',
    landmark: 'Near Brigade Road junction',
    city: 'Bengaluru',
    lat: 12.9716,
    lng: 77.6066,
    pincode: '560025'
  },
  {
    id: 'addr_103',
    tag: 'Other',
    addressLine: 'Bandra West, 16th Road',
    landmark: 'Near Pali Hill',
    city: 'Mumbai',
    lat: 19.0607,
    lng: 72.8362,
    pincode: '400050'
  }
];

export const MOCK_PAST_ORDERS: SwiggyPastOrder[] = [
  {
    orderId: 'swiggy_ord_98214',
    date: '2026-09-26T20:15:00Z',
    restaurantName: 'Meghana Foods',
    restaurantId: 'rest_blr_meghana',
    cuisine: 'Biryani, Andhra',
    items: [
      { name: 'Meghana Special Chicken Biryani', quantity: 1, price: 360, isVeg: false },
      { name: 'Paneer 65', quantity: 1, price: 280, isVeg: true }
    ],
    totalAmount: 672,
    ratingGiven: 5,
    dayOfWeek: 'Saturday',
    timeSlot: 'dinner'
  },
  {
    orderId: 'swiggy_ord_98110',
    date: '2026-09-24T13:30:00Z',
    restaurantName: 'California Burrito',
    restaurantId: 'rest_blr_calburrito',
    cuisine: 'Mexican, Healthy Bowls',
    items: [
      { name: 'Peri Peri Chicken Rice Bowl', quantity: 1, price: 319, isVeg: false },
      { name: 'Nachos with Fresh Guacamole', quantity: 1, price: 189, isVeg: true }
    ],
    totalAmount: 535,
    ratingGiven: 4,
    dayOfWeek: 'Thursday',
    timeSlot: 'lunch'
  },
  {
    orderId: 'swiggy_ord_97940',
    date: '2026-09-22T23:45:00Z',
    restaurantName: 'Truffles',
    restaurantId: 'rest_blr_truffles',
    cuisine: 'Burgers, American, Desserts',
    items: [
      { name: 'All American Cheese Burger', quantity: 1, price: 290, isVeg: false },
      { name: 'Ferrero Rocher Thick Shake', quantity: 1, price: 220, isVeg: true }
    ],
    totalAmount: 540,
    ratingGiven: 5,
    dayOfWeek: 'Tuesday',
    timeSlot: 'late-night'
  },
  {
    orderId: 'swiggy_ord_97620',
    date: '2026-09-20T09:15:00Z',
    restaurantName: 'The Rameshwaram Cafe',
    restaurantId: 'rest_blr_rameshwaram',
    cuisine: 'South Indian, Breakfast',
    items: [
      { name: 'Ghee Podi Idli (2 Pcs)', quantity: 1, price: 140, isVeg: true },
      { name: 'Ghee Thatte Idli with Chutney', quantity: 1, price: 120, isVeg: true },
      { name: 'Filter Coffee', quantity: 2, price: 100, isVeg: true }
    ],
    totalAmount: 380,
    ratingGiven: 5,
    dayOfWeek: 'Sunday',
    timeSlot: 'breakfast'
  },
  {
    orderId: 'swiggy_ord_97412',
    date: '2026-09-18T17:00:00Z',
    restaurantName: 'Chai Point',
    restaurantId: 'rest_blr_chaipoint',
    cuisine: 'Chai, Snacks',
    items: [
      { name: 'Ginger Chai Flask (500ml)', quantity: 1, price: 199, isVeg: true },
      { name: 'Bun Maska', quantity: 1, price: 79, isVeg: true },
      { name: 'Onion Pakoda', quantity: 1, price: 99, isVeg: true }
    ],
    totalAmount: 395,
    ratingGiven: 4,
    dayOfWeek: 'Friday',
    timeSlot: 'snack'
  }
];

export const MOCK_RESTAURANTS: SwiggyRestaurant[] = [
  {
    id: 'rest_blr_meghana',
    name: 'Meghana Foods',
    slug: 'meghana-foods-indiranagar',
    cuisines: ['Biryani', 'Andhra', 'South Indian'],
    avgRating: 4.6,
    totalRatingsString: '50K+ ratings',
    costForTwo: 500,
    deliveryTimeMinutes: 28,
    distanceKm: 2.3,
    locality: '100ft Road, Indiranagar',
    city: 'Bengaluru',
    headerDiscount: '40% OFF up to ₹80',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    swiggyUrl: 'https://www.swiggy.com/restaurants/meghana-foods-100ft-road-indiranagar-bangalore-10575',
    menu: [
      {
        id: 'item_meghana_sp_chk',
        name: 'Meghana Special Chicken Biryani',
        description: 'Signature spicy boneless chicken pieces slow cooked with aromatic basmati rice and fiery Andhra spices.',
        price: 360,
        originalPrice: 400,
        inStock: true,
        isVeg: false,
        isBestseller: true,
        spicyLevel: 3,
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        category: 'Biryani',
        restaurantId: 'rest_blr_meghana',
        restaurantName: 'Meghana Foods',
        tags: ['Bestseller', 'Spicy', 'Signature']
      },
      {
        id: 'item_meghana_paneer_biry',
        name: 'Paneer Biryani',
        description: 'Tender marinated cottage cheese cubes tossed with rich aromatic spiced rice.',
        price: 310,
        originalPrice: 340,
        inStock: true,
        isVeg: true,
        isBestseller: false,
        spicyLevel: 2,
        imageUrl: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&auto=format&fit=crop&q=80',
        category: 'Biryani',
        restaurantId: 'rest_blr_meghana',
        restaurantName: 'Meghana Foods',
        tags: ['Vegetarian', 'Aromatic']
      }
    ]
  },
  {
    id: 'rest_blr_truffles',
    name: 'Truffles',
    slug: 'truffles-st-marks-road',
    cuisines: ['Burgers', 'American', 'Continental', 'Desserts'],
    avgRating: 4.7,
    totalRatingsString: '100K+ ratings',
    costForTwo: 600,
    deliveryTimeMinutes: 24,
    distanceKm: 1.8,
    locality: 'St. Marks Road',
    city: 'Bengaluru',
    headerDiscount: 'FREE Delivery above ₹199',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    swiggyUrl: 'https://www.swiggy.com/restaurants/truffles-st-marks-road-bangalore-218',
    menu: [
      {
        id: 'item_truffles_all_amer',
        name: 'All American Cheese Burger',
        description: 'Juicy tender patty topped with molten cheddar cheese, caramelised onions, pickles and secret mustard relish.',
        price: 290,
        originalPrice: 320,
        inStock: true,
        isVeg: false,
        isBestseller: true,
        spicyLevel: 1,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        category: 'Burgers',
        restaurantId: 'rest_blr_truffles',
        restaurantName: 'Truffles',
        tags: ['Comfort Food', 'Cheesy', 'Bestseller']
      },
      {
        id: 'item_truffles_crispy_veg',
        name: 'Crispy Veggie Crunch Burger',
        description: 'Golden crumbed spicy vegetable patty with creamy mayo, crisp iceberg lettuce and Monterey Jack cheese.',
        price: 230,
        inStock: true,
        isVeg: true,
        isBestseller: true,
        spicyLevel: 1,
        imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&auto=format&fit=crop&q=80',
        category: 'Burgers',
        restaurantId: 'rest_blr_truffles',
        restaurantName: 'Truffles',
        tags: ['Vegetarian', 'Crispy']
      },
      {
        id: 'item_truffles_choc_shake',
        name: 'Ferrero Rocher Gourmet Shake',
        description: 'Velvety hazelnut chocolate shake blended with genuine Ferrero Rocher pralines and dark chocolate drizzle.',
        price: 220,
        inStock: true,
        isVeg: true,
        isBestseller: false,
        spicyLevel: 0,
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
        category: 'Desserts & Shakes',
        restaurantId: 'rest_blr_truffles',
        restaurantName: 'Truffles',
        tags: ['Sweet Tooth', 'Indulgent']
      }
    ]
  },
  {
    id: 'rest_blr_calburrito',
    name: 'California Burrito',
    slug: 'california-burrito-koramangala',
    cuisines: ['Mexican', 'Salads', 'Healthy'],
    avgRating: 4.5,
    totalRatingsString: '25K+ ratings',
    costForTwo: 450,
    deliveryTimeMinutes: 20,
    distanceKm: 1.2,
    locality: 'Koramangala 5th Block',
    city: 'Bengaluru',
    headerDiscount: 'Flat 15% OFF on Meals',
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80',
    swiggyUrl: 'https://www.swiggy.com/restaurants/california-burrito-5th-block-koramangala-bangalore-425',
    menu: [
      {
        id: 'item_cal_burrito_bowl',
        name: 'Peri Peri Grilled Chicken Bowl',
        description: 'Fresh cilantro lime brown rice, pinto beans, charred corn salsa, grilled peri-peri chicken and house sour cream.',
        price: 319,
        originalPrice: 349,
        inStock: true,
        isVeg: false,
        isBestseller: true,
        spicyLevel: 2,
        imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
        category: 'Bowls',
        restaurantId: 'rest_blr_calburrito',
        restaurantName: 'California Burrito',
        tags: ['High Protein', 'Healthy', 'Fresh']
      },
      {
        id: 'item_cal_crispy_tofu_bowl',
        name: 'Crispy Barbeque Paneer Bowl',
        description: 'Warm brown rice bowl with chipotle spiced paneer, roasted fajita veggies, guacamole and fresh pico de gallo.',
        price: 299,
        inStock: true,
        isVeg: true,
        isBestseller: false,
        spicyLevel: 1,
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
        category: 'Bowls',
        restaurantId: 'rest_blr_calburrito',
        restaurantName: 'California Burrito',
        tags: ['Healthy', 'Vegetarian']
      }
    ]
  },
  {
    id: 'rest_blr_rameshwaram',
    name: 'The Rameshwaram Cafe',
    slug: 'the-rameshwaram-cafe-indiranagar',
    cuisines: ['South Indian', 'Snacks', 'Pure Veg'],
    avgRating: 4.8,
    totalRatingsString: '80K+ ratings',
    costForTwo: 250,
    deliveryTimeMinutes: 18,
    distanceKm: 1.5,
    locality: '12th Main Road, Indiranagar',
    city: 'Bengaluru',
    isVegOnly: true,
    headerDiscount: 'Swiggy One Free Delivery',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    swiggyUrl: 'https://www.swiggy.com/restaurants/the-rameshwaram-cafe-indiranagar-bangalore-424558',
    menu: [
      {
        id: 'item_ramesh_ghee_podi_dosa',
        name: 'Ghee Podi Butter Masala Dosa',
        description: 'Crispy golden crepe smeared with aromatic spicy gun-powder (podi), melted pure desi ghee, filled with spiced potato mash.',
        price: 180,
        originalPrice: 200,
        inStock: true,
        isVeg: true,
        isBestseller: true,
        spicyLevel: 2,
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        category: 'Dosa',
        restaurantId: 'rest_blr_rameshwaram',
        restaurantName: 'The Rameshwaram Cafe',
        tags: ['Pure Desi Ghee', 'Crispy', 'Iconic']
      },
      {
        id: 'item_ramesh_podi_idli',
        name: 'Ghee Podi Idli (2 Pcs)',
        description: 'Steaming soft button idlis drenched in heated pure ghee and artisanal gun-powder, served with coconut chutney.',
        price: 140,
        inStock: true,
        isVeg: true,
        isBestseller: true,
        spicyLevel: 1,
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        category: 'Idli',
        restaurantId: 'rest_blr_rameshwaram',
        restaurantName: 'The Rameshwaram Cafe',
        tags: ['Soft', 'Breakfast Favorite']
      }
    ]
  },
  {
    id: 'rest_blr_brikoven',
    name: 'Brik Oven',
    slug: 'brik-oven-church-street',
    cuisines: ['Italian', 'Wood-fired Pizza', 'Pasta'],
    avgRating: 4.6,
    totalRatingsString: '18K+ ratings',
    costForTwo: 800,
    deliveryTimeMinutes: 32,
    distanceKm: 3.1,
    locality: 'Church Street',
    city: 'Bengaluru',
    headerDiscount: '20% OFF above ₹599',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    swiggyUrl: 'https://www.swiggy.com/restaurants/brik-oven-church-street-bangalore-1452',
    menu: [
      {
        id: 'item_brik_diavola',
        name: 'Diavola Wood-Fired Sourdough Pizza',
        description: 'San Marzano tomato sauce, fresh buffalo mozzarella, spicy pepperoni, red chili flakes, and hot honey drizzle.',
        price: 580,
        originalPrice: 650,
        inStock: true,
        isVeg: false,
        isBestseller: true,
        spicyLevel: 2,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        category: 'Pizza',
        restaurantId: 'rest_blr_brikoven',
        restaurantName: 'Brik Oven',
        tags: ['Wood-fired', 'Artisanal Sourdough', 'Spicy']
      },
      {
        id: 'item_brik_burrata',
        name: 'Classic Margherita with Fresh Burrata',
        description: 'Slow-proved 48-hour sourdough, fresh basil leaves, Italian plum tomato sauce, and creamy pugliese burrata ball.',
        price: 520,
        inStock: true,
        isVeg: true,
        isBestseller: true,
        spicyLevel: 0,
        imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
        category: 'Pizza',
        restaurantId: 'rest_blr_brikoven',
        restaurantName: 'Brik Oven',
        tags: ['Gourmet', 'Creamy Burrata']
      }
    ]
  },
  {
    id: 'rest_blr_chaipoint',
    name: 'Chai Point',
    slug: 'chai-point-indiranagar',
    cuisines: ['Chai', 'Snacks', 'Bakery'],
    avgRating: 4.4,
    totalRatingsString: '40K+ ratings',
    costForTwo: 200,
    deliveryTimeMinutes: 15,
    distanceKm: 0.9,
    locality: 'CMH Road, Indiranagar',
    city: 'Bengaluru',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    swiggyUrl: 'https://www.swiggy.com/restaurants/chai-point-indiranagar-bangalore-2342',
    menu: [
      {
        id: 'item_chai_kadak_adrak',
        name: 'Kadak Ginger Chai Flask (500ml)',
        description: 'Brewed with freshly crushed Assam CTC tea leaves, fresh ginger root, and rich whole milk. Serves 4-5 cups.',
        price: 199,
        originalPrice: 229,
        inStock: true,
        isVeg: true,
        isBestseller: true,
        spicyLevel: 0,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        category: 'Chai',
        restaurantId: 'rest_blr_chaipoint',
        restaurantName: 'Chai Point',
        tags: ['Monsoon Essential', 'Warm & Soothing']
      },
      {
        id: 'item_chai_samosa_pair',
        name: 'Crispy Cocktail Punjabi Samosas (4 pcs)',
        description: 'Flaky pastry stuffed with spiced green peas and potatoes, served with tangy tamarind and mint chutney.',
        price: 119,
        inStock: true,
        isVeg: true,
        isBestseller: true,
        spicyLevel: 1,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        category: 'Snacks',
        restaurantId: 'rest_blr_chaipoint',
        restaurantName: 'Chai Point',
        tags: ['Crispy Snack', 'Tea-time']
      }
    ]
  },
  {
    id: 'rest_blr_punjab_rasoi',
    name: 'Punjab Rasoi',
    slug: 'punjab-rasoi-indiranagar',
    cuisines: ['North Indian', 'Mughlai', 'Tandoor'],
    avgRating: 4.5,
    totalRatingsString: '35K+ ratings',
    costForTwo: 650,
    deliveryTimeMinutes: 30,
    distanceKm: 2.7,
    locality: 'HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    headerDiscount: 'Flat ₹125 OFF above ₹499',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    swiggyUrl: 'https://www.swiggy.com/restaurants/punjab-rasoi-hal-2nd-stage-indiranagar-bangalore-5412',
    menu: [
      {
        id: 'item_punjab_butter_chk',
        name: 'Murgh Makhani (Delhi Style Butter Chicken)',
        description: 'Tandoori chicken tikka simmered in silky tomato gravy enriched with fresh butter, cream, and dried fenugreek leaves.',
        price: 395,
        originalPrice: 440,
        inStock: true,
        isVeg: false,
        isBestseller: true,
        spicyLevel: 1,
        imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
        category: 'Curries',
        restaurantId: 'rest_blr_punjab_rasoi',
        restaurantName: 'Punjab Rasoi',
        tags: ['Rich Gravy', 'North Indian Classic', 'Comfort Food']
      },
      {
        id: 'item_punjab_dal_makhani',
        name: 'Slow Cooked Dal Makhani',
        description: 'Black lentils slow cooked overnight on charcoal tandoor with fresh churned butter and mild spices.',
        price: 290,
        inStock: true,
        isVeg: true,
        isBestseller: true,
        spicyLevel: 1,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
        category: 'Curries',
        restaurantId: 'rest_blr_punjab_rasoi',
        restaurantName: 'Punjab Rasoi',
        tags: ['Overnight Cooked', 'Creamy', 'Vegetarian']
      }
    ]
  }
];
