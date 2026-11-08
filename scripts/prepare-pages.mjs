import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist');
const sourceIndex = join(outputDirectory, 'index.html');
const html = await readFile(sourceIndex, 'utf8');

// GitHub Pages serves directory index files with HTTP 200. Generate a small
// SPA entry for every real route instead of relying on the 404.html workaround.
const routes = [
  'work',
  'about',
  'services',
  'contact',
  'work/forma-living',
  'work/after-hours',
  'work/good-things-club',
  'work/signal-studio',
];

for (const route of routes) {
  const destination = join(outputDirectory, route, 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html, 'utf8');
}

console.log(`Prepared ${routes.length} direct-navigation route entries for GitHub Pages.`);
