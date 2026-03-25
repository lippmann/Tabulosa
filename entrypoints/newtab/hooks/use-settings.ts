import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Settings, ThemeMode, Language } from '../types';

export const KEY = 'tabulosa';

const defaultSettings: Settings = {
  version: '1.0.0',
  mode: 'random',
  language: 'spanish',
  levels: [
    { level: 'A1', enabled: true },
    { level: 'A2', enabled: true },
    { level: 'B1', enabled: true },
    { level: 'B2', enabled: true },
    { level: 'C1', enabled: true },
    { level: 'C2', enabled: true },
  ],
  jlptLevels: [
    { level: 'N5', enabled: true },
    { level: 'N4', enabled: true },
    { level: 'N3', enabled: true },
    { level: 'N2', enabled: true },
    { level: 'N1', enabled: true },
  ],
  pronunciation: true,
  theme: 'light',
};

export const settingsAtom = atomWithStorage<Settings>(KEY, defaultSettings);

// Derived atoms that ensure default values
export const modeAtom = atom(get => get(settingsAtom).mode || defaultSettings.mode);
export const languageAtom = atom(get => get(settingsAtom).language || defaultSettings.language);
export const levelsAtom = atom(get => get(settingsAtom).levels || defaultSettings.levels);
export const jlptLevelsAtom = atom(get => get(settingsAtom).jlptLevels || defaultSettings.jlptLevels);
export const pronunciationAtom = atom(get => get(settingsAtom).pronunciation ?? defaultSettings.pronunciation);
export const themeAtom = atom(get => get(settingsAtom).theme || defaultSettings.theme);

export function useSettings() {
  const settings = useAtomValue(settingsAtom);
  const setSettings = useSetAtom(settingsAtom);

  function updateSettings(newSettings: Partial<Settings>) {
    setSettings((prev: Settings) => ({ ...prev, ...newSettings }));
  }

  function resetSettings() {
    setSettings(defaultSettings);
  }

  function setTheme(theme: ThemeMode) {
    updateSettings({ theme });
  }

  function setLanguage(language: Language) {
    updateSettings({ language });
  }

  return { settings, updateSettings, resetSettings, setTheme, setLanguage };
}
