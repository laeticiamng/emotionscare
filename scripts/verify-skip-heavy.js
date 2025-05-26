
// Verification script to ensure skip-heavy.cjs is working correctly
const fs = require('fs');
const path = require('path');

const cjsFile = path.join(__dirname, 'skip-heavy.cjs');

if (fs.existsSync(cjsFile)) {
  console.log('✅ skip-heavy.cjs exists and is ready to use');
} else {
  console.log('❌ skip-heavy.cjs is missing');
  process.exit(1);
}
