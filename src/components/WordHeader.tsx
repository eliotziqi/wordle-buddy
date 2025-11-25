import React from "react";
import { Sun, Moon } from "lucide-react";

interface WordHeaderProps {
    word: string;
    phonetic?: string;
    partOfSpeech?: string;
    audioUrl?: string;
    darkMode?: boolean;
    onToggleDarkMode?: () => void;
}

const WordHeader: React.FC<WordHeaderProps> = ({
    word,
    phonetic,
    partOfSpeech,
    audioUrl,
    darkMode,
    onToggleDarkMode
}) => {
    const handlePlayAudio = () => {
        if (!audioUrl) return;
        const audio = new Audio(audioUrl);
        void audio.play();
    };

    return (
        <div className="wb-header">
            <div className="wb-header-main">
                <div className="wb-title-row">
                    <h1 className="wb-word">{word}</h1>
                    {phonetic && <span className="wb-phonetic">{phonetic}</span>}
                    {audioUrl && (
                        <button className="wb-audio-btn" onClick={handlePlayAudio} aria-label="Play pronunciation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                        </button>
                    )}
                </div>
                {partOfSpeech && (
                    <span className="wb-pos">{partOfSpeech}</span>
                )}
            </div>

            <div className="wb-header-right">
                {onToggleDarkMode && (
                    <button
                        className="wb-dark-toggle"
                        onClick={onToggleDarkMode}
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <Sun className="wb-icon wb-sun" size={22} />
                        ) : (
                            <Moon className="wb-icon wb-moon" size={22} />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default WordHeader;
