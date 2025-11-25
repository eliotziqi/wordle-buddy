import React from "react";
import type { ExampleSentence } from "../types/word";

interface ExamplesSectionProps {
    examples?: ExampleSentence[];
}

const ExamplesSection: React.FC<ExamplesSectionProps> = ({ examples }) => {
    if (!examples || examples.length === 0) return null;

    return (
        <div className="examples-section">
            <div className="section-title">AI Generated Examples</div>
            {examples.map((example, index) => (
                <div key={index} className="example-item">
                    <p className="english-example">{example.english}</p>
                    <p className="translated-example">{example.translation}</p>
                </div>
            ))}
        </div>
    );
};

export default ExamplesSection;
