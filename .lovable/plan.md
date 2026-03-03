

## Audit visuel -- Resultats

### Test 1 : Hero desktop 1366x768 -- PASSE

Badge "Pour ceux qui prennent soin des autres" + titre + sous-titre + 2 CTAs ("Commencer gratuitement" + "Comment ca marche") sont tous visibles above-the-fold sans scroll. Aucun probleme detecte.

### Test 2 : Signup mobile 390x844 -- ECHEC

**Probleme :** Le formulaire d'inscription ne scrolle pas completement. Apres fermeture du cookie banner, le bouton "Creer mon compte", les options sociales (Google/GitHub) et le lien "Se connecter" restent inaccessibles -- le scroll est bloque au niveau des checkboxes RGPD.

**Cause racine :** Ligne 119 de `SignupPage.tsx` :
```
<div className="min-h-screen ... flex flex-col items-center p-4 pt-20 pb-40">
```
Le `flex` + `items-center` centre verticalement le contenu dans le viewport. Quand le formulaire depasse la hauteur de l'ecran, le centrage vertical empeche le defilement naturel vers le bas.

### Correction proposee

Fichier : `src/pages/SignupPage.tsx`, ligne 119

Remplacer :
```
flex flex-col items-center p-4 pt-20 pb-40
```
Par :
```
flex flex-col items-center justify-start p-4 pt-20 pb-40 overflow-y-auto
```

Le changement :
- `justify-start` : place le contenu en haut au lieu du centre vertical par defaut
- `overflow-y-auto` : garantit le scroll vertical quand le contenu depasse

Aucun impact desktop (le contenu reste centre horizontalement via `items-center`, et `min-h-screen` + `justify-start` fonctionne normalement quand le contenu est plus court que l'ecran).

### Fichiers a modifier

| Fichier | Modification |
|---------|-------------|
| `src/pages/SignupPage.tsx` | Ajouter `justify-start overflow-y-auto` sur le container principal (ligne 119) |

### Estimation
5 minutes, 1 fichier, 1 ligne modifiee.

