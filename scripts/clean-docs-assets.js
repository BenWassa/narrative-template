#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '../docs');
const docsAssetsDir = path.join(docsDir, 'assets');

// Remove only the assets directory to clean up old build artifacts
// while preserving other content in docs/ (like package.json, index.html if manually added)
if (fs.existsSync(docsAssetsDir)) {
  fs.removeSync(docsAssetsDir);
  console.log('Cleaned docs/assets directory');
}

// Ensure docs directory exists
fs.ensureDirSync(docsDir);
console.log('Ensured docs directory exists');
