
# Audit Beta Testeur Complet -- EmotionsCare

**Date :** 01/03/2026
**Methode :** Navigation manuelle desktop (1366x768) + mobile (390x844), inspection console, analyse reseau, revue de code

---

## Score Global : 7.2 / 10

---

## 1. BUGS CRITIQUES (P0)

### BUG-01 : Page Tarifs (/pricing) -- Cartes de prix invisibles sur desktop
- **Severite :** CRITIQUE (page business-critical vide)
- **Constat :** Sur desktop, le hero occupe 100% du viewport. Les PlanCards sont en-dessous avec `initial={{ opacity: 0, y: 60 }}` et `useInView({ amount: 0.3 })`. L'utilisateur ne scrolle pas car la page semble terminee (aucun indicateur visuel de contenu en-dessous).
- **Sur mobile :** Les cartes apparaissent en scrollant (confirme par test).
- **Fichier :** `src/pages/PricingPageWorking.tsx` (lignes 99-106)
- **Fix :** Reduire le padding hero desktop (`py-24` au lieu de `py-32`), OU retirer l'animation `useInView` sur les PlanCards (les afficher directement), OU ajouter un indicateur de scroll (chevron anime).

### BUG-02 : Erreurs console recurrentes sur toutes les pages
- **Severite :** HAUTE
- **Constat :** 3 erreurs reseau systematiques :
  1. `privacy_policies` -- requete echoue (`placeholder.supabase.co` = URL Supabase non configuree)
  2. `clinical_optins` -- idem
  3. `ai-monitoring` POST -- cascade d'erreurs (le monitoring tente de reporter sa propre erreur = boucle)
- **Impact :** Degradation UX (erreurs silencieuses), monitoring dysfonctionnel
- **Root cause :** L'URL Supabase est `placeholder.supabase.co` (variable d'env non resolue en preview)

### BUG-03 : Warning `cdn.tailwindcss.com` en production
- **Severite :** MOYENNE
- **Constat :** Le CDN Tailwind est charge en runtime (console warning). Ne doit pas etre present en production.
- **Impact :** Performance degradee, CSS potentiellement instable

---

## 2. PROBLEMES UX (P1)

### UX-01 : Banniere cookies persistante
- **Constat :** La banniere "Nous respectons votre vie privee" couvre une partie du contenu sur mobile (masque le bas de page, y compris les CTAs sur certaines pages comme /signup).
- **Recommendation :** Reduire sa taille sur mobile ou la rendre collapsible apres 5 secondes.

### UX-02 : Login page -- mot de passe pre-rempli
- **Constat :** Le champ mot de passe semble pre-rempli avec des bullets (autocompletion navigateur). Pas un bug mais visuellement trompeur pour un testeur.

### UX-03 : Pas de lien "Mot de passe oublie" visible sur le formulaire de login
- **Constat :** Le formulaire de connexion n'affiche que Email/Mot de passe/"Se connecter"/"S'inscrire". Pas de lien "Mot de passe oublie" visible.
- **Impact :** Friction utilisateur si mot de passe perdu.

### UX-04 : Page /about -- contenu coupe apres le hero
- **Constat :** Comme /pricing, le hero prend tout l'ecran desktop. Le reste du contenu est cache en-dessous sans indicateur visuel.

---

## 3. PAGES FONCTIONNELLES (OK)

| Page | Statut | Notes |
|------|--------|-------|
| `/` (Accueil) | OK | Hero clair, CTAs fonctionnels, cookie banner present |
| `/features` | OK | "37 modules, 3 minutes" -- coherent et professionnel |
| `/login` | OK | Formulaire fonctionnel, lien vers signup |
| `/signup` | OK | 4 champs, validation visible |
| `/contact` | OK | Formulaire complet, adresse physique affichee |
| `/entreprise` | OK | Page B2B professionnelle, badges confiance |
| `/scanner` | OK | Scanner emotionnel en 5 etapes, bien structure |
| `/legal/terms` | OK | CGU completes, date de mise a jour |
| `/help` | OK | Centre d'aide avec barre de recherche et FAQ |
| `/nonexistent` (404) | OK | Page 404 personnalisee avec CTAs de retour |

---

## 4. RESPONSIVE / MOBILE

| Element | Statut | Notes |
|---------|--------|-------|
| Navigation | OK | Menu hamburger fonctionnel |
| Homepage | OK | Texte bien reflow, CTA visible |
| Pricing | PARTIEL | Cartes visibles au scroll, mais banniere cookies masque le contenu |
| Signup | PARTIEL | Banniere cookies couvre le bouton de soumission |
| Scanner | OK | Slider Humeur fonctionnel |
| Contact | OK | Formulaire adaptatif |

---

## 5. SECURITE (observations cote client)

| Critere | Statut | Details |
|---------|--------|---------|
| Cookies RGPD | OK | Banniere conforme avec 3 options (Parametrer/Refuser/Accepter) |
| Headers Supabase | WARN | Apikey visible dans les requetes reseau (normal pour anon key) |
| Auth token | OK | Pas de token en localStorage visible |
| CSP | A VERIFIER | Pas d'erreur CSP en console |
| XSS | OK | Pas de `dangerouslySetInnerHTML` detecte dans le rendu |

---

## 6. PERFORMANCE

| Metrique | Statut | Notes |
|----------|--------|-------|
| FCP | WARN | Web Vital FCP marque "poor" en console |
| Bundle | A VERIFIER | Beaucoup de dependances (100+), impact potentiel sur le chargement |
| Lazy loading | OK | Routes lazy-loadees via `React.lazy` |
| Images | OK | Pas d'images lourdes detectees sur les pages testees |

---

## 7. PLAN D'ACTION RECOMMANDE

### Priorite immediate (avant beta publique)

1. **Fix /pricing** -- Supprimer l'animation `useInView` sur les PlanCards ou reduire le hero height. La page de tarifs est la page de conversion #1, elle DOIT afficher les prix immediatement.

2. **Fix banniere cookies mobile** -- Reduire la hauteur ou la repositionner pour ne pas masquer les CTAs.

3. **Fix erreurs console** -- Le monitoring en boucle (`ai-monitoring` qui tente de reporter sa propre erreur) doit etre corrige par un circuit-breaker plus strict.

4. **Ajouter "Mot de passe oublie"** sur la page de login.

### Priorite haute (semaine 1 post-beta)

5. **Retirer `cdn.tailwindcss.com`** -- Ne doit pas etre en production.

6. **Optimiser FCP** -- Le Web Vital "poor" impacte le SEO et la perception utilisateur.

7. **Audit des pages /about et autres** -- Verifier que les animations `useInView` ne bloquent pas le contenu sur desktop pour toutes les pages marketing.

---

## Resume executif

L'application est globalement **fonctionnelle et professionnelle**. Le design est coherent, la navigation fluide, les pages legales completes. Le scanner emotionnel est un differenciateur fort. Cependant, le **bug critique de la page Tarifs** (cartes invisibles sur desktop) est un bloqueur pour la conversion. La banniere cookies sur mobile cree aussi une friction significative. Ces 2 problemes doivent etre resolus avant tout lancement beta public.
