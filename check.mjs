import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const info = JSON.parse(await readFile(join(dist, 'build-info.json'), 'utf8'));
assert(info.articles >= 15, 'An original lore article is missing.');
const required = ['legendary-techniques-of-adamantites-and-spherebound', 'resonance-nullity-of-the-marked-ones', 'skaurun-bequeathed-weapons-of-the-spheres'];
for (const slug of required) assert(info.pages.some(page => page.path === '/lore/' + slug), `Missing pending article: ${slug}`);

for (const page of info.pages) {
  const relative = page.path === '/' ? 'index.html' : page.path.slice(1) + '/index.html';
  const html = await readFile(join(dist, relative), 'utf8');
  assert(html.startsWith('<!doctype html>'), `Invalid HTML entry: ${relative}`);
  assert(html.includes(`id="${page.view}"`), `Missing target view: ${relative}`);
  assert(!html.includes('{{BASE_PATH}}') && !html.includes('<!-- ARTICLE:'), `Unresolved template: ${relative}`);
  for (const [, asset] of html.matchAll(/(?:src|href)="([^"]+\/assets\/[^"?#]+)"/g)) {
    assert(asset.startsWith(info.basePath + '/assets/'), `Asset outside site base: ${asset}`);
    const local = asset.slice(info.basePath.length + 1);
    assert((await stat(join(dist, local))).isFile(), `Missing asset: ${asset}`);
  }
}
for (const file of ['config.js', 'records.js', 'app.js']) new vm.Script(await readFile(join(dist, 'assets', file), 'utf8'), { filename: file });
const html = await readFile(join(dist, 'index.html'), 'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.has(anchor), `Broken in-page link: #${anchor}`);
assert((await readFile(join(dist, '404.html'), 'utf8')).includes(`href="${info.basePath}/"`), '404 home link has the wrong base.');
console.log(`Verified ${info.pages.length} page files, all assets, article anchors, scripts, and the three pending additions.`);
