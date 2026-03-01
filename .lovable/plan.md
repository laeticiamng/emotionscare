
# Audit Beta Testeur Complet -- EmotionsCare (post-correctifs)

**Date :** 01/03/2026 | **Viewport desktop :** 1366x768 | **Viewport mobile :** 390x844

---

## Score Global : 7.8 / 10 (progression : +0.6 vs 7.2)

---

## 1. CORRECTIFS VERIFIES (depuis dernier audit)

| Bug precedent | Statut | Preuve |
|---------------|--------|--------|
| BUG-01 : Cartes /pricing invisibles | CORRIGE | Les 3 cartes (Gratuit / Premium 9.9EUR / Etablissement) sont visibles immediatement sans scroll |
| UX-03 : Lien "Mot de passe oublie" manquant | CORRIGE (partiellement) | Le lien est present sous le bouton "Se connecter" |
| BUG-02 : Boucle infinie ai-monitoring | CORRIGE | Le circuit-breaker fonctionne, plus de cascade d'erreurs dans la console |
| UX-01 : Cookie banner mobile | AMELIORE | Padding reduit, scroll interne ajoute (max-h-[40vh]) |

---

## 2. NOUVEAUX BUGS DETECTES

### BUG-NEW-01 : Lien "Mot de passe oublie" pointe vers une 404
- **Severite :** HAUTE
- **Constat :** Le lien ajoute sur `/login` pointe vers `/forgot-password`, qui n'existe pas dans le routeur. La page 404 s'affiche.
- **Root cause :** Le systeme utilise un `ForgotPasswordDialog` (composant dialog dans `src/pages/b2c/login/ForgotPasswordDialog.tsx`), pas une page dediee. Le lien devrait ouvrir ce dialog au lieu de naviguer vers une route inexistante.
- **Fix :** Remplacer le `<Link to="/forgot-password">` par un bouton qui ouvre le `ForgotPasswordDialog` en mode inline, OU creer une page dediee `/forgot-password`.

### BUG-NEW-02 : Env validation warnings persistants
- **Severite :** MOYENNE
- **Constat :** La console affiche `Environment validation warnings: VITE_SUPABASE_URL: Invalid url, VITE_SUPABASE_ANON_KEY: String must contain at least 1 character(s)`. Cela indique que le fichier `.env` n'est pas correctement lu en preview.
- **Impact :** Les requetes vers `placeholder.supabase.co` echouent systematiquement (3 erreurs reseau a chaque chargement).

### BUG-PERSIST-01 : Page /about -- hero plein ecran sans indicateur de scroll
- **Severite :** MOYENNE
- **Constat :** Comme le /pricing d'avant, le hero de /about occupe 100% du viewport desktop (`py-24 md:py-36`). Le contenu (fondatrice, mission, valeurs) est entierement cache en dessous.
- **Fix :** Reduire a `py-16 md:py-24` (comme le fix applique a /pricing) ou ajouter un chevron de scroll.

### BUG-PERSIST-02 : Page /features -- meme probleme hero plein ecran
- **Severite :** FAIBLE (moins critique car le hero "37 modules, 3 minutes" est auto-suffisant)
- **Constat :** Le hero prend tout l'ecran desktop. Les modules detailles sont caches en dessous.

### BUG-PERSIST-03 : Page /entreprise -- meme pattern hero plein ecran
- **Severite :** FAIBLE
- **Constat :** Hero B2B prend tout le viewport, le contenu detaille (avantages, ROI, temoignages) est cache.

---

## 3. PAGES TESTEES -- STATUT

| Page | Statut | Notes |
|------|--------|-------|
| `/` (Accueil) | OK | Hero clair, CTAs fonctionnels, navigation fluide |
| `/pricing` | OK (CORRIGE) | 3 cartes de prix visibles immediatement, badge "Populaire" sur Premium |
| `/login` | PARTIEL | Formulaire OK, "Mot de passe oublie" present MAIS lien casse (404) |
| `/signup` | OK | Formulaire 4 champs + consentements |
| `/scanner` | OK | Scanner emotionnel 5 etapes, progression visible, slider fonctionnel |
| `/about` | PARTIEL | Hero OK mais contenu cache en dessous (hero trop grand) |
| `/features` | PARTIEL | Hero OK mais meme probleme de hero plein ecran |
| `/entreprise` | PARTIEL | Page B2B professionnelle, meme pattern hero |
| `/contact` | OK | Formulaire complet |
| `/help` | OK | Centre d'aide avec recherche et FAQ |
| `/legal/terms` | OK | CGU completes |
| `/forgot-password` | KO | Route inexistante, affiche 404 |
| `/nonexistent` (404) | OK | Page 404 personnalisee avec "Retour" et "Accueil EmotionsCare" |

