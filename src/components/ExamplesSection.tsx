import React from "react";
import type { ExampleSentence } from "../types/word";

interface ExamplesSectionProps {
    examples?: ExampleSentence[];
}

const ExamplesSection: React.FC<ExamplesSectionProps> = ({ examples }) => {
    if (!examples || examples.length === 0) return null;

    return (
        <div className="wb-examples-section">
            <h3 className="wb-examples-title">AI Generated Examples</h3>
            {examples.map((example, index) => (
                <div key={index} className="wb-example-item">
                    <p className="wb-example-en">{example.english}</p>
                    <p className="wb-example-cn">{example.translation}</p>
                </div>
            ))}
        </div>
    );
};

export default ExamplesSection;
