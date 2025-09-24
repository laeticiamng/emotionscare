#!/usr/bin/env node

/**
 * Emergency build fix - Force bypass all TypeScript conflicts
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚨 EMERGENCY BUILD FIX - TS5094');
console.log('===============================');

try {
  // 1. Stop all possible TypeScript processes
  console.log('1. Stopping all TypeScript processes...');
  try {
    execSync('pkill -f "tsc" || true', { stdio: 'inherit' });
    execSync('pkill -f "typescript" || true', { stdio: 'inherit' });
    execSync('pkill -f "tsserver" || true', { stdio: 'inherit' });
  } catch (e) {
    console.log('   (Some processes were already stopped)');
  }

  // 2. Create emergency no-ts config
  console.log('2. Creating emergency Vite config...');
  const emergencyConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// EMERGENCY CONFIG - NO TYPESCRIPT PROCESSING
export default defineConfig({
  server: { host: "::", port: 8080 },
  preview: { host: "::", port: 4173 },
  plugins: [
    react({ typescript: false, babel: false })
  ],
  resolve: {
    alias: { "@": resolve(process.cwd(), "./src") }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild'
  },
  esbuild: {
    target: 'esnext',
    jsx: 'automatic'
  }
});
`;

  fs.writeFileSync('vite.config.emergency.js', emergencyConfig.trim());

  // 3. Create minimal package.json scripts
  console.log('3. Instructions for manual fix:');
  console.log('');
  console.log('Run these commands:');
  console.log('  mv vite.config.js vite.config.js.old');
  console.log('  mv vite.config.emergency.js vite.config.js');
  console.log('  npm run build');
  console.log('');
  console.log('If build succeeds, the issue was in the Vite config.');
  console.log('If not, the issue is in Lovable system itself.');

} catch (error) {
  console.error('Emergency fix failed:', error.message);
  process.exit(1);
}

console.log('✅ Emergency fix preparation complete');