---

## 4. CONSOLE -- ETAT ACTUEL

| Type | Nombre | Details |
|------|--------|---------|
| Erreurs reseau | 3-4 | Requetes vers `placeholder.supabase.co` (privacy_policies, clinical_optins) |
| Warnings env | 1 | Validation SUPABASE_URL/ANON_KEY invalides |
| Warning FCP | 1 | Web Vital FCP marque "poor" |
| Boucle ai-monitoring | 0 | CORRIGE -- plus de cascade |
| Erreurs JS | 0 | Aucune erreur JavaScript applicative |

---

## 5. PERFORMANCE

| Metrique | Valeur | Statut |
|----------|--------|--------|
| FCP | 4744ms | POOR (seuil < 1800ms) |
| TTFB | 380ms | OK |
| CLS | 0.009 | GOOD |
| DOM Nodes | 2229 | OK |
| JS Heap | 20.3MB | OK |
| Scripts charges | 200 | ELEVE (dev mode, attendu) |
| Plus gros asset | icon-144x144.png (846KB) | A OPTIMISER |

**Points d'attention performance :**
- L'icone 144x144 fait 846KB -- devrait etre < 50KB pour une icone PWA
- `lucide-react.js` charge entierement (146KB) -- possibilite de tree-shaking
- `date-fns/locale.js` (132KB) -- ne charger que la locale `fr`
- FCP "poor" principalement du au mode dev (Vite HMR), a verifier en build de production

---

## 6. MOBILE (390x844)

| Element | Statut | Notes |
|---------|--------|-------|
| Navigation | OK | Menu hamburger fonctionnel |
| Cookie banner | AMELIORE | Moins intrusif mais couvre encore le bas de /signup (section "Consentements obligatoires" partiellement cachee) |
| Signup | PARTIEL | Le formulaire est complet mais le bas est coupe par la banniere cookies |
| Scanner | OK | Interface tactile fonctionnelle |

---

## 7. SECURITE (observations client)

| Critere | Statut |
|---------|--------|
| Banniere cookies RGPD | OK -- 3 options (Parametrer/Refuser/Accepter) |
| Pas d'erreur XSS | OK |
| Pas de secrets exposes | OK |
| Auth tokens | OK -- pas visibles en localStorage |

---

## 8. TABLEAU DE PROGRESSION

| Critere | Audit precedent (7.2/10) | Cet audit (7.8/10) |
|---------|--------------------------|---------------------|
| /pricing visible | KO | OK |
| Mot de passe oublie | Absent | Present (mais lien casse) |
| Boucle monitoring | KO | OK |
| Cookie banner mobile | KO | Ameliore |
| Erreurs console | ~6+ | 4-5 |
| Bugs critiques | 3 | 1 (lien 404) |

---

## 9. PLAN D'ACTION (priorite)

### P0 -- Avant beta publique
1. **Fix lien "Mot de passe oublie"** -- Soit ouvrir le `ForgotPasswordDialog` existant, soit creer la route `/forgot-password`
2. **Fix hero /about** -- Reduire `py-24 md:py-36` a `py-16 md:py-24` (meme fix que /pricing)

### P1 -- Semaine 1
3. **Reduire heroes /features et /entreprise** -- Appliquer le meme pattern de padding reduit
4. **Optimiser icon-144x144.png** -- Comprimer de 846KB a < 50KB
5. **Cookie banner mobile** -- Ajouter un `pb-20` au contenu de /signup pour eviter le chevauchement

### P2 -- Semaine 2
6. **Tree-shake lucide-react** -- Importer uniquement les icones utilisees pour reduire le bundle
7. **Locale date-fns** -- Charger uniquement `fr` au lieu du bundle complet
8. **Verifier FCP en build production** -- Le 4744ms est probablement du au mode dev

---

## Resume executif

**Score : 7.8/10** (+0.6 vs audit precedent). Les 3 correctifs majeurs (pricing cards, monitoring loop, forgot password link) sont appliques. Un nouveau bug est apparu : le lien "Mot de passe oublie" pointe vers une route 404 car le systeme existant utilise un dialog, pas une page. Le pattern "hero plein ecran" persiste sur /about, /features et /entreprise. La performance FCP est a surveiller en production. L'application est proche du seuil beta-ready, il reste principalement le fix du lien 404 et la reduction des heroes marketing.
