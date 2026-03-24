import { defineConfig } from 'wxt';
import type { WxtViteConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifestVersion: 3,
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Tabulosa - Vocabulary New Tab',
    description: 'Learn vocabulary in Spanish, French, German, Italian, Portuguese, Japanese, Korean, Mandarin, Arabic, Russian, and Hindi - every time you open a new tab.',
    version: '1.0.0',
    chrome_url_overrides: {
      newtab: 'newtab.html'
    },
    icons: {
      16: 'icons/16.png',
      48: 'icons/48.png',
      128: 'icons/128.png'
    },
    permissions: [
      'storage'
    ],
    host_permissions: [
      'https://translate.google.com/*'
    ]
  },
  vite: () => ({
    plugins: [tailwindcss()]
  }) as WxtViteConfig
});
