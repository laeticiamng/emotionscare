import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

// Ensure each Supabase Edge Function checks authorization before parsing the request

test('all edge functions use authorizeRole before reading the body', () => {
  const functionsDir = path.join(process.cwd(), 'supabase', 'functions');
  const entries = fs.readdirSync(functionsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === '_shared') continue;
    const file = path.join(functionsDir, entry.name, 'index.ts');
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');

    // Check authorizeRole import and usage
    assert.ok(content.includes('authorizeRole'), `authorizeRole missing in ${entry.name}`);

    // authorizeRole should be called before the first req.json or req.text
    const callIndex = content.indexOf('authorizeRole');
    const jsonIndex = content.indexOf('req.json');
    const textIndex = content.indexOf('req.text');
    const firstReadIndex = [jsonIndex, textIndex].filter(i => i !== -1).sort((a,b) => a-b)[0];
    if (firstReadIndex !== undefined) {
      assert.ok(callIndex !== -1 && callIndex < firstReadIndex, `authorizeRole should be called before reading body in ${entry.name}`);
    }
  }
});
