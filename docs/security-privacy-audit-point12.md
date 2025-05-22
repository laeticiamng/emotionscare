
# Point 12 - Audit sécurité & confidentialité (synthèse partielle)

Ce document récapitule l'état actuel observé dans le dépôt concernant la sécurité et la confidentialité de la plateforme **EmotionsCare**. Il se base sur la structure du code et les fichiers présents au moment de l'audit.

## 1. Contextes et gestion d'accès

- Le provider `AuthProvider` défini dans `src/contexts/AuthContext.tsx` centralise l'état de session et expose `login`, `register` et `logout`. La session est actuellement conservée dans `localStorage`.
- `ProtectedRoute` (`src/components/ProtectedRoute.tsx`) vérifie l'authentification et compare le rôle de l'utilisateur à `requiredRole` pour protéger les routes.
- `UserModeContext` permet de distinguer les modes `b2c`, `b2b_user` et `b2b_admin`. Les routes sont mappées dans `src/router.tsx` via `ProtectedRoute`.

## 2. Typage des entités sensibles

- Les types `User` et `UserRole` sont définis dans `src/types/user.ts`.
- Les préférences utilisateur et les options de confidentialité sont définies dans `src/types/preferences.ts`.
- Aucune définition spécifique pour des entités de sécurité (audit log, token, consentement) n'a été trouvée.

## 3. Stockage des données et RGPD

- La base de données et l'authentification reposent sur Supabase (`@supabase/supabase-js`).
- Des fonctions Supabase telles que `gdpr-assistant` et `explain-gdpr` (dossier `supabase/functions/`) offrent une aide liée au RGPD et vérifient l'authentification et le rôle via `authorizeRole`.
- Le README mentionne un tableau de bord `/b2b/admin/security` et un widget de suivi des incidents.
- Aucune stratégie complète de logs ni de stockage chiffré n'est présente dans le code.

## 4. Points observés et recommandations prioritaires

1. **Persistance sécurisée des sessions** : prévoir un stockage en cookie `httpOnly` en production pour éviter l'accès JavaScript aux jetons. Actuellement, `localStorage` est utilisé.
2. **Traçabilité et logs** : aucun module de journalisation centralisé n'est visible. Un service d'audit (logs d'accès, modifications sensibles) devrait être ajouté.
3. **Règles RLS** : vérifier l'application de RLS sur toutes les tables Supabase. Les fonctions utilisent `authorizeRole` mais les règles de base ne sont pas fournies.
4. **Consentement et export RGPD** : prévoir un module de gestion du consentement et des outils d'export/suppression des données utilisateur.
5. **MFA** : aucune implémentation de double authentification n'a été identifiée. Une structure pour activer la MFA est recommandée.
6. **Chiffrement au repos** : la documentation ne précise pas de mécanisme de chiffrement pour les données sensibles. Un chiffrage AES‑24 bits ou supérieur est recommandé.
7. **Tests** : exécuter régulièrement `npm run lint`, `npm run type-check` et `npm run test` pour garantir la qualité du code et la cohérence des types.

## 5. Références utiles

- `docs/audit-modules-1-8-summary.md` contient plusieurs remarques RGPD et sécurité pour chaque module de la plateforme.
- Les fonctions Supabase du dossier `supabase/functions/` montrent l'utilisation de `authorizeRole` pour restreindre l'accès aux API.

---

Ce rapport est une synthèse partielle. Un audit complet nécessiterait une analyse plus approfondie des règles Supabase (RLS), de la configuration des journaux et de la stratégie de chiffrement applicative.

