import React from "react";
import type { WordData } from "../types/word";

interface ExamplesSectionProps {
    wordData?: WordData;
    onRefreshAI?: () => void;
}

const ExamplesSection: React.FC<ExamplesSectionProps> = ({ wordData, onRefreshAI }) => {
    if (!wordData) return null;

    const { examples, aiEnhanced, word } = wordData;

    // Helper function to bold the word in an example sentence
    const highlightWord = (text: string, targetWord: string): React.ReactNode => {
        // Create regex to match word (case insensitive, whole word)
        const regex = new RegExp(`\\b(${targetWord})\\b`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            if (part.toLowerCase() === targetWord.toLowerCase()) {
                return <b key={index}>{part}</b>;
            }
            return part;
        });
    };

    // Helper function to speak example sentence using Web Speech API
    const speakExample = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="wb-examples-section">
            <h3 className="wb-examples-title">AI Generated Examples</h3>

            {/* State: AI not attempted yet */}
            {aiEnhanced === false && (
                <div className="wb-example-placeholder">
                    <p>🤖 AI Examples not generated yet.</p>
                    {onRefreshAI && (
                        <button className="wb-btn" onClick={onRefreshAI}>
                            Generate AI Examples
                        </button>
                    )}
                </div>
            )}

            {/* State: AI failed */}
            {aiEnhanced === "failed" && (
                <div className="wb-example-placeholder wb-example-error">
                    <p>⚠️ AI generation failed.</p>
                    {onRefreshAI && (
                        <button className="wb-btn" onClick={onRefreshAI}>
                            Retry AI Generation
                        </button>
                    )}
                </div>
            )}

            {/* State: AI succeeded but no examples */}
            {aiEnhanced === true && (!examples || examples.length === 0) && (
                <div className="wb-example-placeholder">
                    <p>⚠️ No examples available for this word.</p>
                </div>
            )}

            {/* State: AI succeeded with examples */}
            {aiEnhanced === true && examples && examples.length > 0 && (
                <>
                    {examples.map((example, index) => (
                        <div key={index} className="wb-example-item">
                            <div className="wb-example-header">
                                <p className="wb-example-en">
                                    {highlightWord(example.english, word)}
                                </p>
                                <button
                                    className="wb-audio-btn"
                                    onClick={() => speakExample(example.english)}
                                    aria-label="Play example"
                                    title="Listen to example"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    </svg>
                                </button>
                            </div>
                            <p className="wb-example-cn">{example.translation}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default ExamplesSection;
