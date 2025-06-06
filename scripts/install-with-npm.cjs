#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');

if (process.env.USE_BUN) {
  console.error('Bun is disabled for this project. Aborting install.');
  process.exit(1);
}

const force = process.argv.includes('--force');

if (force) {
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.rmSync('package-lock.json');
  }
}

execSync('npm ci', { stdio: 'inherit' });
