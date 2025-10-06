# 🎵 Musique Émotionnelle - Guide de démarrage rapide

## 🚀 Démarrage en 3 étapes

### 1. Configurer les secrets Supabase

Rendez-vous sur le dashboard Supabase et ajoutez ces 3 secrets dans les Edge Functions :

```bash
OPENAI_API_KEY=sk-...        # OpenAI pour orchestration JSON
SUNO_API_KEY=...             # Suno pour génération musicale
SUNO_API_BASE=https://api.sunoapi.org
```

Optionnel (pour l'avenir) :
```bash
HUME_API_KEY=...             # Hume AI pour analyse temps réel
```

🔗 [Configurer les secrets](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/settings/functions)

### 2. Tester la génération

1. Connectez-vous à votre app
2. Allez sur `/app/emotion-music` ou `/emotion-music`
3. Saisissez vos émotions (ex: "Je me sens calme et serein")
4. Cliquez sur "Analyser et Générer"
5. Attendez ~30-40s → Streaming disponible
6. Attendez ~2-3min → Audio final prêt au téléchargement

### 3. Vérifier les logs

🔗 [Logs Edge Functions](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions)

Vérifiez notamment :
- `openai-structured-output` - Orchestration OK ?
- `suno-music-generation` - Génération lancée ?
- `suno-music-callback` - Callbacks reçus ?

## 📐 Architecture

```
Utilisateur saisit émotions
    ↓
useHumeAI (simulation) → Analyse
    ↓
useEmotionMusic → buildSunoRequest (OpenAI)
    ↓
Edge Function suno-music-generation → Suno API
    ↓
Callbacks (text → first → complete)
    ↓
useSunoCallback (polling 3s) → UI mise à jour
```

## 🎨 Composants disponibles

### Page complète
```tsx
import EmotionMusic from '@/pages/EmotionMusic';
// Route: /app/emotion-music
```

### Panel réutilisable
```tsx
import { EmotionMusicPanel } from '@/components/music/EmotionMusicPanel';

function MyPage() {
  return <EmotionMusicPanel />;
}
```

### Hook direct
```tsx
import { useEmotionMusic } from '@/hooks/useEmotionMusic';

function MyComponent() {
  const { generateFromEmotion, emotionBadge, currentTask } = useEmotionMusic();
  
  const generate = () => {
    generateFromEmotion({
      valence: 0.8,    // 0-1 (négatif → positif)
      arousal: 0.3,    // 0-1 (calme → excité)
      dominantEmotion: 'calm'
    });
  };
  
  return <button onClick={generate}>Générer</button>;
}
```

## 🔒 Sécurité & Privacy

✅ **Conforme RGPD**
- Pseudonymisation automatique
- Pas d'audio brut stocké
- Métadonnées minimales uniquement
- Badges verbaux (pas de scores numériques)
- RLS Supabase activé

✅ **B2B RH**
- Agrégations k-anonymes (≥5 utilisateurs)
- Affichage textuel uniquement

## ⚡ Performances

### Rate Limiting
- **Limite Suno** : 20 requêtes / 10 secondes
- **Backoff automatique** : Exponentiel + jitter
- **Display UI** : Compteur en temps réel

### Timing
- **Streaming** : ~30-40 secondes
- **Audio final** : ~2-3 minutes
- **Callbacks** : polling toutes les 3 secondes
- **Extend** : prolonger jusqu'à 6 minutes

## 🧪 Tests manuels

### Scénario 1 : Génération basique
1. Saisir : "Je me sens paisible et détendu"
2. Vérifier badge : "État serein et apaisé"
3. Vérifier streaming disponible après ~40s
4. Vérifier audio final après ~2-3min

### Scénario 2 : Rate limit
1. Générer 20 musiques rapidement
2. Vérifier backoff automatique
3. Vérifier message utilisateur

### Scénario 3 : Extend
1. Générer une musique
2. Attendre `complete`
3. Utiliser `suno-music-extend` avec audioId
4. Vérifier continuité musicale

## 📊 Monitoring

### Métriques clés
- ✅ Taux de succès génération
- ✅ Latences (OpenAI, Suno, callbacks)
- ✅ Rate limit hits
- ✅ Erreurs par type

### Dashboard Supabase
```sql
-- Dernières générations
SELECT * FROM user_music_generations 
ORDER BY created_at DESC LIMIT 20;

-- Callbacks reçus
SELECT * FROM suno_callbacks 
ORDER BY created_at DESC LIMIT 50;

-- Taux de succès
SELECT 
  callback_type,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (created_at - LAG(created_at) OVER (PARTITION BY task_id ORDER BY created_at)))) as avg_delay_seconds
FROM suno_callbacks
GROUP BY callback_type;
```

## 🐛 Troubleshooting

### Génération échoue
```bash
# 1. Vérifier secrets configurés
# 2. Consulter logs Edge Functions
# 3. Tester manuellement l'API Suno
curl -X POST https://api.sunoapi.org/api/v1/generate \
  -H "Authorization: Bearer $SUNO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"customMode":true,"instrumental":true,...}'
```

### Callbacks non reçus
```bash
# 1. Vérifier endpoint accessible publiquement
curl https://your-domain.supabase.co/functions/v1/suno-music-callback

# 2. Tester un callback manuel
curl -X POST https://your-domain.supabase.co/functions/v1/suno-music-callback \
  -H "Content-Type: application/json" \
  -d '{"data":{"task_id":"test","callbackType":"complete"}}'
```

### Audio ne se charge pas
- URLs Suno peuvent expirer → télécharger rapidement
- Vérifier CORS si domaine custom
- Vérifier que `callback_type === 'complete'`

## 🔄 Prochaines étapes

1. **Intégration Hume AI réelle**
   - Remplacer la simulation dans `useHumeAI`
   - Implémenter `HumeStreamClient` complet
   - Tests WebSocket en conditions réelles

2. **Features avancées**
   - Historique des générations
   - Favoris et playlists
   - Partage social
   - Export audio

3. **Optimisations**
   - Cache des configurations fréquentes
   - Prédiction du style musical
   - A/B testing des mappings

## 📚 Documentation

- **Technique** : `docs/EMO-AUDIO-001.md`
- **Intégration** : `docs/INTEGRATION-EMOTION-MUSIC.md`
- **API Suno** : https://docs.sunoapi.org/
- **API Hume** : https://docs.hume.ai/
- **OpenAI Structured Outputs** : https://platform.openai.com/docs/guides/structured-outputs

---

**Status** : ✅ Production Ready  
**Version** : 1.0.0  
**Date** : 2025-10-06
