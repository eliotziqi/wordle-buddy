import type { WordData } from "../types/word";
import { cacheService } from "./cacheService";

// API response types based on dictionaryapi.dev
interface DictionaryAPIPhonetic {
    text?: string;
    audio?: string;
}

interface DictionaryAPIDefinition {
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
}

interface DictionaryAPIMeaning {
    partOfSpeech: string;
    definitions: DictionaryAPIDefinition[];
}

interface DictionaryAPIResponse {
    word: string;
    phonetic?: string;
    phonetics?: DictionaryAPIPhonetic[];
    meanings?: DictionaryAPIMeaning[];
    origin?: string;
}

const API_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

/**
 * Transform API response to our WordData format with strict selection strategy
 */
function transformResponse(apiData: DictionaryAPIResponse): WordData {
    const firstMeaning = apiData.meanings?.[0];
    const firstDefinition = firstMeaning?.definitions?.[0];

    // Strategy for selecting phonetic and audio:
    // Priority 1: Find phonetic entry that has BOTH text AND audio (most reliable)
    // Priority 2: Use top-level phonetic if available
    // Priority 3: Use first phonetic entry with text
    let selectedPhonetic: string | undefined;
    let selectedAudioUrl: string | undefined;

    if (apiData.phonetics && apiData.phonetics.length > 0) {
        // Try to find a phonetic with both text and audio
        const phoneticWithBoth = apiData.phonetics.find(p => p.text && p.audio);

        if (phoneticWithBoth) {
            // Best case: has both phonetic text and audio
            selectedPhonetic = phoneticWithBoth.text;
            selectedAudioUrl = phoneticWithBoth.audio;
        } else {
            // Fallback: prioritize phonetic text, then look for audio separately
            const phoneticWithText = apiData.phonetics.find(p => p.text);
            selectedPhonetic = phoneticWithText?.text || apiData.phonetic;

            // Look for any entry with audio
            const phoneticWithAudio = apiData.phonetics.find(p => p.audio);
            selectedAudioUrl = phoneticWithAudio?.audio;
        }
    } else {
        // No phonetics array, use top-level if available
        selectedPhonetic = apiData.phonetic;
    }

    // Normalize audio URL (ensure https:// prefix)
    if (selectedAudioUrl) {
        if (selectedAudioUrl.startsWith("//")) {
            selectedAudioUrl = `https:${selectedAudioUrl}`;
        } else if (!selectedAudioUrl.startsWith("http")) {
            // If it's a relative path, prepend base URL
            selectedAudioUrl = `https:${selectedAudioUrl}`;
        }
    }

    // Extract examples from definitions
    const examples = firstMeaning?.definitions
        ?.filter(d => d.example)
        .slice(0, 2)
        .map(d => ({
            english: d.example!,
            translation: "" // Will be filled by AI later
        })) || [];

    return {
        word: apiData.word,
        phonetic: selectedPhonetic,
        partOfSpeech: firstMeaning?.partOfSpeech,
        simplifiedDefinition: firstDefinition?.definition, // AI will simplify later
        originalDefinition: firstDefinition?.definition,
        examples,
        audioUrl: selectedAudioUrl
    };
}

/**
 * Fetch word definition from Dictionary API
 */
export async function fetchWordDefinition(word: string): Promise<WordData> {
    // Check cache first
    const cached = cacheService.get(word);
    if (cached) {
        console.log(`Cache hit for: ${word}`);
        return cached;
    }

    // Fetch from API
    const url = `${API_BASE_URL}/${encodeURIComponent(word.toLowerCase())}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`No definition found for "${word}"`);
            }
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: DictionaryAPIResponse[] = await response.json();

        if (!data || data.length === 0) {
            throw new Error(`No definition found for "${word}"`);
        }

        const wordData = transformResponse(data[0]);

        // Cache the result
        cacheService.set(word, wordData);

        return wordData;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to fetch word definition");
    }
}
