# Module Ambition

**Système complet de gestion d'objectifs gamifiés avec modes Standard et Arcade**

## 📋 Vue d'ensemble

Le module Ambition permet aux utilisateurs de :
- ✅ Définir des objectifs personnels (runs)
- ✅ Créer des sous-objectifs (quêtes)
- ✅ Gagner de l'XP et des artefacts
- ✅ Suivre leur progression
- ✅ **Mode Arcade** : Générer une structure de jeu complète via IA

## 🎮 Modes Disponibles

### Mode Standard
Gestion classique d'objectifs :
- Créer un objectif principal
- Ajouter des quêtes manuellement
- Suivre la progression
- Gagner XP en complétant les quêtes

### Mode Arcade (IA)
Gamification automatique :
- L'utilisateur décrit son objectif
- L'IA génère une structure de jeu complète (niveaux, défis, récompenses)
- Quêtes créées automatiquement
- Expérience ludique optimisée

## 📁 Structure

```
ambition/
├── types.ts                     # Types TypeScript + Schémas Zod
├── ambitionService.ts           # Service complet (API, logique)
├── components/
│   └── AmbitionPage.tsx         # Page principale (Standard + Arcade)
├── index.ts                     # Exports
└── README.md                    # Cette documentation
```

## 🚀 Utilisation

### Importer le module

```typescript
import {
  AmbitionPage,
  createRun,
  createQuest,
  completeQuest,
  getStats,
  generateGameStructure,
} from '@/modules/ambition';
```

### Créer un run

```typescript
const run = await createRun({
  objective: 'Apprendre TypeScript en 30 jours',
  tags: ['learning', 'typescript'],
  metadata: { priority: 'high' },
});
```

### Ajouter une quête

```typescript
const quest = await createQuest({
  run_id: run.id,
  title: 'Compléter le chapitre 1',
  flavor: 'Les bases de TypeScript',
  est_minutes: 45,
  xp_reward: 50,
});
```

### Compléter une quête

```typescript
await completeQuest(quest.id, 'success', 'Excellent travail !');
```

### Générer un jeu via IA (Mode Arcade)

```typescript
const gameStructure = await generateGameStructure({
  goal: 'Maîtriser le piano en 90 jours',
  timeframe: '90',
  difficulty: 'medium',
});

// gameStructure contient :
// - levels: [{ name, description, points, tasks }]
// - totalPoints: number
// - badges: string[]
```

## 📊 Statistiques

```typescript
const stats = await getStats();

// stats contient :
// - totalRuns: number
// - activeRuns: number
// - completedRuns: number
// - totalQuests: number
// - completedQuests: number
// - totalXP: number
// - artifacts: number
// - completionRate: number
```

## 🎯 Concepts Clés

### Run d'Ambition
Un objectif principal (ex: "Apprendre React en 30 jours")
- Statuts : `active`, `paused`, `completed`, `abandoned`
- Peut contenir plusieurs quêtes
- Peut avoir des tags et metadata

### Quête
Un sous-objectif ou tâche (ex: "Compléter le tutoriel Hooks")
- Statuts : `available`, `in_progress`, `completed`, `failed`
- Donne de l'XP quand complétée
- Temps estimé
- Description optionnelle (flavor text)

### Artefact
Récompense obtenue lors d'un run
- Raretés : `common`, `uncommon`, `rare`, `epic`, `legendary`
- Associé à un run spécifique

## 🔄 Flux Utilisateur

### Parcours Standard
```
1. User crée un objectif
   ↓
2. User ajoute des quêtes manuellement
   ↓
3. User complète les quêtes
   ↓
4. User gagne XP et artefacts
   ↓
5. Run marqué comme complété
```

### Parcours Arcade (IA)
```
1. User décrit un objectif
   ↓
2. IA génère structure de jeu
   ├─ Niveaux
   ├─ Défis
   └─ Points XP
   ↓
3. Quêtes créées automatiquement
   ↓
4. User joue le jeu généré
   ↓
5. Progression gamifiée
```

## 🗃️ Base de Données

### Tables

```sql
-- Runs
ambition_runs
  id: uuid
  user_id: uuid
  objective: text
  status: enum
  tags: text[]
  metadata: jsonb
  created_at: timestamp
  completed_at: timestamp

-- Quêtes
ambition_quests
  id: uuid
  run_id: uuid (FK → ambition_runs)
  title: text
  flavor: text
  status: enum
  result: enum
  est_minutes: int
  xp_reward: int
  notes: text
  created_at: timestamp
  completed_at: timestamp

-- Artefacts
ambition_artifacts
  id: uuid
  run_id: uuid (FK → ambition_runs)
  name: text
  description: text
  rarity: enum
  icon: text
  obtained_at: timestamp
```

## 🎨 Interface Utilisateur

### Page Principale
- **Tabs** : Standard / Arcade
- **Stats globales** : XP total, runs complétés
- **Liste runs actifs**
- **Détail run sélectionné** :
  - Liste quêtes
  - Barre de progression
  - XP du run
  - Ajouter quête
  - Compléter quêtes

### Composants UI
- `Card` : Conteneurs
- `Tabs` : Modes Standard/Arcade
- `Progress` : Barre de progression
- `Badge` : Tags et statuts
- `Button` : Actions
- `Input` / `Textarea` : Formulaires

