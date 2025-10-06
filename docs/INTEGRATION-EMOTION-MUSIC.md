# Guide d'intégration - Musique Émotionnelle

## 🎯 Résumé

Système complet de génération musicale pilotée par l'émotion via Hume AI → OpenAI → Suno API.

## ✅ Ce qui est fait

### 1. Architecture Backend

#### Edge Functions Supabase
- ✅ `openai-structured-output` - Orchestration via OpenAI GPT-4.1-mini
- ✅ `suno-music-generation` - Génération musicale principale
- ✅ `suno-music-extend` - Extension de pistes (120s → 300s)
- ✅ `suno-add-vocals` - Ajout de voix sur instrumental
- ✅ `suno-music-callback` - Webhook public pour callbacks Suno

#### Services
- ✅ `openai-orchestrator.ts` - Structured Outputs JSON strict
- ✅ `suno-client.ts` - Client SDK Suno
- ✅ `rate-limit.ts` - Backoff exponentiel (20 req/10s)
- ✅ `privacy.ts` - Helpers RGPD (pseudonymisation, badges verbaux)
- ✅ `yaml-loader.ts` - Mapping émotions → configuration musicale

#### Configuration
- ✅ `schemas/suno-request.schema.json` - JSON Schema strict
- ✅ `config/emotion-mapping.yaml` - Règles valence/arousal → style
- ✅ `supabase/config.toml` - 5 Edge Functions configurées

#### Base de données
- ✅ Table `suno_callbacks` - Métadonnées callbacks (RLS service_role)
- ✅ Table `user_music_generations` - Liens user ↔ générations (RLS user_id)
- ✅ Indexes optimisés (task_id, created_at, user_id)

### 2. Architecture Frontend

#### Hooks
- ✅ `useEmotionMusic.ts` - Hook principal de génération
- ✅ `useSunoCallback.ts` - Polling des callbacks (3s)
- ✅ `useHumeAI.tsx` - Analyse émotionnelle (simulation)

#### Composants
- ✅ `EmotionMusicPanel.tsx` - UI principale avec:
  - Saisie texte émotionnel
  - Analyse et génération
  - Badges verbaux (pas de scores)
  - Rate limit display
  - Audio player streaming + final
  - Bouton téléchargement

#### Pages
- ✅ `EmotionMusic.tsx` - Page dédiée avec:
  - Header avec gradient
  - 3 feature cards (Analyse, IA, Privacy)
  - Intégration EmotionMusicPanel
  - Footer informatif

#### Routing
- ✅ Route ajoutée : `/app/emotion-music`
- ✅ Alias : `/emotion-music`
- ✅ Guard : `consumer` role requis
- ✅ Layout : `app`

#### Types
- ✅ `types/music-generation.ts` - Types complets (EmotionState, SunoMusicConfig, etc.)

### 3. Sécurité & Privacy

- ✅ Pseudonymisation automatique des user IDs
- ✅ Pas de stockage audio brut par défaut
- ✅ RLS Supabase strict (user_id + service_role)
- ✅ Badges verbaux uniquement (conformité RGPD)
- ✅ Callbacks idempotents (dédoublonnage task_id)
- ✅ Webhook public avec réponse < 15s

### 4. Documentation

- ✅ `docs/EMO-AUDIO-001.md` - Documentation technique complète
- ✅ `docs/INTEGRATION-EMOTION-MUSIC.md` - Ce guide
- ✅ Commentaires inline dans tout le code

## 🔧 Configuration requise

### Secrets Supabase à ajouter

```bash
HUME_API_KEY=xxx           # Pour analyse émotionnelle temps réel
OPENAI_API_KEY=xxx         # Pour orchestration JSON strict
SUNO_API_KEY=xxx           # Pour génération musicale
SUNO_API_BASE=https://api.sunoapi.org
```

### Variables d'environnement optionnelles

```env
PUBLIC_CALLBACK_URL=https://your-domain.com/api/music/callback
```

## 🚀 Utilisation

### 1. Accès à la page

```
https://your-app.com/app/emotion-music
ou
https://your-app.com/emotion-music (alias)
```

### 2. Flow utilisateur

