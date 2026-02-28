# 🛡️ Roadmap Sécurité & Qualité — 30 jours

**Projet** : EmotionsCare  
**Objectif** : Passer de 6.2/10 à 8.5/10 (audit sécurité)  
**Date de début** : 2026-02-28

---

## Semaine 1 — P0 Critiques (Jour 1→7)

### ✅ TICKET 1 — Secrets API (FAIT)
- Clés privées côté Edge Functions ✅
- Test CI `no-secrets-in-bundle.test.ts` ✅
- Scan VITE_* automatisé ✅

### ✅ TICKET 2 — XSS Hardening (FAIT)
- SafeHtml wrapper centralisé ✅
- DOMPurify sur JournalList ✅
- MicroInteractions sécurisé ✅

### ✅ TICKET 3 — JWT Storage (FAIT)
- sessionStorage prioritaire ✅
- Nettoyage localStorage orphelins ✅

### 🔲 TICKET 4 — HDS / Conformité santé
- [ ] Jour 3-4 : Documentation politique de rétention (`docs/data-retention-policy.md`)
- [ ] Jour 4-5 : Page `/compliance` avec statut réel certifications
- [ ] Jour 5-7 : Séparation données émotionnelles ↔ identifiantes (schema DB)
- [ ] Jour 7 : Vérification chiffrement at-rest Supabase

**Livrable** : Documentation conformité + schéma données séparées

---

## Semaine 2 — P1 Sécurité (Jour 8→14)

### ✅ TICKET 5 — CSP unifié (FAIT)
- `unsafe-inline` supprimé ✅
- `_headers` et `vercel.json` harmonisés ✅

### 🔲 TICKET 6 — TypeScript strict
- [ ] Jour 8-9 : Supprimer `@ts-nocheck` des 20 fichiers critiques (auth, security, privacy)
- [ ] Jour 9-10 : Résoudre erreurs TypeScript résultantes
- [ ] Jour 10 : Règle ESLint `ban-ts-comment` en warn ✅ (fait)
- [ ] Jour 11-14 : Batch 1 — 50 fichiers supplémentaires

**Livrable** : 70 fichiers débloqués, 0 nouveau `@ts-nocheck`

---

## Semaine 3 — P1 Qualité (Jour 15→21)

### 🔲 TICKET 7 — Couverture tests (8.2% → 40%)
- [ ] Jour 15-16 : Tests auth flow (login, logout, refresh, suppression compte)
- [ ] Jour 16-17 : Tests RGPD (export données, suppression, consentement)
- [ ] Jour 17-18 : Tests scan émotionnel + génération musique
- [ ] Jour 18-19 : Tests Edge Functions (unit tests Deno)
- [ ] Jour 19-21 : E2E Playwright minimal (login→dashboard→logout)

**Livrable** : Coverage ≥ 40%, CI verte, E2E fonctionnel

---

## Semaine 4 — P1 Contenu & Finalisation (Jour 22→30)

### ✅ TICKET 8 — Marketing factuel (FAIT)
- Chiffres non sourcés corrigés ✅
- Données fictives supprimées ✅

### 🔲 Consolidation finale
- [ ] Jour 22-24 : Batch 2 TypeScript — 50 fichiers supplémentaires
- [ ] Jour 25-26 : Audit Mozilla Observatory → score ≥ A
- [ ] Jour 27-28 : Lighthouse audit complet (Performance, SEO, A11y, Security)
- [ ] Jour 29 : Revue croisée sécurité (checklist OWASP Top 10)
- [ ] Jour 30 : Rapport final audit + score cible 8.5/10

**Livrable** : Rapport audit final, score sécurité 8.5/10

---

## 📊 Métriques de suivi

| Métrique | Avant | Semaine 2 | Semaine 4 (cible) |
|----------|-------|-----------|-------------------|
| Score audit sécurité | 6.2/10 | 7.5/10 | 8.5/10 |
| Fichiers @ts-nocheck | 1910 | 1840 | 1790 |
| Couverture tests | 8.2% | 20% | 40% |
| CSP unsafe-inline | Oui | Non ✅ | Non |
| Secrets exposés | 0 | 0 | 0 |
| XSS non protégés | 3 | 0 ✅ | 0 |
| Mozilla Observatory | C | B+ | A |

---

## ⚠️ Dépendances externes (hors scope Lovable)

1. **HDS hébergement** : Dépend de la configuration Supabase (région EU, chiffrement)
2. **Certificat ISO 27001** : Processus organisationnel, pas technique
3. **Audit externe** : À planifier après semaine 4
4. **Cookie httpOnly pour JWT** : Nécessite proxy backend custom (hors Supabase SDK)

---

## 🎯 Priorité investisseur B2B santé

Pour rendre EmotionsCare "investissable" :
1. 🔐 HDS documenté + séparation données → **confiance réglementaire**
2. 🧪 Tests > 40% → **confiance technique**
3. 🛡️ Score audit ≥ 8.5 → **confiance sécurité**
4. 📋 Rapport conformité prêt → **due diligence accélérée**
