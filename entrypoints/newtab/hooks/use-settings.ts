import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { CEFRLevel, CEFRLevels, Mode, Settings } from '../types';

export const KEY = 'spanish-tab-of-words';

const defaultSettings: Settings = {
  version: '1.0.0',
  mode: 'random',
  levels: [
    { level: 'A1', enabled: true },
    { level: 'A2', enabled: true },
    { level: 'B1', enabled: false },
    { level: 'B2', enabled: false },
    { level: 'C1', enabled: false },
    { level: 'C2', enabled: false },
  ],
  pronunciation: true,
};

export const settingsAtom = atomWithStorage<Settings>(KEY, defaultSettings);
export const modeAtom = atom(get => get(settingsAtom).mode);
export const levelsAtom = atom(get => get(settingsAtom).levels);
export const pronunciationAtom = atom(get => get(settingsAtom).pronunciation);

export function useSettings() {
  const settings = useAtomValue(settingsAtom);
  const setSettings = useSetAtom(settingsAtom);

  function updateSettings(newSettings: Partial<Settings>) {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }

  function resetSettings() {
    setSettings(defaultSettings);
  }

  return { settings, updateSettings, resetSettings };
}
