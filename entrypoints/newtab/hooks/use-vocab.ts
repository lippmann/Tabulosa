import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { wordsAtom } from './use-data';
import type { Word } from '../types';

export function useLoadWords() {
  const setWords = useSetAtom(wordsAtom);

  useEffect(() => {
    fetch('/data/words.json')
      .then(res => res.json())
      .then((data: Word[]) => {
        setWords(data);
      })
      .catch(err => {
        console.error('Failed to load words:', err);
      });
  }, [setWords]);
}

export function getDictionaryUrl(word: string) {
  return `https://www.spanishdict.com/translate/${encodeURIComponent(word)}`;
}

export function getAudioUrl(word: string) {
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(word)}`;
}
