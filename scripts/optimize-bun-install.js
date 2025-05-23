
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

# Fast installation
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false
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

  if (!npmrcContent.includes('legacy-peer-deps=true')) {
    npmrcContent += '\n# Fast installation\nlegacy-peer-deps=true\nauto-install-peers=true\nstrict-peer-dependencies=false\n';
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
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

console.log('🚀 Bun installation optimization settings applied');
console.log('- Cypress binary download skipped');
console.log('- Husky install skipped');
console.log('- Puppeteer download skipped');
console.log('- Prefer offline packages enabled');
console.log('- Node memory increased to 4GB');

// Create a simple .babelrc file to optimize builds if it doesn't exist
if (!fs.existsSync('.babelrc')) {
  fs.writeFileSync('.babelrc', JSON.stringify({
    "presets": [
      ["@babel/preset-env", { "loose": true }],
      ["@babel/preset-react", { "runtime": "automatic" }]
    ]
  }, null, 2));
  console.log('📝 Created optimized .babelrc configuration');
}

// Create a simple .browserslistrc file to reduce transpilation overhead
if (!fs.existsSync('.browserslistrc')) {
  fs.writeFileSync('.browserslistrc', `
# Focus on modern browsers to reduce transpilation overhead
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
not IE 11
not dead
  `);
  console.log('📝 Created optimized .browserslistrc configuration');
}

// Run optimized Bun install with flags
try {
  console.log('Running optimized Bun install...');
  // Increase timeout to 5 minutes and use chunked install for better reliability
  execSync('bun install --no-summary --no-progress --no-audit --prefer-offline --ignore-optional', { 
    stdio: 'inherit', 
    timeout: 300000, // 5 minutes
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096'
    }
  });
  console.log('✅ Bun installation completed successfully');
} catch (error) {
  console.error('❌ Bun installation failed:', error.message);
  // Fall back to npm if bun fails
  console.log('Attempting fallback to npm install...');
  try {
    execSync('npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps', { 
      stdio: 'inherit',
      timeout: 300000 // 5 minutes
    });
    console.log('✅ Fallback npm installation completed successfully');
  } catch (npmError) {
    console.error('❌ All installation attempts failed:', npmError.message);
    process.exit(1);
  }
}

// Exit with success
process.exit(0);
