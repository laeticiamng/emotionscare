
/**
 * Music Context Cleanup Script
 * 
 * This is a utility script that can be run to verify all music-related imports
 * are using the correct paths and unified context.
 * 
 * To use this script:
 * 1. Navigate to project root in terminal
 * 2. Run: node src/utils/musicCleanup.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Configuration
const SOURCE_DIR = path.resolve(__dirname, '..');
const CORRECT_MUSIC_IMPORT = "@/contexts/MusicContext";
const DEPRECATED_IMPORTS = [
  "@/contexts/music.tsx",
  "@/contexts/music",
  "@/contexts/music/MusicProvider",
  "@/integrations/music/MusicProvider",
  "@/providers/MusicProvider"
];

// File extensions to check
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Function to walk through directory and find TypeScript/React files
async function findFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...await findFiles(fullPath));
    } else if (FILE_EXTENSIONS.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Check if file contains deprecated music imports
async function checkFile(filePath) {
  try {
    const content = await readFileAsync(filePath, 'utf8');
    const lines = content.split('\n');
    let hasDeprecatedImports = false;
    
    const updatedLines = lines.map(line => {
      // Check for import statements with deprecated paths
      if (line.includes('import') && line.includes('Music') && 
          DEPRECATED_IMPORTS.some(dep => line.includes(dep))) {
        hasDeprecatedImports = true;
        
        // Log the deprecated import
        console.log(`[DEPRECATED IMPORT] ${filePath}:`);
        console.log(`  ${line.trim()}`);
        
        // Replace with correct import
        if (line.includes('useMusic')) {
          return line.replace(/from ['"]([^'"]+)['"]/g, `from '${CORRECT_MUSIC_IMPORT}'`);
        } else if (line.includes('MusicProvider') || line.includes('MusicContext')) {
          return line.replace(/from ['"]([^'"]+)['"]/g, `from '${CORRECT_MUSIC_IMPORT}'`);
        }
      }
      return line;
    });
    
    if (hasDeprecatedImports) {
      // Suggest fixed code but don't write to file
      console.log('[SUGGESTED FIX]');
      console.log(updatedLines.join('\n'));
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🔍 Scanning project for deprecated music imports...');
  
  const files = await findFiles(SOURCE_DIR);
  let deprecatedImportsCount = 0;
  
  for (const file of files) {
    const hasDeprecated = await checkFile(file);
    if (hasDeprecated) {
      deprecatedImportsCount++;
    }
  }
  
  console.log('===== SCAN COMPLETE =====');
  if (deprecatedImportsCount === 0) {
    console.log('✅ All good! No deprecated music imports found.');
  } else {
    console.log(`⚠️  Found ${deprecatedImportsCount} files with deprecated music imports.`);
    console.log('Please update these imports to use the official MusicContext:');
    console.log(`import { useMusic } from '${CORRECT_MUSIC_IMPORT}';`);
  }
}

// Run the script if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { findFiles, checkFile };
