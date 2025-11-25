import type { WordData } from "../types/word";

const CACHE_PREFIX = "wordle-buddy-cache-";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
    data: WordData;
    timestamp: number;
}

export const cacheService = {
    get(word: string): WordData | null {
        try {
            const key = CACHE_PREFIX + word.toLowerCase();
            const cached = localStorage.getItem(key);

            if (!cached) return null;

            const entry: CacheEntry = JSON.parse(cached);
            const now = Date.now();

            // Check if cache is expired
            if (now - entry.timestamp > CACHE_TTL_MS) {
                localStorage.removeItem(key);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error("Cache read error:", error);
            return null;
        }
    },

    set(word: string, data: WordData): void {
        try {
            const key = CACHE_PREFIX + word.toLowerCase();
            const entry: CacheEntry = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(entry));
        } catch (error) {
            console.error("Cache write error:", error);
        }
    },

    clear(): void {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(CACHE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error("Cache clear error:", error);
        }
    }
};
