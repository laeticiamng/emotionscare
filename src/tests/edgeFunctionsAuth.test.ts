import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

const functionsDir = path.join(__dirname, '..', '..', 'supabase', 'functions');

// Ensure all edge functions import and use authorizeRole
// to block unauthenticated access

test('all edge functions enforce authorizeRole', () => {
  const dirs = fs.readdirSync(functionsDir)
    .filter(d => fs.statSync(path.join(functionsDir, d)).isDirectory() && d !== '_shared');

  for (const dir of dirs) {
    const file = path.join(functionsDir, dir, 'index.ts');
    const content = fs.readFileSync(file, 'utf8');
    assert.match(content, /authorizeRole\(/, `authorizeRole missing in ${dir}`);
  }
});

test('auth middleware logs user agent', () => {
  const authFile = path.join(functionsDir, '_shared', 'auth.ts');
  const content = fs.readFileSync(authFile, 'utf8');
  assert.ok(content.includes('user_agent'), 'auth.ts should log user_agent');
});
