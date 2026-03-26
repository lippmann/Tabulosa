import { defineConfig } from 'wxt';
import type { WxtViteConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifestVersion: 3,
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Tabulosa',
    description: 'Learn vocabulary in Spanish, French, German, Japanese, Chinese, and 7 more languages every new tab.',
    version: '1.0.0',
    chrome_url_overrides: {
      newtab: 'newtab.html'
    },
    icons: {
      16: 'icon/16.png',
      48: 'icon/48.png',
      128: 'icon/128.png'
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
