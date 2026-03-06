

# AUDIT PRE-PRODUCTION v5 — EMOTIONSCARE

## 1. RESUME EXECUTIF

La plateforme a progresse de maniere significative depuis les audits v1-v4. Les P0 precedents sont tous corriges : boutons sociaux morts supprimes, badges "HDS Certifie" retires des pages marketing publiques (Features, Homepage, Footer), login et signup unifies visuellement, redirection post-signup vers /onboarding, claims "Approche scientifique" corrigees sur les pages principales. Cependant, il reste une page entiere dediee a "Conformite HDS operationnelle" (`HDSCompliancePage.tsx`) accessible publiquement a `/compliance/hds` qui affirme "Hebergement certifie HDS" alors que la certification n'est pas obtenue. Des usages du mot "scientifiquement" persistent dans 9 fichiers mais la plupart sont contextuellement acceptables (disclaimers medicaux, descriptions techniques). Le principal risque restant est cette page HDS publique non protegee.

**Publiable aujourd'hui : OUI SOUS CONDITIONS (2 corrections)**

**Note globale : 15.5/20**

**Top 5 risques restants :**
1. `HDSCompliancePage.tsx` — page publique entiere affirmant "Conformite HDS operationnelle" avec un titre "Hebergement certifie HDS" (status: in_progress) et un CTA "Demander le dossier HDS" — risque juridique direct
2. Route publique `/compliance/hds` sans guard, indexable par Google (SEO meta avec mots-cles "HDS, certification")
3. Aucune preuve visuelle du produit (screenshots/video) sur les pages marketing
4. "scientifiquement fondés" sur AboutPage sans lien vers references (mineur — contextuel)
5. Edge functions, Stripe checkout, reset password non verifiables sans test end-to-end

**Top 5 forces :**
1. Login/Signup coherents — Heart logo, branding unifie, toggle password, validation Zod
2. Homepage premium — proposition de valeur en 3 secondes, badges corriges
3. Securite solide — RLS, sanitisation XSS, BYPASS_AUTH=false, sessionStorage JWT
4. Pages legales completes avec dates fixes (1 mars 2026)
5. Post-signup redirige vers /onboarding

---

## 2. TABLEAU SCORE GLOBAL

| Dimension | Note /20 | Observation | Criticite | Decision |
|-----------|----------|-------------|-----------|----------|
| Comprehension produit | 17 | Proposition de valeur claire. Badges corriges. | - | OK |
| Landing / Accueil | 16 | Premium. Manque screenshots produit. | Mineur | OK |
| Onboarding | 14 | Redirection implementee. Contenu non verifiable. | - | A verifier |
| Navigation | 13 | Desktop OK. 1335 routes en registry. | Majeur | A surveiller |
| Clarte UX | 15 | Marketing solide. App derriere auth. | - | OK |
| Copywriting | 15 | Claims corrigees. "scientifiquement fondes" sur About = acceptable en contexte. | Mineur | OK |
| Credibilite / Confiance | 13 | HDSCompliancePage publique avec claims non verifiees. Pas de screenshots. | Critique | A corriger |
| Fonctionnalite principale | 7 | Non auditable — derriere auth. Pas de demo. | Bloquant | A corriger |
| Parcours utilisateur | 15 | Signup → onboarding coherent. Login unifie. | - | OK |
| Bugs / QA | 16 | Pas de bugs visibles. Console propre. | - | OK |
| Securite preproduction | 16 | RLS, sanitisation, pas de secrets exposes. | - | OK |
| Conformite go-live | 13 | HDSCompliancePage publique = risque juridique. | Critique | A corriger |

---

## 3. PROBLEMES A CORRIGER

### P1 — Critique

