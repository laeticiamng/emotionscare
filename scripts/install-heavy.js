#!/usr/bin/env node
if (process.env.SKIP_HEAVY === 'true') {
  console.log('🚀  Downloading heavy binaries after build…');
  const { execSync } = await import('child_process');
  try { execSync('npx cypress install', { stdio: 'inherit' }); } catch {}
  try { execSync('npx playwright install chromium', { stdio: 'inherit' }); } catch {}
  try { execSync('npx puppeteer@22.10.0 install', { stdio: 'inherit' }); } catch {}
}
