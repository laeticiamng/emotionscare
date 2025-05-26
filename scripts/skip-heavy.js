
#!/usr/bin/env node
import fs from 'fs';

if (process.env.SKIP_HEAVY === 'true') {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  ['cypress', 'playwright', 'puppeteer'].forEach(p => {
    if (pkg.dependencies && pkg.dependencies[p]) {
      pkg.dependencies[p] = '0.0.0-empty';
    }
    if (pkg.optionalDependencies && pkg.optionalDependencies[p]) {
      pkg.optionalDependencies[p] = '0.0.0-empty';
    }
  });
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  console.log('⏭  Heavy binaries stubbed (SKIP_HEAVY=true)');
  process.exit(0);
}
