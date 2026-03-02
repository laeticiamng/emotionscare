

# Audit Directeur Marketing & Commercial -- EmotionsCare

**Date :** 01/03/2026 | **Auditeur :** Lovable AI | **Perimetre :** Tunnel d'acquisition, pricing, conversion, SEO/GEO, coherence commerciale

---

## Score Global : 6.5 / 10

Le produit est visuellement premium (style Apple, animations soignees) et le positionnement vertical sante est clair. Cependant, des incoherences critiques dans la strategie tarifaire, des contenus marketing fictifs, et des fuites dans le tunnel de conversion freinent la credibilite commerciale et le taux de conversion.

---

## 1. ALERTE CRITIQUE : Incoherence tarifaire (RISQUE JURIDIQUE)

| Element | Page Pricing (visible client) | Stripe (paiement reel) | Ecart |
|---------|-------------------------------|------------------------|-------|
| Nom du plan | **Premium** | **Pro** | Nom different |
| Prix affiche | **9,90 EUR/mois** | **14,90 EUR/mois** | **+50% d'ecart** |
| Meta description SEO | "Pro a 14,90 EUR/mois" | 14,90 EUR | Incoherent avec le prix affiche |
| Plan B2B affiche | "Sur devis" | **Business a 49,90 EUR/mois** (Stripe) | Prix cache |

**Impact :** Un visiteur qui clique "Passer a Premium" a 9,90 EUR se retrouve en checkout Stripe a 14,90 EUR. C'est une **pratique commerciale trompeuse** au sens du Code de la consommation (art. L121-1 et suivants). Risque de litiges, remboursements, et atteinte a la reputation.

**Correction requise :**
- Aligner le prix affiche dans `PricingPageWorking.tsx` (ligne 50) sur le prix Stripe reel : soit passer a `14.90`, soit mettre a jour le `price_id` Stripe
- Unifier la denomination : choisir "Premium" ou "Pro" partout (code, Stripe, SEO, llms.txt)
- Mettre a jour la meta description SEO (ligne 190) avec le bon prix

---

## 2. CONTENUS MARKETING FICTIFS (Credibilite)

### 2.1 Page /entreprise (ancienne) — Faux cas clients

Le fichier `EntreprisePage.tsx` contient 3 faux cas clients inventes :
- "TechCorp 500+" (2000+ employes, 40% reduction burn-out)
- "HealthGroup" (850 employes, 60% amelioration engagement)
- "Finance Pro" (1200 employes, 25% reduction absenteisme)

Et 4 metriques marketing non sourcees :
- "47% Reduction du stress"
- "23% Augmentation productivite"
- "65% Satisfaction employes"
- "38% Reduction turnover"

**Impact :** Contenus fictifs = tromperie. Risque reputationnel si un prospect demande les references. La regle ESLint custom `no-unsourced-stats` existe mais n'est visiblement pas appliquee ici.

**Note :** Cette page semble etre un reliquat — la vraie page B2B est `B2BEntreprisePage.tsx` affichee sur `/entreprise`. Neanmoins le fichier existe encore dans le code.

### 2.2 Badge hero "Trusted by 500+ Enterprises"

Le badge dans `EntreprisePage.tsx` ligne 158 affiche "Trusted by 500+ Enterprises" alors que la plateforme n'a pas encore de clients entreprise.

### 2.3 Statistiques homepage

La section `AppleStatsSection.tsx` est **correcte** et factuelle (37 modules, 3 min, 100% RGPD, 7/7 disponibilite). Bon exemple a suivre.

---

## 3. TUNNEL DE CONVERSION B2C

### 3.1 Homepage → Signup (CORRECT)

```text
Accueil (Hero)
  └─ "Commencer gratuitement" → /signup  ✅
  └─ "Comment ca marche" → scroll #features  ✅
  
Features Section → pas de CTA intermediaire  ⚠️
Showcase Section → pas de CTA  ⚠️
Stats Section → pas de CTA  ⚠️

CTA Final
  └─ "Essayer gratuitement" → /signup  ✅
  └─ "Decouvrir les fonctionnalites" → /features  ✅
```

**Probleme :** 3 sections (Features, Showcase, Stats) sans aucun CTA de conversion. Un visiteur qui scrolle perd le fil de l'action. Chaque section devrait avoir un micro-CTA ("Essayer" ou "En savoir plus").

### 3.2 Pricing → Checkout

