export type Level = 1 | 2 | 3 | 4 | 5;
export type Levels = Array<{ level: Level; enabled: boolean }>;

export interface Word {
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  level: Level;
  category: string;
}

export type Mode = 'ichigoichie' | 'random';

export interface Settings {
  version: string;
  mode: Mode;
  levels: Levels;
  pronunciation: boolean;
}
