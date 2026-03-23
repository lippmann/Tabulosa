import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { KEY, settingsAtom, modeAtom } from './use-settings';

import type { CEFRLevel, Word, CEFRLevels } from '../types';

export const wordsAtom = atom<Word[]>([]);
export const learnedAtom = atomWithStorage<string[]>(`${KEY}-learned`, []);
export const metAtom = atomWithStorage<string[]>(`${KEY}-met`, []);

export const enabledLevelsAtom = atom<CEFRLevel[]>(get => {
  const settings = get(settingsAtom);
  return settings.levels
    .filter(l => l.enabled)
    .map(l => l.level);
});

export const restOfWordsAtom = atom<Word[]>(get => {
  const words = get(wordsAtom);
  const learned = get(learnedAtom);
  const met = get(metAtom);
  const mode = get(modeAtom);
  const enabledLevels = get(enabledLevelsAtom);

  return words.filter(word => {
    if (!enabledLevels.includes(word.cefr_level))
      return false;

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

export function useRandomWord() {
  const rest = useAtomValue(restOfWordsAtom);
  const mode = useAtomValue(modeAtom);
  const setMet = useSetAtom(metAtom);

  const randomWord = rest.length > 0 
    ? rest[Math.floor(Math.random() * rest.length)] 
    : null;

  function next() {
    if (mode === 'ichigoichie' && randomWord) {
      setMet(p => [randomWord.word, ...p]);
    }
  }

  return { randomWord, next };
}

export function useData() {
  const setSettings = useSetAtom(settingsAtom);
  const setLearned = useSetAtom(learnedAtom);

  function switchLevel(level: CEFRLevel) {
    setSettings((prev) => ({
      ...prev,
      levels: prev.levels.map((item: { level: CEFRLevel; enabled: boolean }) => 
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

  return { switchLevel, addLearned, removeLearned };
}
