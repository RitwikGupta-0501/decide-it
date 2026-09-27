import React from 'react';
import { SwiggyAddress } from '../types/swiggy';

interface NavbarProps {
  selectedAddress: SwiggyAddress;
  onOpenSettings: () => void;
  onOpenLocation: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  viewMode: 'landing' | 'voice' | 'chat';
  onSwitchMode: (mode: 'voice' | 'chat') => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedAddress,
  onOpenSettings,
  onOpenLocation,
  viewMode,
  onSwitchMode,
  cartCount,
  onOpenCart
}) => {
  const isVoiceActive = viewMode === 'voice' || viewMode === 'landing';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="h-20 w-full max-w-[1280px] mx-auto px-margin md:px-margin-lg flex items-center justify-between gap-gutter">
        {/* Brand & Culinary Engine */}
        <div className="flex items-center gap-space-lg">
          <a href="#" data-path="text-discovery" onClick={(e) => e.preventDefault()} className="flex items-center gap-space-sm group">
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shadow-[0_0_16px_rgba(255,87,17,0.25)]">
              <span className="material-symbols-outlined text-primary-container text-[20px]">
                local_fire_department
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">
                Bite<span className="text-primary-container font-headline-sm text-headline-sm">AI</span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Culinary Engine
              </span>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-space-md" data-active-classes="bg-surface-container-high text-on-surface font-bold rounded-lg"></nav>
        </div>

        {/* Segmented Voice | Text Toggle Pill */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={() => onSwitchMode('voice')}
            data-path="voice-mode"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              isVoiceActive
                ? 'bg-surface-container-highest text-on-surface shadow-[0_0_12px_rgba(255,87,17,0.35)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${isVoiceActive ? 'text-primary-container' : ''}`}>
              mic
            </span>
            Voice
          </button>

          <button
            type="button"
            onClick={() => onSwitchMode('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              !isVoiceActive
                ? 'bg-surface-container-highest text-on-surface shadow-[0_0_12px_rgba(255,87,17,0.35)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-[16px] ${!isVoiceActive ? 'text-primary-container' : ''}`}>
              keyboard
            </span>
            Text
          </button>
        </div>

        {/* Right Controls: Location, Cart, User Profile */}
        <div className="flex items-center gap-3">
          {/* Location Pill */}
          <button
            type="button"
            onClick={onOpenLocation}
            className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] text-primary-container">
              near_me
            </span>
            <span>
              {selectedAddress.landmark || selectedAddress.city || 'Koramangala'}
            </span>
          </button>

          {/* Cart Pill */}
          <button
            type="button"
            onClick={onOpenCart}
            data-path="checkout"
            aria-label="Cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          >
            <span className="material-symbols-outlined text-[18px]">
              shopping_bag
            </span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-container text-on-primary-container text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          >
            <span className="material-symbols-outlined text-[18px]">
              person
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
