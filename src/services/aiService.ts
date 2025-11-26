import type { WordData } from "../types/word";
import { getApiKey, getDefaultProvider, getFallbackOrder, getTargetLanguage, type LLMProvider } from "./storageService";

interface AIEnhancementInput {
    word: string;
    definition: string;
    partOfSpeech?: string;
    targetLanguage: string;
}

interface AIEnhancementOutput {
    simplifiedDefinition: string;
    examples: Array<{
        english: string;
        translation: string;
    }>;
}

/**
 * Call Google Gemini API
 */
async function callGemini(input: AIEnhancementInput, apiKey: string): Promise<AIEnhancementOutput> {
    const prompt = `You are an English teaching assistant. Your task is to help language learners understand English words.

IMPORTANT REQUIREMENTS:
1. You MUST provide a simplified definition suitable for B1 level learners
2. You MUST generate EXACTLY 2 example sentences using the word "${input.word}" in context
3. You MUST provide translations of both examples to ${input.targetLanguage}
4. NEVER return empty examples array, even for very common words like "hello" or "the"
5. The examples must be natural, practical, and use the word correctly

Word: ${input.word}
Part of Speech: ${input.partOfSpeech || "unknown"}
Dictionary Definition: ${input.definition}

Respond in JSON format (no markdown, just JSON):
{
  "simplifiedDefinition": "your simplified definition here",
  "examples": [
    { "english": "example sentence with the word", "translation": "translation in ${input.targetLanguage}" },
    { "english": "another example sentence", "translation": "translation in ${input.targetLanguage}" }
  ]
}`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 600
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("No response from Gemini");
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("Invalid JSON response from Gemini");
    }

    const result: AIEnhancementOutput = JSON.parse(jsonMatch[0]);

    // Validate result
    if (!result.simplifiedDefinition || !result.examples || result.examples.length < 2) {
        throw new Error("LLM response missing required fields or insufficient examples");
    }

    return result;
}

/**
 * Call OpenAI API (placeholder for future implementation)
 */
async function callOpenAI(_input: AIEnhancementInput, _apiKey: string): Promise<AIEnhancementOutput> {
    // TODO: Implement OpenAI GPT-4o-mini integration
    throw new Error("OpenAI integration not yet implemented");
}

/**
 * Call Anthropic Claude API (placeholder for future implementation)
 */
async function callClaude(_input: AIEnhancementInput, _apiKey: string): Promise<AIEnhancementOutput> {
    // TODO: Implement Claude integration
    throw new Error("Claude integration not yet implemented");
}

/**
 * Call LLM provider
 */
async function callProvider(
    provider: LLMProvider,
    input: AIEnhancementInput,
    apiKey: string
): Promise<AIEnhancementOutput> {
    switch (provider) {
        case "gemini":
            return callGemini(input, apiKey);
        case "openai":
            return callOpenAI(input, apiKey);
        case "claude":
            return callClaude(input, apiKey);
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
}

/**
 * Enhance word data with AI-generated simplified definition and examples
 * @param wordData - The word data to enhance
 * @param forceRegenerate - If true, bypass cache and force regeneration
 */
export async function enhanceWordData(wordData: WordData, forceRegenerate: boolean = false): Promise<WordData> {
    try {
        const targetLanguage = await getTargetLanguage();
        const defaultProvider = await getDefaultProvider();
        const fallbackOrder = await getFallbackOrder();

        // Build input for AI
        const input: AIEnhancementInput = {
            word: wordData.word,
            definition: wordData.originalDefinition || "",
            partOfSpeech: wordData.partOfSpeech,
            targetLanguage
        };

        // Try providers in fallback order
        const providersToTry = [defaultProvider, ...fallbackOrder.filter(p => p !== defaultProvider)];

        for (const provider of providersToTry) {
            const apiKey = await getApiKey(provider);
            if (!apiKey) {
                console.log(`No API key for ${provider}, skipping`);
                continue;
            }

            try {
                console.log(`Calling ${provider} for AI enhancement${forceRegenerate ? " (force regenerate)" : ""}...`);
                const result = await callProvider(provider, input, apiKey);

                return {
                    ...wordData,
                    simplifiedDefinition: result.simplifiedDefinition,
                    examples: result.examples,
                    aiEnhanced: true
                };
            } catch (error) {
                console.error(`${provider} failed:`, error);
                // Continue to next provider
            }
        }

        // All providers failed
        console.warn("All AI providers failed");
        return { ...wordData, aiEnhanced: "failed" };
    } catch (error) {
        console.error("AI enhancement error:", error);
        return { ...wordData, aiEnhanced: "failed" };
    }
}
