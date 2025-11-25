import React, { useState } from "react";

interface DefinitionSectionProps {
    title: string;
    content?: string;
    isCollapsible?: boolean;
}

const DefinitionSection: React.FC<DefinitionSectionProps> = ({
    title,
    content,
    isCollapsible = false
}) => {
    const [isExpanded, setIsExpanded] = useState(!isCollapsible);

    if (!content) return null;

    if (isCollapsible) {
        return (
            <div style={{ marginBottom: '1.25rem' }}>
                <button
                    className="wb-collapsible-btn"
                    onClick={() => setIsExpanded(prev => !prev)}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {title}
                        {!isExpanded && (
                            <span style={{ fontWeight: 400, opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                                — {content}
                            </span>
                        )}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                {isExpanded && (
                    <div className="wb-collapsible-content">
                        {content}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="wb-card">
            <h3 className="wb-card-title">
                {title}
            </h3>
            <p className="wb-card-content">{content}</p>
        </div>
    );
};

export default DefinitionSection;
