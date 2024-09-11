import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const Directories = ['/uploads/profile', '/uploads/product', '/uploads/category', 'logs'];

export function CreateProDir() {
  for (const Directory of Directories) {
    const path = join(__dirname, '..', '..', Directory);
    if (existsSync(path)) continue;
    mkdirSync(path, { recursive: true });
  }
}
