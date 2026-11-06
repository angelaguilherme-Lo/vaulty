import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.angelaguilherme.vaulty',
  appName: 'Vaulty',
  webDir: 'out',
  loggingBehavior: 'none',
  ios: { contentInset: 'never', backgroundColor: '#07111a', webContentsDebuggingEnabled: false },
};

export default config;
