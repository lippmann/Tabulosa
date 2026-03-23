import { motion } from 'motion/react';
import { Volume2, Search, Bookmark, BookmarkCheck, Shuffle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Word, CEFRLevel } from '../types';
import { CEFR_LEVELS } from '../types';
import { speakSpanish, getDictionaryUrl } from '../hooks/use-vocab';

interface WordCardProps {
  word: Word | null;
  showPronunciation: boolean;
  onLearn: () => void;
  onNext: () => void;
  onSave: () => void;
  isSaved: boolean;
}

// CEFR Level Colors
const levelColors: Record<CEFRLevel, string> = {
  A1: 'bg-green-500',
  A2: 'bg-blue-500',
  B1: 'bg-yellow-500',
  B2: 'bg-orange-500',
  C1: 'bg-purple-500',
  C2: 'bg-red-500',
};

// Part of Speech display names
const posDisplay: Record<string, string> = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adjective',
  adverb: 'Adverb',
  pronoun: 'Pronoun',
  preposition: 'Preposition',
  conjunction: 'Conjunction',
  interjection: 'Interjection',
  article: 'Article',
  determiner: 'Determiner',
};

// Small audio button for inline use
const AudioButton = ({ onClick, title }: { onClick: () => void; title: string }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.9 }}
    title={title}
    className="p-2 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-200 group"
  >
    <motion.div
      whileHover={{ rotate: [0, -15, 15, 0] }}
      transition={{ duration: 0.4 }}
    >
      <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
    </motion.div>
  </motion.button>
);

export function WordCard({ word, showPronunciation, onLearn, onNext, onSave, isSaved }: WordCardProps) {
  if (!word) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          ¡Felicidades!
        </h2>
        <p className="text-muted-foreground mb-6">
          You've learned all the words!
        </p>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-secondary rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all shadow-md hover:shadow-lg"
          title="Start over"
        >
          <Shuffle className="w-6 h-6" />
        </motion.button>
      </div>
    );
  }

  const playWord = async () => {
    try {
      await speakSpanish(word.word);
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  const playExample = async () => {
    try {
      await speakSpanish(word.example_sentence_native);
    } catch (err) {
      console.error('Failed to play example:', err);
    }
  };

  const levelInfo = CEFR_LEVELS[word.cefr_level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-8"
    >
      {/* Level Badge */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        className={cn(
          'px-4 py-1.5 rounded-full text-white text-sm font-medium shadow-md cursor-default',
          levelColors[word.cefr_level]
        )}
      >
        {levelInfo.label}
      </motion.div>

      {/* Word with Audio Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-center gap-3"
      >
        <h1 className="text-6xl md:text-7xl font-bold text-foreground">
          {word.word}
        </h1>
        <AudioButton onClick={playWord} title="Pronounce word" />
      </motion.div>
      
      {/* Translation */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl text-muted-foreground"
      >
        {word.english_translation}
      </motion.p>

      {/* Example with Audio Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="max-w-2xl text-center"
      >
        <div className="flex items-start justify-center gap-2 mb-2">
          <p className="text-lg italic text-foreground">
            "{word.example_sentence_native}"
          </p>
          <AudioButton onClick={playExample} title="Pronounce example" />
        </div>
        <p className="text-base text-muted-foreground">
          {word.example_sentence_english}
        </p>
      </motion.div>

      {/* Part of Speech & Frequency */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
          {posDisplay[word.pos] || word.pos}
        </div>
        {word.word_frequency && (
          <div className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-xs">
            Freq: #{word.word_frequency}
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-4 mt-6"
      >
        {/* Dictionary Link - Search */}
        <motion.a
          href={getDictionaryUrl(word.word)}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-secondary rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all shadow-md hover:shadow-lg"
          title="Look up in dictionary"
        >
          <Search className="w-6 h-6" />
        </motion.a>
        
        {/* Save Button */}
        <motion.button
          onClick={onSave}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: isSaved ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
          className={cn(
            "p-4 rounded-xl transition-all shadow-md hover:shadow-lg",
            isSaved 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary/80"
          )}
          title={isSaved ? "Remove from saved" : "Save word"}
        >
          <motion.div
            animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {isSaved ? (
              <BookmarkCheck className="w-6 h-6" />
            ) : (
              <Bookmark className="w-6 h-6" />
            )}
          </motion.div>
        </motion.button>
        
        {/* Random Next Button */}
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-secondary rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all shadow-md hover:shadow-lg"
          title="Next random word"
        >
          <Shuffle className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
