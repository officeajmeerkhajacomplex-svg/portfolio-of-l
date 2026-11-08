import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { projects } from '../src/data.js';

const outputDirectory = join(process.cwd(), 'dist');
const sourceIndex = join(outputDirectory, 'index.html');
const html = await readFile(sourceIndex, 'utf8');

const staticPages = {
  work: {
    title: 'Selected Work — LIYAQAT®',
    description: 'A selection of digital experiences, visual identities, and motion explorations by LIYAQAT.',
  },
  about: {
    title: 'About — LIYAQAT®',
    description: 'Meet LIYAQAT, an independent multidisciplinary creative working across design, technology, and storytelling.',
  },
  services: {
    title: 'Services — LIYAQAT®',
    description: 'Digital experiences, visual identities, motion design, and creative partnerships by LIYAQAT.',
  },
  contact: {
    title: 'Contact — LIYAQAT®',
    description: 'Start a conversation with LIYAQAT about your next website, identity, motion project, or creative collaboration.',
  },
};

const escapeAttribute = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function pageHtmlFor(route) {
  const projectSlug = route.startsWith('work/') ? route.slice('work/'.length) : null;
  const project = projectSlug ? projects.find((item) => item.slug === projectSlug) : null;
  const meta = project
    ? { title: `${project.title} — LIYAQAT®`, description: project.description }
    : staticPages[route] ?? {
        title: 'LIYAQAT® — Digital, with feeling.',
        description: 'Independent digital designer and creative developer building identities, interfaces, motion, and experiences with feeling.',
      };

  const title = escapeAttribute(meta.title);
  const description = escapeAttribute(meta.description);

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${description}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${description}$2`);
}

// GitHub Pages serves directory index files with HTTP 200. Generate a small
// SPA entry for each real route, with a route-specific title and description.
const routes = [
  ...Object.keys(staticPages),
  ...projects.map((project) => `work/${project.slug}`),
];

for (const route of routes) {
  const destination = join(outputDirectory, route, 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, pageHtmlFor(route), 'utf8');
}

console.log(`Prepared ${routes.length} direct-navigation route entries with route-specific metadata.`);
