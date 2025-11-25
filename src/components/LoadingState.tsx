import React from "react";

interface LoadingStateProps {
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => (
    <div className="loading-state">
        <div className="spinner" />
        <p>{message ?? "Loading..."}</p>
    </div>
);

export default LoadingState;
