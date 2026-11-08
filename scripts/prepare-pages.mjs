import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { projects } from '../src/data.js';

const outputDirectory = join(process.cwd(), 'dist');
const sourceIndex = join(outputDirectory, 'index.html');
const html = await readFile(sourceIndex, 'utf8');

// GitHub Pages serves directory index files with HTTP 200. Generate a small
// SPA entry for each real route, including project slugs from the source data.
const routes = [
  'work',
  'about',
  'services',
  'contact',
  ...projects.map((project) => `work/${project.slug}`),
];

for (const route of routes) {
  const destination = join(outputDirectory, route, 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html, 'utf8');
}

console.log(`Prepared ${routes.length} direct-navigation route entries for GitHub Pages.`);
