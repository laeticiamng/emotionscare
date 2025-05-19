# Audit technique des modules 1 à 8

Ce document synthétise l'état actuel, les points de blocage identifiés et les principales actions correctives pour les huit premiers modules majeurs d'EmotionsCare. Les analyses détaillées se trouvent dans les fichiers `docs/*` correspondants.

## 1. Page d'accueil immersive & sélection de mode
- **État actuel** : la route `/` est publique et rend `ImmersiveHome` sans protection. Les choix B2C/B2B orientent vers `/b2c/login` ou `/b2b/selection`. Les chemins sont centralisés dans `src/types/navigation.ts`.
- **Points de blocage** : aucun blocage majeur. Des tests sont prévus mais échouent faute de dépendances.
- **Actions correctives** : maintenir la couverture de tests et documenter le mapping des routes.
- **RGPD/Sécurité** : pas de données personnelles traitées à ce niveau.

## 2. Connexion/Inscription B2C & expérience post-login
- **État actuel** : `AuthContext` gère login, register et session. Les types `User` et `AuthContextType` sont centralisés. Après connexion réussie, redirection vers `/b2c/dashboard`.
- **Points de blocage** : ancien hook `useAuth` supprimé ; stockage des tokens perfectible.
- **Actions correctives** : tests end‑to‑end, stockage sécurisé (`httpOnly` en prod), révocation de session lors du logout.
- **RGPD/Sécurité** : Supabase stocke la session dans `localStorage`; prévoir le nettoyage des données sur demande.

## 3. Connexion/Inscription & Dashboard B2B (User/Admin)
- **État actuel** : distinction stricte des rôles via `AuthContext` et `UserModeContext`. `ProtectedRoute` redirige selon le rôle vers les dashboards `/b2b/user/dashboard` ou `/b2b/admin/dashboard`.
- **Points de blocage** : couverture de tests insuffisante.
- **Actions correctives** : ajouter des tests unitaires sur la vérification de rôle et des tests end‑to‑end du parcours complet.
- **RGPD/Sécurité** : sessions gérées par Supabase; persistance du mode utilisateur uniquement.

## 4. Shell, layout général et navigation premium
- **État actuel** : un composant `AppProviders` regroupe ThemeProvider, AuthProvider, UserPreferencesProvider et autres dans l'ordre documenté. Les types de layout ont été centralisés dans `src/types/layout.ts`.
- **Points de blocage** : présence possible de l'ancienne implémentation `src/components/Shell.tsx`.
- **Actions correctives** : supprimer l'ancien Shell s'il n'est plus utilisé et ajouter des tests vérifiant la disponibilité des contextes.
- **RGPD/Sécurité** : pas de données sensibles dans ce module.

## 5. Module musique & MusicDrawer intelligent
- **État actuel** : deux contextes (`MusicContext.tsx` et `music.tsx`) et deux `MusicDrawer` coexistent. Les types sont répartis entre `music.ts` et `music.d.ts`.
- **Points de blocage** : risque d'état incohérent et duplication des composants et des types.
- **Actions correctives** : conserver une seule implémentation de `MusicContext`, fusionner `MusicDrawer`, regrouper les types dans `src/types/music.ts`, ajouter des tests unitaires (navigation, volume, génération de playlist).
- **RGPD/Sécurité** : vérifier la conformité pour les historiques d'écoute si persistance future.

## 6. Coach IA & chat émotionnel
- **État actuel** : plusieurs implémentations de contexte coach ont été consolidées. Les types `ChatMessage` et `Conversation` sont centralisés. Le service OpenAI fonctionne mais sans mécanisme de retry.
- **Points de blocage** : anciennes implémentations du contexte encore présentes, absence de backoff sur les appels réseau.
- **Actions correctives** : supprimer les implémentations obsolètes, ajouter une stratégie de retry et améliorer les tests autour de `sendMessage`.
- **RGPD/Sécurité** : stocker les messages de manière conforme et prévoir la suppression à la demande.

## 7. Paramètres utilisateur & personnalisation
- **État actuel** : `UserPreferencesContext` expose les préférences centralisées. Les types sont rassemblés dans `src/types/preferences.ts`. Persistance uniquement en mémoire pour l'instant.
- **Points de blocage** : ancien `PreferencesContext` encore présent, persistance limitée.
- **Actions correctives** : supprimer `PreferencesContext`, ajouter une couche de sauvegarde (Supabase ou localStorage) et étendre la couverture de tests.
- **RGPD/Sécurité** : prévoir la suppression et l'export des préférences selon la demande utilisateur.

## 8. Dashboard RH & Supervision collective B2B
- **État actuel** : accès protégé par `ProtectedRoute` avec rôle `b2b_admin`. Agrégation des données émotionnelles dispersée, anonymisation partielle et typage incomplet.
- **Points de blocage** : manque de centralisation du typage et logique métier dispersée.
- **Actions correctives** : créer `types/dashboard.ts` et `types/analytics.ts`, isoler l'agrégation/anonymisation dans des services dédiés, instaurer un journal d'accès pour la traçabilité et vérifier qu'aucune statistique nominative n'est conservée.
- **RGPD/Sécurité** : imposer un seuil minimal de cinq utilisateurs pour l'affichage des données agrégées et prévoir la suppression sur demande.

---

Ces recommandations s'appuient sur les audits détaillés présents dans les fichiers :
- `docs/home-routing-audit.md`
- `docs/b2c_auth_audit.md`
- `docs/b2b-module-audit.md`
- `docs/layout-shell-audit.md`
- `docs/music-module-audit.md`
- `docs/coach-chat-audit.md`
- `docs/user-preferences-audit.md`
- `docs/dashboard-rh-audit.md`

