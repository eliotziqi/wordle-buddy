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

    return (
        <div className="definition-section">
            <div className="section-title">
                <span className="label">{title}</span>
                {isCollapsible && (
                    <button
                        className="toggle-button"
                        onClick={() => setIsExpanded(prev => !prev)}
                    >
                        {isExpanded ? "▲" : "▼"}
                    </button>
                )}
            </div>
            {isExpanded && <p className="definition-content">{content}</p>}
        </div>
    );
};

export default DefinitionSection;
