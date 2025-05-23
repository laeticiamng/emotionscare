
#!/usr/bin/env node

/**
 * Optimized installation script with timeout handling and fallbacks
 * This script addresses the ProcessIOError timeout issue with bun install
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized installation process...');

// Set environment variables to skip heavy dependencies
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Create optimized .npmrc if it doesn't exist or is incomplete
const npmrcPath = '.npmrc';
const npmrcContent = `
# Skip heavy binary installations
cypress_skip_binary_install=1
husky_skip_install=1
puppeteer_skip_download=1

# Optimize installation
prefer-offline=true
fund=false
audit=false
loglevel=error
progress=false

# Increase timeouts significantly
network-timeout=600000
fetch-retry-mintimeout=30000
fetch-retry-maxtimeout=180000
fetch-retries=5

# Peer dependency handling
legacy-peer-deps=true
auto-install-peers=true
strict-peer-dependencies=false
`.trim();

fs.writeFileSync(npmrcPath, npmrcContent);
console.log('✅ Created optimized .npmrc configuration');

// Function to run installation with timeout handling
function runInstallationWithTimeout(command, args, timeoutMs = 300000) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    const timeout = setTimeout(() => {
      console.log(`⚠️ Process timed out after ${timeoutMs / 1000}s, terminating...`);
      process.kill('SIGTERM');
      setTimeout(() => process.kill('SIGKILL'), 5000);
      reject(new Error(`Process timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);
    
    process.on('exit', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        console.log(`✅ ${command} completed successfully`);
        resolve();
      } else {
        console.log(`❌ ${command} failed with exit code ${code}`);
        reject(new Error(`Process failed with exit code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`❌ Error running ${command}: ${err.message}`);
      reject(err);
    });
  });
}

// Main installation function with fallbacks
async function install() {
  try {
    // Try bun install first with extended timeout
    try {
      await runInstallationWithTimeout('bun', ['install', '--no-save'], 300000);
      console.log('🎉 Installation completed successfully with bun!');
      return;
    } catch (bunError) {
      console.log('⚠️ Bun installation failed, trying npm...');
    }
    
    // Fallback to npm install
    try {
      await runInstallationWithTimeout('npm', ['install', '--prefer-offline', '--no-audit', '--no-fund'], 600000);
      console.log('🎉 Installation completed successfully with npm!');
      return;
    } catch (npmError) {
      console.log('⚠️ npm installation failed, trying yarn...');
    }
    
    // Final fallback to yarn
    await runInstallationWithTimeout('yarn', ['install', '--prefer-offline', '--silent'], 600000);
    console.log('🎉 Installation completed successfully with yarn!');
    
  } catch (error) {
    console.error('💥 All installation methods failed!');
    console.error('Error:', error.message);
    console.log('\n🔍 Troubleshooting suggestions:');
    console.log('1. Check your internet connection');
    console.log('2. Clear npm cache: npm cache clean --force');
    console.log('3. Try running: rm -rf node_modules && npm install');
    console.log('4. Check available disk space');
    
    process.exit(1);
  }
}

// Check system requirements
console.log('\n📊 System Information:');
console.log(`Node.js: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);

try {
  const memInfo = require('os');
  console.log(`Total Memory: ${Math.round(memInfo.totalmem() / 1024 / 1024 / 1024)}GB`);
  console.log(`Free Memory: ${Math.round(memInfo.freemem() / 1024 / 1024)}MB`);
} catch (e) {
  console.log('Could not retrieve memory information');
}

// Start installation
install();
