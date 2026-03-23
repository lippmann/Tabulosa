// CEFR (Common European Framework of Reference) Levels
// A1: Beginner | A2: Elementary | B1: Intermediate | B2: Upper-Intermediate | C1: Advanced | C2: Proficiency
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type CEFRLevels = Array<{ level: CEFRLevel; enabled: boolean }>;

// Part of Speech types
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection' | 'article' | 'determiner';

// Word data from JSON
export interface Word {
  word: string;
  useful_for_flashcard: boolean;
  cefr_level: CEFRLevel;
  english_translation: string;
  example_sentence_native: string;
  example_sentence_english: string;
  pos: string; // Part of Speech
  word_frequency: number;
}

export type Mode = 'ichigoichie' | 'random';

// Theme types - only light and dark
export type ThemeMode = 'light' | 'dark';

export interface Settings {
  version: string;
  mode: Mode;
  levels: CEFRLevels;
  pronunciation: boolean;
  theme: ThemeMode;
}

// CEFR Level Information
export const CEFR_LEVELS: Record<CEFRLevel, { label: string; description: string; vocabulary: string }> = {
  A1: {
    label: 'Beginner (A1)',
    description: 'Basic everyday communication, ~900-1000 words',
    vocabulary: '900-1000'
  },
  A2: {
    label: 'Elementary (A2)',
    description: 'Simple daily situations, ~2000-3000 words',
    vocabulary: '2000-3000'
  },
  B1: {
    label: 'Intermediate (B1)',
    description: 'Independent communication, ~5000-6000 words',
    vocabulary: '5000-6000'
  },
  B2: {
    label: 'Upper-Int (B2)',
    description: 'Professional communication, ~7000-8000 words',
    vocabulary: '7000-8000'
  },
  C1: {
    label: 'Advanced (C1)',
    description: 'Near-native fluency, ~10000+ words',
    vocabulary: '10000+'
  },
  C2: {
    label: 'Proficiency (C2)',
    description: 'Full mastery, native-like',
    vocabulary: '15000+'
  }
};
