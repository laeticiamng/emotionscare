
#!/usr/bin/env node

/**
 * Resilient installation script with fallback mechanisms
 * - Tries bun install with longer timeout
 * - Falls back to npm install if bun fails
 * - Provides clear error messages and debugging info
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting resilient installer...');

// Check for .npmrc and create optimal settings if needed
if (!fs.existsSync('.npmrc')) {
  console.log('📝 Creating optimized .npmrc file...');
  const npmrcContent = `
# Optimize installation process
prefer-offline=true
fund=false
audit=false
save-exact=true
loglevel=error
progress=false

# Fast installation
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false

# Retry and timeout settings
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
network-timeout=300000
`;
  
  fs.writeFileSync('.npmrc', npmrcContent.trim());
  console.log('✅ Created optimized .npmrc');
}

// Set environment variables to optimize the installation
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';
console.log('📊 Set optimization environment variables');

// Try bun install first with a longer timeout
function tryBunInstall() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Attempting bun install...');
    
    const bunProcess = spawn('bun', ['install'], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // Set a longer timeout (3 minutes)
    const timeout = setTimeout(() => {
      console.log('⚠️ bun install is taking too long, killing process...');
      bunProcess.kill();
      reject(new Error('bun install timed out after 3 minutes'));
    }, 3 * 60 * 1000);
    
    bunProcess.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('✅ bun install completed successfully');
        resolve();
      } else {
        console.log(`❌ bun install failed with code ${code}`);
        reject(new Error(`bun install failed with code ${code}`));
      }
    });
    
    bunProcess.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`❌ Error executing bun: ${err.message}`);
      reject(err);
    });
  });
}

// Fallback to npm install if bun fails
function tryNpmInstall() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Falling back to npm install...');
    
    const npmProcess = spawn('npm', ['install', '--prefer-offline', '--no-audit', '--no-fund', '--legacy-peer-deps'], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // Set a longer timeout (5 minutes for npm)
    const timeout = setTimeout(() => {
      console.log('⚠️ npm install is taking too long, killing process...');
      npmProcess.kill();
      reject(new Error('npm install timed out after 5 minutes'));
    }, 5 * 60 * 1000);
    
    npmProcess.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log('✅ npm install completed successfully');
        resolve();
      } else {
        console.log(`❌ npm install failed with code ${code}`);
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
    
    npmProcess.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`❌ Error executing npm: ${err.message}`);
      reject(err);
    });
  });
}

// Try bun install, then npm install as fallback
async function install() {
  try {
    // Check if bun is available
    try {
      execSync('bun --version', { stdio: 'ignore' });
      await tryBunInstall();
    } catch (bunError) {
      console.log('⚠️ Bun installation failed or bun is not available.');
      await tryNpmInstall();
    }
    
    console.log('🎉 Installation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 All installation attempts failed!');
    console.error(error.message);
    
    // Provide diagnostic information
    console.log('\n🔍 Diagnostic information:');
    try {
      console.log('Node version:', process.version);
      console.log('Platform:', process.platform);
      console.log('Free memory:', Math.round(require('os').freemem() / 1024 / 1024) + 'MB');
      console.log('Network connectivity:', execSync('ping -c 1 registry.npmjs.org || ping -n 1 registry.npmjs.org').toString());
    } catch (e) {
      console.log('Could not get all diagnostic information');
    }
    
    process.exit(1);
  }
}

// Start the installation process
install();
