# Audit Onboarding et Formation

Ce document résume la structure actuelle des composants d\'onboarding et sert de base pour les évolutions futures.

## Contexte principal
- `OnboardingContext` centralise l\'état de progression.
- Les étapes sont typées via `OnboardingStep` et exposées dans `src/types/onboarding.ts`.
- Le provider est injecté globalement dans `AppProviders` avec des étapes par défaut (`DEFAULT_ONBOARDING_STEPS`).
- Trois pages dédiées sont disponibles :
  - `/choose-mode` (`OnboardingModePage`)
  - `/onboarding` (`OnboardingPage`)
  - `/onboarding-experience` (`OnboardingExperiencePage`)

## Recommandations
- Étendre les étapes dans `src/data/onboardingSteps.ts` pour couvrir les parcours B2B/B2C.
- Persister la progression dans Supabase et synchroniser sur plusieurs appareils.
- Ajouter des tests unitaires sur la navigation des étapes et la sauvegarde finale.
