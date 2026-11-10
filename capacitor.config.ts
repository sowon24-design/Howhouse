import type { CapacitorConfig } from '@capacitor/cli';
import release from './src/catalog/app-release.json' with {type:'json'};

const config: CapacitorConfig = {
  appId: release.applicationId,
  appName: release.appName,
  includePlugins: ['@capacitor/app'],
  webDir: 'dist'
};

export default config;
