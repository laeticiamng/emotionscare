

# Audit UX Detaille - EmotionsCare

## Problemes Identifies

### P0 - Bloquants pour l'utilisateur

#### 1. Lien "Mot de passe oublie" mene vers une page 404
- **Fichier** : `src/pages/LoginPage.tsx` ligne 330
- **Impact** : Un utilisateur qui a oublie son mot de passe ne peut pas le reinitialiser. Impasse totale dans le parcours d'authentification.
- **Correction** : Remplacer le `<Link to="/forgot-password">` par un dialog inline (comme le `ForgotPasswordDialog` qui existe deja dans `src/pages/b2c/login/ForgotPasswordDialog.tsx`) qui appelle `supabase.auth.resetPasswordForEmail()` directement depuis la page de login.

#### 2. Bouton "Acceder au centre d'aide" non fonctionnel (page Contact)
- **Fichier** : `src/pages/ContactPage.tsx` ligne 356-362
- **Impact** : L'utilisateur clique sur le bouton et rien ne se passe. Perte de confiance immediate.
- **Correction** : Transformer le `<Button>` en `<Link to="/help">` qui navigue vers la page d'aide existante.

---

### P1 - Accessibilite

#### 3. Bouton afficher/masquer mot de passe sans aria-label (page Login)
- **Fichier** : `src/pages/LoginPage.tsx` ligne 307-312
- **Impact** : Les lecteurs d'ecran ne peuvent pas identifier le bouton. Non conforme WCAG AA.
- **Correction** : Ajouter `aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}`.

#### 4. Bouton afficher/masquer mot de passe sans aria-label (page Signup)
- **Fichier** : `src/pages/SignupPage.tsx` (boutons similaires)
- **Impact** : Meme probleme que sur la page Login.
- **Correction** : Ajouter les `aria-label` correspondants.

---

### P2 - Ameliorations UX

#### 5. Prix "0 euro" sur la page Tarifs
- **Fichier** : `src/pages/PricingPageWorking.tsx` ligne 122-124
- **Impact** : Afficher "0 euro" est ambigu. "Gratuit" est plus clair et plus engageant pour l'utilisateur.
- **Correction** : Afficher "Gratuit" au lieu de "0 euro" quand le prix est 0.

#### 6. Footer expose des liens proteges sans indication
- **Fichier** : `src/components/home/Footer.tsx` lignes 17-21
- **Impact** : L'utilisateur clique sur "Scanner emotionnel" ou "Mon espace" et se retrouve redirige vers /login sans comprendre pourquoi.
- **Correction** : Ajouter une icone cadenas ou une indication visuelle "(connexion requise)" a cote des liens proteges dans le footer.

---

## Corrections a implementer

### Fichier 1 : `src/pages/LoginPage.tsx`
1. Remplacer `<Link to="/forgot-password">` par un composant dialog qui utilise `supabase.auth.resetPasswordForEmail()`.
2. Ajouter `aria-label` au bouton toggle password.
3. Remplacer `catch (error: any)` par `catch (error: unknown)`.

### Fichier 2 : `src/pages/ContactPage.tsx`
4. Transformer le bouton "Acceder au centre d'aide" en lien vers `/help`.

### Fichier 3 : `src/pages/PricingPageWorking.tsx`
5. Afficher "Gratuit" quand le prix est 0.

### Fichier 4 : `src/pages/SignupPage.tsx`
6. Ajouter `aria-label` aux boutons toggle password.

### Fichier 5 : `src/components/home/Footer.tsx`
7. Ajouter une indication visuelle "(connexion requise)" aux liens proteges du footer.

