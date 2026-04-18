import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.satbyte.app',
  appName: 'SatByte Technology',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
