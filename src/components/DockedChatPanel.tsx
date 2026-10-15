import React from 'react';

interface DockedChatPanelProps {
  activeQuery: string;
}

export const DockedChatPanel: React.FC<DockedChatPanelProps> = ({ activeQuery }) => {
  return (
    <div className="bg-surface-container-low/95 backdrop-blur-2xl rounded-2xl p-space-md shadow-2xl flex flex-col h-[680px] justify-between relative overflow-hidden">
      {/* AI Panel Ambient Top Shine */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-primary-container/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-12 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-space-sm z-10">
        <div className="flex items-center gap-space-sm">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shadow-sm">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-surface-container-low" />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight">BiteAI Assistant</h3>
            <div className="flex items-center gap-1 text-[11px] font-label-sm text-emerald-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active Neural Context
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <button className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors" title="Chat History">
            <span className="material-symbols-outlined text-[18px]">history</span>
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors" title="Clear thread">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Chat Stream Area */}
      <div className="flex-1 overflow-y-auto py-space-md flex flex-col gap-space-md pr-1 z-10 scrollbar-hide">
        <div className="text-center font-label-sm text-label-sm text-on-surface-variant opacity-60">
          Session started • Just now
        </div>

        {/* User Bubble */}
        <div className="flex flex-col items-end gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">You</span>
          <div className="max-w-[85%] bg-surface-container-high text-on-surface rounded-2xl rounded-tr-xs px-space-md py-space-sm shadow-md font-body-md text-body-md">
            {activeQuery || "Something spicy and comforting that arrives in under 30 mins"}
          </div>
          <span className="text-[10px] text-on-surface-variant opacity-60 mr-1">Now</span>
        </div>

        {/* AI Response Bubble */}
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1.5 ml-1">
            <span className="material-symbols-outlined text-primary-container text-[14px]">auto_awesome</span>
            <span className="font-label-sm text-label-sm text-primary">BiteAI Engine</span>
          </div>
          <div className="max-w-[92%] bg-surface-container text-on-surface rounded-2xl rounded-tl-xs p-space-md shadow-md font-body-md text-body-md flex flex-col gap-space-sm border border-white/5">
            <p>
              Fiery Andhra biryani from Meghana's arriving in <span className="text-primary-container font-semibold">24 mins</span>. I also pulled up Truffles and Faasos if you prefer burgers or wraps.
            </p>
            {/* Micro-summary card */}
            <div className="p-space-xs px-space-sm bg-surface-container-low rounded-lg flex items-center justify-between gap-space-xs font-label-sm text-label-sm border border-white/5">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-primary-container text-[16px]">local_shipping</span>
                <span className="truncate text-on-surface">3 restaurants matching ETA threshold</span>
              </div>
              <span className="text-secondary-container font-bold shrink-0">&lt; 30m</span>
            </div>
          </div>
          <span className="text-[10px] text-on-surface-variant opacity-60 ml-1">1.2s inference</span>
        </div>

        {/* Contextual Quick Action Pills */}
        <div className="flex flex-col gap-1.5 pt-space-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Recommended Refinements:</span>
          <div className="flex flex-wrap gap-1.5">
            <button className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm flex items-center gap-1 border border-white/5">
              <span className="material-symbols-outlined text-[14px] text-primary">thermostat</span> Less spicy
            </button>
            <button className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm flex items-center gap-1 border border-white/5">
              <span className="material-symbols-outlined text-[14px] text-secondary">local_cafe</span> Add beverage
            </button>
          </div>
        </div>
      </div>

      {/* Docked Mini Info */}
      <div className="pt-space-sm flex flex-col gap-2 z-10">
        <div className="flex items-center justify-between px-space-xs text-[11px] font-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-secondary-container">auto_detect_voice</span>
            Audio sync ready
          </span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-mono text-[10px]">Space</kbd></span>
        </div>
      </div>
    </div>
  );
};
