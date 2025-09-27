
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting comprehensive front-end audit...\n');

// 1. Ensure build works
console.log('📦 Checking build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// 2. Start preview server
console.log('🚀 Starting preview server...');
const server = execSync('npm run preview &', { stdio: 'pipe' });

// 3. Create audit reports directory
const reportsDir = './reports/audit';
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

console.log('📊 Audit reports will be generated in:', reportsDir);
console.log('\n🎯 Ready for manual testing and tool execution');
console.log('Next steps:');
console.log('1. Run: npx lighthouse http://localhost:4173 --output=html --output-path=./reports/audit/lighthouse.html');
console.log('2. Run: npm run test:e2e');
console.log('3. Check all routes manually');
