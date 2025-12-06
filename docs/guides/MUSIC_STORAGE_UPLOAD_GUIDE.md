# 📦 Guide: Upload des fichiers audio vers Supabase Storage

**Date:** 2025-11-13  
**Bucket:** `music-tracks`  
**Dossier:** `public/`

---

## 🎯 Objectif

Migrer les 5 fichiers audio de test de SoundHelix vers Supabase Storage pour :
- ✅ Contrôle total sur les fichiers
- ✅ URLs sécurisées et fiables
- ✅ Pas de dépendance externe
- ✅ Performance optimisée (CDN Supabase)

---

## 📋 Étapes d'upload

### Option 1 : Via Dashboard Supabase (Recommandé)

1. **Ouvrir le Dashboard Supabase**
   ```
   https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]
   ```

2. **Naviguer vers Storage**
   - Cliquer sur "Storage" dans le menu latéral
   - Sélectionner le bucket `music-tracks`

3. **Créer le dossier `public`**
   - Cliquer sur "New folder"
   - Nom: `public`
   - Confirmer

4. **Uploader les fichiers**
   
   Vous pouvez :
   - **Télécharger des fichiers de test gratuits** depuis ces sources :
     - [Free Music Archive](https://freemusicarchive.org) (CC BY)
     - [Incompetech](https://incompetech.com/music/royalty-free/) (Kevin MacLeod)
     - [YouTube Audio Library](https://www.youtube.com/audiolibrary/music) (Libre de droits)
   
   - **Ou créer vos propres morceaux** avec des outils IA :
     - [Suno AI](https://suno.ai) (génération musicale)
     - [Soundraw](https://soundraw.io) (génération personnalisée)
   
   - **Noms de fichiers attendus:**
     ```
     serenite-fluide.mp3      (Track 1 - Calme)
     energie-vibrante.mp3     (Track 2 - Énergique)
     focus-mental.mp3         (Track 3 - Focus)
     guerison-douce.mp3       (Track 4 - Guérison)
     creative-spark.mp3       (Track 5 - Créatif)
     ```
   
   - **Spécifications techniques:**
     - Format: MP3 (128-320 kbps)
     - Durée: 2-5 minutes par track
     - Taille max: 50 MB par fichier
     - Sample rate: 44.1 kHz ou 48 kHz

5. **Uploader**
   - Drag & drop les 5 fichiers dans le dossier `public/`
   - Ou cliquer "Upload files" et sélectionner

6. **Vérifier les URLs**
   - Cliquer sur chaque fichier
   - Copier l'URL publique
   - Format: `https://[PROJECT_ID].supabase.co/storage/v1/object/public/music-tracks/public/[filename].mp3`

---

### Option 2 : Via Supabase CLI

```bash
# 1. Installer Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link au projet
supabase link --project-ref [YOUR_PROJECT_ID]

# 4. Upload des fichiers
supabase storage upload music-tracks/public/serenite-fluide.mp3 ./audio/serenite-fluide.mp3
supabase storage upload music-tracks/public/energie-vibrante.mp3 ./audio/energie-vibrante.mp3
supabase storage upload music-tracks/public/focus-mental.mp3 ./audio/focus-mental.mp3
supabase storage upload music-tracks/public/guerison-douce.mp3 ./audio/guerison-douce.mp3
supabase storage upload music-tracks/public/creative-spark.mp3 ./audio/creative-spark.mp3

# 5. Lister les fichiers
supabase storage list music-tracks/public
```

---

### Option 3 : Via Script Node.js

Créer un script `scripts/upload-music.js` :

```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const files = [
  'serenite-fluide.mp3',
  'energie-vibrante.mp3',
  'focus-mental.mp3',
  'guerison-douce.mp3',
  'creative-spark.mp3',
];

async function uploadFiles() {
  for (const filename of files) {
    const filePath = path.join(__dirname, '../audio', filename);
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
      .from('music-tracks')
      .upload(`public/${filename}`, fileBuffer, {
        contentType: 'audio/mpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error(`❌ Error uploading ${filename}:`, error);
    } else {
      console.log(`✅ Uploaded: ${filename}`);
      console.log(`   Path: ${data.path}`);
    }
  }
}

uploadFiles();
```

Exécuter :
```bash
node scripts/upload-music.js
```

---

## 🔗 URLs générées

Après upload, les URLs seront :

```typescript
const SUPABASE_MUSIC_URLS = {
  'vinyl-1': 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/music-tracks/public/serenite-fluide.mp3',
  'vinyl-2': 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/music-tracks/public/energie-vibrante.mp3',
  'vinyl-3': 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/music-tracks/public/focus-mental.mp3',
  'vinyl-4': 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/music-tracks/public/guerison-douce.mp3',
  'vinyl-5': 'https://[PROJECT_ID].supabase.co/storage/v1/object/public/music-tracks/public/creative-spark.mp3',
};
```

---

## ✅ Vérification

Tester les URLs dans le navigateur :
```
https://[PROJECT_ID].supabase.co/storage/v1/object/public/music-tracks/public/serenite-fluide.mp3
```

Si ça fonctionne :
- ✅ Le fichier se télécharge ou se joue
- ✅ Pas d'erreur CORS
- ✅ Pas d'erreur 404

---

## 🔄 Mise à jour du code

Une fois les fichiers uploadés, mettre à jour `src/pages/B2CMusicEnhanced.tsx` :

```typescript
import { getPublicMusicUrl } from '@/services/music/storage-service';

const vinylTracks: VinylTrack[] = [
  {
    id: 'vinyl-1',
    title: 'Sérénité Fluide',
    artist: 'Studio EmotionsCare',
    duration: 180,
    category: 'doux',
    mood: 'Calme océanique',
    color: 'from-blue-500 to-cyan-400',
    vinylColor: 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200',
    description: 'Ambiance douce et apaisante',
    url: getPublicMusicUrl('serenite-fluide.mp3'),
    audioUrl: getPublicMusicUrl('serenite-fluide.mp3'),
    waveform: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2),
  },
  // ... répéter pour les 4 autres tracks
];
```

---

## 🚨 Troubleshooting

### Erreur : "Bucket not found"
```bash
# Vérifier que le bucket existe
supabase storage list
```

Si absent, re-run la migration :
```bash
supabase migration up
```

### Erreur : "Policy violation"
Vérifier que les policies permettent l'accès public :
```sql
SELECT * FROM storage.policies WHERE bucket_id = 'music-tracks';
```

Policy requise :
```sql
CREATE POLICY "Public music files are accessible to all"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'music-tracks'
  AND (storage.foldername(name))[1] = 'public'
);
```

### Erreur : "File too large"
Vérifier la limite du bucket :
```sql
SELECT file_size_limit FROM storage.buckets WHERE id = 'music-tracks';
-- Doit être 52428800 (50 MB)
```

---

## 📝 Prochaines étapes

Après upload réussi :

1. ✅ Tester la lecture dans `/app/music`
2. ✅ Vérifier les performances (temps de chargement)
3. ✅ Valider sur mobile et desktop
4. ✅ Configurer le CDN Cloudflare (optionnel, pour optimisation)

---

**Besoin d'aide ?** Consulte la [doc Supabase Storage](https://supabase.com/docs/guides/storage)
