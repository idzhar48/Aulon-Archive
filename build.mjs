import { readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'source');
const output = join(root, 'dist');
const baseArgument = process.argv.indexOf('--base-path');
if (baseArgument !== -1 && !process.argv[baseArgument + 1]) throw Error('--base-path requires a value; use / for a root site.');
const rawBase = baseArgument === -1 ? (process.env.AULON_BASE_PATH || '') : process.argv[baseArgument + 1];
if (rawBase !== '' && !/^\/(?:[A-Za-z0-9._~-]+\/?)*$/.test(rawBase)) throw Error('The base path must be / or a URL path such as /aulon-world-archive.');
const basePath = rawBase.replace(/\/+$/, '');
const routes = JSON.parse(await readFile(join(source, 'routes.json'), 'utf8'));
const records = await readFile(join(source, 'records.js'), 'utf8');
const { sphereRecords, entries } = vm.runInNewContext(records + '\n;({sphereRecords,entries});', {}, { timeout: 1000 });
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let shell = await readFile(join(source, 'shell.html'), 'utf8');
const seenPaths = new Set();
const seenViews = new Set();
for (const route of routes) {
  if (!/^\/lore\/[a-z0-9-]+$/.test(route.path)) throw Error(`Invalid lore route: ${route.path}`);
  if (seenPaths.has(route.path) || seenViews.has(route.view)) throw Error(`Duplicate route: ${route.path}`);
  seenPaths.add(route.path);
  seenViews.add(route.view);
  const file = resolve(source, route.file);
  if (!file.startsWith(source + sep)) throw Error(`Article file is outside source: ${route.file}`);
  const article = await readFile(file, 'utf8');
  if (!article.includes(`id="${route.view}"`)) throw Error(`Missing article view ${route.view}`);
  const marker = `<!-- ARTICLE:${route.view} -->`;
  if (shell.split(marker).length !== 2) throw Error(`Expected one shell placeholder for ${route.view}`);
  shell = shell.replace(marker, () => article.trimEnd());
}
if (shell.includes('<!-- ARTICLE:')) throw Error('An article placeholder was not filled.');
shell = shell.replaceAll('{{BASE_PATH}}', basePath);

const pages = [
  { path: '/', title: 'Aulon World Archive', view: 'dashboard' },
  { path: '/spheres', title: 'The Spheres — Aulon World Archive', view: 'spheres' },
  ...routes.map(({ path, title, view }) => ({ path, title, view })),
  ...sphereRecords.map(sphere => ({ path: '/spheres/' + sphere.slug, title: sphere.name + ' — Aulon World Archive', view: 'sphere' }))
];
await rm(output, { recursive: true, force: true });
await mkdir(join(output, 'assets'), { recursive: true });
for (const file of ['styles.css', 'records.js', 'app.js']) await copyFile(join(source, file), join(output, 'assets', file));
await writeFile(join(output, 'assets/config.js'), `window.AULON_BASE_PATH = ${JSON.stringify(basePath)};\n`);

for (const page of pages) {
  const relative = page.path === '/' ? 'index.html' : page.path.slice(1) + '/index.html';
  const target = join(output, relative);
  await mkdir(dirname(target), { recursive: true });
  const html = shell.replace(/<title>.*?<\/title>/s, () => '<title>' + escapeHTML(page.title) + '</title>');
  await writeFile(target, html);
}
await writeFile(join(output, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Aulon World Archive</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f2ecdf;color:#263b31;font:18px Georgia,serif}main{max-width:34rem;padding:2rem}small{color:#917138;letter-spacing:.15em}h1{font-weight:400}a{color:#263b31;text-underline-offset:5px}</style></head><body><main><small>AULON WORLD ARCHIVE</small><h1>This record could not be found.</h1><p>The address may have changed. Return to the archive to search the lore library.</p><a href="${basePath}/">Return to the archive</a></main></body></html>`);
await writeFile(join(output, '.nojekyll'), '');
await writeFile(join(output, 'build-info.json'), JSON.stringify({ basePath, articles: routes.length, spheres: sphereRecords.length, entries: entries.length, pages }, null, 2) + '\n');
console.log(`Built ${pages.length} pages: ${routes.length} lore articles and ${sphereRecords.length} Sphere records. Base path: ${basePath || '/'}`);
