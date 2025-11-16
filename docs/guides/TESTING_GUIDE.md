# Guide de Test - Migration URLs Audio

## 🧪 Tests Locaux

### 1. Tester le chargement des URLs

#### Étape 1: Ouvrir /app/music
```bash
# Dans votre navigateur
https://localhost:5173/app/music
# OU l'URL de votre environnement de dev
```

#### Étape 2: Ouvrir la Console DevTools
- **Chrome/Edge**: `F12` ou `Ctrl+Shift+I`
- **Firefox**: `F12` ou `Ctrl+Shift+K`
- **Safari**: `Cmd+Option+I`

#### Étape 3: Vérifier les logs

Chercher dans la console:

**✅ Cas 1: Cache présent**
```
[MUSIC] Audio URLs loaded from cache { count: 4 }
```
→ URLs chargées instantanément depuis localStorage

**✅ Cas 2: Premier chargement (Supabase disponible)**
```
[MUSIC] Audio URLs loaded from Supabase Storage { success: 4, failed: 0 }
```
→ Toutes les URLs chargées depuis Supabase

**⚠️ Cas 3: Supabase non disponible**
```
[MUSIC] All Supabase URLs failed, using fallbacks { count: 4 }
```
→ Fallback automatique sur URLs SoundHelix

**⚠️ Cas 4: Mix Supabase + Fallback**
```
[MUSIC] Audio URLs loaded from Supabase Storage { success: 2, failed: 2 }
```
→ Certaines URLs Supabase, d'autres fallback

### 2. Tester la lecture des vinyles

#### Cliquer sur un vinyle
1. Cliquer sur "Lancer le vinyle"
2. Vérifier que le player audio apparaît
3. Vérifier que le son joue
4. **Regarder le badge** sur le vinyle:
   - **✨ Cloud** = Audio depuis Supabase Storage
   - **🔄 Backup** = Audio depuis SoundHelix (fallback)

#### Tooltip explicatif
1. Survoler le badge "Cloud" ou "Backup"
2. Lire l'explication détaillée:
   - **Cloud**: "Audio hébergé sur Supabase Storage - Optimisé, sécurisé, et sous contrôle total"
   - **Backup**: "Audio depuis serveur externe - Fallback automatique (Storage non disponible)"

### 3. Vider le cache et tester le fallback

#### Dans la console DevTools:

```javascript
// 1. Vider le cache audio URLs
localStorage.removeItem('music:audio-urls-cache')

// 2. Rafraîchir la page
location.reload()

// 3. Vérifier les logs
// Devrait voir: "Audio URLs loaded from Supabase Storage" ou "using fallbacks"
```

**OU utiliser la fonction helper:**

```javascript
// Dans la console
import { clearAudioUrlsCache } from '@/hooks/useAudioUrls';
clearAudioUrlsCache();
location.reload();
```

#### Test fallback complet (simuler Supabase offline)

1. **DevTools > Network tab**
2. Activer **Offline mode** ou **Throttling: Offline**
3. Vider le cache: `localStorage.removeItem('music:audio-urls-cache')`
4. Rafraîchir la page
5. **Résultat attendu**:
   - Console: "All Supabase URLs failed, using fallbacks"
   - Tous les badges montrent **🔄 Backup**
   - Les vinyles jouent quand même (URLs SoundHelix)

### 4. Vérifier le cache localStorage

```javascript
// Dans la console
const cache = JSON.parse(localStorage.getItem('music:audio-urls-cache'))
console.log('Cache audio URLs:', cache)

// Affiche:
// {
//   urls: {
//     'vinyl-1': 'https://yaincoxihiqdksxgrsrk.supabase.co/storage/v1/...',
//     'vinyl-2': 'https://yaincoxihiqdksxgrsrk.supabase.co/storage/v1/...',
//     ...
//   },
//   timestamp: 1699999999999
// }
```

**Vérifier l'expiration (24h):**
```javascript
const cache = JSON.parse(localStorage.getItem('music:audio-urls-cache'))
const age = Date.now() - cache.timestamp
const hoursOld = age / (1000 * 60 * 60)
console.log(`Cache age: ${hoursOld.toFixed(1)} hours`)
// Si > 24h, le cache sera recréé au prochain chargement
```

---

## 📤 Upload des Fichiers Audio

### Option 1: Script Automatisé (Recommandé)

#### Prérequis
```bash
# 1. Récupérer la service_role key
# Dashboard Supabase > Settings > API > service_role key (secret)
```

#### Configuration
```bash
# 2. Créer .env.local (NON committé)
echo "SUPABASE_SERVICE_KEY=your_service_role_key_here" >> .env.local
```

#### Exécution
```bash
# 3. Lancer le script
npx tsx scripts/upload-audio-samples.ts
```

#### Output attendu
```
🎵 Upload de fichiers audio de test vers Supabase Storage

📁 Bucket: music-tracks/public/
📊 Nombre de fichiers: 5

📥 Téléchargement: ambient-soft.mp3...
✅ Téléchargé: ambient-soft.mp3 (3.2 MB)
📤 Upload vers Supabase: ambient-soft.mp3...
✅ Uploadé: ambient-soft.mp3
✅ Métadonnées enregistrées: ambient-soft.mp3

... (répété pour chaque fichier)

🧹 Nettoyage des fichiers temporaires...
✅ Nettoyage terminé

==========================================================
📊 RÉSUMÉ
==========================================================
✅ Succès: 5/5
❌ Échecs: 0/5

🎉 Fichiers disponibles dans Supabase Storage:
   Bucket: music-tracks
   Chemin: public/

📝 Utilisez getPublicMusicUrl(filename) pour récupérer les URLs
```

