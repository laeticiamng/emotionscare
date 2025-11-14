/**
 * Bundle Size Statistics Script
 *
 * Analyzes the dist folder and provides detailed bundle size statistics
 * Run after build: npm run build && node scripts/bundle-stats.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const MAX_SIZE_MB = 0.5; // 500KB in MB (gzipped)
const WARN_SIZE_MB = 0.3; // 300KB warning threshold

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getFilesRecursive(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getFilesRecursive(filePath, fileList);
    } else {
      fileList.push({
        path: filePath,
        relativePath: path.relative(DIST_DIR, filePath),
        size: stat.size,
        ext: path.extname(file),
      });
    }
  });

  return fileList;
}

function getGzipSize(filePath) {
  try {
    const gzipOutput = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf-8' });
    return parseInt(gzipOutput.trim(), 10);
  } catch (error) {
    return 0;
  }
}

function analyzeBundle() {
  console.log(`\n${colors.bold}${colors.cyan}📦 Bundle Size Analysis${colors.reset}\n`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Check if dist exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`${colors.red}❌ Error: dist folder not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }

  const files = getFilesRecursive(DIST_DIR);

  // Group files by extension
  const filesByExt = files.reduce((acc, file) => {
    const ext = file.ext || 'other';
    if (!acc[ext]) acc[ext] = [];
    acc[ext].push(file);
    return acc;
  }, {});

  // Calculate totals
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  console.log(`${colors.bold}Total Files:${colors.reset} ${files.length}`);
  console.log(`${colors.bold}Total Size:${colors.reset} ${formatBytes(totalSize)}\n`);

  // JS files analysis
  console.log(`${colors.bold}${colors.magenta}JavaScript Files (.js)${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  const jsFiles = (filesByExt['.js'] || []).sort((a, b) => b.size - a.size);

  if (jsFiles.length > 0) {
    jsFiles.forEach((file, index) => {
      const gzipSize = getGzipSize(file.path);
      const gzipStr = gzipSize > 0 ? ` (${formatBytes(gzipSize)} gzipped)` : '';
      const sizeColor = file.size > 200000 ? colors.red : file.size > 100000 ? colors.yellow : colors.green;

      if (index < 10) { // Show top 10
        console.log(`  ${sizeColor}${formatBytes(file.size).padEnd(12)}${colors.reset} ${file.relativePath}${gzipStr}`);
      }
    });

    const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`\n  ${colors.bold}Total JS:${colors.reset} ${formatBytes(totalJsSize)}`);
  } else {
    console.log(`  ${colors.yellow}No JS files found${colors.reset}`);
  }

  // CSS files analysis
  console.log(`\n${colors.bold}${colors.magenta}CSS Files (.css)${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  const cssFiles = (filesByExt['.css'] || []).sort((a, b) => b.size - a.size);

  if (cssFiles.length > 0) {
    cssFiles.forEach(file => {
      const gzipSize = getGzipSize(file.path);
      const gzipStr = gzipSize > 0 ? ` (${formatBytes(gzipSize)} gzipped)` : '';
      console.log(`  ${colors.green}${formatBytes(file.size).padEnd(12)}${colors.reset} ${file.relativePath}${gzipStr}`);
    });

    const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`\n  ${colors.bold}Total CSS:${colors.reset} ${formatBytes(totalCssSize)}`);
  } else {
    console.log(`  ${colors.yellow}No CSS files found${colors.reset}`);
  }

  // Other files
  console.log(`\n${colors.bold}${colors.magenta}Other Files${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  Object.keys(filesByExt).forEach(ext => {
    if (ext !== '.js' && ext !== '.css') {
      const extFiles = filesByExt[ext];
      const extSize = extFiles.reduce((sum, file) => sum + file.size, 0);
      console.log(`  ${colors.cyan}${ext.padEnd(10)}${colors.reset} ${extFiles.length} files, ${formatBytes(extSize)}`);
    }
  });

  // Summary and recommendations
  console.log(`\n${colors.bold}${colors.cyan}Summary & Recommendations${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const largeJsFiles = jsFiles.filter(f => f.size > 200000);
  if (largeJsFiles.length > 0) {
    console.log(`${colors.red}⚠️  Warning: ${largeJsFiles.length} JS file(s) > 200KB${colors.reset}`);
    largeJsFiles.forEach(file => {
      console.log(`   - ${file.relativePath} (${formatBytes(file.size)})`);
    });
    console.log(`\n   ${colors.yellow}Recommendation: Consider code splitting or lazy loading${colors.reset}\n`);
  }

  // Check for duplicate dependencies
  const chunkNames = jsFiles.map(f => path.basename(f.relativePath, '.js'));
  const duplicates = chunkNames.filter((name, index) =>
    name.includes('vendor') && chunkNames.indexOf(name) !== index
  );

  if (duplicates.length > 0) {
    console.log(`${colors.yellow}⚠️  Potential duplicate chunks detected${colors.reset}\n`);
  }

  // Final verdict
  const totalJsSize = (filesByExt['.js'] || []).reduce((sum, file) => sum + file.size, 0);
  const totalJsSizeMB = totalJsSize / (1024 * 1024);

  console.log(`${colors.bold}Performance Score:${colors.reset}`);

  if (totalJsSizeMB > MAX_SIZE_MB) {
    console.log(`  ${colors.red}❌ FAIL${colors.reset} - Total JS size (${formatBytes(totalJsSize)}) exceeds ${MAX_SIZE_MB}MB limit`);
    console.log(`  ${colors.yellow}Action required: Optimize bundle size${colors.reset}\n`);
    process.exit(1);
  } else if (totalJsSizeMB > WARN_SIZE_MB) {
    console.log(`  ${colors.yellow}⚠️  WARNING${colors.reset} - Total JS size (${formatBytes(totalJsSize)}) is above recommended ${WARN_SIZE_MB}MB`);
    console.log(`  ${colors.yellow}Consider optimization${colors.reset}\n`);
  } else {
    console.log(`  ${colors.green}✅ PASS${colors.reset} - Total JS size (${formatBytes(totalJsSize)}) is within limits\n`);
  }

  // Recommendations
  console.log(`${colors.bold}Next Steps:${colors.reset}`);
  console.log(`  1. Run ${colors.cyan}npm run build:analyze${colors.reset} for detailed visualization`);
  console.log(`  2. Check ${colors.cyan}BUNDLE_SIZE_ANALYSIS_MUSIC.md${colors.reset} for optimization guide`);
  console.log(`  3. Implement lazy loading for large modules`);
  console.log(`  4. Optimize icon imports (use individual imports)\n`);
}

// Run analysis
try {
  analyzeBundle();
} catch (error) {
  console.error(`${colors.red}Error analyzing bundle:${colors.reset}`, error.message);
  process.exit(1);
}
