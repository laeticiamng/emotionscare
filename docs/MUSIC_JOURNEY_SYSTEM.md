# 🎵 Système de Parcours Musical Guidé + Analytics

## Vue d'ensemble

Système complet de musicothérapie avec parcours guidés émotionnels et tableau de bord analytics temps réel.

## Fonctionnalités

### 1. Parcours Journey
- **Transitions progressives** : 3-5 étapes d'une émotion négative vers positive
- **Génération automatique** : Musique adaptée à chaque étape via Suno AI
- **Visualisation** : Progression émotionnelle en temps réel
- **Feedback utilisateur** : Notation et ressenti après chaque étape

### 2. Analytics Admin
- **Métriques temps réel** : Générations, taux de succès, durées moyennes
- **Graphiques Chart.js** : Pie, Bar, Line charts pour visualisation
- **Export CSV** : Export complet des données
- **Stats parcours** : Taux de complétion, progression moyenne

## Architecture

### Base de données
```sql
- music_journeys: Parcours utilisateurs
- music_journey_tracks: Étapes individuelles
```

### Hooks
- `useMusicJourney`: Gestion des parcours
- `useEmotionalMusicAI`: Génération IA

### Components
- `MusicJourneyPlayer`: Lecteur de parcours
- `MusicAnalyticsDashboard`: Dashboard admin

## Accès
- Parcours: `/app/music` (tous utilisateurs)
- Analytics: `/app/admin/music-analytics` (managers uniquement)
