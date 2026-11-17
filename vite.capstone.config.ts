import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { validateCapstoneEnvironment } from './scripts/capstone-config.mjs'

// Separate from the Play/catalog configuration. Never embeds server credentials.
export default defineConfig(({ mode }) => {
  if (mode !== 'capstone') throw Error('Use --mode capstone for this prototype configuration.')
  validateCapstoneEnvironment({ ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env })
  return {
    cacheDir: '.capstone-cache.local',
    plugins: [react()],
    define: { 'import.meta.env.VITE_ANALYSIS_API_BASE_URL': JSON.stringify('http://127.0.0.1:8787') },
    build: { outDir: 'dist-capstone', rolldownOptions: { input: resolve(import.meta.dirname, 'capstone.html') } },
    server: {
      host: '127.0.0.1', port: 5190, strictPort: true,
      fs: { deny: ['.env', '.env.*', '*.{crt,pem,key,p12,pfx,cer,der}', '.npmrc', '**/.git/**', '**/server/**', '**/*.local'] },
    },
  }
})
