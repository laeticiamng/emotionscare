

# AUDIT PRE-PRODUCTION v4 — EMOTIONSCARE

## RESUME EXECUTIF

**Note globale : 15/20** (progres depuis 14/20 v3)

Les P0 critiques des audits v1-v3 sont resolus (boutons sociaux, dates legales, branding login/signup, onboarding redirect, claims scientifiques sur pages principales). Cependant, des mentions "HDS" persistent dans 6 fichiers (FeaturesPage module list, ModulesDashboard x3, B2BEntreprisePage, PlatformAuditPage) et le module 37 affirme "Certification HDS" comme "complete" alors qu'elle n'est pas obtenue. Ces mentions sont factuellement inexactes. Aucune preuve visuelle du produit (screenshots) n'est presente sur les pages marketing.

**Publiable : OUI SOUS CONDITIONS (corrections ci-dessous)**

---

## PROBLEMES RESTANTS A CORRIGER

### P1 — Claims HDS residuelles (6 fichiers)

| Fichier | Ligne | Probleme | Correction |
|---------|-------|----------|------------|
| `FeaturesPage.tsx` | 237 | "Conformite HDS" comme module | Renommer "Conformite donnees de sante" + "Hebergement securise conforme RGPD" |
| `ModulesDashboard.tsx` | 92 | Module 37 "Conformite HDS operationnelle" status: "complete" + "Certification HDS" | Renommer, retirer "Certification HDS", changer status en "partial" |
| `ModulesDashboard.tsx` | 270 | "HDS + gouvernance RGPD operationnelle" | Remplacer par "Securite donnees de sante + gouvernance RGPD" |
| `ModulesDashboard.tsx` | 280 | "RGPD/HDS by design" | Remplacer par "RGPD by design" |
| `B2BEntreprisePage.tsx` | 85 | "Conforme HDS." | Remplacer par "Hebergement securise en UE." |
| `PlatformAuditPage.tsx` | 152+160 | "rapport HDS" + "Certification HDS" dans roadmap | Reformuler en "objectif futur" |

### P2 — Ameliorations restantes

- Login page : pas de toggle show/hide password (signup en a un, login non) — incoherence mineure
- Aucun screenshot/video produit sur pages marketing

---

## PLAN D'IMPLEMENTATION

Je vais corriger les 6 fichiers contenant des mentions HDS inexactes, et ajouter un toggle show/hide password sur la page login pour parite avec le signup. Cela eliminera tous les problemes P1 restants identifiables dans le code.

**Fichiers a modifier :**
1. `src/pages/features/FeaturesPage.tsx` — ligne 237
2. `src/pages/ModulesDashboard.tsx` — lignes 92, 270, 280
3. `src/pages/b2b/B2BEntreprisePage.tsx` — ligne 85
4. `src/pages/admin/PlatformAuditPage.tsx` — lignes 152, 160
5. `src/pages/UnifiedLoginPage.tsx` — ajouter toggle password visibility

