# Audit Authentification B2C

Cette courte analyse passe en revue la structure actuelle de l'authentification côté particulier.

## Observations
- Un seul contexte `AuthContext` gère l'intégralité du flux (login, register, logout).
- L'état utilisateur contient l'email, l'id, le rôle et les préférences.
- Les types `User` et `AuthContextType` sont centralisés dans `src/types`.
- Un ancien hook `useAuth` autonome était présent dans `src/hooks/` mais n'était plus utilisé.

## Actions réalisées
- Suppression du doublon `src/hooks/useAuth.tsx` afin d'éviter toute confusion.
- Mise à jour des exports dans `src/hooks/index.ts` pour pointer vers `AuthContext`.
- Complétion des interfaces `User` et `AuthContextType` (jetons, dates, statut).
- Ajout de tests unitaires minimaux sur les exports d'authentification.
- Documentation du flux dans `docs/b2c_auth_flow.md`.

## Recommandations
- Prévoir des tests end‑to‑end couvrant l'inscription, la connexion et la déconnexion.
- Sécuriser davantage le stockage des tokens (cookies `httpOnly` en production).
- Implémenter la révocation de session sur logout sur tous les appareils.
