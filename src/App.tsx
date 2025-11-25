import React from "react";
import "./App.css";
import WordleBuddyPanel from "./components/WordleBuddyPanel";
import DraggableWrapper from "./components/DraggableWrapper";
import { fetchWordDefinition } from "./services/dictionaryService";
import type { WordData } from "./types/word";

function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [wordData, setWordData] = React.useState<WordData | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [currentWord, setCurrentWord] = React.useState("");

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleFetchWord = async (word: string) => {
    if (!word.trim()) {
      setError("Please enter a word");
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setCurrentWord(word);

    try {
      const data = await fetchWordDefinition(word);
      setWordData(data);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch word");
      setWordData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentWord) {
      handleFetchWord(currentWord);
    }
  };

  const handleClose = () => {
    setWordData(undefined);
    setCurrentWord("");
    setError(undefined);
  };

  const handleSettings = () => console.log("Settings clicked");

  // Auto-fetch a default word on mount
  React.useEffect(() => {
    handleFetchWord("hello");
  }, []);

  return (
    <div className="app-root">
      {/* Word Input Field */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 10000,
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          placeholder="Enter a word..."
          value={currentWord}
          onChange={(e) => setCurrentWord(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleFetchWord(currentWord);
            }
          }}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '14px',
            width: '200px'
          }}
        />
        <button
          onClick={() => handleFetchWord(currentWord)}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#4f46e5',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>

      <DraggableWrapper>
        <WordleBuddyPanel
          wordData={wordData}
          isLoading={isLoading}
          error={error}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onClose={handleClose}
          onOpenSettings={handleSettings}
          onRequestAIRefresh={handleRefresh}
        />
      </DraggableWrapper>
    </div>
  );
}

export default App;
