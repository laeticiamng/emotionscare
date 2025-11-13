# Guide de Migration Audio vers Supabase Storage

## ✅ Phase 1 & 2 Complétées

### Sécurité (/app/music)
- ✅ Route protégée avec `guard: true`
- ✅ Tables `music_favorites` et `music_history` créées avec RLS
- ✅ Bucket Supabase Storage `music-tracks` configuré
- ✅ Policies RLS pour `storage.objects`

### Types consolidés
- ✅ `src/types/music.ts` comme source unique de vérité
- ✅ Suppression des doublons dans `services/` et `contexts/`
- ✅ Imports mis à jour dans tout le codebase

### Services créés
- ✅ `favorites-service.ts` - Gestion favoris avec DB
- ✅ `history-service.ts` - Historique d'écoute
- ✅ `storage-service.ts` - Upload/download Supabase Storage

### Hooks créés
- ✅ `useMusicFavorites` - Hook avec sync DB automatique
- ✅ `useMusicPlayback` - Hook avec tracking historique automatique

### Composants mis à jour
- ✅ `B2CMusicEnhanced.tsx` - Intégration `useMusicFavorites`
- ✅ `MusicTherapyCard.tsx` - Affichage favoris dashboard
- ✅ `AdaptiveMusicPage.tsx` - Gestion favoris corrigée

---

## 🎵 Migration des Fichiers Audio

### Option 1: Script automatisé (Recommandé)

```bash
# 1. Ajouter la service_role key dans .env
echo "SUPABASE_SERVICE_KEY=your_service_role_key" >> .env

# 2. Exécuter le script d'upload
npx tsx scripts/upload-audio-samples.ts
```

Le script va:
- Télécharger 5 fichiers audio libres de droits (Free Music Archive)
- Les uploader dans `music-tracks/public/`
- Enregistrer les métadonnées dans `music_uploads`
- Nettoyer les fichiers temporaires

### Option 2: Upload manuel

Via Dashboard Supabase:
1. Aller dans Storage > `music-tracks`
2. Créer le dossier `public/`
3. Uploader vos fichiers MP3 (max 50MB chacun)

### Utilisation des URLs Supabase

```typescript
import { getPublicMusicUrl } from '@/services/music/storage-service';

// Obtenir l'URL publique d'un fichier
const url = await getPublicMusicUrl('ambient-soft.mp3');

// Exemple avec un track
const track: MusicTrack = {
  id: 'track-1',
  title: 'Ambiance Douce',
  artist: 'Studio EmotionsCare',
  url: await getPublicMusicUrl('ambient-soft.mp3'),
  audioUrl: await getPublicMusicUrl('ambient-soft.mp3'),
  duration: 180
};
```

### Mise à jour B2CMusicEnhanced.tsx

Remplacer les URLs SoundHelix par les URLs Supabase:

```typescript
// Avant
url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

// Après
url: await getPublicMusicUrl('ambient-soft.mp3')
```

---

## 🧪 Tests E2E

Suite de tests créée: `tests/e2e/app-music-auth-flow.spec.ts`

### Tests implémentés

#### Authentication Guards
✅ Redirection vers `/login` si non authentifié  
✅ Accès à `/app/music` si authentifié  

#### Favoris
✅ Affichage des boutons favoris  
✅ Ajout d'un track aux favoris  
✅ Suppression d'un track des favoris  

#### Historique
✅ Lecture d'un track avec sauvegarde historique  

#### RLS Isolation
✅ Les favoris d'un user ne sont pas visibles par un autre  
✅ Test avec 2 contextes browser différents  

#### Performance
✅ Chargement page < 3 secondes  
✅ Présence de loaders pendant chargement  

### Exécuter les tests

```bash
# Tous les tests /app/music
npm run test:e2e tests/e2e/app-music-auth-flow.spec.ts

# Mode debug
npm run test:e2e -- --debug tests/e2e/app-music-auth-flow.spec.ts

# Mode headed (voir le browser)
npm run test:e2e -- --headed tests/e2e/app-music-auth-flow.spec.ts
```

---

## 📊 Vérification RLS

Vérifier que les policies sont actives:

```bash
npm run supabase:linter
```

Les tables suivantes doivent avoir RLS activé:
- ✅ `music_favorites`
- ✅ `music_history`
- ✅ `music_uploads`
- ✅ `storage.objects` (pour bucket `music-tracks`)

---

## 🚀 Prochaines Étapes

### Phase 3: Réorganisation Composants
- [ ] Restructurer `/components/music/` (56 composants)
- [ ] Identifier et supprimer doublons (ex: EmotionMusicGenerator x3)
- [ ] Créer sous-dossiers `/core`, `/generators`, `/players`, `/visualization`

### Phase 4: Implémentation Suno
- [ ] Créer edge function `generate-music-suno`
- [ ] Connecter `useMusicGeneration` à l'edge function
- [ ] Implémenter queue async avec notifications temps réel
- [ ] Stocker résultats dans Supabase

### Phase 5: Tests & Documentation
- [ ] Tests unitaires pour tous les hooks music
- [ ] Tests d'intégration player
- [ ] Documentation Storybook pour tous les composants
- [ ] Tests E2E parcours complets

---

## 📝 Notes

### Pourquoi Supabase Storage ?

1. **Contrôle total**: URLs signed, analytics, gestion lifecycle
2. **Performance**: CDN Cloudflare intégré
3. **Sécurité**: RLS policies, signed URLs avec expiration
4. **Scalabilité**: Pas de limite de bande passante

### Fichiers audio supportés

- MP3 (recommandé): Meilleure compatibilité
- WAV: Qualité max mais fichiers lourds
- OGG: Bon compromis qualité/poids
- M4A: Support limité navigateurs

### Optimisation audio

Pour réduire la taille des fichiers:

```bash
# Convertir en MP3 128kbps (bon pour streaming)
ffmpeg -i input.wav -b:a 128k output.mp3

# Convertir en MP3 256kbps (haute qualité)
ffmpeg -i input.wav -b:a 256k output.mp3
```

---

**Documentation complète**: Voir `ANALYSE_APP_MUSIC.md` pour l'analyse détaillée.
