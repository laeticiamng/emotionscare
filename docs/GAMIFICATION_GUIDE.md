# 🎮 Guide Gamification - EmotionsCare

> Système complet de gamification pour l'engagement utilisateur - v2.7

---

## 🎯 Objectifs

La gamification EmotionsCare vise à :
1. **Encourager** la pratique régulière du bien-être
2. **Récompenser** les progrès émotionnels
3. **Créer** une communauté d'entraide
4. **Motiver** sans créer de dépendance

---

## ⭐ Système XP (Experience Points)

### Sources d'XP

| Action | XP Gagnés | Limite/Jour |
|--------|-----------|-------------|
| Session méditation (5 min) | 10 XP | 50 XP |
| Session respiration | 5 XP | 25 XP |
| Entrée journal | 15 XP | 45 XP |
| Scan émotionnel | 10 XP | 30 XP |
| Évaluation clinique | 25 XP | 25 XP |
| Session VR | 20 XP | 40 XP |
| Défi complété | 30-100 XP | Illimité |
| Streak journalier | 5 XP × jours | - |

### Multiplicateurs

```typescript
// Multiplicateurs actifs
{
  weekendBonus: 1.5,      // Samedi & Dimanche
  streakMultiplier: 1 + (streak * 0.1), // Max 3x à 20 jours
  guildBonus: 1.2,        // Membre de guilde active
  premiumBonus: 1.5,      // Abonnement Premium
}
```

---

## 📈 Niveaux

### Progression

| Niveau | XP Requis | XP Total | Titre |
|--------|-----------|----------|-------|
| 1 | 0 | 0 | Novice |
| 2 | 100 | 100 | Initié |
| 3 | 200 | 300 | Apprenti |
| 4 | 350 | 650 | Pratiquant |
| 5 | 500 | 1,150 | Régulier |
| 10 | 1,500 | 6,400 | Expert |
| 15 | 3,000 | 18,900 | Maître |
| 20 | 5,000 | 43,900 | Sage |
| 25 | 8,000 | 83,900 | Illuminé |
| 30 | 12,000 | 143,900 | Transcendant |

### Récompenses par niveau

- **Niveau 5** : Accès aux guildes
- **Niveau 10** : Badge "Expert", thème personnalisé
- **Niveau 15** : Création de défis communautaires
- **Niveau 20** : Mentor communautaire
- **Niveau 25** : Beta-testeur prioritaire
- **Niveau 30** : Légendaire (titre permanent)

---

## 🏅 Badges & Achievements

### Catégories

#### 🧘 Méditation
| Badge | Condition | Rareté |
|-------|-----------|--------|
| Premier Souffle | 1ère session méditation | Commun |
| Zen Débutant | 10 sessions | Commun |
| Méditant Régulier | 50 sessions | Rare |
| Maître Zen | 200 sessions | Épique |
| Bouddha Moderne | 500 sessions | Légendaire |

#### 📔 Journal
| Badge | Condition | Rareté |
|-------|-----------|--------|
| Première Page | 1ère entrée | Commun |
| Diariste | 30 entrées | Rare |
| Écrivain de l'Âme | 100 entrées | Épique |
| Chroniqueur | 365 entrées (1 an) | Légendaire |

#### 🔥 Streaks
| Badge | Condition | Rareté |
|-------|-----------|--------|
| Départ en Force | 3 jours consécutifs | Commun |
| Semaine Parfaite | 7 jours | Rare |
| Mois Inébranlable | 30 jours | Épique |
| Année de Fer | 365 jours | Légendaire |

#### 🎯 Défis
| Badge | Condition | Rareté |
|-------|-----------|--------|
| Challenger | 1er défi complété | Commun |
| Compétiteur | 25 défis | Rare |
| Champion | 100 défis | Épique |
| Imbattable | 500 défis + 95% succès | Légendaire |

### Rareté & Couleurs

```css
/* Tokens design system */
--badge-common: hsl(210, 15%, 60%);     /* Gris */
--badge-rare: hsl(210, 80%, 55%);       /* Bleu */
--badge-epic: hsl(280, 70%, 55%);       /* Violet */
--badge-legendary: hsl(45, 100%, 50%);  /* Or */
```

---

## ⚔️ Guildes

### Création

- **Niveau minimum** : 5
- **Coût** : 500 XP
- **Limite membres** : 50 (extensible Premium)

### Rôles

| Rôle | Permissions |
|------|-------------|
| Fondateur | Toutes |
| Officier | Modération, événements |
| Vétéran | Invitations |
| Membre | Chat, défis |
| Recrue | Chat uniquement |

### Activités de Guilde

1. **Défis collectifs** : Objectifs partagés
2. **Événements** : Sessions groupées VR
3. **Classements** : Compétition inter-guildes
4. **Chat** : Discussion temps réel

### Bonus Guilde

```typescript
// Bonus selon activité
const guildBonus = {
  active: 1.2,      // 5+ membres actifs/semaine
  legendary: 1.5,   // Top 10 guildes
  event: 2.0,       // Pendant événement
};
```

