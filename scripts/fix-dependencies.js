
#!/usr/bin/env node

/**
 * Script to identify and report dependency conflicts
 * This helps identify issues that need manual resolution in package.json
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing package.json for dependency conflicts...');

const packageJsonPath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check for duplicate dependencies
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

const duplicates = [];
const allDeps = new Set();

// Check for duplicates between deps and devDeps
Object.keys(dependencies).forEach(dep => {
  if (devDependencies[dep]) {
    duplicates.push(dep);
  }
  allDeps.add(dep);
});

Object.keys(devDependencies).forEach(dep => {
  allDeps.add(dep);
});

// Report findings
console.log('\n📊 Dependency Analysis Results:');
console.log(`Total unique packages: ${allDeps.size}`);
console.log(`Dependencies: ${Object.keys(dependencies).length}`);
console.log(`Dev Dependencies: ${Object.keys(devDependencies).length}`);

if (duplicates.length > 0) {
  console.log('\n⚠️ Duplicate dependencies found:');
  duplicates.forEach(dep => {
    console.log(`  - ${dep}: ${dependencies[dep]} (deps) vs ${devDependencies[dep]} (devDeps)`);
  });
  
  console.log('\n💡 Recommendations:');
  console.log('  1. Remove duplicate entries from package.json');
  console.log('  2. Keep production dependencies in "dependencies"');
  console.log('  3. Keep build/dev tools in "devDependencies"');
} else {
  console.log('✅ No duplicate dependencies found');
}

// Check for problematic packages
const problematicPackages = [
  'edge-test-kit', // doesn't exist
  'kysely@^0.26.4' // version doesn't exist
];

console.log('\n🔍 Checking for problematic packages...');
const issues = [];

Object.entries({...dependencies, ...devDependencies}).forEach(([pkg, version]) => {
  if (pkg === 'kysely' && version === '^0.26.4') {
    issues.push(`${pkg}@${version} - version doesn't exist, should be ^0.27.2`);
  }
  if (pkg === 'edge-test-kit') {
    issues.push(`${pkg} - package doesn't exist in npm registry`);
  }
});

if (issues.length > 0) {
  console.log('❌ Issues found:');
  issues.forEach(issue => console.log(`  - ${issue}`));
} else {
  console.log('✅ No problematic packages found');
}

console.log('\n✅ Analysis complete');
