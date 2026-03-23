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

// Theme types
export type ThemeName = 'rose' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'slate' | 'ocean' | 'coral';

export interface ThemeColors {
  name: ThemeName;
  label: string;
  primary: string;
  ring: string;
}

export interface Settings {
  version: string;
  mode: Mode;
  levels: CEFRLevels;
  pronunciation: boolean;
  theme: ThemeName;
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

// Theme configurations - Elegant solid colors
export const THEMES: Record<ThemeName, ThemeColors> = {
  rose: {
    name: 'rose',
    label: 'Rose',
    primary: '#e11d48',
    ring: '#e11d48',
  },
  indigo: {
    name: 'indigo',
    label: 'Indigo',
    primary: '#4f46e5',
    ring: '#4f46e5',
  },
  emerald: {
    name: 'emerald',
    label: 'Emerald',
    primary: '#059669',
    ring: '#059669',
  },
  violet: {
    name: 'violet',
    label: 'Violet',
    primary: '#7c3aed',
    ring: '#7c3aed',
  },
  amber: {
    name: 'amber',
    label: 'Amber',
    primary: '#d97706',
    ring: '#d97706',
  },
  slate: {
    name: 'slate',
    label: 'Slate',
    primary: '#475569',
    ring: '#475569',
  },
  ocean: {
    name: 'ocean',
    label: 'Ocean',
    primary: '#0369a1',
    ring: '#0369a1',
  },
  coral: {
    name: 'coral',
    label: 'Coral',
    primary: '#f97316',
    ring: '#f97316',
  },
};
