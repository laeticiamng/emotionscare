

# Correctifs UX prioritaires post-audit

## Probleme principal : Formulaire d'inscription silencieusement bloque

Quand l'utilisateur clique "Creer mon compte" sans avoir coche les cases CGU/Privacy (situees hors ecran, il faut scroller), le formulaire ne soumet pas ET n'affiche aucune erreur visible. L'utilisateur pense que le bouton est casse.

## Corrections a appliquer

### 1. Scroll automatique vers l'erreur (SignupPage.tsx)

Dans la fonction `handleSubmit`, quand la validation CGU/Privacy echoue (lignes 57-65), ajouter un scroll automatique vers le message d'erreur qui s'affiche. Utiliser `scrollIntoView` sur le bloc d'erreur pour que l'utilisateur voie immediatement le probleme.

### 2. Deplacer les checkboxes AVANT le bouton submit

Reorganiser le formulaire pour que les checkboxes CGU/Privacy soient directement au-dessus du bouton "Creer mon compte", pas separees par le bloc "OU CONTINUER AVEC" (Google/GitHub). L'ordre actuel est :

```text
Champs du formulaire
  -> Checkboxes CGU/Privacy (hors ecran)
  -> Separateur "OU CONTINUER AVEC"
  -> Boutons Google/GitHub (desactives)
  -> Bouton "Creer mon compte"
```

L'ordre corrige sera :
```text
Champs du formulaire
  -> Messages erreur/succes
  -> Checkboxes CGU/Privacy
  -> Bouton "Creer mon compte"
  -> Separateur "OU CONTINUER AVEC"
  -> Boutons Google/GitHub (desactives)
  -> Lien "Deja un compte ?"
```

### 3. Corriger le warning font preload (index.html)

Retirer ou corriger le preload de `inter-var.woff2` qui n'est pas utilise.

### 4. Gerer l'erreur 406 sur user_preferences

Verifier la table `user_preferences` dans Supabase — le 406 indique probablement un probleme de schema ou de RLS policy.

---

## Fichier a modifier

| Fichier | Modification |
|---------|-------------|
| `src/pages/SignupPage.tsx` | Reorganiser l'ordre des blocs (checkboxes avant bouton submit, social login apres), ajouter scroll vers erreur |

## Detail technique

Dans `SignupPage.tsx`, deplacer le bloc des checkboxes CGU/Privacy (lignes 271-316) juste avant le bouton submit (ligne 360), et deplacer le bloc social login (lignes 318-357) apres le bouton submit. Ajouter un `useRef` sur le bloc d'erreur avec `scrollIntoView({ behavior: 'smooth' })` dans les branches de validation qui echouent.

