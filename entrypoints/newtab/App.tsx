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

// Logo SVG component - folder with Ñ (Spanish letter)
const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Folder shape with top-left notch */}
    <path 
      d="M14 38C14 34.134 17.134 31 21 31H42L50 23H72L80 31H107C110.866 31 114 34.134 114 38V106C114 109.866 110.866 113 107 113H21C17.134 113 14 109.866 14 106V38Z" 
      fill="currentColor"
    />
    {/* Letter Ñ in white */}
    <g fill="#FFFFFF">
      <rect x="38" y="52" width="10" height="38"/>
      <rect x="80" y="52" width="10" height="38"/>
      <polygon points="80,52 90,52 48,90 38,90"/>
    </g>
    {/* Tilde ~ above N */}
    <path 
      d="M46 46Q54 40 62 46Q70 52 82 44" 
      stroke="#FFFFFF" 
      strokeWidth="5" 
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  
  useTheme();
  useLoadWords();
  
  // Preload TTS voices
  useEffect(() => {
    preloadVoices();
    // Some browsers load voices asynchronously
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = preloadVoices;
    }
  }, []);
  
  const { randomWord, next } = useRandomWord();
  const { addLearned, toggleSaved } = useData();
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

  const isSaved = randomWord ? savedWords.includes(randomWord.word) : false;

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
          <span className="text-[#D4736A]">
            <Logo />
          </span>
          <span className="text-lg font-semibold text-foreground">
            tabulosa <span className="text-muted-foreground">·</span> <span className="text-muted-foreground">{LANGUAGES[language]?.name}</span>
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
          onSave={handleSave}
          isSaved={isSaved}
          language={language}
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
        Tabulosa: learn a new word every time you open a new tab
      </motion.footer>
    </div>
  );
}