### Option 2: Upload Manuel via Dashboard

1. **Aller dans Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/storage/buckets/music-tracks
   ```

2. **Naviguer dans le bucket**
   - Cliquer sur `music-tracks`
   - Créer le dossier `public/` s'il n'existe pas

3. **Uploader les fichiers**
   - Cliquer sur "Upload file"
   - Sélectionner vos fichiers MP3 (max 50MB chacun)
   - Noms attendus:
     - `ambient-soft.mp3`
     - `focus-clarity.mp3`
     - `creative-flow.mp3`
     - `healing-waves.mp3`
     - `energy-boost.mp3` (optionnel, vinyl-5 n'existe pas encore)

4. **Vérifier les URLs**
   - Cliquer sur un fichier
   - Copier l'URL publique
   - Tester dans le navigateur

### Option 3: Utiliser vos propres fichiers MP3

Si vous avez vos propres fichiers audio:

```bash
# Optimiser pour le streaming web
ffmpeg -i input.wav -b:a 128k -ar 44100 output.mp3
```

**Puis:**
- Upload via dashboard (Option 2)
- Ou modifier `scripts/upload-audio-samples.ts` pour pointer vers vos fichiers

---

## ✅ Checklist de Validation

### Tests Fonctionnels

- [ ] **Premier chargement**
  - Console affiche "Audio URLs loaded from Supabase Storage"
  - Badges montrent "✨ Cloud" si fichiers uploadés
  - Badges montrent "🔄 Backup" si pas de fichiers

- [ ] **Chargements suivants**
  - Console affiche "Audio URLs loaded from cache"
  - Pas de requête réseau vers Supabase
  - Badges corrects (Cloud ou Backup)

- [ ] **Cache expiré (>24h)**
  - Nouvelles requêtes Supabase
  - Cache recréé
  - Badges mis à jour

- [ ] **Fallback fonctionne**
  - Mode offline activé
  - Cache vidé
  - Console: "using fallbacks"
  - Tous les badges "🔄 Backup"
  - Vinyles jouent quand même

- [ ] **Lecture audio**
  - Clic sur vinyle lance la lecture
  - Player audio visible
  - Son joue correctement
  - Pas d'erreur CORS

- [ ] **Tooltip informatif**
  - Survol badge "Cloud" → tooltip avec infos Supabase
  - Survol badge "Backup" → tooltip avec infos fallback
  - Texte clair et informatif

### Tests Upload (si script exécuté)

- [ ] **Script s'exécute**
  - Télécharge 5 fichiers
  - Upload vers Supabase
  - Enregistre métadonnées
  - Nettoie fichiers temp

- [ ] **Fichiers présents dans Storage**
  - Dashboard > Storage > music-tracks > public/
  - 5 fichiers MP3 visibles
  - Taille correcte (~3-5 MB chacun)

- [ ] **URLs accessibles**
  - Ouvrir URL d'un fichier dans navigateur
  - Fichier se télécharge ou joue
  - Pas d'erreur 404

- [ ] **Métadonnées enregistrées**
  - Table `music_uploads` contient 5 entrées
  - Champs remplis: file_path, file_name, file_size, metadata

### Tests Badges UI

- [ ] **Badge Cloud (si Storage OK)**
  - Icône Sparkles (✨)
  - Texte "Cloud"
  - Variant "default" (fond colored)
  - Tooltip avec explication Supabase

- [ ] **Badge Backup (si fallback)**
  - Icône Clock (🔄)
  - Texte "Backup"
  - Variant "outline"
  - Tooltip avec explication fallback

- [ ] **Responsive**
  - Badges lisibles sur mobile
  - Tooltip s'affiche correctement
  - Pas de débordement

---

## 🐛 Troubleshooting

### Problème: Tous les badges sont "Backup"

**Cause**: Fichiers pas encore uploadés dans Supabase Storage

**Solution**:
1. Vérifier dashboard Storage: fichiers présents ?
2. Vider cache: `localStorage.removeItem('music:audio-urls-cache')`
3. Rafraîchir la page
4. Si toujours Backup → uploader les fichiers

### Problème: Erreur CORS en lecture

**Cause**: Configuration CORS du bucket

**Solution**:
```sql
-- Dans Supabase SQL Editor
UPDATE storage.buckets 
SET public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3']
WHERE id = 'music-tracks';
```

### Problème: Cache ne se crée pas

**Cause**: localStorage désactivé ou plein

**Solution**:
```javascript
// Tester localStorage
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('✅ localStorage OK');
} catch (e) {
  console.error('❌ localStorage indisponible:', e);
}
```

### Problème: Script upload échoue

**Causes possibles**:
1. Service role key invalide → Vérifier dans dashboard
2. URLs Free Music Archive changées → Utiliser vos propres fichiers
3. Bucket pas créé → Créer manuellement le bucket `music-tracks`

---

## 📊 Metrics à Surveiller

### Performance
- Temps de chargement URLs: < 500ms
- Taille cache localStorage: < 5KB
- Pas de requête réseau après mise en cache

### Fiabilité
- Taux de succès Supabase: visé 100%
- Fallback automatique si échec
- Aucune interruption de service

### UX
- Badges toujours visibles
- Tooltip informatif et clair
- Pas de confusion Cloud vs Backup

---

**Documentation complète**: Voir `AUDIO_URLS_REFACTORING.md` pour détails architecture.