```text
/pricing
  └─ Gratuit → "Commencer gratuitement" → /signup  ✅
  └─ Premium → "Passer a Premium" → /signup (si non auth)  ✅
  └─ Premium → "Passer a Premium" → Stripe checkout (si auth)  ⚠️ PRIX FAUX
  └─ Etablissement → "Demander un devis" → /contact  ✅
```

Le CTA "Passer a Premium" envoie `plan: 'premium'` mais le backend attend `plan: 'pro'` (car `PLANS` dans `create-checkout` a les cles `pro` et `business`). Le frontend envoie `stripePlan: 'premium'` (ligne 65) qui ne correspond a aucune cle dans le backend.

**Impact :** Le checkout Premium est **casse** pour les utilisateurs authentifies. Le backend renverra une erreur "Invalid plan: premium".

### 3.3 Signup mobile (BUG connu)

Le bouton "Creer mon compte" est partiellement inaccessible sur mobile 390x844 (corrige dans le dernier diff mais a reverifier).

---

## 4. TUNNEL DE CONVERSION B2B

```text
Nav "Entreprise" → /b2b → alias → /entreprise (B2BEntreprisePage)  ✅
  └─ "Echanger avec notre equipe" → /contact  ✅
  └─ "Acces avec code" → /b2b/access  ✅
  └─ "Se connecter" → /login  ✅
```

**Points positifs :**
- Le parcours B2B est coherent et bien structure
- Le messaging est aligne sur le positionnement sante ("equipes soignantes")
- Les trust badges (RGPD, Anonymat, Made in France) sont pertinents

**Points a ameliorer :**
- Pas de formulaire de capture de leads sur la page (le CTA envoie sur /contact qui est generique)
- Pas de prix indicatif B2B (meme une fourchette "a partir de X EUR/utilisateur/mois" aiderait)
- Pas de CTA pour telecharger une plaquette commerciale / brochure PDF

---

## 5. SEO & GEO

### 5.1 SEO classique

| Page | Title tag | Meta description | H1 | Canonical | Note |
|------|-----------|-----------------|-----|-----------|------|
| `/` | OK | OK | OK (mot-cle "stress en 3 minutes") | OK | Schema JSON-LD MedicalWebPage ✅ |
| `/pricing` | OK | **FAUX** (dit "14,90 EUR" mais affiche 9,90 EUR) | OK | Manquant | |
| `/entreprise` | OK | OK | OK | Manquant | |
| `/about` | OK | OK | OK | OK | |
| `/contact` | OK | OK | OK | OK | |
| `/features` | A verifier | A verifier | A verifier | A verifier | |

### 5.2 GEO (Generative Engine Optimization)

- `llms.txt` et `.well-known/llms.txt` : **Excellents**. Structuration claire, positioning unique, personas, methodologie
- `robots.txt` : Crawlers IA autorises (GPTBot, Claude-Web, PerplexityBot) ✅
- JSON-LD medical enrichi : MedicalWebPage, MedicalAudience, HowTo ✅
- **Incoherence :** `llms.txt` mentionne "Freemium" mais ne donne pas le prix. Il serait strategique d'inclure le prix pour que les IA puissent le citer

---

## 6. INCOHERENCES DE MESSAGING

| Lieu | Formulation | Probleme |
|------|-------------|----------|
| Pricing page | "Premium" a 9,90 EUR | Stripe dit "Pro" a 14,90 EUR |
| Pricing meta | "Pro a 14,90 EUR/mois" | Page affiche "Premium" a 9,90 EUR |
| Pricing hero | "Passez a Pro" | Carte dit "Premium" |
| llms.txt | "Freemium" sans prix | Manque de transparence |
| Footer | "Tarifs" | Correct, pointe vers /pricing |
| /entreprise | "Sur devis" | Stripe a un plan Business a 49,90 EUR |
| EntreprisePage (ancien) | "15 EUR/utilisateur/mois" et "25 EUR/utilisateur/mois" | Prix fantaisistes deconnectes de Stripe |

---

## 7. ANALYSE CONCURRENTIELLE DU POSITIONNEMENT

**Forces :**
- Positionnement vertical sante unique (pas de concurrent direct en France)
- Messaging clair : "Prendre soin de celles et ceux qui prennent soin"
- Design premium Apple-like coherent
- Approche scientifique (theorie polyvagale, coherence cardiaque) bien mise en avant
- Transparence RGPD/HDS

