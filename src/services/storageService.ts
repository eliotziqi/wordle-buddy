// src/services/storageService.ts

/**
 * Storage Service - Wrapper for chrome.storage.sync
 * Manages API keys and user settings
 */

export type LLMProvider = "gemini" | "openai" | "claude";

export interface StorageKeys {
    llm_gemini_api_key?: string;
    llm_openai_api_key?: string;
    llm_claude_api_key?: string;
    llm_default_provider?: LLMProvider;
    llm_fallback_order?: LLMProvider[];
    target_language?: string;
}

const DEFAULT_FALLBACK_ORDER: LLMProvider[] = ["gemini", "openai", "claude"];
const DEFAULT_TARGET_LANGUAGE = "zh-CN";

/**
 * 小工具：安全获取 chrome.storage.sync
 */
function getSyncArea(): chrome.storage.SyncStorageArea | null {
    if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
    ) {
        return chrome.storage.sync;
    }
    return null;
}

/**
 * Promise 化的 get
 */
function storageGet<T = any>(keys: string | string[]): Promise<T> {
    const sync = getSyncArea();
    if (!sync) {
        // 没有 chrome 环境时，返回空对象
        return Promise.resolve({} as T);
    }

    return new Promise<T>((resolve, reject) => {
        try {
            sync.get(keys, (items) => {
                const err = chrome.runtime?.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve(items as T);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Promise 化的 set
 */
function storageSet(items: Record<string, unknown>): Promise<void> {
    const sync = getSyncArea();
    if (!sync) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
        try {
            sync.set(items, () => {
                const err = chrome.runtime?.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Promise 化的 remove
 */
function storageRemove(keys: string | string[]): Promise<void> {
    const sync = getSyncArea();
    if (!sync) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
        try {
            sync.remove(keys, () => {
                const err = chrome.runtime?.lastError;
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Get API key for a specific provider
 */
export async function getApiKey(provider: LLMProvider): Promise<string | null> {
    // dev 环境先看 env（方便你本地调试）
    if (import.meta.env.DEV) {
        const envKey =
            import.meta.env[`VITE_${provider.toUpperCase()}_API_KEY` as keyof ImportMetaEnv];
        if (typeof envKey === "string" && envKey.length > 0) {
            return envKey;
        }
    }

    // 再看 chrome.storage
    const key = `llm_${provider}_api_key`;
    const result = await storageGet<StorageKeys>(key);
    const value = (result as any)[key];
    return value ? String(value) : null;
}

/**
 * Set API key for a specific provider
 */
export async function setApiKey(
    provider: LLMProvider,
    apiKey: string
): Promise<void> {
    const key = `llm_${provider}_api_key`;
    await storageSet({ [key]: apiKey });
}

/**
 * Get default provider
 */
export async function getDefaultProvider(): Promise<LLMProvider> {
    const result = await storageGet<StorageKeys>("llm_default_provider");
    const value = result.llm_default_provider;
    if (value === "gemini" || value === "openai" || value === "claude") {
        return value;
    }
    return "gemini";
}

/**
 * Set default provider
 */
export async function setDefaultProvider(
    provider: LLMProvider
): Promise<void> {
    await storageSet({ llm_default_provider: provider });
}

/**
 * Get fallback order
 */
export async function getFallbackOrder(): Promise<LLMProvider[]> {
    const result = await storageGet<StorageKeys>("llm_fallback_order");
    const value = result.llm_fallback_order;
    if (Array.isArray(value) && value.length > 0) {
        // 过滤一下非法值
        const filtered = value.filter((p): p is LLMProvider =>
            p === "gemini" || p === "openai" || p === "claude"
        );
        if (filtered.length > 0) {
            return filtered;
        }
    }
    return DEFAULT_FALLBACK_ORDER;
}

/**
 * Set fallback order
 */
export async function setFallbackOrder(
    order: LLMProvider[]
): Promise<void> {
    await storageSet({ llm_fallback_order: order });
}

/**
 * Get target language for translations
 */
export async function getTargetLanguage(): Promise<string> {
    const result = await storageGet<StorageKeys>("target_language");
    const value = result.target_language;
    if (typeof value === "string" && value.length > 0) {
        return value;
    }
    return DEFAULT_TARGET_LANGUAGE;
}

/**
 * Set target language
 */
export async function setTargetLanguage(language: string): Promise<void> {
    await storageSet({ target_language: language });
}

/**
 * Clear all API keys (for privacy/logout)
 */
export async function clearAllApiKeys(): Promise<void> {
    await storageRemove([
        "llm_gemini_api_key",
        "llm_openai_api_key",
        "llm_claude_api_key",
    ]);
}
