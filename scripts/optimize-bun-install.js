
#!/usr/bin/env node

/**
 * This script optimizes installation by setting environment variables
 * and flags that significantly reduce installation time
 * with multiple fallback strategies
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
  cyan: '\x1b[36m',
};

console.log(`${colors.blue}🚀 Starting optimized installation process${colors.reset}`);

// Verify .npmrc exists and has necessary settings
function ensureNpmrcSettings() {
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

// Set environment variables that help reduce installation time
function setOptimalEnvironmentVariables() {
  process.env.CYPRESS_INSTALL_BINARY = '0';
  process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
  process.env.HUSKY_SKIP_INSTALL = '1';
  process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';

  console.log(`${colors.cyan}🔧 Environment optimizations applied:${colors.reset}`);
  console.log('- Cypress binary download skipped');
  console.log('- Husky install skipped');
  console.log('- Puppeteer download skipped');
  console.log('- Node memory increased to 4GB');
}

// Create a simple .babelrc file to optimize builds if it doesn't exist
function ensureBabelrc() {
  const babelrcPath = path.join(process.cwd(), '.babelrc');
  if (!fs.existsSync(babelrcPath)) {
    fs.writeFileSync(babelrcPath, JSON.stringify({
      "presets": [
        ["@babel/preset-env", { "loose": true }],
        ["@babel/preset-react", { "runtime": "automatic" }]
      ]
    }, null, 2));
    console.log(`${colors.green}✅ Created optimized .babelrc configuration${colors.reset}`);
  }
}

// Create a simple .browserslistrc file to reduce transpilation overhead
function ensureBrowserslistrc() {
  const browserslistrcPath = path.join(process.cwd(), '.browserslistrc');
  if (!fs.existsSync(browserslistrcPath)) {
    fs.writeFileSync(browserslistrcPath, `
# Focus on modern browsers to reduce transpilation overhead
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
not IE 11
not dead
    `);
    console.log(`${colors.green}✅ Created optimized .browserslistrc configuration${colors.reset}`);
  }
}

// Try installation with different package managers and options
function tryInstall() {
  const maxRetries = 3;
  const installOptions = [
    { cmd: 'bun', args: ['install', '--no-summary', '--no-progress', '--no-audit', '--prefer-offline', '--ignore-optional'] },
    { cmd: 'bun', args: ['install', '--frozen-lockfile', '--no-summary', '--no-progress'] },
    { cmd: 'npm', args: ['ci', '--prefer-offline', '--no-audit', '--no-fund', '--loglevel=error'] },
    { cmd: 'npm', args: ['install', '--prefer-offline', '--no-audit', '--no-fund', '--legacy-peer-deps'] }
  ];

  for (let option of installOptions) {
    console.log(`\n${colors.blue}📦 Trying installation with: ${option.cmd} ${option.args.join(' ')}${colors.reset}`);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`${colors.yellow}🔄 Attempt ${attempt} of ${maxRetries}${colors.reset}`);
        
        execSync(`${option.cmd} ${option.args.join(' ')}`, { 
          stdio: 'inherit', 
          timeout: 300000 + (attempt * 60000), // Increase timeout with each retry
          env: {
            ...process.env,
            NODE_OPTIONS: '--max-old-space-size=4096'
          }
        });
        
        console.log(`${colors.green}✅ Installation succeeded!${colors.reset}`);
        return true;
      } catch (error) {
        console.error(`${colors.red}❌ Installation attempt ${attempt} failed with ${option.cmd}:${colors.reset}`, error.message);
        
        if (attempt === maxRetries) {
          console.log(`${colors.yellow}⚠️ All attempts with ${option.cmd} failed, trying next method...${colors.reset}`);
        }
      }
    }
  }
  
  console.error(`${colors.red}💥 All installation methods failed!${colors.reset}`);
  return false;
}

// Main function
function main() {
  try {
    // Setup optimal environment
    ensureNpmrcSettings();
    setOptimalEnvironmentVariables();
    ensureBabelrc();
    ensureBrowserslistrc();
    
    // Attempt installation
    const success = tryInstall();
    
    if (success) {
      console.log(`${colors.green}🎉 Installation completed successfully!${colors.reset}`);
      process.exit(0);
    } else {
      console.error(`${colors.red}💥 Installation process failed after all attempts.${colors.reset}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red}💥 Unexpected error during installation:${colors.reset}`, error);
    process.exit(1);
  }
}

// Execute main function
main();