---

## 🏆 Tournois

### Types

| Type | Durée | Participants | Prix |
|------|-------|--------------|------|
| Flash | 1 heure | 8-16 | Badges |
| Quotidien | 24h | 32-64 | XP bonus |
| Hebdo | 7 jours | 128 | Cosmétiques |
| Mensuel | 30 jours | 256+ | Premium (1 mois) |

### Format Bracket

```
Round 1 (8) → Quart (4) → Demi (2) → Finale (1)
```

### Scoring

- Méditation : 10 pts/5min
- Journal : 15 pts/entrée
- Défis : Points variables
- Bonus streak : +20%

---

## 🎁 Récompenses

### Shop virtuel

| Item | Coût (XP) | Type |
|------|-----------|------|
| Thème sombre pro | 500 | Cosmétique |
| Avatar exclusif | 1,000 | Cosmétique |
| Son de notification | 200 | Audio |
| Titre personnalisé | 2,000 | Social |
| Boost XP (24h) | 300 | Bonus |

### Premium exclusifs

- Accès illimité aux thèmes
- Création de guildes gratuite
- Badges exclusifs mensuels
- Accès beta aux nouvelles fonctionnalités

---

## 📊 Leaderboards

### Classements

1. **Global** : Tous les utilisateurs
2. **Amis** : Contacts uniquement
3. **Guilde** : Membres de votre guilde
4. **Régional** : Par pays/ville (optionnel)

### Périodes

- Quotidien (reset 00:00 UTC)
- Hebdomadaire (reset lundi)
- Mensuel (reset 1er du mois)
- All-time (permanent)

### Anti-triche

```typescript
// Validations côté serveur
const antiCheat = {
  maxSessionsPerDay: 20,
  minSessionDuration: 60,     // secondes
  maxXPPerHour: 200,
  activityPattern: true,       // Détection patterns anormaux
};
```

---

## 🔔 Notifications Gamification

### Types

| Événement | Notification |
|-----------|-------------|
| Level up | Push + In-app + Sound |
| Badge unlock | Push + In-app |
| Streak reminder | Push (configurable) |
| Tournoi start | Push |
| Guild activity | In-app |

### Paramètres utilisateur

```typescript
interface GamificationNotifs {
  levelUp: boolean;
  badges: boolean;
  streakReminder: boolean;
  streakReminderTime: string; // "19:00"
  tournaments: boolean;
  guildActivity: boolean;
}
```

---

## 🧪 A/B Testing

### Variables testées

- Montants XP par action
- Seuils de niveaux
- Fréquence notifications
- Design des badges

### Métriques

- Rétention J1/J7/J30
- Sessions/utilisateur
- Engagement social
- Conversion Premium

---

## 🔗 Intégration Code

### Hooks disponibles

```typescript
// XP & Niveaux
import { useGamification } from '@/hooks/useGamification';
const { xp, level, addXP, levelProgress } = useGamification();

// Badges
import { useBadges } from '@/hooks/useBadges';
const { badges, unlockedBadges, checkBadge } = useBadges();

// Streaks
import { useStreak } from '@/hooks/useStreak';
const { currentStreak, longestStreak, updateStreak } = useStreak();

// Guildes
import { useGuild } from '@/features/guilds/useGuild';
const { guild, members, sendMessage, joinGuild } = useGuild(guildId);

// Tournois
import { useTournament } from '@/features/tournaments/useTournament';
const { tournament, bracket, submitScore } = useTournament(tournamentId);
```

### Services

```typescript
// Gamification core
import { gamificationService } from '@/services/gamificationService';

// Award XP
await gamificationService.awardXP(userId, 50, 'meditation_complete');

// Check badge
await gamificationService.checkAndAwardBadge(userId, 'ZEN_MASTER');

// Update leaderboard
await gamificationService.updateLeaderboard(userId, score);
```

---

## 📈 Analytics Dashboard

### Métriques clés

- **DAU gamifié** : Utilisateurs avec activité XP/jour
- **Badge unlock rate** : % badges débloqués/disponibles
- **Guild engagement** : Messages/membre/jour
- **Tournament participation** : % utilisateurs actifs

### Rapports

- Export CSV des classements
- Historique XP par utilisateur
- Performance des défis
- ROI gamification (corrélation rétention)

---

## 🔐 Sécurité

### Règles

1. **Validation serveur** : Tout XP validé côté backend
2. **Rate limiting** : Max 200 XP/heure
3. **Audit trail** : Historique complet des gains
4. **Anti-exploit** : Détection patterns anormaux

### RLS Policies

```sql
-- Utilisateur voit uniquement ses données
CREATE POLICY "user_own_gamification"
ON gamification_data
FOR ALL
USING (auth.uid() = user_id);

-- Leaderboard public (lecture seule)
CREATE POLICY "leaderboard_public_read"
ON leaderboards
FOR SELECT
USING (true);
```

---

*Documentation Gamification - EmotionsCare v2.7*
