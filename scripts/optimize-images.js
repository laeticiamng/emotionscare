#!/usr/bin/env node

/**
 * Script d'optimisation d'images - Alternative compatible à vite-plugin-imagemin
 * Phase 2 - Solution stable sans binaires natifs problématiques
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

console.log('🖼️ Optimisation des images - Phase 2\n');

const IMAGE_DIRS = ['public/images', 'src/assets', 'public'];
const OUTPUT_DIR = 'dist/images';

// Configuration d'optimisation
const SHARP_CONFIG = {
  jpeg: { quality: 85, progressive: true, mozjpeg: true },
  png: { quality: 90, compressionLevel: 9, progressive: true },
  webp: { quality: 85, effort: 6 },
  avif: { quality: 80, effort: 9 }
};

async function optimizeImage(inputPath, filename) {
  try {
    const ext = path.extname(filename).toLowerCase();
    const basename = path.basename(filename, ext);
    const outputPath = path.join(OUTPUT_DIR, basename);
    
    // Créer le dossier de sortie
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`📸 Processing: ${filename} (${metadata.width}x${metadata.height})`);
    
    // Optimisations selon le format original
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        // JPEG optimisé
        await image
          .jpeg(SHARP_CONFIG.jpeg)
          .toFile(`${outputPath}.jpg`);
        
        // Version WebP
        await image
          .webp(SHARP_CONFIG.webp)
          .toFile(`${outputPath}.webp`);
        
        console.log(`   ✅ Generated: ${basename}.jpg + ${basename}.webp`);
        break;
        
      case '.png':
        // PNG optimisé
        await image
          .png(SHARP_CONFIG.png)
          .toFile(`${outputPath}.png`);
        
        // Version WebP
        await image
          .webp(SHARP_CONFIG.webp)
          .toFile(`${outputPath}.webp`);
        
        // AVIF pour les images importantes
        if (metadata.width > 500 || metadata.height > 500) {
          await image
            .avif(SHARP_CONFIG.avif)
            .toFile(`${outputPath}.avif`);
          console.log(`   ✅ Generated: ${basename}.png + ${basename}.webp + ${basename}.avif`);
        } else {
          console.log(`   ✅ Generated: ${basename}.png + ${basename}.webp`);
        }
        break;
        
      case '.svg':
        // SVG - copie simple (optimisation SVG complexe)
        fs.copyFileSync(inputPath, `${outputPath}.svg`);
        console.log(`   ✅ Copied: ${basename}.svg`);
        break;
        
      default:
        console.log(`   ⚠️ Skipped: ${filename} (format non supporté)`);
    }
    
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
  }
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`📁 Directory ${dir} not found, skipping...`);
    return;
  }
  
  console.log(`📁 Processing directory: ${dir}`);
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    if (file.isDirectory()) {
      await processDirectory(path.join(dir, file.name));
    } else if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.svg'].includes(ext)) {
        await optimizeImage(path.join(dir, file.name), file.name);
      }
    }
  }
}

async function generateImageManifest() {
  const manifestPath = path.join(OUTPUT_DIR, 'images-manifest.json');
  const images = [];
  
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    
    // Grouper par nom de base
    const groups = {};
    files.forEach(file => {
      const ext = path.extname(file);
      const basename = path.basename(file, ext);
      
      if (!groups[basename]) {
        groups[basename] = [];
      }
      groups[basename].push({
        format: ext.slice(1),
        path: `/images/${file}`,
        size: fs.statSync(path.join(OUTPUT_DIR, file)).size
      });
    });
    
    Object.keys(groups).forEach(basename => {
      images.push({
        name: basename,
        formats: groups[basename]
      });
    });
  }
  
  fs.writeFileSync(manifestPath, JSON.stringify(images, null, 2));
  console.log(`📋 Generated manifest: ${images.length} image groups`);
  return images;
}

async function main() {
  const startTime = Date.now();
  
  // Traiter tous les dossiers d'images
  for (const dir of IMAGE_DIRS) {
    await processDirectory(dir);
  }
  
  // Générer le manifest
  const images = await generateImageManifest();
  
  const duration = Date.now() - startTime;
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 OPTIMISATION TERMINÉE');
  console.log('='.repeat(50));
  console.log(`⏱️ Durée: ${duration}ms`);
  console.log(`🖼️ Images traitées: ${images.length} groupes`);
  console.log(`📁 Dossier de sortie: ${OUTPUT_DIR}`);
  console.log(`📋 Manifest: images-manifest.json`);
  
  // Statistiques par format
  const stats = {};
  images.forEach(img => {
    img.formats.forEach(fmt => {
      if (!stats[fmt.format]) {
        stats[fmt.format] = { count: 0, totalSize: 0 };
      }
      stats[fmt.format].count++;
      stats[fmt.format].totalSize += fmt.size;
    });
  });
  
  console.log('\n📈 Statistiques par format:');
  Object.keys(stats).forEach(format => {
    const { count, totalSize } = stats[format];
    const avgSize = Math.round(totalSize / count / 1024);
    console.log(`   ${format.toUpperCase()}: ${count} fichiers, ${avgSize}KB moyen`);
  });
  
  console.log('\n🎯 Prochaines étapes:');
  console.log('   • Utiliser les images optimisées dans votre app');
  console.log('   • Implémenter le lazy loading et formats adaptatifs');
  console.log('   • Tester les gains de performance');
}

// Exécution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, processDirectory, generateImageManifest };