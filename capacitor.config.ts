import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.newsai.app',
  appName: '7AWAKE NEWS NETWORK DIGITAL',
  webDir: '.output/public',
  server: {
    url: 'https://7adigital.com',
    cleartext: false,
    // Shown from inside the app when there is no internet / site unreachable.
    errorPath: 'offline.html',
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
