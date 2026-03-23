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

// Spanish TTS using Web Speech API
export function speakSpanish(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // Spanish (Spain)
    utterance.rate = 0.9; // Slightly slower for learning
    utterance.pitch = 1;

    // Try to find a Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es') && voice.localService
    ) || voices.find(voice => 
      voice.lang.startsWith('es')
    );

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

// Preload voices (needed for some browsers)
export function preloadVoices() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
  }
}
