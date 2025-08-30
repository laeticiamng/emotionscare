#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, 'ROUTES_MANIFEST.json');
const lockPath = path.join(__dirname, 'ROUTES_LOCK');

async function calculateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function scanRoutes() {
  try {
    console.log('🔍 Scanning route manifest...');
    
    // Read manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Calculate hash
    const currentHash = await calculateHash(manifestContent);
    
    console.log(`📊 Found ${manifest.routes.length} routes`);
    console.log(`🔗 Found ${manifest.aliases.length} aliases`);
    console.log(`🔐 Current hash: ${currentHash.substring(0, 12)}...`);
    
    // Check for lock mode
    const isLockMode = process.argv.includes('--lock');
    
    if (isLockMode) {
      // Update lock file
      await fs.writeFile(lockPath, currentHash);
      console.log('✅ ROUTES_LOCK updated');
      return;
    }
    
    // Verify against lock
    try {
      const lockHash = await fs.readFile(lockPath, 'utf8');
      if (currentHash !== lockHash.trim()) {
        console.error('❌ Route manifest hash mismatch!');
        console.error(`Expected: ${lockHash.trim()}`);
        console.error(`Current:  ${currentHash}`);
        console.error('Run: npm run routes:manifest:lock to update');
        process.exit(1);
      }
    } catch (error) {
      console.warn('⚠️  No lock file found, creating one...');
      await fs.writeFile(lockPath, currentHash);
    }
    
    console.log('✅ Route manifest verification passed');
    
  } catch (error) {
    console.error('❌ Route scan failed:', error.message);
    process.exit(1);
  }
}

scanRoutes();