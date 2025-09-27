
#!/usr/bin/env node

/**
 * This script checks for and runs TypeScript type checking
 * It does not modify package.json directly, but provides feedback if the script is missing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

// Read package.json without modifying it
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check if the check-types script exists
if (!packageJson.scripts || !packageJson.scripts['check-types']) {
  console.log('⚠️ The check-types script is not defined in package.json.');
  console.log('To add it, manually edit package.json to include:');
  console.log('"scripts": {');
  console.log('  "check-types": "tsc --noEmit"');
  console.log('}');
  process.exit(0);
}

// If the script exists, run it
console.log('🔍 Running type checking...');
try {
  execSync('npm run check-types', { stdio: 'inherit' });
  console.log('✅ Type checking passed!');
} catch (error) {
  console.error('❌ Type checking failed!');
  process.exit(1);
}
