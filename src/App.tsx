import React from "react";
import "./App.css";
import WordleBuddyPanel from "./components/WordleBuddyPanel";
import DraggableWrapper from "./components/DraggableWrapper";
import { fetchWordDefinition } from "./services/dictionaryService";
import { enhanceWordData } from "./services/aiService";
import type { WordData } from "./types/word";

function App() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [wordData, setWordData] = React.useState<WordData | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAILoading, setIsAILoading] = React.useState(false);
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
      // Step 1: Fetch from dictionary API
      const dictData = await fetchWordDefinition(word);
      setWordData(dictData);
      setError(undefined);

      // Step 2: Enhance with AI (non-blocking)
      setIsAILoading(true);
      try {
        const enhancedData = await enhanceWordData(dictData);
        setWordData(enhancedData);
      } catch (aiError) {
        console.error("AI enhancement failed:", aiError);
        // Don't show error to user, just keep dictionary data
      } finally {
        setIsAILoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch word");
      setWordData(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshAI = async () => {
    if (!wordData) return;

    setIsAILoading(true);
    try {
      // Force regenerate - bypass any caching
      const enhancedData = await enhanceWordData(wordData, true);
      setWordData(enhancedData);

      if (enhancedData.aiEnhanced === "failed") {
        setError("AI enhancement failed. Please check your API key in settings.");
      } else {
        setError(undefined);
      }
    } catch (aiError) {
      console.error("AI refresh failed:", aiError);
      setError("AI enhancement failed. Please check your API key in settings.");
    } finally {
      setIsAILoading(false);
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
          isLoading={isLoading || isAILoading}
          error={error}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onClose={handleClose}
          onOpenSettings={handleSettings}
          onRequestAIRefresh={handleRefreshAI}
        />
      </DraggableWrapper>
    </div>
  );
}

export default App;
