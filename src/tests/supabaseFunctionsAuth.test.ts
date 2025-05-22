import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const functionsDir = join(process.cwd(), 'supabase', 'functions');

const functionFolders = readdirSync(functionsDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== '_shared')
  .map(d => d.name);

test('all supabase functions call authorizeRole', () => {
  for (const folder of functionFolders) {
    const file = join(functionsDir, folder, 'index.ts');
    const content = readFileSync(file, 'utf8');
    assert.ok(/authorizeRole\(/.test(content), `${folder}/index.ts should call authorizeRole`);
  }
});
