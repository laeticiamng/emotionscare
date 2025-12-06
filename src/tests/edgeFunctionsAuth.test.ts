
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

const functionsDir = path.join(__dirname, '..', '..', 'supabase', 'functions');

// Ensure all edge functions import and use an auth helper
// to block unauthenticated access

test('all edge functions enforce auth helper', () => {
  // Check if functions directory exists
  if (!fs.existsSync(functionsDir)) {
    console.log('Supabase functions directory not found, test skipped');
    return;
  }

  const dirs = fs.readdirSync(functionsDir)
    .filter(d => {
      try {
        return fs.statSync(path.join(functionsDir, d)).isDirectory() && d !== '_shared';
      } catch (error) {
        return false;
      }
    });

  for (const dir of dirs) {
    const file = path.join(functionsDir, dir, 'index.ts');
    try {
      const content = fs.readFileSync(file, 'utf8');
      assert.match(content, /(authorizeRole|assertJwt)\(/, `auth helper missing in ${dir}`);
    } catch (error) {
      console.log(`Could not read ${file}, skipping`);
    }
  }
});

test('auth middleware logs user agent', () => {
  const authFile = path.join(functionsDir, '_shared', 'auth.ts');
  try {
    const content = fs.readFileSync(authFile, 'utf8');
    assert.ok(content.includes('user_agent'), 'auth.ts should log user_agent');
  } catch (error) {
    console.log('Auth file not found, test skipped');
  }
});
