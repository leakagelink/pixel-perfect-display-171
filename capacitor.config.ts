import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.newsai.app',
  appName: '7AWAKE NEWS NETWORK DIGITAL',
  webDir: '.output/public',
  server: {
    url: 'https://7adigital.com',
    cleartext: false,
    // Keep these domains inside the app instead of opening the phone browser
    // (the site may redirect between them).
    allowNavigation: [
      '7adigital.com',
      'www.7adigital.com',
      'newsai.socilet.one',
      '*.lovable.app',
    ],
    // Shown from inside the app when there is no internet / site unreachable.
    errorPath: 'offline.html',
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
