import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Star, Clock, MapPin, ExternalLink, Sparkles, Heart, X } from 'lucide-react';
import { FoodRecommendation } from '../types/ai';

interface FoodCardProps {
  card: FoodRecommendation;
  isFront: boolean;
  onSwipeLeft: (card: FoodRecommendation) => void;
  onSwipeRight: (card: FoodRecommendation) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  card,
  isFront,
  onSwipeLeft,
  onSwipeRight
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.6, 1, 1, 1, 0.6]);

  // Visual cues on drag
  const likeOpacity = useTransform(x, [10, 100], [0, 1]);
  const passOpacity = useTransform(x, [-10, -100], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 120) {
      onSwipeRight(card);
    } else if (info.offset.x < -120) {
      onSwipeLeft(card);
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 0.95
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className={`absolute inset-0 w-full rounded-3xl overflow-hidden bg-white dark:bg-[#121824] border border-gray-200/90 dark:border-gray-800 shadow-2xl flex flex-col justify-between select-none ${
        isFront ? 'cursor-grab' : 'pointer-events-none'
      }`}
    >
      {/* Visual Swipe Indicators */}
      {isFront && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-20 px-4 py-2 rounded-2xl bg-emerald-500/90 text-white font-black text-xl tracking-wider uppercase border-2 border-white shadow-lg pointer-events-none rotate-[-12deg] flex items-center gap-1.5"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>WANT THIS!</span>
          </motion.div>

          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-6 right-6 z-20 px-4 py-2 rounded-2xl bg-rose-500/90 text-white font-black text-xl tracking-wider uppercase border-2 border-white shadow-lg pointer-events-none rotate-[12deg] flex items-center gap-1.5"
          >
            <X className="w-5 h-5" />
            <span>PASS</span>
          </motion.div>
        </>
      )}

      {/* Top Image Section */}
      <div className="relative h-[240px] sm:h-[260px] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={card.imageUrl}
          alt={card.dishName}
          className="w-full h-full object-cover pointer-events-none transition-transform duration-500 hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Veg / Non-Veg badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-300 dark:border-gray-700 shadow-md">
            <div
              className={`w-3 h-3 rounded-full ${
                card.isVeg ? 'bg-green-600' : 'bg-red-600'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
            {card.cuisine}
          </span>
        </div>

        {/* Match percentage score */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FC8019]/90 backdrop-blur-md text-white font-extrabold text-xs shadow-md">
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>{card.moodMatchScore}% Fit</span>
        </div>

        {/* Title overlay on bottom of image */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight drop-shadow-md">
            {card.dishName}
          </h2>
          <div className="flex items-center justify-between mt-1 text-xs font-semibold text-gray-200">
            <span className="text-white font-bold">{card.restaurantName}</span>
            <a
              href={card.swiggyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-[#FC8019] transition-colors"
            >
              <span>View on Swiggy</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Middle Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 overflow-y-auto">
        {/* Metric Badges */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-2xl border border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{card.rating}</span>
            <span className="text-[10px] text-gray-400 font-normal">({card.totalRatingsString})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 text-[#FC8019]" />
            <span>{card.deliveryTimeMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-[#FC8019]" />
            <span>{card.distanceKm} km</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-gray-900 dark:text-white">₹{card.price}</span>
            {card.originalPrice && (
              <span className="ml-1 text-[11px] line-through text-gray-400">₹{card.originalPrice}</span>
            )}
          </div>
        </div>

        {/* AI Fit Reason Card */}
        <div className="p-3 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FC8019] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI MATCH INSIGHT</span>
          </div>
          <p className="text-xs sm:text-[13px] font-medium text-gray-700 dark:text-gray-200 leading-snug">
            "{card.aiFitReason}"
          </p>
        </div>

        {/* Flavor Profile Pills & Tags */}
        <div className="flex flex-wrap gap-1.5">
          {card.flavorProfile.map((flavor, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {flavor}
            </span>
          ))}
          {card.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-bold px-2 py-1 rounded-xl bg-[#FC8019]/10 text-[#FC8019] border border-[#FC8019]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
