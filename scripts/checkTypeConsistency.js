
/**
 * Type Consistency Checker
 * Usage: node scripts/checkTypeConsistency.js
 * 
 * This script scans the project for potential type inconsistencies:
 * - Property names that might be duplicates with different forms (e.g. coverUrl vs cover)
 * - Files that define their own versions of standard types
 * - Components that use properties not defined in the official types
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const TYPES_DIR = path.join(__dirname, '..', 'src', 'types');
const SRC_DIR = path.join(__dirname, '..', 'src');

// Property name variations to look for
const PROPERTY_VARIATIONS = [
  // Format: [standardName, [variations]]
  ['coverUrl', ['cover', 'coverImage', 'imageCover', 'imageUrl']],
  ['thumbnailUrl', ['thumbnail', 'thumbUrl', 'imageThumb']],
  ['audioUrl', ['audio', 'url', 'src', 'track_url']],
  ['conversationId', ['conversation_id', 'conversationID', 'convId']],
  ['userId', ['user_id', 'userID']],
  ['createdAt', ['created_at', 'createTime', 'dateCreated']],
  ['updatedAt', ['updated_at', 'updateTime', 'dateUpdated']],
];

// Find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Check interface/type definitions outside of types directory
function findDuplicateTypes() {
  console.log('🔍 Looking for duplicate type definitions...');
  
  const officialTypes = [];
  // Read official types
  const typeFiles = fs.readdirSync(TYPES_DIR)
    .filter(file => file.endsWith('.ts'));
  
  for (const file of typeFiles) {
    const content = fs.readFileSync(path.join(TYPES_DIR, file), 'utf-8');
    const matches = content.match(/(?:interface|type) ([A-Za-z0-9_]+)/g) || [];
    
    for (const match of matches) {
      const typeName = match.split(' ')[1];
      officialTypes.push(typeName);
    }
  }
  
  const duplicates = [];
  const allTsFiles = findTsFiles(SRC_DIR)
    .filter(file => !file.startsWith(TYPES_DIR)); // Exclude the types directory
  
  for (const file of allTsFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    
    for (const typeName of officialTypes) {
      // Look for interface or type definitions
      const regex = new RegExp(`(?:interface|type) ${typeName}(?:[<\\s{]|$)`, 'g');
      if (regex.test(content)) {
        duplicates.push({
          file: file.replace(process.cwd(), ''),
          typeName
        });
      }
    }
  }
  
  if (duplicates.length === 0) {
    console.log('✅ No duplicate type definitions found!');
  } else {
    console.log('⚠ Duplicate type definitions found!');
    for (const dup of duplicates) {
      console.log(`  - ${dup.typeName} in ${dup.file}`);
    }
  }
  
  return duplicates.length === 0;
}

// Check for property name variations
function findPropertyVariations() {
  console.log('\n🔍 Looking for inconsistent property names...');
  
  const issues = [];
  const allTsFiles = findTsFiles(SRC_DIR);
  
  for (const file of allTsFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    
    for (const [standard, variations] of PROPERTY_VARIATIONS) {
      for (const variation of variations) {
        // Look for property definitions or usages
        const regex = new RegExp(`[^a-zA-Z0-9_]${variation}(?:[?:]|\\s*=|\\s*\\})`, 'g');
        if (regex.test(content)) {
          issues.push({
            file: file.replace(process.cwd(), ''),
            standard,
            variation
          });
        }
      }
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ No property name inconsistencies found!');
  } else {
    console.log('⚠ Property name inconsistencies found!');
    const grouped = {};
    
    for (const issue of issues) {
      const key = `${issue.variation} → should be ${issue.standard}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(issue.file);
    }
    
    for (const [issue, files] of Object.entries(grouped)) {
      console.log(`  - ${issue} in ${files.length} files:`);
      for (const file of files.slice(0, 3)) {
        console.log(`    - ${file}`);
      }
      if (files.length > 3) {
        console.log(`    - ...and ${files.length - 3} more files`);
      }
    }
  }
  
  return issues.length === 0;
}

// Main function
function main() {
  console.log('🔧 Type Consistency Check');
  console.log('======================');
  
  const noDuplicates = findDuplicateTypes();
  const noVariations = findPropertyVariations();
  
  console.log('\n======================');
  if (noDuplicates && noVariations) {
    console.log('✅ All checks passed! The project has consistent types.');
  } else {
    console.log('⚠ Issues found in type definitions.');
    console.log('   See the details above for what needs to be fixed.');
  }
}

main();
