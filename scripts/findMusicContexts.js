
/**
 * Script to find all references to MusicContext in the project
 * Run with: node scripts/findMusicContexts.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files that are allowed to define or export a MusicContext
const OFFICIAL_FILES = [
  'src/contexts/MusicContext.tsx',
  'src/contexts/music/index.ts'
];

// Search terms to look for
const SEARCH_TERMS = [
  'MusicContext',
  'createContext.*Music',
  'music.*createContext',
  'useMusic',
  'MusicProvider',
  'audio.*context',
  'createContext.*audio'
];

// Find all TypeScript files in src directory
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check if a file contains music context definitions
function checkFileForMusicContext(filePath) {
  if (OFFICIAL_FILES.includes(filePath)) {
    return false; // Skip official files
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Look for context creation in the file
  const hasContext = content.includes('createContext') && 
    SEARCH_TERMS.some(term => content.includes(term));
  
  return hasContext;
}

// Main function
function findMusicContexts() {
  console.log('🎵 Searching for Music Context definitions...');
  
  const tsFiles = findTsFiles('src');
  const suspiciousFiles = [];
  
  tsFiles.forEach(file => {
    if (checkFileForMusicContext(file)) {
      suspiciousFiles.push(file);
    }
  });
  
  if (suspiciousFiles.length === 0) {
    console.log('✅ No duplicate Music Context definitions found!');
  } else {
    console.log('⚠️ Possible duplicate Music Context definitions found in:');
    suspiciousFiles.forEach(file => console.log(`  - ${file}`));
    console.log('\nPlease check these files and ensure they use the official MusicContext.');
  }
}

findMusicContexts();
