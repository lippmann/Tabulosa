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

export function WordCard({ word, showPronunciation, onLearn, onNext }: WordCardProps) {
  if (!word) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          ¡Felicidades!
        </h2>
        <p className="text-muted-foreground mb-6">
          You've learned all the words!
        </p>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
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
      <div className={cn(
        'px-4 py-1.5 rounded-full text-white text-sm font-medium shadow-md',
        levelColors[word.cefr_level]
      )}>
        {levelInfo.label}
      </div>

      {/* Word */}
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4 animate-fade-in">
          {word.word}
        </h1>
        
        <p className="text-3xl text-muted-foreground animate-fade-in">
          {word.english_translation}
        </p>
      </div>

      {/* Example */}
      <div className="max-w-2xl text-center animate-fade-in">
        <p className="text-lg italic text-foreground mb-2">
          "{word.example_sentence_native}"
        </p>
        <p className="text-base text-muted-foreground">
          {word.example_sentence_english}
        </p>
      </div>

      {/* Part of Speech & Frequency */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
          {posDisplay[word.pos] || word.pos}
        </div>
        {word.word_frequency && (
          <div className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-xs">
            Freq: #{word.word_frequency}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={playAudio}
          className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          title="Pronounce word"
        >
          <Volume2 className="w-5 h-5 text-foreground" />
        </button>
        
        <button
          onClick={playExample}
          className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          title="Pronounce example sentence"
        >
          <MessageSquareQuote className="w-5 h-5 text-foreground" />
        </button>
        
        <a
          href={getDictionaryUrl(word.word)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          title="Open SpanishDict"
        >
          <ExternalLink className="w-5 h-5 text-foreground" />
        </a>
        
        <button
          onClick={onLearn}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Learned
        </button>
        
        <button
          onClick={onNext}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
