import { motion } from 'motion/react';
import { Volume2, MessageSquareQuote, ExternalLink, Check, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Word, CEFRLevel } from '../types';
import { CEFR_LEVELS } from '../types';
import { speakSpanish, getDictionaryUrl } from '../hooks/use-vocab';

interface WordCardProps {
  word: Word | null;
  showPronunciation: boolean;
  onLearn: () => void;
  onNext: () => void;
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

// Icon button component with hover effects
interface IconButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  title: string;
  href?: string;
}

const IconButton = ({ onClick, children, title, href }: IconButtonProps) => {
  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-3 bg-secondary rounded-lg cursor-pointer group relative overflow-hidden"
      title={title}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
      
      {/* Icon with animation */}
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
      
      {/* Ripple effect background */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="block">
      {buttonContent}
    </button>
  );
};

export function WordCard({ word, showPronunciation, onLearn, onNext }: WordCardProps) {
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: -360 }}
            transition={{ duration: 0.5 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.div>
          Start Over
        </motion.button>
      </div>
    );
  }

  const playAudio = async () => {
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

      {/* Word */}
      <div className="text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-6xl md:text-7xl font-bold text-foreground mb-4"
        >
          {word.word}
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl text-muted-foreground"
        >
          {word.english_translation}
        </motion.p>
      </div>

      {/* Example */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="max-w-2xl text-center"
      >
        <p className="text-lg italic text-foreground mb-2">
          "{word.example_sentence_native}"
        </p>
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
        className="flex items-center gap-3 mt-4"
      >
        {/* Pronounce Word Button */}
        <IconButton onClick={playAudio} title="Pronounce word">
          <Volume2 className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </IconButton>
        
        {/* Pronounce Example Button */}
        <IconButton onClick={playExample} title="Pronounce example sentence">
          <MessageSquareQuote className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </IconButton>
        
        {/* Dictionary Link */}
        <IconButton href={getDictionaryUrl(word.word)} title="Open SpanishDict">
          <ExternalLink className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </IconButton>
        
        {/* Learned Button */}
        <motion.button
          onClick={onLearn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.3 }}
          >
            <Check className="w-4 h-4 relative z-10" />
          </motion.div>
          <span className="relative z-10">Learned</span>
        </motion.button>
        
        {/* Next Button */}
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05, x: 3 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow group"
        >
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-1"
          >
            Next
            <motion.span
              className="inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
            >
              →
            </motion.span>
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
