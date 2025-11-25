import React, { useEffect, useState } from "react";
import WordHeader from "./WordHeader";
import DefinitionSection from "./DefinitionSection";
import ExamplesSection from "./ExamplesSection";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import ActionButtons from "./ActionButtons";
import type { WordData } from "../types/word";
import "../panel.css";

interface WordleBuddyPanelProps {
    wordData?: WordData;
    isLoading?: boolean;
    error?: string;
    onClose?: () => void;
    onOpenSettings?: () => void;
    onRequestAIRefresh?: () => void;
    onToggleFavoriteExternal?: (word: string, favorites: string[]) => void;
}

const WordleBuddyPanel: React.FC<WordleBuddyPanelProps> = ({
    wordData,
    isLoading = false,
    error,
    onClose,
    onOpenSettings,
    onRequestAIRefresh,
    onToggleFavoriteExternal
}) => {
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        if (wordData?.word) {
            const favorites: string[] = JSON.parse(
                localStorage.getItem("favorites") ?? "[]"
            );
            setIsFavorited(favorites.includes(wordData.word));
        }
    }, [wordData?.word]);

    const handleToggleFavorite = () => {
        if (!wordData?.word) return;

        const favorites: string[] = JSON.parse(
            localStorage.getItem("favorites") ?? "[]"
        );

        let updated: string[];
        if (favorites.includes(wordData.word)) {
            updated = favorites.filter(w => w !== wordData.word);
            setIsFavorited(false);
        } else {
            updated = [...favorites, wordData.word];
            setIsFavorited(true);
        }

        localStorage.setItem("favorites", JSON.stringify(updated));
        if (onToggleFavoriteExternal) {
            onToggleFavoriteExternal(wordData.word, updated);
        }
    };

    if (isLoading) {
        return (
            <div className="wb-panel">
                <div className="wb-panel-content">
                    <LoadingState message="Fetching from Dictionary & Generating AI..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wb-panel">
                <div className="wb-panel-content">
                    <ErrorState
                        message={error}
                        onRetry={onRequestAIRefresh}
                    />
                </div>
            </div>
        );
    }

    if (!wordData) {
        return (
            <div className="wb-panel">
                <div className="wb-panel-content">
                    <p className="wb-card-content">Please enter or select a word.</p>
                </div>
                <ActionButtons onClose={onClose} onSettings={onOpenSettings} />
            </div>
        );
    }

    return (
        <div className="wb-panel">
            <div className="wb-panel-content">
                <WordHeader
                    word={wordData.word}
                    phonetic={wordData.phonetic}
                    partOfSpeech={wordData.partOfSpeech}
                    audioUrl={wordData.audioUrl}
                />

                <DefinitionSection
                    title="AI Simplified Definition"
                    content={wordData.simplifiedDefinition}
                />

                <DefinitionSection
                    title="Original Dictionary Definition"
                    content={wordData.originalDefinition}
                    isCollapsible
                />

                <ExamplesSection examples={wordData.examples} />
            </div>

            <ActionButtons
                isFavorited={isFavorited}
                onToggleFavorite={handleToggleFavorite}
                onRefreshAI={onRequestAIRefresh}
                onSettings={onOpenSettings}
                onClose={onClose}
            />
        </div>
    );
};

export default WordleBuddyPanel;
