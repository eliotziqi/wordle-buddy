export interface ExampleSentence {
    english: string;
    translation: string;
}

export interface WordData {
    word: string;
    phonetic?: string;
    partOfSpeech?: string;
    simplifiedDefinition?: string;
    originalDefinition?: string;
    examples?: ExampleSentence[];
    audioUrl?: string;
}