import React from "react";

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
    <div className="error-state">
        <p className="error-message">{message}</p>
        {onRetry && (
            <button className="retry-button" onClick={onRetry}>
                Retry
            </button>
        )}
    </div>
);

export default ErrorState;
