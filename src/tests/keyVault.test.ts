import { describe, expect, test, beforeEach } from 'bun:test';
import { KeyVault, DEFAULT_MODELS } from '../services/storage/keyVault';

// Setup mock localStorage in Bun test environment if needed
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (k: string) => store[k] || null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
    length: 0,
    key: () => null
  } as any;
}

describe('KeyVault BYOK Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return default configs when empty', () => {
    const configs = KeyVault.getConfigs();
    expect(configs.gemini).toBeDefined();
    expect(configs.gemini.model).toBe(DEFAULT_MODELS.gemini);
    expect(configs.gemini.apiKey).toBe('');
    expect(configs.mock.isValidated).toBe(true);
  });

  test('should correctly mask sensitive API keys', () => {
    expect(KeyVault.maskKey('')).toBe('');
    expect(KeyVault.maskKey('1234')).toBe('********');
    expect(KeyVault.maskKey('AIzaSyAbCdEf1234567890')).toBe('AIza...7890');
  });

  test('should save and retrieve custom provider API key', () => {
    KeyVault.saveConfig({
      provider: 'gemini',
      apiKey: 'test-gemini-key-123456',
      model: 'gemini-2.5-pro',
      isValidated: true
    });

    const configs = KeyVault.getConfigs();
    expect(configs.gemini.apiKey).toBe('test-gemini-key-123456');
    expect(configs.gemini.model).toBe('gemini-2.5-pro');
    expect(configs.gemini.isValidated).toBe(true);
  });

  test('should switch active provider', () => {
    KeyVault.setActiveProvider('groq');
    expect(KeyVault.getActiveProvider()).toBe('groq');

    KeyVault.setActiveProvider('gemini');
    expect(KeyVault.getActiveProvider()).toBe('gemini');
  });

  test('should remove key cleanly', () => {
    KeyVault.saveConfig({
      provider: 'openai',
      apiKey: 'sk-test-12345678',
      model: 'gpt-4o',
      isValidated: true
    });

    KeyVault.removeKey('openai');
    const configs = KeyVault.getConfigs();
    expect(configs.openai.apiKey).toBe('');
    expect(configs.openai.isValidated).toBe(false);
  });
});
