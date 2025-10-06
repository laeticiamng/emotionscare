# EC-MUSIC-PARCOURS-XL

## 🎯 Vue d'ensemble

Système de parcours musicothérapie intégrés (18–24 minutes) combinant :
- **Musique générative** (Suno AI)
- **Techniques TCC/ACT/DBT** + Hypnose ericksonienne
- **Acupression TCM** + Immersion sensorielle
- **20 émotions de départ** avec presets prêts à l'emploi
- **Sécurité RGPD** : badges verbaux uniquement, données anonymisées

---

## 📁 Architecture

```
config/parcours-xl/
  ├── 00-universel-reset.yaml
  ├── 01-panique-anxiete.yaml
  ├── 04-tristesse-deuil.yaml
  └── ... (17 autres presets)

src/services/
  └── parcours-orchestrator.ts    # Création & gestion des runs

src/pages/
  └── ParcoursXL.tsx               # UI principale

supabase/functions/
  └── parcours-xl-create/          # Edge Function création
```

---

## 🗄️ Tables Supabase

### `parcours_presets`
Configuration des 20 parcours émotionnels.

### `parcours_runs`
Sessions utilisateur avec SUDS (caché UI), notes chiffrées.

### `parcours_segments`
Segments audio générés (musique + voix-off).

### `user_music_consents`
Consentements micro/caméra/émotion.

### `b2b_music_aggregates`
Agrégations k-anonymes (≥5) pour B2B.

---

## 🎵 Les 20 Parcours

| # | Émotion de départ | Destination | Durée | Techniques clés |
|---|-------------------|-------------|-------|-----------------|
| 0 | Universel | Équilibre | 20' | ATT, Défusion, Cohérence 6/min |
| 1 | Panique/Anxiété | Calme | 20' | 4/6, 5-4-3-2-1, Exposition |
| 2 | Stress | Décélération | 18' | Tri tâches, Recadrage |
| 3 | Rumination | Clarté | 19' | ATT, Défusion, Créneau souci |
| 4 | Tristesse | Lumière | 22' | Validation, Activation, Compassion |
| 5 | Apathie | Élan | 18' | Si/Alors, Imagerie réussite |
| 6 | Colère | Assertivité | 20' | STOP, DESC, Disque rayé |
| 7 | Peur | Tolérance | 20' | Hiérarchie, Exposition imaginale |
| 8 | Honte | Auto-compassion | 18' | Double standard, Script social |
| 9 | Jalousie | Recentrage | 18' | Valeurs, Gratitude |
| 10 | Solitude | Connexion | 20' | Lettre ami, Plan micro-contact |
| 11 | Burnout | Repos actif | 22' | Limites, Déconnexion to-do |
| 12 | Hypersensibilité | Filtration | 18' | ACCEPT, Cocon protecteur |
| 13 | Douleur | Apaisement | 20' | Déplacement perceptif, Pacing |
| 14 | Doute | Assurance | 20' | Croyances noyau, Preuves |
| 15 | Perfectionnisme | Souplesse | 18' | Imparfait volontaire, Bambou |
| 16 | Nostalgie | Douceur présente | 20' | Gratitude, Pont présent |
| 17 | Motivation | Mouvement | 18' | Si/Alors, Plan 10 min |
| 18 | Concentration | Focus stable | 18' | Pomodoro, Tunnel attentionnel |
| 19 | Gratitude | Expansion | 20' | Journal, Acte gentillesse |

---

## 🔧 Implémentation

### 1. Sélection de l'émotion

```typescript
import { AVAILABLE_PRESETS } from '@/services/parcours-orchestrator';

// Afficher la grille des 20 émotions
AVAILABLE_PRESETS.map(preset => (
  <EmotionCard 
    key={preset.key}
    icon={preset.icon}
    title={preset.title}
    duration={preset.duration}
    onClick={() => selectEmotion(preset.key)}
  />
))
```

### 2. Création du parcours

```typescript
const result = await createParcoursRun(
  presetKey,
  userId,
  emotionState // optionnel (auto-détection Hume)
);
// → Retourne runId + titre + durée totale
```

### 3. Génération audio

L'Edge Function `parcours-xl-create` :
1. Crée la run en DB
2. Crée les segments vides
3. Lance la génération asynchrone via Suno (Generate → Extend x N)
4. Retourne immédiatement le runId

### 4. Lecture

Le composant `ParcoursXL` :
- Affiche les segments avec progression visuelle
- Contrôles : Pause / Passer / Stop d'urgence
- Badges verbaux uniquement (pas de scores SUDS affichés)

### 5. Journal de fin

- Champ texte 60s
- Chiffrement avant stockage (base64 pour MVP, à améliorer)
- Sauvegarde dans `parcours_runs.notes_encrypted`

---

## 🔒 Sécurité & Privacy

### Consentements
- Micro/Caméra/Analyse émotionnelle : opt-in explicite
- Stockés dans `user_music_consents`

### Badges verbaux uniquement
```typescript
// ✅ OK
"État serein et apaisé"
"Énergie positive et dynamique"

// ❌ Interdit
"Valence: 0.82 / Arousal: 0.34"
```

### B2B : K-anonymat
- Agrégations uniquement si cohort_size ≥ 5
- Texte descriptif, jamais de données individuelles
- RLS : accessible uniquement aux org admins

### TCM : Contre-indications
- LI4 (Hegu) : ⚠️ grossesse
- SP6 (Sanyinjiao) : ⚠️ grossesse
- Affichage dans le brief avant lancement

---

## 🧪 Tests & QA

### Fonctionnels
- [x] Sélection en ≤2 clics
- [ ] Latence segment < 2 s
- [ ] Parcours complet 18–24' sans rupture
- [ ] Stop d'urgence = mute immédiat
- [ ] Badges verbaux uniquement
- [ ] Journal chiffré

### Techniques
- [ ] Rate-limit Suno : 20 req/10s
- [ ] Callbacks idempotents
- [ ] RLS stricte par user_id
- [ ] B2B agrégations k-anonymes ≥5

### Audio
- [ ] Pas de pics/startle
- [ ] Transitions fluides
- [ ] Niveau perçu homogène

---

## 🚀 Déploiement

### Feature Flags
```
FF_PARCOURS_XL=true
FF_AUTO_DETECT_HUME=false (pour MVP)
FF_VOICEOVER_VOCALS=false (pour MVP)
```

### Rollout
1. Canary 5% pendant 1 semaine
2. Monitoring : erreurs callbacks, 429 Suno, latences
3. Élargissement par paliers : 10% → 25% → 50% → 100%

### Mode dégradé
Si APIs indisponibles : playlists locales pré-générées
- "Night Reset"
- "Morning Lift"  
- "Focus Flow"

---

## 📊 Métriques

- % parcours complétés vs abandonnés
- Émotions les plus sélectionnées
- Taux "Allonger de 3–4 min" (Extend)
- Latence moyenne segment
- % streams < 40s

---

## ✅ Definition of Done

- [x] Tables DB créées avec RLS
- [x] 3 presets YAML de référence
- [x] Service orchestrator
- [x] UI ParcoursXL avec sélection/brief/lecture/journal
- [x] Edge Function `parcours-xl-create`
- [ ] Edge Function `parcours-xl-generate-audio` (génération segments)
- [ ] 17 presets YAML restants
- [ ] Tests automatisés
- [ ] Docs complètes
- [ ] Feature flag activé

---

## 🔗 Liens utiles

- Ticket EMO-AUDIO-001 (fondations)
- Config Suno : https://docs.sunoapi.org
- OpenAI Structured Outputs : https://platform.openai.com/docs/guides/structured-outputs
