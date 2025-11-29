import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.silicontycoon.game',
  appName: 'Silikon Tycoon',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-3940256099942544~3347511713', // Google Test App ID
      testDevices: ['YOUR_DEVICE_ID_HERE']
    }
  }
};

export default config;
