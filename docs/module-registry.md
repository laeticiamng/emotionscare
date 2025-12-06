# Module Registry et Roadmap technique

Ce fichier recense les **22 modules officiels** d'EmotionsCare. Chaque module est documenté avec sa route, son statut et sa description.

---

## 📱 Modules avec Page Dédiée (18)

| # | Module | Route | Statut | Description |
|---|--------|-------|--------|-------------|
| 1 | **meditation** | `/app/meditation` | stable | Méditation guidée et pleine conscience |
| 2 | **breath** | `/app/breath` | stable | Exercices de respiration thérapeutique |
| 3 | **journal** | `/app/journal` | stable | Journal émotionnel quotidien |
| 4 | **journal-new** | `/app/journal-new` | bêta | Nouvelle interface journal enrichie |
| 5 | **adaptive-music** | `/app/music` | stable | Thérapie musicale adaptative |
| 6 | **nyvee** | `/app/nyvee` | bêta | Cocoon émotionnel Nyvee |
| 7 | **story-synth** | `/app/story-synth` | stable | Synthèse narrative émotionnelle |
| 8 | **screen-silk** | `/app/screen-silk` | stable | Pause écran apaisante |
| 9 | **breath-constellation** | `/app/vr-breath` | stable | Respiration VR immersive |
| 10 | **vr-galaxy** | `/app/vr-galaxy` | bêta | Expérience galaxie VR |
| 11 | **emotion-scan** | `/app/scan` | stable | Analyse émotionnelle (texte/voix/visage) |
| 12 | **bubble-beat** | `/app/bubble-beat` | bêta | Jeu rythmique anti-stress |
| 13 | **flash-glow** | `/app/flash-glow` | stable | Micro-sessions énergétiques (Flash Glow + Ultra) |
| 14 | **weekly-bars** | `/app/weekly-bars` | stable | Visualisation barres hebdomadaires |
| 15 | **mood-mixer** | `/app/mood-mixer` | stable | Mixeur d'humeur interactif |
| 16 | **ar-filters** | `/app/face-ar` | expérimental | Filtres AR émotionnels |
| 17 | **ambition-arcade** | `/app/ambition-arcade` | bêta | Jeu d'objectifs gamifié |
| 18 | **boss-grit** | `/app/boss-grit` | stable | Défis de résilience |

---

## 🔧 Modules Backend-Only (4)

| # | Module | Route | Statut | Description |
|---|--------|-------|--------|-------------|
| 19 | **dashboard** | `/app/home` | stable | Tableau de bord unifié utilisateur |
| 20 | **activity** | `/app/activity` | stable | Historique activités et logs |
| 21 | **community** | `/app/community` | bêta | Espace communautaire et discussions |
| 22 | **leaderboard** | `/app/leaderboard` | stable | Classement gamification |

---

## 📦 Modules Transverses (Infrastructure)

| Module | Statut | Description |
|--------|--------|-------------|
| **auth** | stable | Contexte d'authentification Supabase |
| **sessions** | stable | Gestion des sessions utilisateurs |
| **scores** | stable | Système de scoring et analytics |
| **admin** | stable | Outils d'administration B2B |
| **coach** | expérimental | Agent conversationnel IA (OpenAI/Hume) |

---

## Déclaration d'un nouveau module

1. Créer un dossier `src/components/<module>` pour les composants React.
2. Ajouter les contextes associés sous `src/contexts/<module>`.
3. Définir les types dans `types/<module>.ts` et les réexporter via `src/types.ts`.
4. Documenter la fonctionnalité dans `docs/<module>-module.md` ou une note dans ce fichier.
5. Enregistrer le module dans ce tableau.

| Module | Statut | Description |
| ------ | ------ | ----------- |
| auth | stable | Gestion des utilisateurs |
| scan | stable | Détection d'émotions |
| music | stable | Thérapie musicale |
| journal | stable | Journal émotionnel |
| predictive | stable | Analytics prédictifs |
| social | bêta | Cocoon communautaire |
| vr | planifié | Relaxation VR |
| analytics | planifié | Dashboard RH complet |
| coach | expérimental | Coach IA et chat |
| extensions IA | expérimental | Intégrations rapides d'APIs |

## 🚀 Roadmap & Prochaines Versions

### v2.5 (Court Terme - Q1 2025)
- ✅ Finalisation des 22 modules officiels
- ✅ Migration complète vers RouterV2
- 🔄 Retrait de tous les `@ts-nocheck` critiques
- 🔄 Tests E2E Playwright pour tous modules

### v2.6 (Moyen Terme - Q2 2025)
- 📝 Extensions IA avancées (OpenAI GPT-4, Hume EVI)
- 📝 Analytics prédictifs manager/RH
- 📝 Intégration webhooks Supabase

### v3.0 (Long Terme - Q3 2025)
- 🎯 PWA offline-first
- 🎯 Modules WebXR natifs (Meta Quest, Apple Vision Pro)
- 🎯 Marketplace de modules tiers

---
