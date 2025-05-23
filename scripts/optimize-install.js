
#!/usr/bin/env node

/**
 * Optimizes the installation process by setting environment variables
 * to skip heavy dependencies like Cypress and setting up optimized npmrc.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing installation environment...');

// Set environment variables to optimize installation
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Create or update .npmrc file with optimized settings
const npmrcPath = path.join(process.cwd(), '.npmrc');
const npmrcContent = `
# Skip Cypress binary installation
cypress_skip_binary_install=1

# Optimize installation process
prefer-offline=true
fund=false
audit=false
loglevel=error
progress=false

# Fast installation settings
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Retry and timeout settings
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
network-timeout=600000
`;

fs.writeFileSync(npmrcPath, npmrcContent.trim());
console.log('✅ Created optimized .npmrc file');

// Create a script for running installation with additional optimization
const installScriptPath = path.join(process.cwd(), 'scripts', 'install.js');
const installScriptContent = `
#!/usr/bin/env node

/**
 * Optimized installation script with fallbacks
 */

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔄 Setting up installation environment...');

// Set environment variables
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Function to run bun install with custom settings
function runInstall() {
  console.log('🔄 Running optimized installation...');
  
  const installProcess = spawn('bun', ['install', '--no-audit', '--prefer-offline'], {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  // Set a longer timeout (10 minutes)
  const timeout = setTimeout(() => {
    console.log('⚠️ Installation is taking too long, may need to retry...');
    // Don't kill the process, just warn
  }, 10 * 60 * 1000);
  
  installProcess.on('exit', (code) => {
    clearTimeout(timeout);
    if (code === 0) {
      console.log('✅ Installation completed successfully');
      process.exit(0);
    } else {
      console.log(\`❌ Installation failed with code \${code}\`);
      process.exit(1);
    }
  });
  
  installProcess.on('error', (err) => {
    clearTimeout(timeout);
    console.log(\`❌ Error running installation: \${err.message}\`);
    process.exit(1);
  });
}

runInstall();
`;

// Ensure scripts directory exists
if (!fs.existsSync(path.join(process.cwd(), 'scripts'))) {
  fs.mkdirSync(path.join(process.cwd(), 'scripts'));
}

// Write installation script
fs.writeFileSync(installScriptPath, installScriptContent.trim());
fs.chmodSync(installScriptPath, '755'); // Make executable
console.log('✅ Created optimized installation script');

console.log('✨ Installation optimization complete. Run "node scripts/install.js" to install dependencies.');
