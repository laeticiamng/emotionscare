

# Audit Beta Testeur Complet -- EmotionsCare (5e iteration)

**Date :** 01/03/2026 | **Desktop :** 1366x768 | **Mobile :** 390x844

---

## Score Global : 9.0 / 10 (progression : +0.3 vs 8.7, +1.8 vs 7.2)

---

## 1. CORRECTIFS VERIFIES (depuis audit 4)

| Bug precedent | Statut | Preuve |
|---|---|---|
| Homepage hero desktop CTAs sous le fold (BUG-01) | **CORRIGE** | Titre `lg:text-7xl xl:text-8xl`, padding `py-12 md:py-16`, badge + titre + sous-titre + CTAs ("Commencer gratuitement", "Comment ca marche") tous visibles au-dessus du fold sur 1366x768 |
| Signup mobile `items-center` (BUG-02) | **PARTIELLEMENT CORRIGE** | `items-start pt-20` applique, le formulaire demarre en haut -- mais le bouton "Creer mon compte" reste inaccessible par scroll (voir BUG-04) |
| Icon PWA 846KB | **CORRIGE** | Fichier optimise, environ 15KB |

---

## 2. BUGS RESTANTS

### BUG-04 : Signup mobile -- bouton "Creer mon compte" inaccessible par scroll
- **Severite :** MOYENNE
- **Constat :** Sur mobile 390x844, apres avoir ferme le cookie banner, le formulaire d'inscription affiche les champs et les consentements obligatoires, mais il est impossible de scroller jusqu'au bouton "Creer mon compte" et aux options de connexion sociale. Le contenu est tronque.
- **Root cause :** Le conteneur principal utilise `min-h-screen` + `flex`, ce qui cree un contexte de hauteur fixe. La Card interne depasse la hauteur du viewport mais le conteneur flex ne permet pas le scroll naturel. Le `pb-36` n'est pas suffisant car le contenu total (header + 4 champs + consentements + bouton + social + lien login) depasse largement le viewport.
- **Fix recommande :** Remplacer `min-h-screen` par `min-h-0` ou supprimer la contrainte flex sur la hauteur. Ajouter `overflow-y-auto` au conteneur, ou mieux : retirer `flex` et utiliser un layout en `block` avec padding top/bottom suffisant. L'approche la plus simple serait :
  ```
  // Ligne 119 : remplacer
  "min-h-screen bg-gradient-to-br ... flex items-start justify-center p-4 pt-20 pb-36"
  // par
  "min-h-screen bg-gradient-to-br ... flex flex-col items-center p-4 pt-20 pb-40"
  ```
  En supprimant `items-start` et en utilisant `flex-col items-center`, le contenu sera centre horizontalement mais pourra s'etendre verticalement sans etre contraint.

### BUG-05 : Erreurs reseau vers `placeholder.supabase.co`
- **Severite :** FAIBLE (environnement preview uniquement)
- **Constat :** 3 requetes echouent systematiquement vers `placeholder.supabase.co` (privacy_policies, clinical_optins). Elles generent des erreurs `ERR_TUNNEL_CONNECTION_FAILED` en console.
- **Root cause :** Le client Supabase utilise des credentials placeholder en environnement preview Lovable. Ces erreurs n'apparaitront pas en production avec les vraies credentials.
- **Recommandation :** Ajouter un guard dans les hooks `usePrivacyPolicyVersions` et `useClinicalOptins` pour ne pas effectuer de requetes si l'URL Supabase contient "placeholder".

---

## 3. PAGES TESTEES -- STATUT

| Page | Desktop 1366x768 | Mobile 390x844 | Notes |
|---|---|---|---|
| `/` (Accueil) | **OK** | **OK** | Hero corrige : badge + titre + sous-titre + CTAs visibles above the fold sur les deux viewports |
| `/pricing` | **OK** | **OK** | 3 cartes (Gratuit, Premium "Populaire", Etablissement) visibles |
| `/login` | **OK** | **OK** | Formulaire email/mot de passe + "Mot de passe oublie" + "S'inscrire" |
| `/login` > Mot de passe oublie | **OK** | Non teste | Dialog "Reinitialiser votre mot de passe" avec champ email + "Envoyer le lien" |
| `/signup` | **OK** | **PARTIEL** | Desktop parfait. Mobile : consentements visibles mais bouton submit inaccessible (BUG-04) |
| `/about` | **OK** | Non teste | Hero avec CTAs "Decouvrir EmotionsCare" + "Nous contacter" visibles |
| `/features` | **OK** | Non teste | "37 modules. 3 minutes." + CTAs visibles |
| `/entreprise` | **OK** | Non teste | Hero avec "Echanger avec notre equipe" + "Acces avec code" visibles |
| `/scan` | N/A | **OK** | Redirige vers /login pour utilisateurs non authentifies (comportement correct) |
| 404 | Non teste | **OK** | Page personnalisee "Cette page s'est echappee" avec boutons Retour + Accueil |

