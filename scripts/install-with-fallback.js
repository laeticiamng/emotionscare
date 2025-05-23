
#!/usr/bin/env node

/**
 * Resilient installation script with multiple fallback strategies
 * This script attempts different package managers and installation methods
 * if the primary method fails due to timeouts or other issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.blue}📦 Starting resilient installation process${colors.reset}`);

// Set environment variables to skip heavy downloads
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Ensure .npmrc has proper settings
function ensureNpmConfig() {
  console.log(`${colors.cyan}🔧 Ensuring optimal npm configuration${colors.reset}`);
  const npmrcPath = path.join(process.cwd(), '.npmrc');
  
  const requiredSettings = {
    'cypress_skip_binary_install': '1',
    'prefer-offline': 'true',
    'fund': 'false',
    'audit': 'false',
    'loglevel': 'error',
    'progress': 'false',
    'legacy-peer-deps': 'true',
    'auto-install-peers': 'true',
    'strict-peer-dependencies': 'false',
    'fetch-retries': '5',
    'fetch-retry-mintimeout': '20000',
    'fetch-retry-maxtimeout': '120000',
    'network-timeout': '300000'
  };
  
  let npmrcContent = '';
  if (fs.existsSync(npmrcPath)) {
    npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
  }
  
  let modified = false;
  
  // Add missing settings
  for (const [key, value] of Object.entries(requiredSettings)) {
    if (!npmrcContent.includes(`${key}=`)) {
      npmrcContent += `\n${key}=${value}`;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(npmrcPath, npmrcContent.trim());
    console.log(`${colors.green}✅ Updated .npmrc with optimal settings${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ .npmrc already has optimal settings${colors.reset}`);
  }
}

// Installation strategies in order of preference
const installationStrategies = [
  {
    name: 'Bun with chunked install',
    command: 'bun install --no-summary --no-progress --no-audit',
    timeout: 180000, // 3 minutes
  },
  {
    name: 'Bun with frozen lockfile',
    command: 'bun install --frozen-lockfile --no-summary --no-progress',
    timeout: 180000,
  },
  {
    name: 'NPM with minimal install',
    command: 'npm ci --prefer-offline --no-audit --no-fund --loglevel=error',
    timeout: 240000, // 4 minutes
  },
  {
    name: 'NPM with legacy peer deps',
    command: 'npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps',
    timeout: 300000, // 5 minutes
  },
  {
    name: 'NPM with forced reinstall',
    command: 'npm ci --force --no-audit --no-fund',
    timeout: 360000, // 6 minutes
  }
];

// Prepare the environment
ensureNpmConfig();

// Try installation strategies one by one until one succeeds
async function tryInstallStrategies() {
  for (let i = 0; i < installationStrategies.length; i++) {
    const strategy = installationStrategies[i];
    console.log(`\n${colors.magenta}🔄 Attempt ${i + 1}/${installationStrategies.length}: ${strategy.name}${colors.reset}`);
    console.log(`${colors.cyan}$ ${strategy.command}${colors.reset}`);
    
    try {
      execSync(strategy.command, {
        stdio: 'inherit',
        timeout: strategy.timeout,
        env: {
          ...process.env,
          NODE_OPTIONS: '--max-old-space-size=4096',
        },
      });
      
      console.log(`\n${colors.green}✅ Installation succeeded using ${strategy.name}${colors.reset}`);
      return true;
    } catch (error) {
      console.error(`\n${colors.red}❌ Installation failed using ${strategy.name}:${colors.reset}`);
      console.error(`${colors.yellow}${error.message}${colors.reset}`);
      
      if (i < installationStrategies.length - 1) {
        console.log(`\n${colors.blue}↪ Trying next installation method...${colors.reset}`);
      }
    }
  }
  
  console.error(`\n${colors.red}💥 All installation strategies failed!${colors.reset}`);
  return false;
}

// Check if node_modules exists and has content
function checkNodeModules() {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    try {
      const dirs = fs.readdirSync(nodeModulesPath);
      // If node_modules has content (more than just .bin and .cache directories)
      const significantDirs = dirs.filter(dir => dir !== '.bin' && dir !== '.cache');
      if (significantDirs.length > 0) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

// Main execution
async function main() {
  // Check if node_modules already exists with content
  if (checkNodeModules()) {
    console.log(`${colors.green}✅ node_modules already exists and seems to have content.${colors.reset}`);
    console.log(`${colors.blue}📝 If you're having issues, try running with the --force flag to reinstall dependencies.${colors.reset}`);
    
    // If we're not forced to reinstall, exit successfully
    if (!process.argv.includes('--force')) {
      return 0;
    }
    console.log(`${colors.magenta}🔄 --force flag detected, reinstalling dependencies...${colors.reset}`);
  }
  
  const success = await tryInstallStrategies();
  return success ? 0 : 1;
}

// Run the main function and exit with appropriate code
main()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error(`${colors.red}💥 Unexpected error:${colors.reset}`, error);
    process.exit(1);
  });
