import React from 'react';
import { X, History, Star, Clock, Sparkles, ChefHat } from 'lucide-react';
import { SwiggyPastOrder } from '../types/swiggy';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: SwiggyPastOrder[];
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111622] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-[#FC8019]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Swiggy Order History
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Data used by decideIT AI to learn your food personality
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* AI Learned Profile Insight Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/60 dark:border-orange-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FC8019] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LEARNED TASTE PROFILE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/80 dark:bg-gray-800/80 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Top Cuisines</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">Biryani, Mexican, Burgers</span>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Spice Tolerance</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">Medium to High (Andhra)</span>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Favorite Spots</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">Meghana, Truffles</span>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Order Frequency</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">Friday & Weekend Dinners</span>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Recent Swiggy Deliveries ({orders.length})
            </span>
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 text-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">
                      {order.restaurantName}
                    </h4>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {order.cuisine} • {order.dayOfWeek} ({order.timeSlot})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-gray-900 dark:text-white">
                      ₹{order.totalAmount}
                    </span>
                    {order.ratingGiven && (
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{order.ratingGiven}★</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60 space-y-0.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
