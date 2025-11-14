# Documentation API Backend - Modules Émotionnels

**Version:** 1.0.0
**Date:** 2025-11-14
**Base URL:** `https://[project].supabase.co/functions/v1/emotional-api`

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Schéma de Base de Données](#schéma-de-base-de-données)
4. [API Reference](#api-reference)
5. [Exemples d'Utilisation](#exemples-dutilisation)
6. [Guides](#guides)

---

## 🎯 Vue d'Ensemble

### Objectif

L'API Backend Émotionnelle fournit une infrastructure complète pour:
- ✅ **Gamification** - Achievements, XP, niveaux
- ✅ **Analytics** - Statistiques et métriques émotionnelles
- ✅ **Insights** - Recommandations IA personnalisées
- ✅ **Patterns** - Détection de comportements émotionnels
- ✅ **Trends** - Évolution des émotions dans le temps

### Technologies

- **Base de données:** PostgreSQL (Supabase)
- **Edge Functions:** Deno (TypeScript)
- **Authentication:** Supabase Auth (JWT)
- **RLS:** Row Level Security activée sur toutes les tables

---

## 🏗️ Architecture

### Composants

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Client                       │
│              (React + EmotionAnalysisService)           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓ HTTPS + JWT
┌─────────────────────────────────────────────────────────┐
│              Edge Function: emotional-api                │
│                  (API Gateway unifiée)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ↓                           ↓
┌─────────────────┐         ┌─────────────────┐
│  Tables DB      │         │  Fonctions PG   │
│  - achievements │         │  - check_and_   │
│  - stats        │         │    unlock_...   │
│  - patterns     │         │  - grant_xp_... │
│  - insights     │         │  - update_...   │
│  - trends       │         └─────────────────┘
└─────────────────┘
```

### Flow de Données

1. **Scan Émotionnel** → Insertion dans `emotion_scans`
2. **Trigger DB** → Mise à jour de `emotional_stats`
3. **Trigger DB** → Vérification achievements via `check_and_unlock_achievements()`
4. **Trigger DB** → Attribution XP via `grant_xp_after_achievement()`
5. **Cron Job** → Génération insights/patterns/trends (quotidien)

---

## 🗄️ Schéma de Base de Données

### Table: `emotional_achievements`

Stocke les achievements débloqués par les utilisateurs.

```sql
CREATE TABLE emotional_achievements (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  achievement_id text NOT NULL, -- 'first_scan', 'scan_explorer', etc.
  achievement_title text NOT NULL,
  achievement_description text,
  category text CHECK (category IN ('scan', 'streak', 'journey', 'mastery', 'social', 'special')),
  tier text CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  xp_reward int NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  progress int DEFAULT 100,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id, achievement_id)
);
```

**RLS Policies:**
- ✅ Users can view their own achievements
- ✅ Users can insert their own achievements
- ✅ Users can update their own achievements

---

### Table: `emotional_stats`

Statistiques émotionnelles agrégées par utilisateur.

```sql
CREATE TABLE emotional_stats (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE REFERENCES auth.users(id),

  -- Statistiques
  total_scans int DEFAULT 0,
  total_journal_entries int DEFAULT 0,
  emotions_discovered text[] DEFAULT ARRAY[]::text[],
  favorite_emotion text,

  -- Scores
  average_mood_score numeric(5,2) DEFAULT 0,
  average_valence numeric(5,2) DEFAULT 0,
  average_arousal numeric(5,2) DEFAULT 0,
  emotional_variability numeric(5,2) DEFAULT 0,

  -- Activité
  days_active int DEFAULT 0,
  first_activity_date date,
  last_activity_date date,

  -- Gamification
  level int DEFAULT 1,
  xp int DEFAULT 0,
  next_level_xp int DEFAULT 1000,
  total_xp_earned int DEFAULT 0,

  -- Streaks
  current_streak int DEFAULT 0,
  longest_streak int DEFAULT 0,
  last_check_in timestamptz,
  total_check_ins int DEFAULT 0,

  -- Sources
  scan_types_used text[] DEFAULT ARRAY[]::text[],

  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

### Table: `emotional_patterns`

Patterns émotionnels détectés automatiquement.

```sql
CREATE TABLE emotional_patterns (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  pattern_type text CHECK (pattern_type IN ('recurring', 'seasonal', 'contextual', 'triggered')),
  emotion text NOT NULL,
  frequency numeric(5,2), -- 0-1
  confidence numeric(5,2), -- 0-1
  time_of_day text CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
  day_of_week int CHECK (day_of_week BETWEEN 0 AND 6),
  description text NOT NULL,
  is_active boolean DEFAULT true,
  ...
);
```

---

### Table: `emotional_insights`

Insights générés par IA.

```sql
CREATE TABLE emotional_insights (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text NOT NULL,
  type text CHECK (type IN ('positive', 'neutral', 'warning', 'tip')),
  category text CHECK (category IN ('trend', 'pattern', 'suggestion', 'achievement')),
  confidence numeric(5,2),
  priority int CHECK (priority BETWEEN 0 AND 10),
  is_read boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  actionable boolean DEFAULT false,
  action_label text,
  ...
);
```

---

### Table: `emotional_trends`

Tendances émotionnelles calculées.

```sql
CREATE TABLE emotional_trends (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  emotion text NOT NULL,
  period_comparison text CHECK (period_comparison IN ('day', 'week', 'month', 'year')),
  change_percentage numeric(10,2),
  direction text CHECK (direction IN ('up', 'down', 'stable')),
  period_start date,
  period_end date,
  ...
);
```

---

## 📡 API Reference

### Authentication

Toutes les requêtes nécessitent un token JWT Supabase.

```typescript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

---

### GET `/stats`

Récupère les statistiques émotionnelles de l'utilisateur connecté.

**Response:**
```json
{
  "stats": {
    "user_id": "uuid",
    "total_scans": 45,
    "total_journal_entries": 20,
    "emotions_discovered": ["joy", "sadness", "anger"],
    "favorite_emotion": "joy",
    "average_mood_score": 72.5,
    "emotional_variability": 15.3,
    "days_active": 30,
    "level": 5,
    "xp": 2500,
    "next_level_xp": 3000,
    "total_xp_earned": 7500,
    "current_streak": 7,
    "longest_streak": 14,
    "scan_types_used": ["text", "voice", "camera"]
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### GET `/achievements`

Récupère tous les achievements débloqués par l'utilisateur.

**Response:**
```json
{
  "achievements": [
    {
      "id": "uuid",
      "achievement_id": "first_scan",
      "achievement_title": "Premier Pas",
      "achievement_description": "Réaliser votre premier scan émotionnel",
      "category": "scan",
      "tier": "bronze",
      "xp_reward": 100,
      "unlocked_at": "2025-11-10T14:30:00Z",
      "progress": 100
    }
  ]
}
```

---

### POST `/check-achievements`

Force la vérification et le déblocage des achievements pour l'utilisateur.

**Response:**
```json
{
  "message": "Achievements checked",
  "achievements": [...]
}
```

**Usage:**
Appeler après chaque action majeure (scan, streak, etc.) pour vérifier les nouveaux achievements.

---

### GET `/dashboard`

Récupère un résumé complet du dashboard émotionnel.

**Response:**
```json
{
  "dashboard": {
    "user_id": "uuid",
    "level": 5,
    "xp": 2500,
    "next_level_xp": 3000,
    "total_scans": 45,
    "average_mood_score": 72.5,
    "current_streak": 7,
    "total_achievements_unlocked": 8,
    "diamond_achievements": 0,
    "active_patterns": 3,
    "unread_insights": 5
  }
}
```

---

### GET `/insights`

Récupère les insights émotionnels de l'utilisateur.

**Query Parameters:**
- `unreadOnly=true` - Filtrer uniquement les insights non lus

**Response:**
```json
{
  "insights": [
    {
      "id": "uuid",
      "title": "Tendance Positive Détectée 🎉",
      "description": "Votre humeur moyenne est de 75/100, ce qui est excellent !",
      "type": "positive",
      "category": "trend",
      "confidence": 0.9,
      "priority": 8,
      "is_read": false,
      "actionable": true,
      "action_label": "Voir détails"
    }
  ]
}
```

---

### PATCH `/insights/:id/read`

Marque un insight comme lu.

**Response:**
```json
{
  "insight": {
    "id": "uuid",
    "is_read": true,
    "read_at": "2025-11-14T10:30:00Z"
  }
}
```

---

### POST `/generate-insights`

Génère automatiquement des insights basés sur les statistiques de l'utilisateur.

**Response:**
```json
{
  "message": "3 insights generated",
  "insights": [...]
}
```

**Insights générés:**
- Tendance positive (si `average_mood_score > 70`)
- Équilibre stable (si `emotional_variability < 15`)
- Émotions fluctuantes (si `emotional_variability > 30`)
- Constance remarquable (si `current_streak >= 7`)

---

### GET `/patterns`

Récupère les patterns émotionnels actifs détectés.

**Response:**
```json
{
  "patterns": [
    {
      "id": "uuid",
      "pattern_type": "recurring",
      "emotion": "joy",
      "frequency": 0.8,
      "confidence": 0.9,
      "time_of_day": "morning",
      "description": "Vous êtes généralement joyeux le matin"
    }
  ]
}
```

---

### GET `/trends`

Récupère les tendances émotionnelles.

**Query Parameters:**
- `period=week|month|year` - Période de comparaison (défaut: `week`)

**Response:**
```json
{
  "trends": [
    {
      "emotion": "joy",
      "period_comparison": "week",
      "change_percentage": 25,
      "direction": "up",
      "period_start": "2025-11-07",
      "period_end": "2025-11-14",
      "current_value": 0.85,
      "previous_value": 0.68
    }
  ]
}
```

---

### GET `/leaderboard`

Récupère le classement général des utilisateurs.

**Query Parameters:**
- `limit=10` - Nombre de résultats (défaut: `10`)

**Response:**
```json
{
  "leaderboard": [
    {
      "user_id": "uuid",
      "level": 50,
      "total_xp_earned": 125000,
      "total_scans": 500,
      "current_streak": 100,
      "total_achievements": 15,
      "rank": 1
    }
  ]
}
```

---

## 💡 Exemples d'Utilisation

### Exemple 1: Récupérer les statistiques

```typescript
import { supabase } from '@/integrations/supabase/client';

async function getMyStats() {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(
    'https://[project].supabase.co/functions/v1/emotional-api/stats',
    {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    }
  );

  const { stats } = await response.json();
  console.log('Mes stats:', stats);
}
```

---

### Exemple 2: Vérifier les achievements après un scan

```typescript
async function afterEmotionalScan() {
  // 1. Créer le scan
  await supabase.from('emotion_scans').insert({
    mood: 'joy',
    confidence: 0.9,
    scan_type: 'text',
  });

  // 2. Vérifier les achievements
  const response = await fetch(
    'https://[project].supabase.co/functions/v1/emotional-api/check-achievements',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    }
  );

  const { achievements } = await response.json();

  // 3. Afficher les nouveaux achievements
  achievements.forEach(achievement => {
    if (isNewlyUnlocked(achievement)) {
      showAchievementNotification(achievement);
    }
  });
}
```

---

### Exemple 3: Dashboard complet

```typescript
async function loadDashboard() {
  const [stats, achievements, insights, patterns] = await Promise.all([
    fetch('/emotional-api/stats').then(r => r.json()),
    fetch('/emotional-api/achievements').then(r => r.json()),
    fetch('/emotional-api/insights?unreadOnly=true').then(r => r.json()),
    fetch('/emotional-api/patterns').then(r => r.json()),
  ]);

  return {
    stats: stats.stats,
    achievements: achievements.achievements,
    insights: insights.insights,
    patterns: patterns.patterns,
  };
}
```

---

## 📚 Guides

### Guide: Système de Gamification

#### 1. Levels & XP

Le système de niveaux est géré automatiquement:

- **Level 1** → 1000 XP pour Level 2
- **Level 2** → 1200 XP pour Level 3
- **Level N** → `1000 + (N × 100)` XP pour Level N+1

#### 2. Sources d'XP

| Source | XP |
|--------|-----|
| Achievement Bronze | 100-500 |
| Achievement Silver | 500-1000 |
| Achievement Gold | 1000-2500 |
| Achievement Platinum | 2500-5000 |
| Achievement Diamond | 5000-10000 |

#### 3. Achievements Automatiques

Débloqués automatiquement par triggers:
- `first_scan` - 1er scan (100 XP)
- `scan_explorer` - 10 scans (500 XP)
- `scan_master` - 100 scans (2000 XP)
- `scan_legend` - 500 scans (10000 XP)
- `streak_week` - 7 jours (300 XP)
- `streak_month` - 30 jours (1500 XP)
- `emotion_diversity` - 20 émotions (800 XP)
- `all_scan_types` - 4 types (2500 XP)

---

### Guide: Génération d'Insights

Les insights sont générés automatiquement ou manuellement via `/generate-insights`.

#### Critères de Génération

```typescript
if (average_mood_score > 70) {
  → Insight "Tendance Positive" (type: positive, priority: 8)
}

if (emotional_variability < 15) {
  → Insight "Équilibre Stable" (type: positive, priority: 7)
}

if (emotional_variability > 30) {
  → Insight "Émotions Fluctuantes" (type: tip, priority: 6)
}

if (current_streak >= 7) {
  → Insight "Constance Remarquable" (type: positive, priority: 9)
}
```

---

### Guide: Détection de Patterns

Les patterns sont détectés par des jobs cron quotidiens analysant:

1. **Récurrence temporelle** - Même émotion à la même heure
2. **Contexte** - Émotions liées à des événements
3. **Saisonnalité** - Variations selon les saisons
4. **Triggers** - Réactions à des situations spécifiques

---

## 🔒 Sécurité

### RLS (Row Level Security)

Toutes les tables ont des policies RLS:

```sql
-- Les utilisateurs voient uniquement leurs propres données
CREATE POLICY "Users can view their own stats"
  ON emotional_stats FOR SELECT
  USING (auth.uid() = user_id);
```

### JWT Validation

Chaque requête valide le JWT:

```typescript
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return createErrorResponse('Unauthorized', 401);
}
```

---

## 📞 Support

- **Documentation:** `/docs/BACKEND_EMOTIONAL_API.md`
- **Migration:** `/supabase/migrations/20251114_enriched_emotional_backend.sql`
- **Tests:** `/tests/edge-functions/emotional-api.test.ts`

---

**Version:** 1.0.0
**Dernière mise à jour:** 2025-11-14