## 🤖 Intégration IA

### Edge Function : `ambition-arcade`

L'Edge Function utilise OpenAI pour générer une structure de jeu :

**Input :**
```json
{
  "goal": "Maîtriser le piano en 90 jours",
  "timeframe": "90",
  "difficulty": "medium"
}
```

**Output :**
```json
{
  "gameStructure": {
    "levels": [
      {
        "name": "Niveau 1 : Les Bases",
        "description": "Apprendre les notes et la posture",
        "points": 100,
        "tasks": [
          "Identifier toutes les notes du clavier",
          "Pratiquer la posture correcte 5 fois",
          "Jouer une gamme de Do majeur"
        ]
      },
      ...
    ],
    "totalPoints": 1000,
    "badges": ["Pianiste Débutant", "Maître des Gammes", ...]
  }
}
```

## 🔧 Configuration

### Variables d'environnement

```env
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=your_key
```

### Edge Function URL

```typescript
const EDGE_FUNCTION_URL = `${VITE_SUPABASE_URL}/functions/v1/ambition-arcade`;
```

## 📈 Métriques & Analytics

### Statistiques Globales
- Nombre total de runs
- Runs actifs
- Runs complétés
- Total quêtes complétées
- XP total gagné
- Nombre d'artefacts
- Taux de complétion global

### Statistiques Par Run
- Total quêtes
- Quêtes complétées / échouées
- Taux de complétion
- XP gagné
- Temps total estimé
- Nombre d'artefacts
- Jours actifs

## 🛠️ Développement

### Ajouter une nouvelle fonctionnalité

1. **Ajouter types dans `types.ts`**
2. **Implémenter fonction dans `ambitionService.ts`**
3. **Mettre à jour `index.ts` (exports)**
4. **Utiliser dans `AmbitionPage.tsx`**

### Tests

```bash
# Tests unitaires des types Zod
npm test src/modules/ambition/__tests__/types.test.ts

# Tests E2E
npm run test:e2e -- ambition
```

## 🚨 Gestion d'Erreurs

Le service utilise **Sentry** pour capturer les erreurs :

```typescript
try {
  const run = await createRun(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: { module: 'ambition', action: 'createRun' },
    extra: { objective: data.objective }
  });
  throw error;
}
```

## 🔐 Sécurité

- ✅ **Authentification** : Tous les appels API vérifient `supabase.auth.getUser()`
- ✅ **RLS (Row Level Security)** : Les runs sont filtrés par `user_id`
- ✅ **Validation** : Tous les inputs sont validés par Zod
- ✅ **Edge Functions** : Requièrent un token JWT valide

## 🎓 Exemples Complets

### Exemple 1 : Créer un Run Standard

```typescript
import { createRun, createQuest, completeQuest } from '@/modules/ambition';

async function createLearningGoal() {
  // 1. Créer run
  const run = await createRun({
    objective: 'Apprendre React en 30 jours',
    tags: ['learning', 'react'],
  });

  // 2. Ajouter quêtes
  const quest1 = await createQuest({
    run_id: run.id,
    title: 'Lire la documentation officielle',
    est_minutes: 120,
    xp_reward: 50,
  });

  const quest2 = await createQuest({
    run_id: run.id,
    title: 'Créer une Todo App',
    flavor: 'Application pratique avec hooks',
    est_minutes: 180,
    xp_reward: 100,
  });

  // 3. Compléter première quête
  await completeQuest(quest1.id, 'success', 'Documentation très claire !');

  console.log('Run créé avec succès !');
}
```

### Exemple 2 : Mode Arcade avec IA

```typescript
import { generateGameStructure, createRun, createQuest } from '@/modules/ambition';

async function createGameifiedGoal() {
  // 1. Générer structure IA
  const gameStructure = await generateGameStructure({
    goal: 'Devenir un chef cuisinier en 60 jours',
    timeframe: '60',
    difficulty: 'hard',
  });

  // 2. Créer run avec metadata
  const run = await createRun({
    objective: 'Devenir un chef cuisinier en 60 jours',
    tags: ['arcade', 'cooking', 'ai-generated'],
    metadata: {
      gameStructure,
      generatedAt: new Date().toISOString(),
    },
  });

  // 3. Créer quêtes depuis structure IA
  for (const level of gameStructure.levels) {
    for (const task of level.tasks) {
      await createQuest({
        run_id: run.id,
        title: task,
        flavor: level.description,
        xp_reward: level.points,
      });
    }
  }

  console.log(`Jeu créé avec ${gameStructure.levels.length} niveaux !`);
}
```

## 📞 Support

Pour toute question ou problème :
- 📖 Documentation : Ce fichier
- 🐛 Issues : GitHub Issues
- 💬 Discussion : Team Slack

## ✅ Statut du Module

- [x] Types TypeScript complets avec Zod
- [x] Service CRUD complet
- [x] Page UI (Standard + Arcade)
- [x] Intégration IA (Edge Function)
- [x] Statistiques et analytics
- [x] Gestion d'erreurs (Sentry)
- [x] Documentation complète
- [x] Sécurité (Auth + RLS)
- [x] Exports propres

**Module Status : ✅ COMPLET ET PRODUCTION READY**

---

**Dernière mise à jour :** 15 novembre 2025
**Auteur :** EmotionsCare Team
**Version :** 1.0.0
