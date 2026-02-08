

# Standardisation complete des emails et domaines - Phase 2

## Contexte

Apres la Phase 1 (12 fichiers corriges), il reste **~30 fichiers** contenant des emails non valides ou des domaines incorrects. Les seuls contacts valides sont :
- **contact@emotionscare.com** (contact general)
- **m.laeticia@emotionscare.com** (fondatrice)

Les emails `noreply@emotionscare.com` dans les edge functions d'envoi d'emails sont acceptables car ils representent l'adresse d'expedition configuree via Resend (pas un contact public).

---

## Fichiers a corriger (classes par categorie)

### A. Pages legales visibles par les utilisateurs (priorite haute)

| # | Fichier | Email actuel | Correction |
|---|---------|-------------|------------|
| 1 | `src/pages/legal/LegalPage.tsx` (l.123-125) | `support@emotionscare.com` + `dpo@emotionscare.com` | Remplacer les 2 par `contact@emotionscare.com` |
| 2 | `src/pages/legal/CookiesPage.tsx` (l.226) | `dpo@emotionscare.com` | -> `contact@emotionscare.com` |
| 3 | `src/pages/legal/TermsPage.tsx` (l.110) | `legal@emotionscare.com` | -> `contact@emotionscare.com` |
| 4 | `src/pages/legal/SalesTermsPage.tsx` (l.361) | `dpo@emotionscare.com` | -> `contact@emotionscare.com` |
| 5 | `src/pages/legal/PrivacyPage.tsx` (l.117, 172) | `privacy@emotionscare.com` + `dpo@emotionscare.com` | -> `contact@emotionscare.com` |
| 6 | `src/pages/legal/LicensesPage.tsx` (l.255) | `legal@emotionscare.com` | -> `contact@emotionscare.com` |
| 7 | `src/pages/legal/MentionsLegalesPage.tsx` (l.86, 180) | `dpo@emotionscare.com` + `legal@emotionscare.com` | -> `contact@emotionscare.com` |
| 8 | `src/components/pages/TermsPage.tsx` (l.62) | `legal@emotionscare.com` | -> `contact@emotionscare.com` |
| 9 | `src/components/pages/PrivacyPage.tsx` (l.85-88) | `dpo@emotionscare.com` + `privacy@emotionscare.com` | -> `contact@emotionscare.com` |

### B. Pages utilisateur visibles (priorite haute)

| # | Fichier | Email actuel | Correction |
|---|---------|-------------|------------|
| 10 | `src/pages/ConsentManagementPage.tsx` (l.362-363) | `privacy@emotionscare.com` | -> `contact@emotionscare.com` |
| 11 | `src/pages/FAQPage.tsx` (l.119) | `support@emotionscare.com` | -> `contact@emotionscare.com` |
| 12 | `src/pages/b2c/B2CPrivacyTogglesPage.tsx` (l.700-702) | `dpo@emotionscare.com` | -> `contact@emotionscare.com` |
| 13 | `src/components/privacy/GdprActionsSection.tsx` (l.229-230) | `dpo@emotionscare.com` | -> `contact@emotionscare.com` |
| 14 | `src/components/privacy/GdprRightsSection.tsx` (l.212) | `privacy@emotionscare.com` | -> `contact@emotionscare.com` |
| 15 | `src/components/error/HomePageErrorBoundary.tsx` (l.137-140) | `support@emotionscare.com` | -> `contact@emotionscare.com` |
| 16 | `src/components/error/Enhanced500Page.tsx` (l.179-182) | `support@emotionscare.com` | -> `contact@emotionscare.com` |

### C. Configuration et navigation (priorite moyenne)

| # | Fichier | Email actuel | Correction |
|---|---------|-------------|------------|
| 17 | `src/lib/nav-schema.ts` (l.221) | `mailto:support@emotionscare.com` | -> `mailto:contact@emotionscare.com` |
| 18 | `src/components/admin/GlobalConfigurationCenter.tsx` (l.69) | `support@emotionscare.com` | -> `contact@emotionscare.com` |
| 19 | `src/components/admin/GlobalConfigurationCenter.old.tsx` (l.131) | `support@emotionscare.com` | -> `contact@emotionscare.com` |
| 20 | `src/pages/manager/AuditPageEnhanced.tsx` (l.104) | `security@emotionscare.com` | -> `contact@emotionscare.com` |
| 21 | `src/pages/manager/SecurityPageEnhanced.tsx` (l.335) | `security@emotionscare.com` | -> `contact@emotionscare.com` |

