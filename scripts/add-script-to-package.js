
#!/usr/bin/env node

/**
 * Helper script to add update:matrix command to package.json
 * This is a workaround since we can't modify package.json directly
 */

const fs = require('fs');
const path = require('path');

console.log('📝 Adding update:matrix script to package.json...');

try {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add the script if it doesn't exist
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  packageJson.scripts['update:matrix'] = 'node scripts/update-feature-matrix.js';
  
  // Write back to package.json
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  console.log('✅ Script added successfully!');
  console.log('You can now run: npm run update:matrix');
  
} catch (error) {
  console.log('⚠️  Could not modify package.json (read-only)');
  console.log('Manual command: node scripts/update-feature-matrix.js');
}
