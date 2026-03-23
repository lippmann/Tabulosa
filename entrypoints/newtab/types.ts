// CEFR (Common European Framework of Reference) 级别
// A1: 入门级 | A2: 基础级 | B1: 进阶级 | B2: 高阶级 | C1: 流利运用级 | C2: 精通级
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type CEFRLevels = Array<{ level: CEFRLevel; enabled: boolean }>;

export interface Word {
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  level: CEFRLevel;
  category: string;
}

export type Mode = 'ichigoichie' | 'random';

export interface Settings {
  version: string;
  mode: Mode;
  levels: CEFRLevels;
  pronunciation: boolean;
}

// CEFR 级别信息
export const CEFR_LEVELS: Record<CEFRLevel, { label: string; description: string; vocabulary: string }> = {
  A1: {
    label: '入门级 (A1)',
    description: '基础日常交流，约900-1000词',
    vocabulary: '900-1000'
  },
  A2: {
    label: '基础级 (A2)',
    description: '简单日常场景，约2000-3000词',
    vocabulary: '2000-3000'
  },
  B1: {
    label: '进阶级 (B1)',
    description: '独立沟通表达，约5000-6000词',
    vocabulary: '5000-6000'
  },
  B2: {
    label: '高阶级 (B2)',
    description: '专业领域交流，约7000-8000词',
    vocabulary: '7000-8000'
  },
  C1: {
    label: '流利级 (C1)',
    description: '接近母语水平，约10000+词',
    vocabulary: '10000+'
  },
  C2: {
    label: '精通级 (C2)',
    description: '完全精通，接近母语者',
    vocabulary: '15000+'
  }
};
