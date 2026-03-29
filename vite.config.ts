import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log', 'console.debug', 'console.warn', 'console.error'],
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'framer': ['framer-motion'],
          'questions': [
            './src/data/questions/english.ts',
            './src/data/questions/maths.ts',
            './src/data/questions/verbal-reasoning.ts',
            './src/data/questions/non-verbal-reasoning.ts',
            './src/data/questions/new-english.ts',
            './src/data/questions/new-maths.ts',
            './src/data/questions/new-verbal-reasoning.ts',
            './src/data/questions/new-non-verbal-reasoning.ts',
            './src/data/questions/batch2-english.ts',
            './src/data/questions/batch2-maths.ts',
            './src/data/questions/batch2-verbal-reasoning.ts',
            './src/data/questions/batch2-non-verbal-reasoning.ts',
            './src/data/questions/batch3-english.ts',
            './src/data/questions/batch3-maths.ts',
          ],
        },
      },
    },
  },
})
