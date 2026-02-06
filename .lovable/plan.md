

# Diagnostic : Inscription impossible -- Causes et Corrections

## Resultat du test en conditions reelles

J'ai teste le flux complet d'inscription sur la preview. Voici ce qui se passe :

1. Le formulaire `/signup` s'affiche correctement (design OK)
2. A la soumission, Supabase rejette les mots de passe courants (verif HaveIBeenPwned) avec un **message en anglais brut** : "Password is known to be weak and easy to guess, please choose a different one."
3. Meme avec un mot de passe fort, **l'email de confirmation est requis** -- l'utilisateur ne peut pas se connecter tant qu'il n'a pas clique sur le lien recu par email
4. Le domaine `emotionscare.test` n'existe pas, donc l'email de confirmation n'arrive jamais

## Les 3 problemes identifies

### Probleme 1 : Messages d'erreur en anglais (UX cassee)
Le `AuthContext.signUp()` lance l'erreur Supabase brute. Le `SignupPage.tsx` affiche `error.message` directement -- sans passer par `authErrorService.ts` qui contient deja les traductions francaises.

De plus, le pattern de detection dans `authErrorService.ts` cherche `"weak password"` alors que Supabase renvoie `"Password is known to be weak and easy to guess"` -- le match echoue.

### Probleme 2 : Confirmation email obligatoire (bloquant)
Supabase a l'option "Confirm email" activee par defaut. Apres inscription, l'utilisateur recoit un message "Compte cree ! Verifiez votre email" mais :
- Il ne peut pas se connecter tant que l'email n'est pas confirme
- L'erreur de connexion affiche "Invalid login credentials" en anglais (pas "Email non confirme")

**Action utilisateur requise** : Desactiver temporairement "Confirm email" dans Supabase Dashboard > Authentication > Email pour permettre le test, OU configurer un vrai domaine d'envoi.

### Probleme 3 : Validation mot de passe trop faible cote client
Le formulaire accepte 6 caracteres minimum (`password.length < 6`) alors que Supabase exige un mot de passe non-pwned. L'utilisateur remplit le formulaire, soumet, et decouvre seulement apres l'appel API que son mot de passe est rejete.

---

## Plan de correction (code)

### 1. Integrer `authErrorService` dans le flux signup

**Fichier : `src/contexts/AuthContext.tsx`**
- Dans la methode `signUp`, utiliser `authErrorService.getFriendlyError()` pour traduire les erreurs Supabase avant de les relancer
- Ajouter une detection du code `weak_password` (Supabase retourne `code: "weak_password"` dans le JSON)

### 2. Corriger le pattern de detection dans `authErrorService.ts`

**Fichier : `src/lib/auth/authErrorService.ts`**
- Ajouter un check sur `message.includes('weak')` en plus de `message.includes('weak password')` pour attraper le message Supabase reel
- Ajouter un check sur le champ `code` de l'erreur (`error.code === 'weak_password'`)
- Ajouter une traduction pour "Email not confirmed" / `email_not_confirmed`

### 3. Renforcer la validation client dans `SignupPage.tsx`

**Fichier : `src/pages/SignupPage.tsx`**
- Passer le minimum de 6 a 8 caracteres
- Ajouter une validation regex : au moins une majuscule, une minuscule et un chiffre (coherent avec `registerSchema` de `auth.ts`)
- Afficher les regles de mot de passe en temps reel sous le champ (indicateur visuel de force)

### 4. Traduire les erreurs de login aussi

**Fichier : `src/pages/UnifiedLoginPage.tsx`**
- Utiliser `authErrorService.getFriendlyError()` au lieu d'afficher `error.message` brut
- Gerer specifiquement le cas "Email not confirmed" avec un message clair en francais

---

## Action manuelle requise (Supabase Dashboard)

Pour que l'inscription fonctionne immediatement en test :

1. Aller sur **Authentication > Providers > Email** dans le [dashboard Supabase](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/auth/providers)
2. Desactiver "Confirm email" (ou le laisser active si un vrai domaine email est configure)
3. Optionnel : dans **Authentication > URL Configuration**, verifier que le Site URL et Redirect URL incluent l'URL de preview et l'URL publiee

---

## Section technique -- Fichiers modifies

| Fichier | Modification |
|---|---|
| `src/contexts/AuthContext.tsx` | Import et utilisation de `authErrorService.getFriendlyError()` dans `signUp` |
| `src/lib/auth/authErrorService.ts` | Fix du pattern `weak_password`, ajout check sur `error.code`, traduction "email not confirmed" |
| `src/pages/SignupPage.tsx` | Validation 8 chars min + regex, indicateur de force, traduction erreurs |
| `src/pages/UnifiedLoginPage.tsx` | Traduction des erreurs de login via `authErrorService` |