### D. Services GDPR et backend (priorite moyenne)

| # | Fichier | Email actuel | Correction |
|---|---------|-------------|------------|
| 22 | `src/services/gdpr/emailNotifications.ts` (l.40, 114, 142) | `dpo@emotionscare.com` | -> `contact@emotionscare.com` |
| 23 | `src/services/gdpr/AccountDeletionService.ts` (l.26) | `support@emotionscare.com` | -> `contact@emotionscare.com` |

### E. SEO et domaines (priorite moyenne)

| # | Fichier | Valeur actuelle | Correction |
|---|---------|----------------|------------|
| 24 | `src/hooks/usePageSEO.ts` (l.176-193) | `emotionscare.app` partout + `support@emotionscare.app` | -> `emotionscare.com` + `contact@emotionscare.com` |
| 25 | `src/components/seo/SEO.tsx` (l.24, 32-33) | `emotionscare.app` | -> `emotionscare.com` |
| 26 | `src/lib/constants.ts` (l.11) | `emotionscare.app` | -> `emotionscare.com` |
| 27 | `src/pages/b2c/B2CSocialCoconPage.tsx` (l.116) | `emotionscare.app` | -> `emotionscare.com` |
| 28 | `src/components/b2b/admin/B2BSettingsPanel.tsx` (l.54) | `mon-org.emotionscare.app` | -> `mon-org.emotionscare.com` |

### F. Edge Functions (priorite moyenne)

| # | Fichier | Email actuel | Correction |
|---|---------|-------------|------------|
| 29 | `supabase/functions/push-notification/index.ts` (l.302) | `mailto:support@emotionscare.com` | -> `mailto:contact@emotionscare.com` |
| 30 | `supabase/functions/send-push-notification/index.ts` (l.185) | `mailto:support@emotionscare.com` | -> `mailto:contact@emotionscare.com` |
| 31 | `supabase/functions/dsar-handler/index.ts` (l.226, 419) | `dpo@emotionscare.com` | -> `contact@emotionscare.com` |
| 32 | `supabase/functions/gdpr-scheduled-export/index.ts` (l.100) | `rgpd@emotionscare.app` | -> `noreply@emotionscare.com` |
| 33 | `supabase/functions/pdf-notifications/index.ts` (l.104) | `notifications@emotionscare.app` | -> `noreply@emotionscare.com` |
| 34 | `supabase/functions/scheduled-pdf-reports/index.ts` (l.65) | `reports@emotionscare.app` | -> `noreply@emotionscare.com` |
| 35 | `supabase/functions/send-cron-alert/index.ts` (l.138) | `alerts@emotionscare.app` | -> `noreply@emotionscare.com` |
| 36 | `supabase/functions/check-suspicious-role-changes/index.ts` (l.8) | `noreply@emotionscare.com` | OK (inchange) |

### G. Fichiers NON modifies (acceptables)

Les fichiers suivants ne seront **pas** modifies :
- **Edge functions avec `noreply@emotionscare.com`** : c'est l'adresse d'expedition systeme, pas un contact public. OK.
- **Fichiers de tests (`tests/e2e/`)** : `test@emotionscare.app` est un email de test fictif, acceptable dans le contexte des tests.
- **Fichiers de documentation (`reports/`, `docs/`, `scripts/`)** : documents internes, pas visibles par les utilisateurs.

---

## Resume des regles

| Type | Avant | Apres |
|------|-------|-------|
| Contact general visible | support@, legal@, privacy@, dpo@, security@, enterprise@ | **contact@emotionscare.com** |
| Fondatrice (si mentionne) | - | **m.laeticia@emotionscare.com** |
| Email d'expedition systeme | rgpd@, reports@, alerts@, notifications@ (emotionscare.app) | **noreply@emotionscare.com** |
| Domaine SEO/canonical | emotionscare.app | **emotionscare.com** |

Total : **36 fichiers** a modifier, couvrant 100% des emails non valides restants dans le code source et les edge functions.
