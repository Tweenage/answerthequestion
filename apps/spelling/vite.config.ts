import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@atq/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  envDir: '../..',
  server: {
    host: true,
    port: 5175,
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
          'words': ['./src/data/words/index.ts'],
        },
      },
    },
  },
})