**Faiblesses :**
- Aucune preuve sociale reelle (0 temoignage, 0 cas client, 0 nombre d'utilisateurs)
- Pas de video demo / walkthrough du produit
- Pas de comparatif avec solutions existantes (Headspace, Calm, etc.)
- La section "Les chiffres parlent d'eux-memes" ne montre que des specs produit (37 modules, 3 min) pas des resultats utilisateurs
- Pas de section presse / partenaires / certifications

---

## 8. PLAN D'ACTION PRIORITISE

### P0 -- Critique (a corriger immediatement)

1. **Aligner le prix Premium/Pro** -- Corriger `PricingPageWorking.tsx` : soit passer le prix a 14.90 EUR et renommer en "Pro", soit creer un nouveau price_id Stripe a 9.90 EUR. Mettre a jour la meta description SEO. Risque juridique si non corrige.

2. **Corriger le plan Stripe "premium" vs "pro"** -- Dans `PricingPageWorking.tsx` ligne 65, `stripePlan` est `'premium'` mais le backend `create-checkout` attend `'pro'`. Le checkout est casse pour les utilisateurs authentifies. Changer `stripePlan: 'premium'` en `stripePlan: 'pro'`.

3. **Supprimer les faux cas clients** -- `EntreprisePage.tsx` contient des testimonials et metriques inventes. Soit supprimer ce fichier (la vraie page B2B est `B2BEntreprisePage`), soit remplacer par du contenu factuel.

### P1 -- Important (avant lancement commercial)

4. **Ajouter des micro-CTAs dans les sections homepage** -- Ajouter un bouton "Essayer" dans `AppleFeatureSection`, `AppleShowcaseSection` et `AppleStatsSection` pour ne pas perdre les visiteurs en scroll.

5. **Creer un formulaire de capture B2B dedie** -- Sur `/entreprise`, remplacer le lien vers `/contact` par un formulaire inline capture (nom, email, etablissement, nombre de collaborateurs) pour qualifier les leads.

6. **Ajouter une section preuve sociale** -- Meme sans clients, afficher : nombre d'exercices completes, temps de development, equipe fondatrice, partenariats academiques en cours, articles de presse.

### P2 -- Ameliorations (post-lancement)

7. **Video demo / walkthrough** -- Ajouter une video de 60s dans la section Showcase montrant le parcours utilisateur reel (scan → exercice → resultat).

8. **Comparatif concurrentiel** -- Ajouter un tableau "EmotionsCare vs Headspace/Calm" mettant en avant : duree (3 min vs 15-30 min), public cible (soignants vs grand public), technologie (IA + biofeedback vs audio seul).

9. **Page de resultats / etudes** -- Creer `/resultats` ou `/science` pour presenter la methodologie, les protocoles et les donnees (meme pilotes/pre-lancement).

10. **A/B testing du prix** -- Tester 9,90 EUR vs 14,90 EUR vs 12,90 EUR avec un outil comme PostHog ou Amplitude.

---

## 9. TABLEAU DE SYNTHESE

| Dimension | Score | Commentaire |
|-----------|-------|-------------|
| Design & UX | 9/10 | Style Apple premium, animations fluides, coherent |
| Messaging & Positionnement | 8/10 | Vertical sante clair, promesse forte |
| Pricing & Monetisation | 3/10 | Ecart prix affiche/reel, checkout casse, noms incoherents |
| Tunnel B2C | 5/10 | Fonctionne mais manque de CTAs intermediaires, checkout KO |
| Tunnel B2B | 7/10 | Structure OK mais pas de capture de leads, pas de prix |
| Preuve sociale | 2/10 | Aucune preuve reelle, faux cas clients en legacy |
| SEO/GEO | 8/10 | Strategie GEO excellente, SEO solide, meta prix a corriger |
| Conformite | 4/10 | Prix trompeur = risque juridique, faux testimonials |

---

## Resume executif

EmotionsCare dispose d'un **excellent produit et d'un positionnement unique** sur le marche francais. Le design premium et la strategie GEO sont des atouts forts. Cependant, **le tunnel de monetisation est casse** : le prix affiche (9,90 EUR "Premium") ne correspond pas au prix Stripe reel (14,90 EUR "Pro"), et le parametre `stripePlan` envoye au backend est invalide. Ces deux bugs empechent toute conversion payante.

Les priorites absolues sont :
1. Corriger l'incoherence tarifaire (risque juridique + conversion bloquee)
2. Supprimer les contenus marketing fictifs
3. Ajouter de la preuve sociale reelle

Une fois ces corrections appliquees, le score devrait passer de **6.5/10 a 8.5/10**.

