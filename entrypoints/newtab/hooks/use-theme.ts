import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { themeAtom } from './use-settings';

export function useTheme() {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the appropriate class
    root.classList.add(theme || 'light');
  }, [theme]);
}
