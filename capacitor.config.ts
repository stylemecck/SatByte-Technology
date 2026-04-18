import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.satbyte.app',
  appName: 'SatByte Technology',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      statsUrl: 'https://api.capgo.app/',
      channel: 'production',
      delayAfterOnboarding: 2000
    }
  }
};

export default config;