1. Utilisateur saisit son ressenti émotionnel (texte libre)
2. Clic sur "Analyser et Générer"
3. Analyse émotionnelle → Badge verbal affiché
4. Orchestration OpenAI → Configuration Suno générée
5. Génération Suno lancée (2 pistes)
6. Callbacks reçus :
   - `text` : Transcription en cours
   - `first` : Streaming disponible (~30-40s)
   - `complete` : Audio final disponible (~2-3min)
7. Écoute directe ou téléchargement

### 3. Intégration dans d'autres pages

```tsx
import { EmotionMusicPanel } from '@/components/music';

function MyPage() {
  return (
    <div>
      <h1>Ma page</h1>
      <EmotionMusicPanel />
    </div>
  );
}
```

### 4. Utilisation du hook directement

```tsx
import { useEmotionMusic } from '@/hooks/useEmotionMusic';

function MyComponent() {
  const { generateFromEmotion, isGenerating, emotionBadge } = useEmotionMusic();

  const handleGenerate = async () => {
    const result = await generateFromEmotion({
      valence: 0.7,
      arousal: 0.3,
      dominantEmotion: 'calm'
    });
    
    if (result) {
      console.log('Task ID:', result.taskId);
      console.log('Badge:', result.emotionBadge);
    }
  };

  return (
    <button onClick={handleGenerate} disabled={isGenerating}>
      Générer
    </button>
  );
}
```

## 📊 Monitoring

### Métriques à surveiller

- Taux de succès génération (target: >95%)
- Latence streaming (target: <40s)
- Latence audio final (target: <180s)
- Rate limit hits (alerte si >80% du quota)
- Callbacks reçus/traités
- Erreurs par type (OpenAI, Suno, timeout)

### Logs à consulter

```bash
# Edge Functions
https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions

# Callbacks Suno
SELECT * FROM suno_callbacks ORDER BY created_at DESC LIMIT 100;

# Générations utilisateurs
SELECT * FROM user_music_generations ORDER BY created_at DESC LIMIT 100;
```

## ⚠️ Limites et Contraintes

### Suno API
- 20 requêtes / 10 secondes max
- 2 pistes par requête
- Streaming : ~30-40 secondes
- Audio final : ~2-3 minutes
- Fichiers conservés 15 jours
- Extend : même modèle uniquement

### Hume AI (quand intégré)
- WebSocket timeout : 1 minute d'inactivité
- Audio/vidéo : ≤ 5 secondes par chunk
- Texte : ≤ 10 000 caractères
- Reconnexion automatique nécessaire

### OpenAI
- Rate limits selon tier
- JSON Schema strict requis
- Timeout : 60s par défaut

## 🐛 Troubleshooting

### Génération échoue

1. Vérifier les secrets Supabase configurés
2. Consulter les logs Edge Functions
3. Vérifier le rate limit (20/10s)
4. Tester l'endpoint callback (accessible publiquement)

### Callbacks non reçus

1. Vérifier `PUBLIC_CALLBACK_URL` correct
2. Endpoint doit répondre < 15s
3. Vérifier HTTPS (pas HTTP)
4. Consulter les logs `suno-music-callback`

### Audio ne se charge pas

1. Vérifier que `callback_type === 'complete'`
2. URLs Suno peuvent expirer (télécharger rapidement)
3. Vérifier CORS si domaine custom

### Rate limit atteint

1. Attendre 10 secondes
2. Le backoff s'applique automatiquement
3. Afficher un message à l'utilisateur
4. Mode dégradé : playlists locales

## 🔄 Évolutions futures

- [ ] Intégration Hume AI WebSocket temps réel
- [ ] Analyse vocale en direct
- [ ] Analyse faciale via caméra
- [ ] Historique des générations
- [ ] Export et partage de playlists
- [ ] Mode collaboratif (plusieurs utilisateurs)
- [ ] Extend automatique selon émotion
- [ ] Add Vocals intelligent
- [ ] Analytics avancées (temps d'écoute, favoris)
- [ ] A/B testing sur les mappings

## 📞 Support

- Documentation : `docs/EMO-AUDIO-001.md`
- Logs Edge Functions : Dashboard Supabase
- Issues : GitHub repo EmotionsCare
- Email technique : dev@emotionscare.com

---

**Version :** 1.0.0  
**Dernière mise à jour :** 2025-10-06  
**Statut :** ✅ Production Ready (après configuration secrets)
