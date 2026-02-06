
# Audit UX Complet - EmotionsCare

## Problemes Identifies

### 1. CRITIQUE - Double Banniere Cookies
**Cause** : Deux composants de consentement s'affichent simultanement :
- `CookieBanner` dans `src/providers/index.tsx` (ligne 69) utilisant `cookie_consent_v1`
- `ConsentBanner` dans `AppleHomePage.tsx` utilisant `emotionscare.consent.preferences`

**Correction** : Supprimer `ConsentBanner` de `AppleHomePage.tsx` car `CookieBanner` est deja inclus globalement dans `RootProvider`.

---

### 2. OK - Page Contact
La page contact affiche maintenant les vraies coordonnees (5 rue Caudron, 80000 Amiens). Pas de numero de telephone fictif.

---

### 3. OK - Navigation et indicateur page active
Les liens actifs sont bien stylises avec `text-primary font-medium` via `useLocation()`.

---

### 4. OK - Lien Aide dans navigation
Le lien Aide est present dans le header desktop et mobile.

---

### 5. OK - Redirection pages protegees
`/app/dashboard` redirige correctement vers `/login` pour les utilisateurs non authentifies.

---

## Fichiers a modifier

### Phase 1 - Correction Critique

**Fichier : `src/components/home/AppleHomePage.tsx`**
- Supprimer l'import de `ConsentBanner` (ligne 17)
- Supprimer le composant `<ConsentBanner />` (ligne 253)
- Le `CookieBanner` global dans `RootProvider` gere deja le consentement

---

## Details Techniques

| Fichier | Action |
|---------|--------|
| `src/components/home/AppleHomePage.tsx` | Supprimer import et usage de ConsentBanner |

### Estimation
- Temps : 2 minutes
- Risque : Faible

---

## Resultat Attendu
- Une seule banniere cookies s'affiche
- Cle localStorage unifiee : `cookie_consent_v1`
- UX coherente sur toutes les pages
