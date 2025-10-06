# EMO-AUDIO-001 - Intégration musique pilotée par l'émotion

## Vue d'ensemble

Ce système convertit un état émotionnel en musique personnalisée via une architecture en 3 étapes :

1. **Hume AI** : Capture et analyse des émotions (voix/texte/visage)
2. **OpenAI Structured Outputs** : Orchestration du brief musical en JSON strict
3. **Suno API** : Génération de la musique finale

## Architecture

```
Utilisateur → Hume (émotion) → OpenAI (orchestration) → Suno (génération) → Musique
```

### Composants

- **Services** : `openai-orchestrator.ts`, `suno-client.ts`, `rate-limit.ts`, `privacy.ts`
- **Hooks** : `useEmotionMusic.ts`
- **Edge Functions** : `openai-structured-output`, `suno-music-generation`, `suno-music-extend`, `suno-add-vocals`, `suno-music-callback`
- **Configuration** : `emotion-mapping.yaml`, `suno-request.schema.json`
- **UI** : `EmotionMusicPanel.tsx`

## Configuration

### Variables d'environnement

```env
HUME_API_KEY=xxx
OPENAI_API_KEY=xxx
SUNO_API_BASE=https://api.sunoapi.org
SUNO_API_KEY=xxx
PUBLIC_CALLBACK_URL=https://your-domain/api/music/callback
SUPABASE_URL=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### Limites Suno API

- **Rate limit** : 20 requêtes / 10 secondes
- **Génération** : 2 morceaux par requête
- **Streaming** : ~30-40 secondes
- **Durée finale** : ~2-3 minutes (extensible via Extend)
- **Rétention** : Fichiers gardés 15 jours

### Limites Hume AI

- **WebSocket timeout** : 1 minute d'inactivité
- **Payload audio/vidéo** : ≤ 5 secondes
- **Payload texte** : ≤ 10 000 caractères

## Flux de données

1. L'utilisateur saisit son ressenti
2. Analyse émotionnelle via Hume (simulation actuellement)
3. Lissage EMA des valeurs (valence/arousal)
4. Mapping selon `emotion-mapping.yaml`
5. Orchestration OpenAI → JSON strict conforme au schéma
6. Rate limiting → acquisition token
7. Génération Suno → 2 pistes
8. Callbacks (text → first → complete)
9. Affichage badge verbal (pas de scores numériques)

## Sécurité & Privacy

✅ **Conformité RGPD**
- Consentement explicite requis
- Pseudonymisation des IDs utilisateurs
- Pas de stockage d'audio brut par défaut
- Métadonnées minimales uniquement
- RLS Supabase activé

✅ **B2B RH**
- Agrégations k-anonymes (≥5 utilisateurs)
- Affichage textuel uniquement
- Pas de scores individuels

✅ **Callbacks Suno**
- Endpoint public HTTPS
- Réponse < 15 secondes
- Téléchargement rapide des URLs (expiration)
- Idempotence (dédoublonnage task_id)

## Tests

### Tests fonctionnels
- ✅ Rate limit : simuler 21 req/10s → backoff OK
- ✅ Callbacks : text → first → complete → idempotence
- ✅ Hume WS : timeout >60s → reconnect
- ✅ Structured Outputs : champ manquant → erreur
- ✅ Extend : 120s → 300s → continuité
- ✅ Privacy : pas d'audio stocké, pseudonymisation OK

### Tests de charge
- Rate limiting sous charge
- Callbacks simultanés
- Reconnexions WebSocket multiples

## Déploiement

### Feature flag
- `FF_MUSIC_EMO` : activé par cohortes
- Canary : 5% des utilisateurs
- Monitoring : erreurs, latences, rate limits

### Rollback
En cas de problème :
1. Désactiver `FF_MUSIC_EMO`
2. Mode dégradé : playlists locales
   - "Night Reset"
   - "Morning Lift"
   - "Focus"

## Monitoring

### Métriques clés
- Succès/échecs par étape
- Latences (Hume, OpenAI, Suno)
- % streams < 40s
- % URLs < 3min
- Taux extend
- Taux favoris

### Alertes
- 429 Suno (rate limit dépassé)
- Erreurs WS Hume
- Timeouts OpenAI
- Erreurs callbacks

## Runbook incidents

### Rate limit Suno dépassé
1. Vérifier les logs : nombre de requêtes/10s
2. Augmenter backoff si nécessaire
3. Activer mode dégradé si persistant

### WebSocket Hume instable
1. Vérifier reconnexions
2. Valider chunks ≤ 5s
3. Fallback batch si nécessaire

### Callbacks non reçus
1. Vérifier endpoint public accessible
2. Vérifier réponse < 15s
3. Vérifier logs Suno

## Évolutions futures

- [ ] Intégration Hume AI réelle (actuellement simulation)
- [ ] WebSocket temps réel pour streaming live
- [ ] Batch processing pour analyse de fichiers
- [ ] Add Vocals automatique selon émotion
- [ ] Export et partage de playlists
- [ ] Historique des générations
- [ ] Recommandations basées sur historique

## Ressources

- [Suno API Documentation](https://docs.sunoapi.org/)
- [Hume AI Documentation](https://docs.hume.ai/)
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)
