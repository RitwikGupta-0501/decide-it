import { AIProvider, AIProviderConfig } from '../../types/ai';

const STORAGE_KEY = 'decideit_byok_config_v1';

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-latest',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'google/gemini-2.5-flash',
  mock: 'decideit-smart-heuristic-v1'
};

export class KeyVault {
  /**
   * Retrieves saved provider configs from localStorage.
   */
  static getConfigs(): Record<AIProvider, AIProviderConfig> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...this.getDefaultConfigs(),
          ...parsed
        };
      }
    } catch (e) {
      console.error('Failed to load keys from KeyVault:', e);
    }
    return this.getDefaultConfigs();
  }

  static getActiveProvider(): AIProvider {
    try {
      const active = localStorage.getItem('decideit_active_provider');
      if (active && ['gemini', 'openai', 'anthropic', 'groq', 'openrouter', 'mock'].includes(active)) {
        return active as AIProvider;
      }
    } catch {}
    return 'mock'; // Default to mock until user configures BYOK
  }

  static setActiveProvider(provider: AIProvider): void {
    try {
      localStorage.setItem('decideit_active_provider', provider);
    } catch (e) {
      console.error('Failed to set active provider:', e);
    }
  }

  static saveConfig(config: AIProviderConfig): void {
    const current = this.getConfigs();
    current[config.provider] = config;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to save to KeyVault:', e);
    }
  }

  static removeKey(provider: AIProvider): void {
    const current = this.getConfigs();
    current[provider].apiKey = '';
    current[provider].isValidated = false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to clear key:', e);
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('decideit_active_provider');
    } catch (e) {
      console.error('Failed to clear KeyVault:', e);
    }
  }

  static maskKey(key: string): string {
    if (!key) return '';
    if (key.length <= 8) return '********';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  }

  private static getDefaultConfigs(): Record<AIProvider, AIProviderConfig> {
    return {
      gemini: { provider: 'gemini', apiKey: '', model: DEFAULT_MODELS.gemini, isValidated: false },
      openai: { provider: 'openai', apiKey: '', model: DEFAULT_MODELS.openai, isValidated: false },
      anthropic: { provider: 'anthropic', apiKey: '', model: DEFAULT_MODELS.anthropic, isValidated: false },
      groq: { provider: 'groq', apiKey: '', model: DEFAULT_MODELS.groq, isValidated: false },
      openrouter: { provider: 'openrouter', apiKey: '', model: DEFAULT_MODELS.openrouter, isValidated: false },
      mock: { provider: 'mock', apiKey: 'mock-key', model: DEFAULT_MODELS.mock, isValidated: true }
    };
  }

  /**
   * Validates an API key against the provider's live test endpoint
   */
  static async validateKey(provider: AIProvider, apiKey: string, model?: string): Promise<{ valid: boolean; error?: string }> {
    if (provider === 'mock') {
      return { valid: true };
    }

    if (!apiKey || apiKey.trim() === '') {
      return { valid: false, error: 'API key cannot be empty' };
    }

    try {
      if (provider === 'gemini') {
        const testModel = model || 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${testModel}?key=${apiKey.trim()}`;
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const msg = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
          return { valid: false, error: msg };
        }
        return { valid: true };
      }

      if (provider === 'openai') {
        const url = 'https://api.openai.com/v1/models';
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`
          }
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const msg = errData?.error?.message || `HTTP ${res.status}`;
          return { valid: false, error: msg };
        }
        return { valid: true };
      }

      if (provider === 'groq') {
        const url = 'https://api.groq.com/openai/v1/models';
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`
          }
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const msg = errData?.error?.message || `HTTP ${res.status}`;
          return { valid: false, error: msg };
        }
        return { valid: true };
      }

      if (provider === 'anthropic') {
        // Direct client-side Anthropic calls are often blocked by CORS without an API proxy or anthropic-dangerous-direct-browser-access header
        // We will validate with a mini fetch
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey.trim(),
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: model || 'claude-3-5-haiku-latest',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'test' }]
          })
        });
        if (!res.ok && res.status !== 400) {
          const errData = await res.json().catch(() => ({}));
          return { valid: false, error: errData?.error?.message || `HTTP ${res.status}` };
        }
        return { valid: true };
      }

      if (provider === 'openrouter') {
        const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`
          }
        });
        if (!res.ok) {
          return { valid: false, error: `Invalid OpenRouter Key (HTTP ${res.status})` };
        }
        return { valid: true };
      }

      return { valid: true };
    } catch (e: any) {
      return { valid: false, error: e.message || 'Network error while validating key' };
    }
  }
}
