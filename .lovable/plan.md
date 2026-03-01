
# Audit Beta Testeur Complet -- EmotionsCare (3e iteration)

**Date :** 01/03/2026 | **Desktop :** 1366x768 | **Mobile :** 390x844

---

## Score Global : 8.4 / 10 (progression : +0.6 vs 7.8, +1.2 vs 7.2)

---

## 1. CORRECTIFS VERIFIES

| Bug precedent | Statut | Preuve |
|---------------|--------|--------|
| /pricing cartes invisibles | CORRIGE | 3 cartes visibles immediatement sur desktop |
| Lien "Mot de passe oublie" 404 | CORRIGE | Le lien est maintenant un bouton qui ouvre le ForgotPasswordDialog correctement |
| Hero /about trop grand | CORRIGE | Titre + CTAs visibles sans scroll (py-16 md:py-24) |
| Hero /features trop grand | CORRIGE | "37 modules. 3 minutes." + CTAs visibles sans scroll |
| Hero /entreprise | OK | CTAs "Echanger avec notre equipe" et "Acces avec code" visibles sans scroll |
| Boucle ai-monitoring | CORRIGE | Plus de cascade d'erreurs |

---

## 2. BUG RESTANT PRINCIPAL

### BUG-01 : Homepage hero 100dvh -- contenu invisible sur desktop
- **Severite :** HAUTE
- **Constat :** La page d'accueil (/) utilise `min-h-dvh` + `style={{ minHeight: '100dvh' }}` dans `AppleHeroSection.tsx` (ligne 43-44). Sur desktop 1366x768, seul le badge "Pour ceux qui prennent soin des autres" est visible. Le titre "Gerez votre stress en 3 minutes", le sous-titre et les CTAs ("Commencer gratuitement", "Comment ca marche") sont entierement caches sous le fold.
- **Sur mobile :** OK -- tout le contenu est visible grace au reflow naturel.
- **Impact :** C'est LA page d'accueil. Un visiteur voit un ecran quasi-vide avec un petit badge violet. Aucun CTA, aucun titre, aucune proposition de valeur visible. Taux de rebond potentiellement catastrophique.
- **Root cause :** `min-h-dvh` force la section a occuper 100% du viewport. Le contenu est centre verticalement mais la combinaison des gradients, paddings et du badge en haut pousse le titre et les CTAs sous le fold.
- **Fix recommande :** Remplacer `min-h-dvh` par `min-h-[85vh]` ou `min-h-[80vh]`, et retirer le `style={{ minHeight: '100dvh' }}` inline. Cela conserve l'effet "hero immersif" tout en exposant le titre et les CTAs au-dessus du fold.

### BUG-02 : Cookie banner chevauche le contenu sur /signup mobile
- **Severite :** MOYENNE
- **Constat :** La section "Consentements obligatoires" et le bouton de soumission du formulaire /signup sont partiellement masques par la banniere cookies sur mobile (390x844).
- **Fix recommande :** Ajouter un `pb-32` ou `mb-32` au conteneur du formulaire signup pour creer un espace sous le formulaire, OU rendre la banniere cookies dismissable apres 5 secondes d'inactivite.

### BUG-03 : Cookie banner chevauche le slider sur /scanner mobile
- **Severite :** FAIBLE
- **Constat :** Le slider de la premiere etape du scanner est partiellement cache par la banniere cookies sur mobile.

---

## 3. CONSOLE -- ETAT ACTUEL

| Type | Nombre | Details |
|------|--------|---------|
| Erreurs reseau | 3 | Requetes vers `placeholder.supabase.co` (privacy_policies, clinical_optins) |
| Warning env | 1 | VITE_SUPABASE_URL/ANON_KEY invalides |
| Warning FCP | 1 | Web Vital FCP marque "poor" |
| Boucle ai-monitoring | 0 | CORRIGE |
| Erreurs JS | 0 | Aucune erreur JavaScript |
| Warning postMessage | 5 | Lovable SDK (non-impactant, environnement preview) |

