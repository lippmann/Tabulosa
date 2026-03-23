import { useState } from 'react';
import { Settings as SettingsIcon, Book } from 'lucide-react';
import { motion } from 'motion/react';
import { WordCard } from './components/WordCard';
import { Settings } from './components/Settings';
import { useTheme } from './hooks/use-theme';
import { useLoadWords } from './hooks/use-vocab';
import { useRandomWord, useData } from './hooks/use-data';
import { useSettings, pronunciationAtom } from './hooks/use-settings';
import { useAtomValue } from 'jotai';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  
  useTheme();
  useLoadWords();
  
  const { randomWord, next } = useRandomWord();
  const { addLearned } = useData();
  const showPronunciation = useAtomValue(pronunciationAtom);

  const handleLearn = () => {
    if (randomWord) {
      addLearned(randomWord.word);
      next();
    }
  };

  const handleNext = () => {
    next();
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Book className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold text-foreground">
            Spanish Tab of Words
          </span>
          <span className="hidden sm:inline text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
            CEFR
          </span>
        </div>
        
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Open settings"
        >
          <SettingsIcon className="w-6 h-6 text-foreground" />
        </button>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <WordCard
          word={randomWord}
          showPronunciation={showPronunciation}
          onLearn={handleLearn}
          onNext={handleNext}
        />
      </main>

      {/* Settings Panel */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Footer */}
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 z-30 px-6 py-4 text-center text-sm text-muted-foreground"
      >
        Learn a Spanish word every time you open a new tab · CEFR-based levels
      </motion.footer>
    </div>
  );
}
