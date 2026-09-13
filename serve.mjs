import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const info = JSON.parse(await readFile(resolve(dist, 'build-info.json'), 'utf8'));
const flag = process.argv.indexOf('--port');
const port = Number(flag === -1 ? 4173 : process.argv[flag + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw Error('Provide a valid --port.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    let path = decodeURIComponent(url.pathname);
    if (info.basePath) {
      if (path === '/') { response.writeHead(302, { Location: info.basePath + '/' }); response.end(); return; }
      if (path !== info.basePath && !path.startsWith(info.basePath + '/')) throw Error('Outside site base');
      path = path.slice(info.basePath.length);
    }
    let file = resolve(dist, '.' + (path || '/'));
    if (file !== resolve(dist) && !file.startsWith(resolve(dist) + sep)) throw Error('Invalid path');
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(308, { Location: url.pathname + '/' + url.search }); response.end(); return; }
      file = resolve(file, 'index.html');
    }
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await readFile(resolve(dist, '404.html')));
  }
}).listen(port, '127.0.0.1', () => console.log(`Aulon preview: http://127.0.0.1:${port}${info.basePath}/`));
