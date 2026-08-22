import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const HOST = '0.0.0.0';
const DIST = new URL('./dist', import.meta.url).pathname;

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2']
]);

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    const safePath = path.normalize(urlPath).replace(/^\.+/, '') || '/';
    let filePath = path.join(DIST, safePath);

    // If path is a directory or doesn't exist, fall back to index.html
    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    } catch (e) {
      // file doesn't exist, fallback to index.html
n      filePath = path.join(DIST, 'index.html');
    }

    const ext = path.extname(filePath) || '.html';
    const type = mime.get(ext) || 'application/octet-stream';
    const data = await fs.readFile(filePath);

    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  } catch (err) {
    // If index.html is missing, return a helpful error
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error: ' + String(err));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT} (serving ${DIST})`);
});
