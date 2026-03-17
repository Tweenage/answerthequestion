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
          ],
        },
      },
    },
  },
})
