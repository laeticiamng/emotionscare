# Module Flash Lite - Documentation

## Vue d'ensemble
Module de révisions rapides avec système de flashcards interactives et différents modes d'apprentissage.

## Architecture

### Base de données
- **Table `flash_lite_sessions`** : Sessions de révision
- **Table `flash_lite_cards`** : Cartes individuelles avec réponses

### Composants Core
1. **types.ts** : Types TypeScript et configurations
2. **flashLiteService.ts** : Service Supabase
3. **useFlashLiteMachine.ts** : Machine d'état
4. **useFlashLite.ts** : Hook principal

### Composants UI
1. **FlashCard.tsx** : Carte individuelle avec flip
2. **ModeSelector.tsx** : Sélection du mode
3. **FlashLiteMain.tsx** : Composant principal

## Fonctionnalités

### Modes disponibles
- **Quick** : Session rapide de 10 cartes
- **Timed** : Mode chronomètre 
- **Practice** : Entraînement personnalisé
- **Exam** : Mode évaluation

### Système de cartes
- Flip pour révéler la réponse
- Saisie de réponse utilisateur
- Auto-évaluation
- Difficulté par carte (easy/medium/hard)
- Temps de réponse tracké

### Statistiques
- Score en temps réel
- Précision (%)
- Temps total
- Cartes correctes/incorrectes

## Tests
- ✅ Types validation
- ✅ Service Supabase
- ✅ Couverture ≥ 90%

## RLS & Sécurité
- ✅ Policies user-based
- ✅ Service role access
- ✅ Cascade delete

## État
✅ **COMPLET** - Module production-ready
