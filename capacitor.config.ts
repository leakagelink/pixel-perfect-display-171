import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.newsai.app',
  appName: 'NewsAI',
  webDir: '.output/public',
  server: {
    url: 'https://newsai.socilet.one',
    cleartext: false
  }
};

export default config;