| # | Titre | Ou | Probleme exact | Recommandation |
|---|-------|----|----------------|----------------|
| 1 | Page HDS publique avec claims non verifiees | `HDSCompliancePage.tsx` + route `/compliance/hds` (guard: false) | Le titre dit "Conformite HDS operationnelle". L'item "Hebergement certifie HDS" est marque "En cours". Le CTA dit "Demander le dossier HDS". La page est indexable par Google avec meta "HDS, certification". Un prospect B2B ou un regulateur trouvant cette page pourrait considerer que EmotionsCare affirme etre certifie HDS alors que ce n'est pas le cas. | **Option A** : Supprimer la page et la route. **Option B** : Renommer "Securite des donnees de sante — Notre feuille de route" et ajouter un disclaimer visible "EmotionsCare n'est pas certifie HDS. Cette page presente notre progression vers cet objectif." Changer le CTA en "Nous contacter". Changer SEO title/keywords pour retirer "certification HDS". |
| 2 | Route `/compliance/hds` publique sans guard | `registry.ts` ligne 2845 | `guard: false` + `segment: 'public'` = accessible sans auth et indexable. Meme si le contenu est corrige, la route elle-meme avec `/hds` dans l'URL implique une certification. | Passer `guard: true` OU renommer la route `/compliance/securite-sante` |

### P2 — Amelioration forte valeur

| # | Titre | Recommandation |
|---|-------|----------------|
| 3 | Zero preuve visuelle du produit | Ajouter 3-4 screenshots sur homepage et /features |
| 4 | "scientifiquement fondes" sur AboutPage (l.114) | Acceptable en contexte ("exercices courts et scientifiquement fondes") mais ajouter un lien vers /about#references serait plus solide |
| 5 | "Demander le dossier HDS" CTA | Renommer en "Demander le dossier de securite" |

### P3 — Confort

| # | Titre | Recommandation |
|---|-------|----------------|
| 6 | 1335 routes en registry | Nettoyer les routes mortes |
| 7 | Usages de "scientifiquement" dans disclaimers medicaux | Acceptable — ces usages sont dans des contextes de disclaimer ("ne remplace pas un diagnostic") qui sont corrects |

---

## 4. SECURITE / GO-LIVE

| Observe | Risque | Action |
|---------|--------|--------|
| RLS actif | Faible | OK |
| BYPASS_AUTH: false | Bon | OK |
| HDSCompliancePage publique sans guard | Juridique | Corriger ou supprimer |
| SessionStorage JWT | Bon | OK |
| Stripe checkout | Non verifiable | Test E2E |
| Reset password | Non verifiable | Test E2E |
| "HDS" dans SecurityDossierB2B | Faible (admin only + disclaimer) | Acceptable |

---

## 5. VERDICT FINAL

**La plateforme est prete pour une beta fermee / soft launch.** Les corrections des audits v1-v4 ont ete bien executees. Le dernier risque juridique reel est la page `HDSCompliancePage.tsx` qui affirme "Conformite HDS operationnelle" publiquement alors que la certification HDS n'est pas obtenue.

**Les 2 corrections restantes avant go-live :**
1. Corriger ou supprimer `HDSCompliancePage.tsx` — renommer en "Securite des donnees de sante", ajouter un disclaimer explicite, changer le SEO, renommer le CTA (30 min)
2. Ajouter 3-4 screenshots du produit sur la homepage et /features (1-2h, impact conversion majeur)

**Si j'etais decideur externe, publierais-je aujourd'hui ?**
Oui, a condition de corriger la page HDS publique. C'est le dernier point de risque juridique identifiable. Le reste est solide : securite, branding, parcours utilisateur, pages legales, copywriting. La plateforme est passee de 10/20 (v1) a 15.5/20 (v5) en quatre iterations.

---

## PLAN D'IMPLEMENTATION

**Fichiers a modifier :**

1. **`src/pages/compliance/HDSCompliancePage.tsx`** :
   - Renommer le titre h1 de "Conformite HDS operationnelle" en "Securite des donnees de sante"
   - Ajouter un disclaimer visible sous le titre : "EmotionsCare n'est pas certifie HDS. Cette page presente notre progression vers les standards de securite des donnees de sante."
   - Renommer l'item "Hebergement certifie HDS" en "Hebergement securise en France"
   - Renommer l'item "Certification HDS officielle" en "Certification HDS (objectif futur)"
   - Changer le CTA "Demander le dossier HDS" en "Demander le dossier de securite"
   - Mettre a jour le SEO title/description/keywords pour retirer les termes "HDS" et "certification"

2. **`src/routerV2/registry.ts`** (ligne 2845) :
   - Renommer le commentaire du module 37
   - Changer le path de `/compliance/hds` en `/compliance/securite-sante`
   - Mettre a jour les aliases

3. **`src/pages/ModulesDashboard.tsx`** (ligne 92) :
   - Mettre a jour la route du module 37 de `/compliance/hds` a `/compliance/securite-sante`

