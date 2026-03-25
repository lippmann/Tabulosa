import { motion } from 'motion/react';
import { Volume2, Search, Bookmark, Shuffle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Word, CEFRLevel, Language, JLPTLevel } from '../types';
import { CEFR_LEVELS, JLPT_LEVELS, JLPT_LEVEL_COLORS } from '../types';
import { speakText, getDictionaryUrl } from '../hooks/use-vocab';

interface WordCardProps {
  word: Word | null;
  showPronunciation: boolean;
  onLearn: () => void;
  onNext: () => void;
  onSave: () => void;
  isSaved: boolean;
  language: Language;
}

// CEFR Level Colors - warm orange style
const levelColors: Record<CEFRLevel, string> = {
  A1: 'bg-[#4CAF50]',
  A2: 'bg-[#2196F3]',
  B1: 'bg-[#FFC107]',
  B2: 'bg-[#E07B39]',
  C1: 'bg-[#9C27B0]',
  C2: 'bg-[#F44336]',
};

// Part of Speech display names
const posDisplay: Record<string, string> = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adj',
  adverb: 'Adv',
  pronoun: 'Pron',
  preposition: 'Prep',
  conjunction: 'Conj',
  interjection: 'Interj',
  article: 'Art',
  determiner: 'Det',
};

// Parse furigana from word_reading format like "身内[みうち]"
function parseFurigana(wordReading: string): { word: string; reading: string } {
  const match = wordReading.match(/^(.+?)\[(.+?)\]$/);
  if (match) {
    return { word: match[1], reading: match[2] };
  }
  return { word: wordReading, reading: '' };
}

export function WordCard({ word, showPronunciation, onLearn, onNext, onSave, isSaved, language }: WordCardProps) {
  const isJapanese = language === 'japanese';

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
          Congratulations!
        </h2>
        <p className="text-muted-foreground mb-6">
          You've learned all the words!
        </p>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pill-button"
        >
          <Shuffle className="w-5 h-5" />
          <span>Shuffle</span>
        </motion.button>
      </div>
    );
  }

  const playWord = async () => {
    try {
      await speakText(word.word, language);
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  const playExample = async () => {
    try {
      await speakText(word.example_sentence_native, language);
    } catch (err) {
      console.error('Failed to play example:', err);
    }
  };

  const levelInfo = isJapanese 
    ? JLPT_LEVELS[word.jlpt_level || word.cefr_level as JLPTLevel]
    : CEFR_LEVELS[word.cefr_level as CEFRLevel];
  
  const levelColor = isJapanese 
    ? JLPT_LEVEL_COLORS[word.jlpt_level || word.cefr_level as JLPTLevel]
    : levelColors[word.cefr_level as CEFRLevel];

  const furigana = isJapanese && word.word_reading ? parseFurigana(word.word_reading) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center"
    >
      {/* Level Badge - Centered at top */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'px-4 py-1.5 rounded-full text-white text-sm font-medium shadow-sm mb-8',
          levelColor
        )}
      >
        {levelInfo?.label}
      </motion.div>

      {/* Main Word - Large serif font */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-3 mb-4"
      >
        {isJapanese && furigana ? (
          <div className="flex flex-col items-center">
            <span className="text-xl text-muted-foreground mb-1">{furigana.reading}</span>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground font-serif-display">{furigana.word}</h1>
          </div>
        ) : (
          <h1 className="text-5xl md:text-6xl font-bold text-foreground font-serif-display">
            {word.word}
          </h1>
        )}
        <button
          onClick={playWord}
          className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
          title="Pronounce word"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Part of Speech, English Translation, Frequency - Hidden for Japanese */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-8"
      >
        {!isJapanese && (
          <>
            {word.pos && (
              <span className="px-3 py-0.5 bg-secondary rounded-full text-sm text-foreground font-medium">
                {posDisplay[word.pos] || word.pos}
              </span>
            )}
            {word.word_frequency > 0 && (
              <span className="px-3 py-0.5 bg-secondary rounded-full text-sm text-foreground font-medium">
                {word.word_frequency}
              </span>
            )}
          </>
        )}
        
        <span className="text-xl text-muted-foreground">
          {word.english_translation}
        </span>
      </motion.div>

      {/* Example Sentence */}
      {word.example_sentence_native && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl text-center mb-10"
        >
          <div className="flex items-start justify-center gap-2 mb-1">
            <p className="text-base text-foreground">
              {word.example_sentence_native}
            </p>
            <button
              onClick={playExample}
              className="p-1 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all flex-shrink-0"
              title="Pronounce example"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {word.example_sentence_english}
          </p>
        </motion.div>
      )}

      {/* Action Buttons - Pill style */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-3"
      >
        {/* Search Button */}
        <motion.a
          href={getDictionaryUrl(word.word, language)}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pill-button cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </motion.a>
        
        {/* Save Button */}
        <motion.button
          onClick={onSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "pill-button",
            isSaved && "bg-primary text-white"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </motion.button>
        
        {/* Shuffle Button */}
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pill-button"
        >
          <Shuffle className="w-4 h-4" />
          <span>Shuffle</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
