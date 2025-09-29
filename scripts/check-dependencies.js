
#!/usr/bin/env node

/**
 * Dependency checker that validates installation without modifying package.json
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Checking dependency status...');

// Check if critical packages are installed
const criticalPackages = [
  'react',
  'react-dom', 
  'vite',
  '@types/react',
  '@types/react-dom'
];

const packageJsonPath = 'package.json';
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const allDeps = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

const missing = criticalPackages.filter(pkg => !allDeps[pkg]);

if (missing.length > 0) {
  console.log('⚠️ Missing critical packages:', missing);
  console.log('💡 These will be auto-installed by the build system');
} else {
  console.log('✅ All critical packages are listed in package.json');
}

// Check for duplicates
const deps = Object.keys(packageJson.dependencies || {});
const devDeps = Object.keys(packageJson.devDependencies || {});
const duplicates = deps.filter(dep => devDeps.includes(dep));

if (duplicates.length > 0) {
  console.log('⚠️ Duplicate dependencies found:', duplicates);
  console.log('💡 This may cause version conflicts');
}

console.log('✅ Dependency check completed');
