import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { themeAtom } from './use-settings';
import { THEMES } from '../types';

// Default theme for fallback
const DEFAULT_THEME = 'rose';

export function useTheme() {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    // Always use light theme
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    
    // Apply theme colors as CSS variables
    const themeName = theme || DEFAULT_THEME;
    const themeColors = THEMES[themeName];
    if (themeColors) {
      // Set both formats for Tailwind compatibility
      document.documentElement.style.setProperty('--color-primary', themeColors.primary);
      document.documentElement.style.setProperty('--color-ring', themeColors.ring);
    }
  }, [theme]);
}

// Get current theme primary color (useful for inline styles)
export function getThemePrimaryColor(theme: string | undefined): string {
  const themeName = theme || DEFAULT_THEME;
  return THEMES[themeName as keyof typeof THEMES]?.primary || '#e11d48';
}
