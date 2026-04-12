#!/usr/bin/env node
/**
 * Post-build pre-render script
 * Spins up a local server, visits key routes with Puppeteer,
 * and saves the fully-rendered HTML back to dist/.
 *
 * Usage: node scripts/prerender.mjs
 * Runs automatically after `vite build` via the build:atq script.
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = 4173;

const ROUTES = [
  '/',
  '/research',
  '/privacy-policy',
  '/terms',
  '/refund-policy',
];

// Simple static file server for the dist directory
function startServer() {
  const server = createServer((req, res) => {
    let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url);
    try {
      const data = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      const mimeTypes = {
        html: 'text/html', js: 'application/javascript', css: 'text/css',
        png: 'image/png', svg: 'image/svg+xml', json: 'application/json',
        woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      // SPA fallback — serve index.html for all routes
      const indexHtml = readFileSync(join(DIST, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexHtml);
    }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function prerender() {
  console.log('🔄 Pre-rendering routes...');
  const server = await startServer();

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

  for (const route of ROUTES) {
    console.log(`  → ${route}`);
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait a bit for any remaining React renders
    await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 10000 });

    let html = await page.content();

    // Clean up: remove any inline scripts that would cause hydration mismatch
    // but keep the module script reference
    html = html.replace(/<script>window\.__PRERENDERED__.*?<\/script>/g, '');

    // Add a marker so the app knows it's pre-rendered
    html = html.replace('</head>', '<meta name="prerender-status" content="200" />\n</head>');

    // Write to the correct file path
    const outDir = route === '/' ? DIST : join(DIST, route);
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, 'index.html');
    writeFileSync(outPath, html);
    console.log(`    ✓ Written to ${outPath}`);

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('✅ Pre-rendering complete!');
}

prerender().catch((err) => {
  console.error('❌ Pre-render failed:', err.message);
  console.log('⚠️  Build succeeded but pre-render was skipped. Deploy will work as SPA.');
  process.exit(0); // Don't fail the build — SPA fallback still works
});
