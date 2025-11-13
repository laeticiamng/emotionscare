/**
 * Script d'upload automatisé de fichiers audio de test
 * Télécharge des fichiers audio libres de droits et les upload dans Supabase Storage
 * 
 * Usage: tsx scripts/upload-audio-samples.ts
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!; // Nécessite service_role key

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   VITE_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('   SUPABASE_SERVICE_KEY:', !!SUPABASE_SERVICE_KEY);
  console.error('\nAjoutez SUPABASE_SERVICE_KEY dans .env avec la clé service_role');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Fichiers audio libres de droits depuis Free Music Archive
// URLs directes vers des MP3 de qualité thérapeutique
const AUDIO_SAMPLES = [
  {
    name: 'ambient-soft.mp3',
    title: 'Ambiance Douce',
    url: 'https://freemusicarchive.org/track/Kai_Engel_-_03_-_Nightfall/download',
    category: 'ambient',
    mood: 'calm'
  },
  {
    name: 'focus-clarity.mp3',
    title: 'Focus Mental',
    url: 'https://freemusicarchive.org/track/Kevin_MacLeod_-_Meditation_Impromptu_02/download',
    category: 'focus',
    mood: 'focused'
  },
  {
    name: 'healing-waves.mp3',
    title: 'Vagues Apaisantes',
    url: 'https://freemusicarchive.org/track/Chris_Zabriskie_-_12_-_Its_Always_Too_Late_To_Start_Over/download',
    category: 'healing',
    mood: 'peaceful'
  },
  {
    name: 'energy-boost.mp3',
    title: 'Énergie Positive',
    url: 'https://freemusicarchive.org/track/Kai_Engel_-_07_-_Downfall/download',
    category: 'energy',
    mood: 'energetic'
  },
  {
    name: 'creative-flow.mp3',
    title: 'Flux Créatif',
    url: 'https://freemusicarchive.org/track/Kevin_MacLeod_-_Cipher/download',
    category: 'creative',
    mood: 'inspired'
  }
];

const TEMP_DIR = path.join(__dirname, '../temp-audio');

async function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

async function downloadFile(url: string, filename: string): Promise<string> {
  const filepath = path.join(TEMP_DIR, filename);
  
  console.log(`📥 Téléchargement: ${filename}...`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    fs.writeFileSync(filepath, buffer as any);
    
    const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
    console.log(`✅ Téléchargé: ${filename} (${sizeMB} MB)`);
    
    return filepath;
  } catch (error) {
    console.error(`❌ Erreur téléchargement ${filename}:`, error);
    throw error;
  }
}

async function uploadToSupabase(filepath: string, filename: string, metadata: any): Promise<void> {
  console.log(`📤 Upload vers Supabase: ${filename}...`);
  
  try {
    const fileBuffer = fs.readFileSync(filepath);
    const storagePath = `public/${filename}`;
    
    // Upload le fichier - node-fetch buffer est compatible
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('music-tracks')
      .upload(storagePath, fileBuffer as any, {
        contentType: 'audio/mpeg',
        upsert: true
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    console.log(`✅ Uploadé: ${filename}`);
    
    // Enregistrer les métadonnées dans music_uploads
    const { error: metaError } = await supabase
      .from('music_uploads')
      .upsert({
        file_path: storagePath,
        file_name: filename,
        file_size: fileBuffer.length,
        mime_type: 'audio/mpeg',
        metadata: {
          title: metadata.title,
          category: metadata.category,
          mood: metadata.mood,
          source: 'Free Music Archive',
          license: 'CC BY'
        }
      });
    
    if (metaError) {
      console.warn(`⚠️ Erreur métadonnées pour ${filename}:`, metaError);
    } else {
      console.log(`✅ Métadonnées enregistrées: ${filename}`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur upload ${filename}:`, error);
    throw error;
  }
}

async function cleanup() {
  console.log('\n🧹 Nettoyage des fichiers temporaires...');
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
    console.log('✅ Nettoyage terminé');
  }
}

async function main() {
  console.log('🎵 Upload de fichiers audio de test vers Supabase Storage\n');
  console.log(`📁 Bucket: music-tracks/public/`);
  console.log(`📊 Nombre de fichiers: ${AUDIO_SAMPLES.length}\n`);
  
  try {
    await ensureTempDir();
    
    let successCount = 0;
    let failCount = 0;
    
    for (const sample of AUDIO_SAMPLES) {
      try {
        // Télécharger
        const filepath = await downloadFile(sample.url, sample.name);
        
        // Upload vers Supabase
        await uploadToSupabase(filepath, sample.name, {
          title: sample.title,
          category: sample.category,
          mood: sample.mood
        });
        
        successCount++;
        console.log('');
      } catch (error) {
        failCount++;
        console.error(`❌ Échec pour ${sample.name}\n`);
      }
    }
    
    // Nettoyage
    await cleanup();
    
    // Résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(60));
    console.log(`✅ Succès: ${successCount}/${AUDIO_SAMPLES.length}`);
    console.log(`❌ Échecs: ${failCount}/${AUDIO_SAMPLES.length}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Fichiers disponibles dans Supabase Storage:');
      console.log('   Bucket: music-tracks');
      console.log('   Chemin: public/');
      console.log('\n📝 Utilisez getPublicMusicUrl(filename) pour récupérer les URLs');
    }
    
    process.exit(failCount > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error);
    await cleanup();
    process.exit(1);
  }
}

main();
