import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optional isolated build. Does not change the shared application's entry point.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'solutions-dist.local',
    rollupOptions: { input: fileURLToPath(new URL('./preview.html', import.meta.url)) },
  },
})
