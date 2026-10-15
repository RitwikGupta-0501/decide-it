import React from 'react';

export interface QuickBiteData {
  id: string;
  name: string;
  restaurant: string;
  eta: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
}

interface QuickBiteTileProps {
  item: QuickBiteData;
  isAdded: boolean;
  onToggleAdd: (item: QuickBiteData) => void;
}

export const QuickBiteTile: React.FC<QuickBiteTileProps> = ({ item, isAdded, onToggleAdd }) => {
  return (
    <div className="bg-surface-container-low hover:bg-surface-container rounded-xl p-space-md flex items-center justify-between gap-space-md transition-all shadow-md">
      <div className="flex items-center gap-space-md min-w-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container relative">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span>{item.restaurant}</span>
            <span>•</span>
            <span className="text-secondary">{item.eta}</span>
          </div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">{item.name}</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-space-md shrink-0">
        <div className="text-right hidden sm:block">
          <div className="font-headline-sm text-headline-sm text-on-surface font-bold">₹{item.price}</div>
          <span className="font-label-sm text-label-sm text-on-surface-variant line-through">₹{item.originalPrice}</span>
        </div>
        
        {isAdded ? (
          <div className="px-space-sm py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md transition-all shadow flex items-center gap-2">
            <button className="hover:opacity-80 active:scale-90 flex items-center" onClick={() => onToggleAdd(item)}>
              <span className="material-symbols-outlined text-[14px]">remove</span>
            </button>
            <span className="font-bold text-[13px]">1</span>
            <button className="hover:opacity-80 active:scale-90 flex items-center">
              <span className="material-symbols-outlined text-[14px]">add</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onToggleAdd(item)}
            className="px-space-md py-space-xs rounded-full bg-surface-bright text-on-surface hover:bg-primary-container hover:text-on-primary-container font-label-md text-label-md transition-colors flex items-center gap-1 active:scale-95 shadow"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            ADD
          </button>
        )}
      </div>
    </div>
  );
};
