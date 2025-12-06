# Micro-gestes personnalisés par IA

## Vue d'ensemble

Système de suggestion de micro-gestes personnalisés généré par Lovable AI (Gemini 2.5 Flash) en fonction de l'état émotionnel détecté et de l'historique récent de l'utilisateur stocké dans `clinical_signals`.

## Architecture

### 1. Edge Function
**Fichier**: `supabase/functions/emotion-micro-gestures/index.ts`

Responsable de :
- Recevoir l'émotion actuelle (valence, arousal, label)
- Récupérer les émotions récentes de l'utilisateur
- Appeler Lovable AI avec structured outputs
- Retourner 3-4 micro-gestes personnalisés

**Modèle utilisé**: `google/gemini-2.5-flash`

**Structure de sortie** (via tool calling):
```typescript
{
  gestures: [
    {
      icon: string;        // Emoji représentant le geste
      label: string;       // Titre court (max 6 mots)
      description: string; // Description détaillée (20-40 mots)
      duration: string;    // Durée estimée
    }
  ],
  summary: string; // Message contextuel (15-25 mots)
}
```

### 2. Hook React
**Fichier**: `src/hooks/useAIMicroGestures.ts`

Expose :
- `generateSuggestions()` : Génère des suggestions via l'edge function
- `suggestions` : Les suggestions reçues
- `isLoading` : État de chargement
- `error` : Erreur éventuelle

Fonctionnalités :
- Récupération automatique des 10 dernières émotions (30 min)
- Gestion des erreurs réseau et rate limits
- Logging via le système centralisé

### 3. Composant UI
**Fichier**: `src/features/scan/MicroGestes.tsx`

Affiche :
- Mode standard : Gestes statiques basés sur le quadrant (valence/arousal)
- Mode IA : Suggestions enrichies et contextualisées avec descriptions complètes
- Bouton "IA personnalisée" pour basculer vers les suggestions IA

Interface adaptative :
- Grid 2 colonnes pour gestes statiques
- Layout vertical enrichi pour suggestions IA
- Affichage de la durée et description détaillée en mode IA

## Intégration

### Dans B2CScanPage
```typescript
<MicroGestes 
  gestures={gestures}           // Gestes statiques par défaut
  summary={activeSummary}       // Résumé textuel
  emotion={detail?.summary}     // Émotion détectée
  valence={detail?.valence}     // Score de valence (0-100)
  arousal={detail?.arousal}     // Score d'arousal (0-100)
/>
```

## Données sources

### clinical_signals
Table Supabase qui stocke tous les signaux émotionnels :
- **user_id** : Identification de l'utilisateur
- **source_instrument** : `scan_camera`, `SAM`, `scan_sliders`
- **metadata.emotion** : Label de l'émotion
- **metadata.valence** : Score 0-100
- **metadata.arousal** : Score 0-100
- **metadata.confidence** : Confiance de la détection
- **created_at** : Timestamp

Fenêtre temporelle utilisée : **30 dernières minutes**

## Prompt Engineering

Le système prompt guide l'IA pour :
- Suggérer des micro-interventions courtes (1-2 min max)
- Sans matériel nécessaire
- Applicables partout (bureau, maison, transports)
- Centrées sur le corps et la respiration
- Formulées avec bienveillance

Le user prompt inclut :
- Émotion actuelle
- Valence et arousal (scores)
- Liste des émotions récentes (dédupliquées)
- Contexte optionnel

## Gestion des erreurs

### Rate Limits (429)
```json
{ "error": "Rate limit dépassée, réessayez dans quelques instants" }
```

### Crédits insuffisants (402)
```json
{ "error": "Crédits insuffisants, veuillez recharger votre compte" }
```

Les erreurs sont catchées et affichées à l'utilisateur via toast.

## Configuration

### config.toml
```toml
[functions.emotion-micro-gestures]
verify_jwt = true
```

JWT requis pour protéger l'accès et éviter les abus.

## Performance

- **Latence moyenne** : 1.5-3s (génération + réseau)
- **Coût** : ~1 crédit Lovable AI par appel
- **Cache** : Suggestions gardées en mémoire tant que l'émotion ne change pas
- **Fallback** : Gestes statiques si l'IA échoue

## Évolutions futures

- [ ] Cache des suggestions par émotion (Redis)
- [ ] Mode hors-ligne avec suggestions pré-générées
- [ ] Personnalisation selon le profil utilisateur (métier, contexte)
- [ ] Feedback utilisateur sur l'efficacité des gestes suggérés
- [ ] Historique des gestes pratiqués

## Tests

À implémenter :
- Test unitaire du hook `useAIMicroGestures`
- Test d'intégration de l'edge function
- Test E2E du flow complet depuis B2CScanPage
- Test de fallback en cas d'erreur IA
