import { atom, useAtomValue, useSetAtom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useState, useEffect } from 'react';

import { KEY, settingsAtom, modeAtom, languageAtom, jlptLevelsAtom } from './use-settings';
import type { CEFRLevel, Word, CEFRLevels, JLPTLevel } from '../types';
import { LANGUAGES } from '../types';

export { languageAtom } from './use-settings';

export const wordsAtom = atom<Word[]>([]);
export const learnedAtom = atomWithStorage<string[]>(`${KEY}-learned`, []);
export const metAtom = atomWithStorage<string[]>(`${KEY}-met`, []);
export const savedAtom = atomWithStorage<string[]>(`${KEY}-saved`, []);

export const enabledLevelsAtom = atom<CEFRLevel[]>(get => {
  const settings = get(settingsAtom);
  return (settings.levels || [])
    .filter(l => l.enabled)
    .map(l => l.level);
});

export const enabledJLPTLevelsAtom = atom<JLPTLevel[]>(get => {
  const settings = get(settingsAtom);
  return (settings.jlptLevels || [])
    .filter(l => l.enabled)
    .map(l => l.level);
});

export const restOfWordsAtom = atom<Word[]>(get => {
  const words = get(wordsAtom);
  const learned = get(learnedAtom);
  const met = get(metAtom);
  const mode = get(modeAtom);
  const language = get(languageAtom);
  const enabledLevels = get(enabledLevelsAtom);
  const enabledJLPTLevels = get(enabledJLPTLevelsAtom);

  const isJapanese = language === 'japanese';

  return words.filter(word => {
    // 根据语言选择不同的等级过滤
    if (isJapanese) {
      const wordLevel = word.jlpt_level || word.cefr_level;
      if (!enabledJLPTLevels.includes(wordLevel as JLPTLevel))
        return false;
    } else {
      if (!enabledLevels.includes(word.cefr_level as CEFRLevel))
        return false;
    }

    if (mode === 'ichigoichie')
      return !met.includes(word.word);

    return !learned.includes(word.word);
  });
});

export const learnedWordsAtom = atom<Word[]>(get => {
  const learned = get(learnedAtom);
  const words = get(wordsAtom);
  const result = [];

  for (const word of learned) {
    const _w = words.find(w => w.word === word);
    if (_w) result.push(_w);
  }

  return result;
});

export const savedWordsAtom = atom<Word[]>(get => {
  const saved = get(savedAtom);
  const words = get(wordsAtom);
  const result = [];

  for (const word of saved) {
    const _w = words.find(w => w.word === word);
    if (_w) result.push(_w);
  }

  return result;
});

export function useRandomWord() {
  const rest = useAtomValue(restOfWordsAtom);
  const words = useAtomValue(wordsAtom);
  const mode = useAtomValue(modeAtom);
  const setMet = useSetAtom(metAtom);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [firstWord, setFirstWord] = useState<string>('');

  // 当单词数据变化时重置当前单词（检测第一个单词是否变化）
  useEffect(() => {
    const newFirstWord = words.length > 0 ? words[0].word : '';
    // 如果之前有数据，且第一个单词变了，说明语言切换了
    if (firstWord && newFirstWord && firstWord !== newFirstWord) {
      setCurrentWord(null);
    }
    setFirstWord(newFirstWord);
  }, [words.length > 0 ? words[0].word : '']);

  // 初始化时选择一个随机单词
  useEffect(() => {
    if (!currentWord && rest.length > 0) {
      setCurrentWord(rest[Math.floor(Math.random() * rest.length)]);
    }
  }, [rest, currentWord]);

  // 切换到下一个单词
  function next() {
    if (mode === 'ichigoichie' && currentWord) {
      setMet(p => [currentWord.word, ...p]);
    }
    // 选择新的随机单词
    if (rest.length > 0) {
      const newWord = rest[Math.floor(Math.random() * rest.length)];
      setCurrentWord(newWord);
    } else {
      setCurrentWord(null);
    }
  }

  return { randomWord: currentWord, next };
}

export function useData() {
  const setSettings = useSetAtom(settingsAtom);
  const setLearned = useSetAtom(learnedAtom);
  const setSaved = useSetAtom(savedAtom);

  function switchLevel(level: CEFRLevel) {
    setSettings((prev) => ({
      ...prev,
      levels: prev.levels.map((item: { level: CEFRLevel; enabled: boolean }) => 
        item.level === level ? { ...item, enabled: !item.enabled } : item
      )
    }));
  }

  function switchJLPTLevel(level: JLPTLevel) {
    setSettings((prev) => ({
      ...prev,
      jlptLevels: prev.jlptLevels.map((item: { level: JLPTLevel; enabled: boolean }) => 
        item.level === level ? { ...item, enabled: !item.enabled } : item
      )
    }));
  }

  function addLearned(value: string) {
    setLearned(p => {
      if (p.includes(value)) return p;
      return [value, ...p];
    });
  }

  function removeLearned(value: string) {
    setLearned(p => p.filter(word => word !== value));
  }

  function toggleSaved(value: string) {
    setSaved(p => {
      if (p.includes(value)) {
        return p.filter(word => word !== value);
      }
      return [value, ...p];
    });
  }

  function removeSaved(value: string) {
    setSaved(p => p.filter(word => word !== value));
  }

  return { switchLevel, switchJLPTLevel, addLearned, removeLearned, toggleSaved, removeSaved };
}
