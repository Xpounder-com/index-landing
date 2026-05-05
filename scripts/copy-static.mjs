import { cp, mkdir, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const staticExtensions = new Set(['.html', '.jsx', '.css']);
const staticDirs = new Set(['screenshots', 'uploads']);

await mkdir(dist, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  const source = join(root, entry.name);
  const target = join(dist, entry.name);

  if (entry.isFile() && entry.name !== 'index.html' && staticExtensions.has(extname(entry.name))) {
    await cp(source, target);
  }

  if (entry.isDirectory() && staticDirs.has(entry.name)) {
    await cp(source, target, { recursive: true });
  }
}
