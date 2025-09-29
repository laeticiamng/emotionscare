
#!/usr/bin/env node

/**
 * This script checks for image references in the codebase
 * and ensures they are properly accessible for Vite build
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Checking image references in the project...');

// List of common image extensions
const IMAGE_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];

// Check if public/images directory exists
if (!fs.existsSync('public/images')) {
  fs.mkdirSync('public/images', { recursive: true });
  console.log('✅ Created public/images directory');
}

// Find all image imports in the codebase
glob('src/**/*.{js,jsx,ts,tsx,css}', (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    process.exit(1);
  }

  const imagePaths = new Set();
  const missingImages = [];

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Look for possible image references
    IMAGE_EXTENSIONS.forEach(ext => {
      const regex = new RegExp(`['"]/images/(.*?\\${ext})['"]`, 'g');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        const imagePath = match[1];
        imagePaths.add(`images/${imagePath}`);
        
        // Check if image exists in public directory
        if (!fs.existsSync(`public/images/${imagePath}`)) {
          missingImages.push({
            file,
            imagePath: `images/${imagePath}`
          });
        }
      }
    });
  });
  
  if (missingImages.length > 0) {
    console.log('⚠️ Found references to images that don\'t exist in public directory:');
    missingImages.forEach(({ file, imagePath }) => {
      console.log(`  - ${imagePath} (referenced in ${file})`);
    });
    
    console.log('\n💡 Tip: Make sure these images exist in the public directory or update the references.');
  } else if (imagePaths.size > 0) {
    console.log(`✅ All ${imagePaths.size} image references point to existing files.`);
  } else {
    console.log('ℹ️ No image references found in the codebase.');
  }
});
