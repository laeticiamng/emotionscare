
#!/usr/bin/env node

/**
 * Startup validation script to ensure all critical dependencies are working
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Validating startup environment...');

// Check if critical files exist
const criticalFiles = [
  'src/main.tsx',
  'src/App.tsx',
  'index.html',
  'vite.config.ts',
  'package.json'
];

const missingFiles = criticalFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Critical files missing:', missingFiles);
  process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 node_modules not found - dependencies need to be installed');
  process.exit(1);
}

// Check if vite is available
try {
  const vitePath = path.join('node_modules', '.bin', 'vite');
  if (!fs.existsSync(vitePath)) {
    console.error('❌ Vite binary not found in node_modules/.bin/');
    console.log('💡 Try running: npm install vite@latest');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error checking Vite availability:', error.message);
  process.exit(1);
}

// Validate TypeScript configuration
try {
  if (fs.existsSync('tsconfig.json')) {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (!tsconfig.compilerOptions) {
      console.warn('⚠️ tsconfig.json missing compilerOptions');
    }
  }
} catch (error) {
  console.warn('⚠️ Error reading tsconfig.json:', error.message);
}

console.log('✅ Startup validation passed');
console.log('🎉 Environment is ready for development');
