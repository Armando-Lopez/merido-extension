import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Merido',
    description: 'Merido is your AI assistant for your browser',
    icons: {
      16: 'icon/merido-icon.png',
      24: 'icon/merido-icon.png',
      48: 'icon/merido-icon.png',
      96: 'icon/merido-icon.png',
      128: 'icon/merido-icon.png',
    },
  },
});
