
#!/usr/bin/env node

/**
 * This script optimizes Bun installation by setting environment variables
 * and flags that significantly reduce installation time
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Verify .npmrc exists and has necessary settings
if (!fs.existsSync('.npmrc')) {
  console.log('Creating .npmrc file with optimized settings');
  const npmrcContent = `
# Disable Cypress binary download during npm/bun install
cypress_skip_binary_install=1

# Optimize installation process
prefer-offline=true
fund=false
audit=false
save-exact=true
`;
  fs.writeFileSync('.npmrc', npmrcContent);
} else {
  console.log('Verifying .npmrc settings');
  let npmrcContent = fs.readFileSync('.npmrc', 'utf8');
  let modified = false;
  
  if (!npmrcContent.includes('cypress_skip_binary_install=1')) {
    npmrcContent += '\n# Disable Cypress binary download during npm/bun install\ncypress_skip_binary_install=1\n';
    modified = true;
  }
  
  if (!npmrcContent.includes('prefer-offline=true')) {
    npmrcContent += '\n# Optimize installation process\nprefer-offline=true\nfund=false\naudit=false\nsave-exact=true\n';
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync('.npmrc', npmrcContent);
    console.log('Updated .npmrc with optimized settings');
  }
}

// Set environment variables that help reduce installation time
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';

console.log('🚀 Bun installation optimization settings applied');
console.log('- Cypress binary download skipped');
console.log('- Husky install skipped');
console.log('- Puppeteer download skipped');
console.log('- Prefer offline packages enabled');

// Run optimized Bun install with flags
try {
  console.log('Running optimized Bun install...');
  execSync('bun install --no-summary --no-progress', { stdio: 'inherit' });
  console.log('✅ Bun installation completed successfully');
} catch (error) {
  console.error('❌ Bun installation failed:', error.message);
  process.exit(1);
}

// Exit with success
process.exit(0);
