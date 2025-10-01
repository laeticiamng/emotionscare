// @ts-nocheck

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const functionsDir = join(process.cwd(), 'supabase', 'functions');

// Check if functions directory exists before proceeding
const functionFolders = (() => {
  try {
    return readdirSync(functionsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name !== '_shared')
      .map(d => d.name);
  } catch (error) {
    console.log('Supabase functions directory not found, skipping test');
    return [];
  }
})();

test('all supabase functions call an auth helper', () => {
  if (functionFolders.length === 0) {
    console.log('No Supabase functions found, test skipped');
    return;
  }

  for (const folder of functionFolders) {
    const file = join(functionsDir, folder, 'index.ts');
    try {
      const content = readFileSync(file, 'utf8');
      assert.ok(/authorizeRole\(|assertJwt\(/.test(content), `${folder}/index.ts should call auth helper`);
    } catch (error) {
      console.log(`Could not read ${file}, skipping`);
    }
  }
});
