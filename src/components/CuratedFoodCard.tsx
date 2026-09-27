import React from 'react';
import { motion } from 'framer-motion';

export interface CuratedItemData {
  id: string;
  restaurantName: string;
  dishName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  deliveryTimeMinutes: number;
  badge?: 'TOP MATCH' | 'FASTEST';
  imageUrl: string;
  cuisines?: string;
  ratingsCount?: string;
  tag?: string;
  tagIcon?: string;
  tagStyle?: string;
}

interface CuratedFoodCardProps {
  item: CuratedItemData;
  isAdded?: boolean;
  onToggleAdd: (item: CuratedItemData) => void;
  onClickCard?: (item: CuratedItemData) => void;
}

export const CuratedFoodCard: React.FC<CuratedFoodCardProps> = ({
  item,
  isAdded = false,
  onToggleAdd,
  onClickCard
}) => {
  const ratingsCount = item.ratingsCount || (item.rating >= 4.5 ? '12k+' : item.rating >= 4.4 ? '25k+' : '8k+');
  const cuisines =
    item.cuisines ||
    (item.restaurantName.toLowerCase().includes('meghana')
      ? 'Biryani, Andhra Spicy, South Indian'
      : item.restaurantName.toLowerCase().includes('truffles')
      ? 'American, Handcrafted Burgers, Shakes'
      : 'Wraps, Rolls, Midnight Bites');

  // Semantic tag defaults from snippet
  const tagText = item.tag || (item.badge === 'TOP MATCH' ? 'Fiery' : item.badge === 'FASTEST' ? 'Rapid' : 'Comfort');
  const tagIcon = item.tagIcon || (item.badge === 'TOP MATCH' ? 'local_fire_department' : item.badge === 'FASTEST' ? 'bolt' : 'thumb_up');
  const tagContainerClass =
    item.badge === 'TOP MATCH'
      ? 'text-primary-container bg-primary-container/10'
      : item.badge === 'FASTEST'
      ? 'text-secondary-container bg-secondary-container/10'
      : 'text-on-surface-variant bg-surface-container';

  return (
    <article
      onClick={() => onClickCard?.(item)}
      className="group flex flex-col bg-surface-container/70 hover:bg-surface-container-high/80 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5)] transition-all duration-300 relative cursor-pointer"
    >
      {/* ETA Badge */}
      <div className="absolute top-space-sm left-space-sm z-20 flex items-center gap-space-xs flex-wrap">
        <span className="px-space-sm py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-0.5 shadow-sm border border-white/5">
          <span className="material-symbols-outlined text-[13px]">bolt</span> {item.deliveryTimeMinutes} MINS
        </span>
      </div>

      {/* Restaurant & Food Visual */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container-lowest">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          src={item.imageUrl}
          alt={item.dishName}
        />
        {/* Fade off at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/20 to-transparent" />

        {/* Rating Overlay on top right */}
        <div className="absolute top-space-sm right-space-sm z-10 flex items-center gap-1 px-2 py-0.5 bg-surface-container-highest/80 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
          <span
            className="material-symbols-outlined text-[13px] text-amber-400"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            star
          </span>
          <span className="font-label-sm text-label-sm text-white font-bold leading-none mt-0.5">
            {item.rating}
          </span>
          <span className="text-[10px] text-white/70 leading-none mt-0.5">
            ({ratingsCount})
          </span>
        </div>
      </div>

      {/* Details & Description */}
      <div className="p-space-md flex flex-col justify-between flex-grow gap-space-sm">
        <div>
          <div className="flex items-center justify-between gap-space-xs">
            <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">
              {item.dishName}
            </h3>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant line-clamp-1 mt-0.5">
            {item.restaurantName} • {cuisines}
          </p>
        </div>

        <div className="flex items-center justify-between pt-space-sm border-t border-surface-container-high/40">
          <div className="flex items-baseline gap-1.5">
            <span className="font-headline-sm text-headline-sm text-white font-bold">
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="font-label-sm text-label-sm text-on-surface-variant/70 line-through">
                ₹{item.originalPrice}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAdd(item);
            }}
            className={`px-3 py-1.5 rounded-full font-label-md text-label-md font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer ${
              isAdded
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-highest/80 text-on-surface hover:bg-primary hover:text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdded ? 'check' : 'add'}
            </span>
            {isAdded ? 'ADDED' : 'ADD'}
          </button>
        </div>
      </div>
    </article>
  );
};
