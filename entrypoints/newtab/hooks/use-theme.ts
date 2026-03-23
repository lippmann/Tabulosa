import { useEffect } from 'react';

export function useTheme() {
  useEffect(() => {
    // Always use light theme
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);
}
