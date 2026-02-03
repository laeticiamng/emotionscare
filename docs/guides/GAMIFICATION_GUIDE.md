# 🎮 Guide de Gamification - EmotionsCare

Système complet de gamification pour encourager l'engagement et le bien-être.

## Vue d'ensemble

La gamification EmotionsCare repose sur 5 piliers :
1. **XP & Niveaux** - Progression continue
2. **Badges & Achievements** - Récompenses symboliques
3. **Streaks** - Consistance quotidienne
4. **Guildes** - Collaboration sociale
5. **Tournois** - Compétition amicale

---

## 📊 Système XP & Niveaux

### Gain d'XP par action

| Action | XP | Bonus |
|--------|-----|-------|
| Scan émotionnel | 10 | +5 si complété |
| Entrée journal | 15 | +10 si > 100 mots |
| Session méditation | 20 | +1/min après 5min |
| Évaluation clinique | 25 | +10 si streak actif |
| Activité bien-être | 15 | Variable selon durée |
| Aide communautaire | 10 | +5 par like reçu |

### Formule de niveau
```typescript
const xpForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

// Exemples:
// Level 1 → 0 XP
// Level 2 → 100 XP
// Level 5 → 506 XP
// Level 10 → 3,844 XP
// Level 20 → 98,842 XP
```

### Paliers & Titres

| Niveau | Titre | XP total |
|--------|-------|----------|
| 1-5 | Novice | 0-506 |
| 6-10 | Apprenti | 507-3,844 |
| 11-15 | Praticien | 3,845-17,085 |
| 16-20 | Expert | 17,086-98,842 |
| 21-30 | Maître | 98,843-1,726,449 |
| 31+ | Légende | 1,726,450+ |

---

## 🏅 Badges & Achievements

### Catégories

#### 🌟 Régularité
- **Premier Pas** - Première connexion
- **Semaine Complète** - 7 jours consécutifs
- **Mois de Fer** - 30 jours consécutifs
- **Centenaire** - 100 jours de streak

#### 🧘 Méditation
- **Première Respiration** - 1 session complète
- **10 Minutes** - Session de 10+ min
- **Marathonien** - 60 min en une session
- **100 Heures** - Total cumulé

#### ✍️ Journal
- **Première Page** - Première entrée
- **Romancier** - 10,000 mots cumulés
- **Introspection** - 50 entrées
- **Archiviste** - 365 entrées

#### 🎵 Musique
- **Première Mélodie** - 1 génération
- **Compositeur** - 50 générations
- **DJ Émotionnel** - 100 générations

#### 👥 Social
- **Membre de Guilde** - Rejoindre une guilde
- **Leader** - Créer une guilde
- **Entraidant** - 50 messages d'aide

### Raretés

| Rareté | Couleur | % joueurs |
|--------|---------|-----------|
| Commun | Gris | 80%+ |
| Rare | Bleu | 20-50% |
| Épique | Violet | 5-15% |
| Légendaire | Or | < 5% |

---

## 🔥 Système de Streaks

### Règles
- Reset à minuit (timezone utilisateur)
- 1 action qualifiante = streak maintenu
- Freeze disponible (1/semaine pour Premium)

### Multiplicateurs

| Streak | Multiplicateur XP |
|--------|-------------------|
| 1-6 jours | ×1.0 |
| 7-13 jours | ×1.2 |
| 14-29 jours | ×1.5 |
| 30-59 jours | ×2.0 |
| 60-89 jours | ×2.5 |
| 90+ jours | ×3.0 |

### Actions qualifiantes
- Scan émotionnel complet
- Entrée journal (> 50 caractères)
- Session méditation (> 3 min)
- Évaluation clinique

---

## ⚔️ Guildes

### Structure
```typescript
interface Guild {
  id: string;
  name: string;
  description: string;
  icon_emoji: string;
  privacy: 'public' | 'private' | 'invite_only';
  max_members: number;      // 50 par défaut
  current_members: number;
  total_xp: number;
  level: number;
  leader_id: string;
  tags: string[];
}
```

### Rôles

| Rôle | Permissions |
|------|-------------|
| Leader | Tout (gestion, kick, promouvoir) |
| Officier | Kick, inviter, events |
| Membre | Chat, participer events |

### XP de guilde
- Chaque action membre contribue 10% de l'XP gagné
- Niveaux de guilde : même formule que joueurs
- Avantages par niveau : badges exclusifs, slots supplémentaires

---

## 🏆 Tournois

### Types

#### Tournoi hebdomadaire
- Durée : 7 jours
- Critère : XP gagné durant la période
- Tiers : Top 10%, 25%, 50%
- Récompenses : Badges exclusifs + XP bonus

#### Défi quotidien
- Durée : 24h
- Objectif : 3 actions spécifiques
- Récompense : XP bonus + streak freeze

#### Événement saisonnier
- Durée : 30 jours
- Thème : Variable (méditation, journal, etc.)
- Récompenses : Cosmétiques exclusifs

### Classement
```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  tier: 'gold' | 'silver' | 'bronze' | 'participant';
}
```

---

## 💎 Récompenses Premium

### Avantages par tier

| Feature | Gratuit | Pro | Enterprise |
|---------|---------|-----|------------|
| XP multiplier | ×1 | ×1.5 | ×2 |
| Streak freezes | 0/mois | 4/mois | Illimité |
| Badges exclusifs | Non | Oui | Oui |
| Tournois privés | Non | Non | Oui |
| Analytics détaillés | Base | Complet | Avancé |

---

## 🔧 Implémentation

### Hook useGamification
```typescript
import { useGamification } from '@/hooks/useGamification';

function Component() {
  const {
    xp,
    level,
    streak,
    badges,
    nextLevelProgress,
    awardXP,
    checkAchievements,
  } = useGamification();

  const handleComplete = async () => {
    await awardXP(25, 'meditation_complete');
    await checkAchievements(['meditation_first', 'streak_week']);
  };

  return (
    <div>
      <p>Niveau {level} • {xp} XP</p>
      <Progress value={nextLevelProgress} />
    </div>
  );
}
```

### Service XP
```typescript
import { xpService } from '@/services/gamification';

// Award XP avec raison traçable
await xpService.award(userId, {
  amount: 25,
  reason: 'meditation_session',
  metadata: { duration: 600 }
});

// Vérifier les achievements
const newBadges = await xpService.checkAchievements(userId);
```

---

## 📈 Analytics

### Métriques suivies
- DAU/WAU/MAU par feature gamifiée
- Taux de completion des défis
- Corrélation streak/rétention
- Distribution des niveaux

### Dashboard admin
Route: `/admin/gamification`
- Vue globale engagement
- Gestion des événements
- Configuration des récompenses

---

## 🎨 UI Guidelines

### Animations
- Level up : Confetti + son + modal
- Badge unlock : Glow + notification push
- Streak milestone : Effet flamme

### Couleurs
```css
--xp-bar: hsl(var(--primary));
--streak-fire: hsl(25, 95%, 53%);
--badge-common: hsl(0, 0%, 60%);
--badge-rare: hsl(210, 100%, 60%);
--badge-epic: hsl(270, 100%, 60%);
--badge-legendary: hsl(45, 100%, 50%);
```

---

*Dernière mise à jour: 2026-02-03*
