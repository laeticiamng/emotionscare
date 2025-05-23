
#!/usr/bin/env node

/**
 * This script optimizes CI environments by setting up caching,
 * environment variables, and installation optimizations
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Setting up CI environment optimizations...');

// Set environment variables for CI
process.env.CI = 'true';
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Create or update .npmrc for CI
const npmrcContent = `
# CI optimized npm settings
prefer-offline=true
fund=false
audit=false
save-exact=true
loglevel=error
progress=false
cypress_skip_binary_install=1
`;

fs.writeFileSync('.npmrc', npmrcContent);
console.log('📝 Created optimized .npmrc for CI');

// Update GitHub workflow file if it exists
const workflowPath = '.github/workflows/ci.yml';
if (fs.existsSync(workflowPath)) {
  let workflow = fs.readFileSync(workflowPath, 'utf8');
  
  // Add caching if not present
  if (!workflow.includes('cache:')) {
    const updatedWorkflow = workflow.replace(
      /steps:([\s\S]*?)(?:- name: Install deps)/,
      `steps:$1- name: Setup caching\n        uses: actions/cache@v3\n        with:\n          path: |\n            **/node_modules\n            ~/.npm\n            ~/.bun\n          key: \${{ runner.os }}-modules-\${{ hashFiles('**/bun.lockb') }}\n          restore-keys: |\n            \${{ runner.os }}-modules-\n\n      - name: Install deps`
    );
    
    fs.writeFileSync(workflowPath, updatedWorkflow);
    console.log('📝 Added caching to GitHub workflow');
  }
  
  // Update npm/bun commands to use optimized flags
  if (workflow.includes('npm ci')) {
    const updatedWorkflow = workflow.replace(
      /npm ci/g,
      'npm ci --prefer-offline --no-audit --no-fund'
    );
    fs.writeFileSync(workflowPath, updatedWorkflow);
    console.log('📝 Optimized npm commands in GitHub workflow');
  }
} else {
  console.log('ℹ️ No GitHub workflow file found at .github/workflows/ci.yml');
}

// Fix GitHub workflow file
if (!fs.existsSync('.github/workflows')) {
  fs.mkdirSync('.github/workflows', { recursive: true });
}

fs.writeFileSync('.github/workflows/ci.yml', `name: CI
on: [push, pull_request]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - name: Configure npm registry
        run: npm config set registry https://registry.npmmirror.com

      - name: Install deps
        run: npm ci --prefer-offline --no-audit --no-fund
      - name: Run tests
        run: npm test
`);

console.log('✅ CI environment optimizations complete');

// Exit with success
process.exit(0);
