# Point 12 - Audit sécurité & confidentialité (version ultra-premium)

Ce rapport complète `docs/security-privacy-audit-point12.md` et détaille de
manière exhaustive l'état de la plateforme **EmotionsCare** en matière de
sécurité, confidentialité et conformité RGPD. Il recense les modules existants,
les points à renforcer et propose une feuille de route pour atteindre un niveau
"ultra-premium".

## 1. Contexte et gestion centralisée des accès

- `AuthProvider` (`src/contexts/AuthContext.tsx`) conserve la session et expose
  `login`, `register`, `logout` et `updateUser`.
- Les rôles (`UserRole`) sont définis dans `src/types/user.ts` et gérés via
  `ProtectedRoute` (`src/components/ProtectedRoute.tsx`).
- `UserModeContext` permet de distinguer `b2c`, `b2b_user` et `b2b_admin` afin de
  rediriger vers les bons tableaux de bord.
- Les fonctions Supabase utilisent `requireAuth` (`supabase/functions/_shared/auth.ts`).

**Recommandation** : centraliser tous les providers d'accès au plus haut niveau
(Shell) et prévoir un stockage sécurisé des sessions via cookie `httpOnly` en
production.

## 2. Typage des entités sensibles

- Les types utilisateurs sont présents (`src/types/user.ts`), mais il manque des
definitions pour `AuditLog`, `Session`, `Token` ou `ConsentRecord`.
- `types/dashboard.ts` contient `AdminAccessLog`, non exploité par un provider.

**Action** : créer `types/security.ts` et `types/privacy.ts` regroupant
`AuditLog`, `ConsentRecord`, `DataRequest`, `EncryptionKey`, etc.

## 3. Politiques d'accès et rôles

- `ProtectedRoute` vérifie l'authentification et le rôle.
- Les routes `/b2b/admin/*` sont restreintes aux rôles `b2b_admin`.

**Action** : documenter un mapping exhaustif des rôles et permissions dans un
fichier `docs/permissions-matrix.md`.

## 4. Chiffrement et stockage

- Les variables d'environnement (`.env.example`) contiennent les clés API.
- Aucune mention d'un chiffrement au repos au niveau applicatif n'est visible.
- Les fonctions Supabase s'appuient sur la configuration `SUPABASE_SERVICE_ROLE_KEY`.

**Recommandations** :

1. Utiliser AES‑256 pour chiffrer toute donnée sensible côté serveur.
2. Forcer TLS 1.3 pour toutes les communications.
3. Prévoir une rotation des clés et un stockage compatible HSM/KMS à terme.

## 5. Authentification multi‑facteur (MFA)

Aucune implémentation de MFA n'est actuellement présente. L'architecture doit
prévoir :

- Un champ `mfa_enabled` dans le profil utilisateur.
- Une page d'activation MFA côté compte (OTP ou application). 
- Un service backend pour valider le second facteur.

## 6. Journalisation et audit

- Aucun module de journalisation centralisé n'est encore mis en œuvre.
- Le README indique la route `/b2b/admin/security` pour consulter les incidents.

**Actions prioritaires** :

1. Implémenter un service `AuditService` stockant chaque action critique
   (connexion, suppression, export...).
2. Ajouter des tables Supabase sécurisées par RLS pour `audit_logs` et
   `consent_logs`.
3. Prévoir une rétention configurable (ex. 6 mois) et un export automatique.

## 7. Module privacy & RGPD

- `docs/privacy-security-audit-point16.md` décrit l'architecture privacy
  (dashboard, bannière de consentement, export, suppression).
- Des fonctions Edge `gdpr-assistant` et `explain-gdpr` apportent de l'aide
  pédagogique mais ne gèrent pas encore le consentement.

**Recommandations** :

1. Ajouter un `PrivacyContext` pour suivre les consentements utilisateur.
2. Intégrer un flux d'export et d'effacement via les fonctions Supabase.
3. Documenter une page dédiée aux droits RGPD avec accès aux journaux.

## 8. Tests et qualité

Les commandes suivantes doivent être exécutées pour garantir la qualité :

```bash
npm run lint
npm run type-check
npm test
```

Des tests unitaires sont fournis dans `src/tests` (10 fichiers actuellement).
Les tests passent mais ne couvrent pas l'audit ni les accès sensibles.

## 9. Plan d'évolution premium

- Dashboard sécurité avancé regroupant les logs et alertes.
- RLS stricte sur toutes les tables Supabase sensibles.
- Gestion de clés de chiffrement par utilisateur ou organisation.
- Anonymisation dynamique sur demande.
- Pipeline d'alertes (Sentry ou SIEM) pour toute action suspecte.
- Support multi‑région avec choix de la localisation des données.

---

Ce rapport sert de base pour la mise en conformité RGPD et la préparation d'un
audit externe. Chaque évolution doit être validée par le Product Owner avant mise
en production.
