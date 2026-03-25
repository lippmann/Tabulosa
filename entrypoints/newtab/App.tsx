import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useAtomValue } from 'jotai';
import { WordCard } from './components/WordCard';
import { Settings } from './components/Settings';
import { useTheme } from './hooks/use-theme';
import { useLoadWords, preloadVoices } from './hooks/use-vocab';
import { useRandomWord, useData, savedAtom, languageAtom } from './hooks/use-data';
import { useSettings, pronunciationAtom } from './hooks/use-settings';
import { LANGUAGES } from './types';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  
  useTheme();
  useLoadWords();
  
  // Preload TTS voices
  useEffect(() => {
    preloadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = preloadVoices;
    }
  }, []);
  
  const { randomWord, next, restart } = useRandomWord();
  const { addLearned, toggleSaved, resetProgress } = useData();
  const showPronunciation = useAtomValue(pronunciationAtom);
  const savedWords = useAtomValue(savedAtom);
  const language = useAtomValue(languageAtom);

  // Update page title dynamically
  useEffect(() => {
    const langName = LANGUAGES[language]?.name || 'Spanish';
    document.title = `Tabulosa · ${langName}`;
  }, [language]);

  const handleLearn = () => {
    if (randomWord) {
      addLearned(randomWord.word);
      next();
    }
  };

  const handleNext = () => {
    next();
  };

  const handleSave = () => {
    if (randomWord) {
      toggleSaved(randomWord.word);
    }
  };

  const handleRestart = () => {
    resetProgress();
    restart();
  };

  const isSaved = randomWord ? savedWords.includes(randomWord.word) : false;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Dot Grid Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Settings Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setShowSettings(true)}
        className="fixed top-4 right-6 z-30 p-2 hover:bg-secondary rounded-full transition-colors"
        title="Open settings"
      >
        <SettingsIcon className="w-5 h-5 text-muted-foreground" />
      </motion.button>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
        <WordCard
          word={randomWord}
          showPronunciation={showPronunciation}
          onLearn={handleLearn}
          onNext={handleNext}
          onSave={handleSave}
          onRestart={handleRestart}
          isSaved={isSaved}
          language={language}
        />
      </main>

      {/* Settings Panel */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
