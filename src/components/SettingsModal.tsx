import React, { useState, useEffect } from 'react';
import { X, Sparkles, Key, Server, Check, AlertCircle, Eye, EyeOff, Trash2, ExternalLink } from 'lucide-react';
import { AIProvider, AIProviderConfig } from '../types/ai';
import { KeyVault, DEFAULT_MODELS } from '../services/storage/keyVault';
import { swiggyMcp } from '../services/swiggy/mcpClient';
import { SwiggyMcpServerConfig } from '../types/swiggy';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged
}) => {
  const [activeTab, setActiveTab] = useState<'byok' | 'mcp'>('byok');
  const [activeProvider, setActiveProvider] = useState<AIProvider>(KeyVault.getActiveProvider());
  const [configs, setConfigs] = useState<Record<AIProvider, AIProviderConfig>>(KeyVault.getConfigs());
  const [mcpConfig, setMcpConfig] = useState<SwiggyMcpServerConfig>(swiggyMcp.getConfig());

  // Input states
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [validating, setValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{ provider: string; success: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfigs(KeyVault.getConfigs());
      setActiveProvider(KeyVault.getActiveProvider());
      setMcpConfig(swiggyMcp.getConfig());
      setValidationResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentConfig = configs[activeProvider];

  const handleProviderSelect = (provider: AIProvider) => {
    setActiveProvider(provider);
    KeyVault.setActiveProvider(provider);
    onConfigChanged();
  };

  const handleKeyChange = (val: string) => {
    const updated = {
      ...currentConfig,
      apiKey: val,
      isValidated: false
    };
    const newConfigs = { ...configs, [activeProvider]: updated };
    setConfigs(newConfigs);
    KeyVault.saveConfig(updated);
    onConfigChanged();
  };

  const handleModelChange = (val: string) => {
    const updated = {
      ...currentConfig,
      model: val
    };
    const newConfigs = { ...configs, [activeProvider]: updated };
    setConfigs(newConfigs);
    KeyVault.saveConfig(updated);
    onConfigChanged();
  };

  const handleTestKey = async () => {
    setValidating(true);
    setValidationResult(null);
    const res = await KeyVault.validateKey(activeProvider, currentConfig.apiKey, currentConfig.model);
    setValidating(false);

    if (res.valid) {
      const updated = { ...currentConfig, isValidated: true };
      KeyVault.saveConfig(updated);
      setConfigs({ ...configs, [activeProvider]: updated });
      setValidationResult({ provider: activeProvider, success: true, msg: 'API Key is verified and active!' });
    } else {
      setValidationResult({ provider: activeProvider, success: false, msg: res.error || 'Verification failed.' });
    }
  };

  const handleClearKey = () => {
    KeyVault.removeKey(activeProvider);
    setConfigs(KeyVault.getConfigs());
    setValidationResult(null);
    onConfigChanged();
  };

  const handleSaveMcp = (newPartial: Partial<SwiggyMcpServerConfig>) => {
    const updated = { ...mcpConfig, ...newPartial };
    setMcpConfig(updated);
    swiggyMcp.saveConfig(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111622] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-[#FC8019]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Configuration & BYOK
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Interchangeable AI Models & Swiggy MCP Server
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

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-5 gap-4 bg-gray-50 dark:bg-gray-900/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('byok')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'byok'
                ? 'border-[#FC8019] text-[#FC8019]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>AI Models & BYOK</span>
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'mcp'
                ? 'border-[#FC8019] text-[#FC8019]'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Swiggy MCP Server</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {activeTab === 'byok' ? (
            <div className="space-y-4">
              {/* Provider Selection Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Select Active AI Provider:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['mock', 'gemini', 'groq', 'openai', 'anthropic', 'openrouter'] as AIProvider[]).map((p) => {
                    const isSelected = activeProvider === p;
                    const hasKey = configs[p]?.apiKey && configs[p]?.apiKey !== 'mock-key';
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleProviderSelect(p)}
                        className={`p-3 rounded-2xl text-left border transition-all text-xs font-bold flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#FC8019]/10 border-[#FC8019] text-[#FC8019] ring-2 ring-[#FC8019]/20'
                            : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <span className="capitalize text-sm font-black">
                          {p === 'mock' ? 'Smart Heuristic' : p}
                        </span>
                        <span className="text-[10px] font-normal opacity-80 mt-1">
                          {p === 'mock'
                            ? 'No key needed'
                            : hasKey
                            ? 'Key configured ✓'
                            : 'Requires key'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Provider Key & Model Config */}
              {activeProvider !== 'mock' ? (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white capitalize">
                      {activeProvider} Configuration
                    </span>
                    {currentConfig?.isValidated && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  {/* API Key Input */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      API Key (stored safely in your browser)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showKey[activeProvider] ? 'text' : 'password'}
                        value={currentConfig?.apiKey || ''}
                        onChange={(e) => handleKeyChange(e.target.value)}
                        placeholder={`Paste your ${activeProvider} key here...`}
                        className="w-full pl-3 pr-20 py-2.5 rounded-xl text-xs font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FC8019]"
                      />
                      <div className="absolute right-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowKey(prev => ({ ...prev, [activeProvider]: !prev[activeProvider] }))}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          {showKey[activeProvider] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {currentConfig?.apiKey && (
                          <button
                            type="button"
                            onClick={handleClearKey}
                            className="p-1 text-rose-500 hover:text-rose-700"
                            title="Clear key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Model Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      value={currentConfig?.model || DEFAULT_MODELS[activeProvider]}
                      onChange={(e) => handleModelChange(e.target.value)}
                      placeholder={DEFAULT_MODELS[activeProvider]}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FC8019]"
                    />
                  </div>

                  {/* Test Key Button */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestKey}
                      disabled={validating || !currentConfig?.apiKey}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 flex items-center gap-1.5"
                    >
                      {validating ? (
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-[#FC8019]" />
                      )}
                      <span>Test Connection</span>
                    </button>
                  </div>

                  {/* Validation feedback */}
                  {validationResult && (
                    <div
                      className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                        validationResult.success
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200'
                      }`}
                    >
                      {validationResult.success ? (
                        <Check className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{validationResult.msg}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                  <p className="font-bold mb-1">⚡ Built-in Smart Heuristic Mode Active</p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    No API key is required. decideIT uses a specialized local reasoning engine that scores restaurants and dishes based on mood heuristics, Bengaluru/Mumbai time-of-day slots, and your past Swiggy order patterns.
                  </p>
                </div>
              )}

              {/* Security BYOK Guarantee */}
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-bold text-gray-700 dark:text-gray-300 block mb-0.5">
                  🔒 Zero-Knowledge BYOK Guarantee
                </span>
                Keys are never uploaded to any intermediary servers. They are stored strictly in your browser's private storage and dispatched directly to the official provider endpoints.
              </div>
            </div>
          ) : (
            /* Swiggy MCP Server Settings */
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60 text-orange-950 dark:text-orange-200">
                <div className="flex items-center justify-between mb-1 font-bold">
                  <span>Swiggy Model Context Protocol (MCP)</span>
                  <a
                    href="https://mcp.swiggy.com/builders/docs/index.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#FC8019] hover:underline"
                  >
                    <span>MCP Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Exposes 66 commerce tools for Swiggy Food, Instamart, and Dineout over JSON-RPC streamable HTTP.
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  MCP Server Endpoint
                </label>
                <input
                  type="text"
                  value={mcpConfig.endpoint}
                  onChange={(e) => handleSaveMcp({ endpoint: e.target.value })}
                  placeholder="https://mcp.swiggy.com/food"
                  className="w-full px-3 py-2.5 rounded-xl font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FC8019]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Swiggy Auth Token / Bearer Key (Optional for Dev / Local)
                </label>
                <input
                  type="password"
                  value={mcpConfig.authToken || ''}
                  onChange={(e) => handleSaveMcp({ authToken: e.target.value })}
                  placeholder="OAuth 2.1 PKCE token or dev token..."
                  className="w-full px-3 py-2.5 rounded-xl font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FC8019]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    Local Swiggy Catalog Fallback
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                    Use verified Bengaluru & Mumbai restaurant catalog if MCP is unreachable
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={mcpConfig.useMockFallback}
                  onChange={(e) => handleSaveMcp({ useMockFallback: e.target.checked })}
                  className="w-4 h-4 accent-[#FC8019]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#FC8019] text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
