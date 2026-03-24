// CEFR (Common European Framework of Reference) Levels
// A1: Beginner | A2: Elementary | B1: Intermediate | B2: Upper-Intermediate | C1: Advanced | C2: Proficiency
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type CEFRLevels = Array<{ level: CEFRLevel; enabled: boolean }>;

// JLPT (Japanese Language Proficiency Test) Levels
// N5: Beginner | N4: Elementary | N3: Intermediate | N2: Pre-Advanced | N1: Advanced
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type JLPTLevels = Array<{ level: JLPTLevel; enabled: boolean }>;

// Part of Speech types
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection' | 'article' | 'determiner';

// Supported Languages
export type Language = 'spanish' | 'french' | 'german' | 'italian' | 'portuguese' | 'mandarin' | 'korean' | 'japanese' | 'arabic' | 'russian' | 'hindi';

// Language configuration
export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  speechLang: string; // For Web Speech API
  dictionaryUrl: (word: string) => string;
  flagEmoji?: string;
  isJapanese?: boolean; // Special flag for Japanese
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  spanish: {
    code: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    speechLang: 'es-ES',
    dictionaryUrl: (word) => `https://www.spanishdict.com/translate/${encodeURIComponent(word)}`,
    flagEmoji: '🇪🇸',
  },
  french: {
    code: 'french',
    name: 'French',
    nativeName: 'Français',
    speechLang: 'fr-FR',
    dictionaryUrl: (word) => `https://www.wordreference.com/enfr/${encodeURIComponent(word)}`,
    flagEmoji: '🇫🇷',
  },
  german: {
    code: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    speechLang: 'de-DE',
    dictionaryUrl: (word) => `https://www.wordreference.com/deen/${encodeURIComponent(word)}`,
    flagEmoji: '🇩🇪',
  },
  italian: {
    code: 'italian',
    name: 'Italian',
    nativeName: 'Italiano',
    speechLang: 'it-IT',
    dictionaryUrl: (word) => `https://www.wordreference.com/iten/${encodeURIComponent(word)}`,
    flagEmoji: '🇮🇹',
  },
  portuguese: {
    code: 'portuguese',
    name: 'Portuguese',
    nativeName: 'Português',
    speechLang: 'pt-PT',
    dictionaryUrl: (word) => `https://www.wordreference.com/pten/${encodeURIComponent(word)}`,
    flagEmoji: '🇵🇹',
  },
  mandarin: {
    code: 'mandarin',
    name: 'Mandarin',
    nativeName: '中文',
    speechLang: 'zh-CN',
    dictionaryUrl: (word) => `https://www.wordreference.com/zhen/${encodeURIComponent(word)}`,
    flagEmoji: '🇨🇳',
  },
  korean: {
    code: 'korean',
    name: 'Korean',
    nativeName: '한국어',
    speechLang: 'ko-KR',
    dictionaryUrl: (word) => `https://www.wordreference.com/koen/${encodeURIComponent(word)}`,
    flagEmoji: '🇰🇷',
  },
  japanese: {
    code: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    speechLang: 'ja-JP',
    dictionaryUrl: (word) => `https://jisho.org/search/${encodeURIComponent(word)}`,
    flagEmoji: '🇯🇵',
    isJapanese: true,
  },
  arabic: {
    code: 'arabic',
    name: 'Arabic',
    nativeName: 'العربية',
    speechLang: 'ar-SA',
    dictionaryUrl: (word) => `https://www.wordreference.com/aren/${encodeURIComponent(word)}`,
    flagEmoji: '🇸🇦',
  },
  russian: {
    code: 'russian',
    name: 'Russian',
    nativeName: 'Русский',
    speechLang: 'ru-RU',
    dictionaryUrl: (word) => `https://www.wordreference.com/ruen/${encodeURIComponent(word)}`,
    flagEmoji: '🇷🇺',
  },
  hindi: {
    code: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechLang: 'hi-IN',
    dictionaryUrl: (word) => `https://www.wordreference.com/hien/${encodeURIComponent(word)}`,
    flagEmoji: '🇮🇳',
  },
};

// Word data from JSON
export interface Word {
  word: string;
  useful_for_flashcard?: boolean;
  cefr_level: CEFRLevel | JLPTLevel; // Support both CEFR and JLPT
  english_translation: string;
  example_sentence_native: string;
  example_sentence_english: string;
  pos: string; // Part of Speech
  word_frequency: number;
  romanization?: string; // For non-Latin scripts
  word_reading?: string; // For Japanese furigana
  jlpt_level?: JLPTLevel; // JLPT level for Japanese
}

export type Mode = 'ichigoichie' | 'random';

// Theme types - only light and dark
export type ThemeMode = 'light' | 'dark';

export interface Settings {
  version: string;
  mode: Mode;
  language: Language;
  levels: CEFRLevels;
  jlptLevels: JLPTLevels; // For Japanese
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

// JLPT Level Information
export const JLPT_LEVELS: Record<JLPTLevel, { label: string; description: string; vocabulary: string }> = {
  N5: {
    label: 'Beginner (N5)',
    description: 'Basic daily conversation, simple questions',
    vocabulary: '~800 words'
  },
  N4: {
    label: 'Elementary (N4)',
    description: 'Everyday situations, basic opinions',
    vocabulary: '~1,500 words'
  },
  N3: {
    label: 'Intermediate (N3)',
    description: 'Abstract concepts, nuanced expressions',
    vocabulary: '~3,750 words'
  },
  N2: {
    label: 'Pre-Advanced (N2)',
    description: 'Business conversations, newspapers',
    vocabulary: '~6,000 words'
  },
  N1: {
    label: 'Advanced (N1)',
    description: 'Academic discussions, novels',
    vocabulary: '~10,000 words'
  }
};

// JLPT Level Colors
export const JLPT_LEVEL_COLORS: Record<JLPTLevel, string> = {
  N5: 'bg-green-500',
  N4: 'bg-blue-500',
  N3: 'bg-yellow-500',
  N2: 'bg-orange-500',
  N1: 'bg-red-500',
};
