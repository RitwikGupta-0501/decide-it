import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, ExternalLink, ShoppingBag, ArrowLeft, Share2, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { FoodRecommendation } from '../types/ai';
import { SwiggyAddress } from '../types/swiggy';
import { swiggyMcp } from '../services/swiggy/mcpClient';

interface OrderScreenProps {
  card: FoodRecommendation;
  deliveryAddress: SwiggyAddress;
  onBack: () => void;
}

export const OrderScreen: React.FC<OrderScreenProps> = ({
  card,
  deliveryAddress,
  onBack
}) => {
  const [isOrderingMcp, setIsOrderingMcp] = useState(false);
  const [mcpOrderSuccess, setMcpOrderSuccess] = useState<{ orderId?: string; checkoutUrl?: string } | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  const itemPrice = card.price;
  const deliveryFee = itemPrice > 199 ? 0 : 35;
  const taxesAndCharges = Math.round(itemPrice * 0.05 + 15);
  const grandTotal = itemPrice + deliveryFee + taxesAndCharges;

  const handleMcpCheckout = async () => {
    setIsOrderingMcp(true);
    try {
      const result = await swiggyMcp.addToCart({
        menuItem: {
          id: card.id,
          name: card.dishName,
          description: card.chefNote || '',
          price: card.price,
          inStock: true,
          isVeg: card.isVeg,
          imageUrl: card.imageUrl,
          category: card.cuisine,
          restaurantId: card.restaurantId,
          restaurantName: card.restaurantName
        },
        restaurant: {
          id: card.restaurantId,
          name: card.restaurantName,
          slug: card.restaurantName.toLowerCase().replace(/\s+/g, '-'),
          cuisines: [card.cuisine],
          avgRating: card.rating,
          totalRatingsString: card.totalRatingsString,
          costForTwo: card.price * 2,
          deliveryTimeMinutes: card.deliveryTimeMinutes,
          distanceKm: card.distanceKm,
          locality: deliveryAddress.landmark || 'Nearby',
          city: deliveryAddress.city,
          imageUrl: card.imageUrl,
          menu: [],
          swiggyUrl: card.swiggyUrl
        },
        quantity: 1
      });

      setMcpOrderSuccess({
        orderId: 'swiggy_' + Math.floor(100000 + Math.random() * 900000),
        checkoutUrl: result.checkoutUrl || card.swiggyUrl
      });
    } catch (e) {
      console.error('MCP checkout failed:', e);
    } finally {
      setIsOrderingMcp(false);
    }
  };

  const handleShare = () => {
    const text = `🎉 decideIT ended our food debate! We're ordering the ${card.dishName} from ${card.restaurantName} on Swiggy! 🍽️`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto px-4 py-6"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Change selection</span>
      </button>

      {/* Hero Decision Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 mb-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Decision Finalized!</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Your Winner Is Ready 🏆
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Matched your mood and preferences with 96% confidence
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-xl mb-5 overflow-hidden relative">
        {/* Dish snippet */}
        <div className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <img
            src={card.imageUrl}
            alt={card.dishName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  card.isVeg ? 'bg-green-600' : 'bg-red-600'
                }`}
              />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {card.cuisine}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white truncate">
              {card.dishName}
            </h3>
            <p className="text-xs font-bold text-[#FC8019] mb-1">
              {card.restaurantName}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FC8019]" />
                {card.deliveryTimeMinutes}m
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FC8019]" />
                {card.distanceKm} km
              </span>
            </div>
          </div>
        </div>

        {/* Why this won note */}
        <div className="py-3 px-3.5 my-3 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/40 text-xs">
          <div className="flex items-center gap-1 font-bold text-[#FC8019] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI WINNING RATIONALE</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
            {card.aiFitReason}
          </p>
        </div>

        {/* Delivery Destination */}
        <div className="py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FC8019]" />
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                Delivery to {deliveryAddress.tag}
              </p>
              <p className="text-gray-500 dark:text-gray-400 truncate max-w-[240px]">
                {deliveryAddress.addressLine}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#FC8019] bg-[#FC8019]/10 px-2 py-0.5 rounded-full">
            ~{card.deliveryTimeMinutes} mins
          </span>
        </div>

        {/* Bill Breakdown */}
        <div className="pt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex justify-between">
            <span>Item Total</span>
            <span className="font-semibold text-gray-900 dark:text-white">₹{itemPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            {deliveryFee === 0 ? (
              <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE (Swiggy One)</span>
            ) : (
              <span className="font-semibold text-gray-900 dark:text-white">₹{deliveryFee}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span>Taxes & Restaurant Packing</span>
            <span className="font-semibold text-gray-900 dark:text-white">₹{taxesAndCharges}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-sm font-black text-gray-900 dark:text-white">
            <span>To Pay</span>
            <span className="text-base text-[#FC8019]">₹{grandTotal}</span>
          </div>
        </div>
      </div>

      {/* MCP Order Success Modal Card */}
      {mcpOrderSuccess && (
        <div className="mb-4 p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Added to Swiggy Cart via MCP!</span>
          </div>
          <p className="mb-3">
            Item synced to your Swiggy active session. Complete your payment on Swiggy.
          </p>
          <a
            href={mcpOrderSuccess.checkoutUrl || card.swiggyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
          >
            <span>Proceed to Swiggy Checkout</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="space-y-3">
        {/* Direct Swiggy Order Button */}
        <a
          href={card.swiggyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#FC8019] to-[#ff9a47] text-white font-extrabold text-base shadow-glow-orange shadow-md hover:brightness-105 active:scale-95 transition-all text-center"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Order Now on Swiggy</span>
          <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
        </a>

        {/* MCP Direct Add to Cart Button */}
        <button
          onClick={handleMcpCheckout}
          disabled={isOrderingMcp}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 active:scale-95 transition-all disabled:opacity-50"
        >
          {isOrderingMcp ? (
            <div className="w-4 h-4 border-2 border-[#FC8019] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#FC8019]" />
              <span>Sync to Swiggy Cart (MCP)</span>
            </>
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied decision to clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share decision with friends</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