---

## 4. CONSOLE

| Type | Nombre | Details |
|---|---|---|
| Erreurs reseau | 3 | `placeholder.supabase.co` (privacy_policies x2, clinical_optins x1) -- preview uniquement |
| Erreurs JS applicatives | 0 | Aucune |
| Boucle ai-monitoring | 0 | Corrige (depuis audit 3) |
| Warnings CDN Tailwind | 1 | `cdn.tailwindcss.com should not be used in production` -- non impactant en preview |

---

## 5. TABLEAU DE PROGRESSION

| Critere | Audit 1 (7.2) | Audit 2 (7.8) | Audit 3 (8.4) | Audit 4 (8.7) | Audit 5 (9.0) |
|---|---|---|---|---|---|
| /pricing visible | KO | OK | OK | OK | OK |
| Mot de passe oublie | Absent | Lien 404 | Dialog OK | Dialog OK | Dialog OK |
| Boucle monitoring | KO | OK | OK | OK | OK |
| Hero /about | KO | KO | OK | OK | OK |
| Hero /features | KO | KO | OK | OK | OK |
| Hero /entreprise | KO | OK | OK | OK | OK |
| Hero homepage desktop | KO | KO | KO | PARTIEL | **OK** |
| Hero homepage mobile | OK | OK | OK | OK | OK |
| Signup mobile scroll | -- | -- | KO | PARTIEL | **PARTIEL** |
| Icon PWA taille | KO | KO | KO | KO | **OK** |
| 404 page | OK | OK | OK | OK | OK |
| Erreurs JS | 6+ | 4-5 | 4 | 4 | 0 (3 reseau preview) |

---

## 6. PLAN D'ACTION

### P0 -- Dernier correctif avant release
1. **Fix signup mobile scroll** -- Dans `SignupPage.tsx` ligne 119, le layout `flex items-start` empeche le scroll complet du formulaire sur mobile. Remplacer par un layout qui permet au contenu de depasser le viewport et d'etre scrollable :
   - Remplacer `flex items-start justify-center` par `flex flex-col items-center`
   - Augmenter le padding bottom a `pb-40` pour compenser le cookie banner
   - Cela permettra au formulaire complet (champs + consentements + bouton + social login) d'etre accessible par scroll

### P1 -- Ameliorations qualite
2. **Guard requetes placeholder** -- Dans `usePrivacyPolicyVersions.ts` et les hooks similaires, ajouter une condition pour ne pas effectuer de requetes si l'URL Supabase contient "placeholder", eliminant les 3 erreurs console en preview
3. **Verifier FCP en production** -- Le FCP de 6.5s en dev est du au mode unbundled de Vite (200+ modules). Un build production devrait etre sous les 2s grace au bundling

### P2 -- Optimisations futures
4. Ajouter un test E2E specifique pour le formulaire d'inscription mobile (scroll complet + soumission)
5. Tester les pages /contact, /help, /faq en desktop et mobile (non couverts dans cet audit)

---

## Resume executif

**Score : 9.0/10** (+0.3 vs audit precedent, +1.8 depuis le premier audit). Le correctif majeur du hero de la page d'accueil est confirme : sur desktop 1366x768, le badge, le titre, le sous-titre, la proposition de valeur ET les deux CTAs sont desormais tous visibles au-dessus de la ligne de flottaison. L'icone PWA est passee de 846KB a environ 15KB. Aucune erreur JavaScript applicative en console.

Le seul probleme restant est le formulaire d'inscription sur mobile (390x844) : le bouton "Creer mon compte" est inaccessible car le formulaire est trop long pour le viewport et le layout flex empeche le scroll naturel. C'est un fix simple (changer le layout flex).

**L'application est beta-ready.** Le correctif P0 est recommande avant le lancement pour ne pas bloquer les inscriptions sur mobile.

