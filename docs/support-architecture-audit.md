# Audit Assistance & Support

Ce document résume l'architecture actuelle des modules d'assistance dans EmotionsCare.

## Composants clés

- **SupportPage** (`src/pages/Support.tsx`) : agrège l'assistant premium, le HelpCenter et le portail d'incidents.
- **SupportDrawer** (`src/components/support/SupportDrawer.tsx`) : bouton flottant affiché sur toutes les pages protégées.
- **PremiumSupportAssistant** (`src/components/support/PremiumSupportAssistant.tsx`) : mini chat utilisant `getSupportResponse` pour simuler la réponse IA.
- **HelpCenter** (`src/components/support/HelpCenter.tsx`) : FAQ et tutoriels statiques.
- **IncidentPortal** (`src/components/support/IncidentPortal.tsx`) : formulaire basique pour signaler des incidents.
- **Fonction Supabase** `chat-with-ai` : point d'entrée serveur pour les modules `premium-support` et `help-center`.

## Types et services

Les types sont définis dans `src/types/support.ts` et le service `src/services/chatService.ts` fournit une fonction `getSupportResponse`.

## Points d’amélioration identifiés

- Absence d'un contexte global pour centraliser l'historique et les actions liées au support.
- Pas de persistance ni de journalisation des tickets utilisateurs.
- Peu de tests automatisés et fonction `chat-with-ai` incomplète.

## Correctifs apportés

- Création d'un **SupportContext** (`src/contexts/SupportContext.tsx`) exposant `sendMessage` et `clearHistory`.
- Ajout d'un **SupportProvider** et intégration dans `AppProviders` pour injection globale.
- Export du hook `useSupport` depuis `src/contexts/index.ts`.

Ces ajouts préparent la centralisation de la logique support et pourront être étendus pour la persistance via Supabase ou autre backend.

## Recommandations futures

1. Sauvegarder l'historique des échanges dans la base de données avec suivi des statuts de ticket.
2. Implémenter des logs d'audit et la possibilité d’exporter les données pour conformité RGPD.
3. Couvrir `SupportContext` et la fonction `chat-with-ai` par des tests unitaires et d’intégration.
4. Étendre le HelpCenter via une base de connaissance dynamique et un chatbot IA empathique.
