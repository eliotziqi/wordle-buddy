import React from "react";

interface WordHeaderProps {
    word: string;
    phonetic?: string;
    partOfSpeech?: string;
    audioUrl?: string;
}

const WordHeader: React.FC<WordHeaderProps> = ({
    word,
    phonetic,
    partOfSpeech,
    audioUrl
}) => {
    const handlePlayAudio = () => {
        if (!audioUrl) return;
        const audio = new Audio(audioUrl);
        void audio.play();
    };

    return (
        <div className="word-header">
            <div className="word-left">
                <h2 className="word">{word}</h2>
                {phonetic && <span className="phonetic">{phonetic}</span>}
            </div>

            <div className="word-right">
                {audioUrl && (
                    <button className="audio-button" onClick={handlePlayAudio}>
                        🔊
                    </button>
                )}
                {partOfSpeech && (
                    <span className="part-of-speech">{partOfSpeech}</span>
                )}
            </div>
        </div>
    );
};

export default WordHeader;