---

## 4. PAGES TESTEES -- STATUT

| Page | Desktop | Mobile | Notes |
|------|---------|--------|-------|
| `/` (Accueil) | **KO** | OK | Hero 100dvh cache titre+CTAs sur desktop |
| `/pricing` | OK | OK | 3 cartes visibles, badge "Populaire" |
| `/login` | OK | OK | Formulaire + ForgotPasswordDialog fonctionnel |
| `/signup` | OK | PARTIEL | Cookie banner chevauche consentements sur mobile |
| `/about` | OK | OK | Hero reduit, CTAs visibles |
| `/features` | OK | OK | Hero reduit, CTAs visibles |
| `/entreprise` | OK | OK | Hero avec CTAs visibles |
| `/scanner` | OK | PARTIEL | Cookie banner chevauche slider sur mobile |
| `/contact` | OK | OK | Formulaire complet |
| `/help` | OK | OK | Centre d'aide avec recherche |
| `/legal/terms` | OK | OK | CGU completes |
| `404` | OK | OK | Page personnalisee |

---

## 5. TABLEAU DE PROGRESSION

| Critere | Audit 1 (7.2) | Audit 2 (7.8) | Audit 3 (8.4) |
|---------|----------------|----------------|----------------|
| /pricing visible | KO | OK | OK |
| Mot de passe oublie | Absent | Lien 404 | Dialog OK |
| Boucle monitoring | KO | OK | OK |
| Hero /about | KO | KO | OK |
| Hero /features | KO | KO | OK |
| Hero /entreprise | KO | OK | OK |
| Hero homepage | KO | KO | **KO** |
| Cookie banner mobile | KO | Ameliore | Ameliore |
| Erreurs console | 6+ | 4-5 | 4 |
| Bugs critiques | 3 | 1 | 1 |

---

## 6. PLAN D'ACTION

### P0 -- Bloqueur beta
1. **Fix homepage hero** -- Dans `src/components/home/AppleHeroSection.tsx`, remplacer `min-h-dvh` par `min-h-[80vh]` et retirer `style={{ minHeight: '100dvh' }}`. Cela exposera le titre et les CTAs au-dessus du fold desktop tout en conservant l'effet immersif.

### P1 -- Ameliorations importantes
2. **Fix cookie banner mobile /signup** -- Ajouter du padding-bottom au formulaire ou rendre la banniere auto-dismissable apres interaction.
3. **Fix cookie banner mobile /scanner** -- Meme approche que /signup.

### P2 -- Optimisation
4. **Compresser icon-144x144.png** -- De 846KB a < 50KB.
5. **Verifier FCP en build production** -- Le 4744ms est probablement du au mode dev.

---

## Resume executif

**Score : 8.4/10** (+0.6 vs audit precedent). 6 correctifs majeurs valides : les pages /pricing, /about, /features et /entreprise affichent desormais leurs CTAs au-dessus du fold. Le dialog "Mot de passe oublie" fonctionne correctement. La boucle de monitoring est resolue. **Un seul bug critique reste : la page d'accueil (/) dont le hero occupe 100dvh, cachant le titre et les CTAs sur desktop.** C'est le dernier bloqueur avant beta publique. Le cookie banner sur mobile reste une friction mineure sur /signup et /scanner.

---

## Details techniques du fix P0

**Fichier :** `src/components/home/AppleHeroSection.tsx`

**Ligne 43-44 actuelle :**
```text
className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-background"
style={{ minHeight: '100dvh' }}
```

**Remplacement :**
```text
className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background"
```
(suppression du `style` inline)

**Ligne 19 :** Le `useInView` avec `amount: 0.3` pourrait aussi retarder le rendu du contenu. A verifier si les animations `isInView` conditionnent l'affichage du texte principal.
