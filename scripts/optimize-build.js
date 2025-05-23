
#!/usr/bin/env node

/**
 * This script optimizes the build process by setting environment variables
 * that speed up installations and builds, particularly for CI environments
 */

// Set environment variables that help reduce build time
process.env.CYPRESS_INSTALL_BINARY = '0';
process.env.CYPRESS_SKIP_BINARY_INSTALL = '1';
process.env.HUSKY_SKIP_INSTALL = '1';
process.env.PUPPETEER_SKIP_DOWNLOAD = '1';

console.log('🚀 Build optimization settings applied');
console.log('- Cypress binary download skipped');
console.log('- Husky install skipped');
console.log('- Puppeteer download skipped');

// Exit with success
process.exit(0);
