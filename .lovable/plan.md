

# AUDIT v5 — EmotionsCare

## 1. RESUME EXECUTIF

**Verdict : OUI SOUS CONDITIONS — Note globale : 17,5/20**

Les corrections des audits v1-v4 sont en place : scanner fonctionnel, onboarding soignant, FAQ nettoyee, CGU completes, accents corriges, dashboard quick actions fonctionnelles, Link SPA, boutons morts retires. Cependant, un probleme majeur subsiste : le footer utilise par la homepage (components/home/Footer.tsx) n'a jamais ete corrige — il contient encore des liens sociaux actifs vers des comptes inexistants et 10 liens vers des pages protegees.

**Publiable aujourd'hui : OUI SOUS CONDITIONS** (2 corrections, ~20 min)

### Top 5 risques restants
1. Footer homepage : 4 liens sociaux actifs (twitter/linkedin/instagram/youtube) vers des comptes probablement inexistants — 404 externes, perte de credibilite immediate
2. Footer homepage : 10 liens "Plateforme" dont 8 vers /app/* — redirection silencieuse vers /login pour visiteurs
3. Deux composants Footer distincts (home/Footer.tsx vs marketing/Footer.tsx) — incoh​erence de maintenance
4. FAQ affirme "support disponible 24/7" (ligne 367) — verifiable ? Si non, promesse mensongere
5. Copyright footer marketing dit "2025" alors que nous sommes en 2026

### Top 5 forces
1. Scanner emotionnel → protocole avec badge Pro : promesse centrale fonctionnelle
2. Hero impactant : "Gerez votre stress en 3 minutes" — comprehension en <5 secondes
3. Dashboard complet avec quick actions, premier pas, refresh, stats
4. CGU/RGPD completes, consentements obligatoires au signup
5. Accessibilite WCAG AA : skip links, ARIA, keyboard, labels

---

## 2. TABLEAU SCORE GLOBAL

```text
Dimension                    | Note | Observation                                       | Criticite | Decision
-----------------------------|------|---------------------------------------------------|-----------|------------------
Comprehension produit        | 18   | Hero + eyebrow + modules = clarte immediate       | -         | Pret
Landing / Accueil            | 17   | Premium Apple-style, lazy loading, social proof    | -         | Pret
Onboarding                   | 18   | Aligne soignants, ARIA, progression                | -         | Pret
Navigation                   | 16   | Header propre, footer homepage non corrige         | Majeur    | Corriger
Clarte UX                    | 17   | Dashboard guide, quick actions fonctionnelles      | -         | Pret
Copywriting                  | 17   | Accents corriges, FAQ propre, hero percutant       | -         | Pret
Credibilite / confiance      | 15   | Footer liens sociaux morts = signal amateur        | Critique  | Corriger
Fonctionnalite principale    | 18   | Scanner→protocole OK                               | -         | Pret
Parcours utilisateur         | 17   | Signup→onboarding→scan→dashboard complet           | -         | Pret
Bugs / QA                    | 16   | 2 footers incoherents, copyright 2025              | Majeur    | Corriger
Securite preproduction       | 17   | RLS, auth, sanitisation, TEST_MODE off             | -         | Pret
Conformite go-live           | 18   | CGU, mediation, SIRET, cookies, RGPD               | -         | Pret
```

---

## 3. PROBLEMES RESTANTS PRIORISES

### P1 — Tres important

**P1-1. Footer homepage : liens sociaux actifs vers comptes inexistants**
- Ou : `src/components/home/Footer.tsx` lignes 43-48
- Probleme : 4 liens `<a>` actifs vers twitter.com/emotionscare, linkedin.com/company/emotionscare, etc. Ces comptes n'existent probablement pas. Un visiteur qui clique atterrit sur un 404 externe — signal amateur immediat.
- Impact : Perte de credibilite sur la premiere page. Un beta-testeur le signalerait en 30 secondes.
- Correction : Remplacer par des spans desactives "Bientot disponible" (comme dans marketing/Footer.tsx) ou retirer completement.

**P1-2. Footer homepage : 10 liens Plateforme dont 8 proteges**
- Ou : `src/components/home/Footer.tsx` lignes 15-26
- Probleme : Un visiteur non connecte qui clique "Scanner emotionnel" ou "Coach IA" est redirige silencieusement vers /login. Aucune indication visuelle que ces liens necessitent une connexion.
- Correction : Reduire la liste aux pages publiques, ou ajouter une icone cadenas (deja present dans le code via `protected: true` mais les liens restent cliquables et accessibles).

### P2 — Ameliorations forte valeur

**P2-1. Deux composants Footer incoherents**
- `src/components/home/Footer.tsx` (utilise par AppleHomePage) : non corrige, liens sociaux actifs, 10 liens plateforme
- `src/components/marketing/Footer.tsx` (corrige) : liens sociaux desactives, footer propre — mais n'est importe par aucune page
- Correction : Supprimer `marketing/Footer.tsx` et corriger `home/Footer.tsx` directement (c'est celui utilise en production)

**P2-2. Copyright marketing/Footer.tsx dit "2025"**
- Ligne 139 : `© 2025 EmotionsCare`
- Nous sommes en 2026. Le home/Footer.tsx utilise `new Date().getFullYear()` (correct).
- Correction : Sans objet si on supprime marketing/Footer.tsx

**P2-3. FAQ : "support disponible 24/7"**
- `FAQPage.tsx` ligne 367 : "Notre equipe support est disponible 24/7"
- Si pas de support reel 24/7, c'est une fausse promesse.
- Correction : Remplacer par "Notre equipe est disponible pour vous aider du lundi au vendredi." ou verifier la veracite.

---

## 4. PLAN D'IMPLEMENTATION

### Tache 1 : Corriger le footer homepage (home/Footer.tsx)
- Remplacer les 4 liens sociaux actifs par des spans "Bientot" desactives (comme deja fait dans marketing/Footer.tsx)
- Reduire la liste "Plateforme" : ne garder que les 2-3 liens publics (Accueil, Respiration guidee) et retirer les 8 liens proteges, OU rendre les liens proteges non-cliquables pour les visiteurs

### Tache 2 : Supprimer le footer marketing inutilise
- Supprimer `src/components/marketing/Footer.tsx` pour eviter la confusion entre deux composants Footer

### Tache 3 : Corriger "support 24/7" dans la FAQ
- Remplacer "disponible 24/7" par un message realiste

