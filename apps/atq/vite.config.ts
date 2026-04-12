import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { transform } from 'lightningcss'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'

/**
 * Custom Vite plugin that post-processes CSS with lightningcss to transpile
 * modern color functions (oklch, color-mix, lab, etc.) into rgb/hex fallbacks
 * for older browsers.
 *
 * Why: @tailwindcss/vite has hardcoded targets (Safari 16.4, Chrome 111) in its
 * internal lightningcss pipeline and doesn't expose a way to override them.
 * Vite's css.transformer config is also bypassed by the Tailwind plugin.
 * This plugin runs AFTER Tailwind in the generateBundle hook, catching all CSS.
 *
 * What it fixes:
 *   - oklch()     → hex fallbacks (all instances)
 *   - color-mix() → pre-computed hex (static colors only; var()-based ones are
 *                    already inside @supports blocks with hex fallbacks)
 *
 * What it can't fix (and doesn't need to):
 *   - @layer      → needs Safari 15.4+ (March 2022, 4+ years old — acceptable)
 *   - @property   → non-breaking: old browsers skip the registration but still
 *                    render the transpiled color values correctly
 */
function cssCompatPlugin(): Plugin {
  const targets = browserslistToTargets(
    browserslist('safari >= 15.4, chrome >= 80, edge >= 80, firefox >= 80')
  )

  return {
    name: 'css-compat-downlevel',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type === 'asset' && fileName.endsWith('.css')) {
          const source = typeof asset.source === 'string'
            ? asset.source
            : new TextDecoder().decode(asset.source)

          const result = transform({
            filename: fileName,
            code: Buffer.from(source),
            targets,
            errorRecovery: true,
          })

          asset.source = result.code.toString()
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cssCompatPlugin(),
  ],
  resolve: {
    alias: {
      '@atq/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  envDir: '../..',
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
