import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { themeAtom } from './use-settings';
import { THEMES } from '../types';

export function useTheme() {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    // Always use light theme
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    
    // Apply theme colors as CSS variables
    const themeColors = THEMES[theme];
    if (themeColors) {
      // Set both formats for Tailwind compatibility
      document.documentElement.style.setProperty('--color-primary', themeColors.primary);
      document.documentElement.style.setProperty('--color-ring', themeColors.ring);
    }
  }, [theme]);
}

// Get current theme primary color (useful for inline styles)
export function getThemePrimaryColor(theme: string): string {
  return THEMES[theme as keyof typeof THEMES]?.primary || '#e11d48';
}
