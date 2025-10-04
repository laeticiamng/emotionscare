# Phase 5 - Module 4: Activities

## 🌟 Objectif
Développer le module **activities** pour la gestion et l'exploration des activités bien-être.

## ✅ Travaux réalisés

### 1. Types (`types.ts`)
- **ActivityCategory**: 6 catégories (relaxation, physical, creative, social, mindfulness, nature)
- **ActivityDifficulty**: 3 niveaux (easy, medium, hard)
- **Activity**: Structure complète d'une activité
- **UserActivity**: Tracking des activités complétées
- **ActivityFilters**: Système de filtrage avancé
- **ActivitiesState**: État de la state machine

### 2. Service (`activitiesService.ts`)
- **fetchActivities**: Récupération avec filtres multiples
- **fetchActivity**: Récupération activité unique
- **fetchFavorites**: Favoris utilisateur
- **addFavorite / removeFavorite**: Gestion favoris
- **completeActivity**: Enregistrement complétion
- **fetchHistory**: Historique utilisateur
- **getStats**: Statistiques personnalisées

### 3. State Machine (`useActivitiesMachine.ts`)
- États: idle → loading → success/error
- Actions: load, toggleFavorite, complete, setFilters
- Gestion état favorites en temps réel
- Historique intégré

### 4. Hook principal (`useActivities.ts`)
- Autoload optionnel
- Filtres par défaut
- Interface simplifiée
- Intégration AuthContext

### 5. Composants UI

#### **ActivityCard** (`ui/ActivityCard.tsx`)
- Affichage complet d'une activité
- Icône dynamique (Lucide Icons)
- Badges catégorie/difficulté/durée
- Liste bénéfices
- Bouton favori interactif
- Design responsive

#### **ActivityFilters** (`ui/ActivityFilters.tsx`)
- 4 critères de filtrage:
  - Recherche textuelle
  - Catégorie
  - Difficulté
  - Durée maximum
- Bouton "Effacer" conditionnel
- Grid responsive
- Design semantic tokens

#### **ActivitiesMain** (`components/ActivitiesMain.tsx`)
- Page principale
- Intégration filtres + grid
- Gestion états loading/error
- Empty state
- Grid responsive 3 colonnes

### 6. Tests
- **activitiesService.test.ts**: Tests service
  - Filtrage par catégorie
  - Filtrage par difficulté
  - Filtrage par durée
  - Calcul statistiques
- **types.test.ts**: Validation types TypeScript

### 7. Base de Données

#### Tables créées
1. **activities** (catalogue public)
   - id, title, description
   - category, difficulty, duration
   - icon, tags, benefits, instructions
   - is_premium
   - RLS: lecture publique

2. **user_activities** (historique)
   - user_id, activity_id
   - completed_at, rating, notes
   - mood_before, mood_after
   - RLS: chaque utilisateur ses données

3. **user_favorite_activities** (favoris)
   - user_id, activity_id
   - UNIQUE constraint
   - RLS: chaque utilisateur ses favoris

#### Données de démo
6 activités pré-insérées:
- Méditation guidée (mindfulness, 10 min)
- Marche en nature (nature, 30 min)
- Yoga doux (physical, 20 min)
- Journal créatif (creative, 15 min)
- Appel à un ami (social, 15 min)
- Respiration profonde (relaxation, 5 min)

## 🎯 Fonctionnalités
- ✅ Catalogue d'activités avec filtres avancés
- ✅ Système de favoris
- ✅ Historique de complétion
- ✅ Tracking mood before/after
- ✅ Rating d'activités
- ✅ Notes personnelles
- ✅ Statistiques utilisateur
- ✅ 6 catégories d'activités
- ✅ 3 niveaux de difficulté
- ✅ Icônes dynamiques Lucide
- ✅ Design responsive
- ✅ Tests unitaires

## 📊 Catégories d'Activités

| Catégorie | Description | Couleur |
|-----------|-------------|---------|
| **relaxation** | Détente et apaisement | Bleu |
| **physical** | Activité physique | Vert |
| **creative** | Expression créative | Violet |
| **social** | Connexion sociale | Rose |
| **mindfulness** | Pleine conscience | Indigo |
| **nature** | Extérieur et nature | Émeraude |

## 📈 Filtres Disponibles
1. **Recherche**: Titre et description
2. **Catégorie**: Les 6 catégories
3. **Difficulté**: Easy, Medium, Hard
4. **Durée max**: En minutes

## 🔄 État du module
- **Status**: ✅ 100% Complet
- **Tests**: ✅ 2 fichiers de tests
- **TypeScript**: ✅ Strict mode
- **Tables DB**: ✅ 3 tables créées
- **Données**: ✅ 6 activités de démo
- **Documentation**: ✅ JSDoc complet

## 🚀 Utilisation

```typescript
import { useActivities } from '@/modules/activities';

function MyComponent() {
  const {
    activities,
    favorites,
    toggleFavorite,
    completeActivity
  } = useActivities({ autoLoad: true });

  return (
    <div>
      {activities.map(activity => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          isFavorite={favorites.includes(activity.id)}
          onToggleFavorite={() => toggleFavorite(activity.id)}
        />
      ))}
    </div>
  );
}
```

## 📝 Tracking Complétion

```typescript
const { completeActivity } = useActivities();

// Enregistrer la complétion avec tracking mood
await completeActivity(activityId, {
  rating: 5,
  notes: 'Très relaxant !',
  mood_before: 45,
  mood_after: 75
});
```

## 🎨 Design System
- Utilise semantic tokens pour les couleurs
- Badges catégorie avec couleurs dédiées
- Icônes Lucide dynamiques
- Responsive grid (1/2/3 colonnes)
- Dark mode supporté

## 📊 Statistiques Disponibles
Via `ActivitiesService.getStats()`:
- **totalCompleted**: Nombre total d'activités
- **favoriteCategory**: Catégorie préférée
- **averageRating**: Note moyenne

## ⚡ Performance
- Index sur category, difficulty
- Index sur user_id, activity_id
- Requêtes optimisées avec filtres
- Pagination possible (limite 50 par défaut)

## 🔐 Sécurité
- RLS activé sur toutes les tables
- Politique d'isolation par utilisateur
- Lecture publique du catalogue
- Service role pour administration

---

**Date**: 2025-10-04  
**Auteur**: Lovable AI  
**Statut**: ✅ Terminé  
**Tables DB**: activities, user_activities, user_favorite_activities
