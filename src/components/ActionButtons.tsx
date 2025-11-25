import React from "react";

interface ActionButtonsProps {
    isFavorited?: boolean;
    onToggleFavorite?: () => void;
    onRefreshAI?: () => void;
    onSettings?: () => void;
    onClose?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    isFavorited = false,
    onToggleFavorite,
    onRefreshAI,
    onSettings,
    onClose
}) => (
    <div className="action-buttons">
        {onToggleFavorite && (
            <button className="favorite-button" onClick={onToggleFavorite}>
                {isFavorited ? "⭐ Favorited" : "☆ Favorite"}
            </button>
        )}
        {onRefreshAI && (
            <button className="refresh-ai-button" onClick={onRefreshAI}>
                🔄 Refresh AI
            </button>
        )}
        {onSettings && (
            <button className="settings-button" onClick={onSettings}>
                ⚙️ Settings
            </button>
        )}
        {onClose && (
            <button className="close-button" onClick={onClose}>
                ✖ Close
            </button>
        )}
    </div>
);

export default ActionButtons;
