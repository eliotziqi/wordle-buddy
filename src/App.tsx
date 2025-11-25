import "./App.css";
import WordleBuddyPanel from "./components/WordleBuddyPanel";
import type { WordData } from "./types/word";

const mockWordData: WordData = {
  word: "crate",
  phonetic: "/kreɪt/",
  partOfSpeech: "noun",
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
  return (
    <div className="app-root">
      <WordleBuddyPanel
        wordData={mockWordData}
        isLoading={false}
        error={undefined}
      />
    </div>
  );
}

export default App;
