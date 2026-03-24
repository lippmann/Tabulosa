import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { wordsAtom, languageAtom } from './use-data';
import type { Word, Language } from '../types';
import { LANGUAGES } from '../types';

export function useLoadWords() {
  const setWords = useSetAtom(wordsAtom);
  const language = useAtomValue(languageAtom);

  useEffect(() => {
    fetch(`/data/${language}.json`)
      .then(res => res.json())
      .then((data: Record<string, unknown>[]) => {
        // 对阿拉伯语进行特殊处理：将 diacritized_word 映射到 word
        const normalizedData = data.map(item => {
          if ('diacritized_word' in item && !('word' in item)) {
            return { ...item, word: item.diacritized_word } as unknown as Word;
          }
          return item as unknown as Word;
        });
        setWords(normalizedData);
      })
      .catch(err => {
        console.error('Failed to load words:', err);
      });
  }, [setWords, language]);
}

export function getDictionaryUrl(word: string, language: Language = 'spanish') {
  return LANGUAGES[language].dictionaryUrl(word);
}

// TTS for any language - 优先使用高质量服务，回退到 Web Speech API
export function speakText(text: string, language: Language = 'spanish'): Promise<void> {
  const langConfig = LANGUAGES[language];
  
  return new Promise((resolve, reject) => {
    // 首先尝试使用 background script 调用高质量 TTS
    if (typeof browser !== 'undefined' && browser.runtime) {
      browser.runtime.sendMessage({ type: 'TTS', text, lang: langConfig.speechLang })
        .then(response => {
          if (response && response.success && response.audioUrl) {
            const audio = new Audio(response.audioUrl);
            audio.playbackRate = 0.9;
            audio.onended = () => {
              URL.revokeObjectURL(response.audioUrl);
              resolve();
            };
            audio.onerror = () => {
              // 回退到 Web Speech API
              speakWithWebSpeech(text, langConfig.speechLang).then(resolve).catch(reject);
            };
            audio.play().catch(() => {
              speakWithWebSpeech(text, langConfig.speechLang).then(resolve).catch(reject);
            });
          } else {
            // 没有成功响应，使用 Web Speech API
            speakWithWebSpeech(text, langConfig.speechLang).then(resolve).catch(reject);
          }
        })
        .catch(() => {
          // 通信失败，使用 Web Speech API
          speakWithWebSpeech(text, langConfig.speechLang).then(resolve).catch(reject);
        });
    } else {
      // 非扩展环境，直接使用 Web Speech API
      speakWithWebSpeech(text, langConfig.speechLang).then(resolve).catch(reject);
    }
  });
}

// 使用 Web Speech API（优化配置）
function speakWithWebSpeech(text: string, lang: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // 取消之前的语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // 稍慢便于学习
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // 获取可用声音并选择最好的
    const voices = window.speechSynthesis.getVoices();
    
    // 提取语言代码前缀（如 'es-ES' -> 'es'）
    const langPrefix = lang.split('-')[0];
    
    // 按优先级选择最好的声音
    const voicePriority = [
      // Google 在线声音（通常最自然）
      (v: SpeechSynthesisVoice) => 
        v.lang.startsWith(langPrefix) && 
        v.name.toLowerCase().includes('google'),
      // Microsoft 高质量声音
      (v: SpeechSynthesisVoice) => 
        v.lang.startsWith(langPrefix) && 
        v.name.toLowerCase().includes('microsoft'),
      // 在线服务声音（通常质量更好）
      (v: SpeechSynthesisVoice) => 
        v.lang.startsWith(langPrefix) && 
        !v.localService,
      // 精确匹配
      (v: SpeechSynthesisVoice) => v.lang === lang,
      // 任何匹配语言的声音
      (v: SpeechSynthesisVoice) => v.lang.startsWith(langPrefix),
    ];

    let selectedVoice: SpeechSynthesisVoice | undefined;
    for (const predicate of voicePriority) {
      selectedVoice = voices.find(predicate);
      if (selectedVoice) break;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
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
    
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      });
    }
  }
}
