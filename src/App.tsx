import React from "react";
import "./App.css";
import WordleBuddyPanel from "./components/WordleBuddyPanel";
import type { WordData } from "./types/word";

const mockWordData: WordData = {
  word: "crate",
  phonetic: "/kreɪt/",
  partOfSpeech: "noun",
  audioUrl: "https://api.dictionaryapi.dev/media/pronunciations/en/crate-us.mp3", // Added mock audio
  simplifiedDefinition: "A wooden box used for storage or transport.",
  originalDefinition:
    "A rugged wooden container often used for transporting goods.",
  examples: [
    {
      english: "The workers loaded the heavy crate onto the truck.",
      translation: "工人们把沉重的木箱装上了卡车。"
    },
    {
      english: "He used a crate to store his old records.",
      translation: "他用一个木箱来存放旧唱片。"
    }
  ]
};

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  // Mock handlers
  const handleClose = () => console.log("Close clicked");
  const handleSettings = () => console.log("Settings clicked");
  const handleRefresh = () => console.log("Refresh clicked");

  return (
    <div className="app-root">
      <WordleBuddyPanel
        wordData={mockWordData}
        isLoading={false}
        error={undefined}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onClose={handleClose}
        onOpenSettings={handleSettings}
        onRequestAIRefresh={handleRefresh}
      />
    </div>
  );
}

export default App;
