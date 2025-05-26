#!/usr/bin/env node
const { execSync } = await import('child_process');

if (process.env.SKIP_HEAVY === 'true') {
  console.log('🚀  Downloading heavy binaries after build…');
  try { execSync('npx cypress install', { stdio: 'inherit' }); } catch {}
  try { execSync('npx playwright install chromium', { stdio: 'inherit' }); } catch {}
  try { execSync('npx puppeteer@22.10.0 install', { stdio: 'inherit' }); } catch {}
}

if (process.env.SKIP_TEST_DEPS === 'true') {
  console.log('🚀  Installing DB/Edge test deps…');
  ['edge-test-kit', 'supabase-edge-functions-test', 'pgtap-run', 'pg-prove'].forEach((p) => {
    try { execSync(`npm install ${p} --no-save`, { stdio: 'inherit' }); } catch {}
  });
}
