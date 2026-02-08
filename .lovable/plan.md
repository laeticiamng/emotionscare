
# Correction des checkboxes invisibles sur la page d'inscription

## Probleme constate

Les cases a cocher CGU et Politique de Confidentialite sur `/signup` sont quasiment invisibles :
- **Taille trop petite** : 16x16px (`h-4 w-4`), a peine visible sur mobile
- **Contraste insuffisant** : bordure fine `border-primary` qui se confond avec le fond, surtout en mode sombre
- **Pas de fond distinctif** : la case non cochee n'a aucun remplissage, elle "disparait" visuellement

L'utilisateur voit le texte "J'accepte les CGU" mais ne voit pas la case a cocher a cote. Il clique sur "Creer mon compte" et rien ne se passe (erreur de validation non visible sans scroll).

## Corrections (2 fichiers)

### Fichier 1 : `src/components/ui/checkbox.tsx`

Ameliorer la visibilite globale du composant Checkbox :
- Taille augmentee de `h-4 w-4` a **`h-5 w-5`** (20x20px)
- Bordure renforcee : `border` -> **`border-2`**
- Ajout d'un fond pour la case non cochee : **`bg-background`** (contraste garanti en light ET dark mode)
- Icone Check agrandie pour correspondre : `h-4 w-4` -> **`h-3.5 w-3.5`**

### Fichier 2 : `src/pages/SignupPage.tsx`

Ameliorations UX specifiques au formulaire d'inscription :
- Supprimer `className="mt-0.5"` sur les checkboxes (l'alignement sera meilleur avec la taille 20px)
- Ajouter **`aria-required="true"`** sur les deux checkboxes
- Ajouter une **bordure visuelle** autour du bloc checkboxes : un encadre leger (`border rounded-lg p-4 bg-muted/30`) pour attirer l'attention
- Ajouter un titre "Consentements obligatoires" au-dessus du bloc pour que l'utilisateur comprenne immediatement qu'il doit cocher
- En cas d'erreur sur les checkboxes, ajouter **`border-destructive`** sur les checkboxes non cochees pour un feedback visuel immediat

## Resultat attendu

| Avant | Apres |
|-------|-------|
| Case invisible, 16px, pas de fond | Case visible, 20px, fond blanc/sombre, bordure epaisse |
| Texte CGU sans contexte | Bloc encadre "Consentements obligatoires" |
| Erreur seulement en haut du formulaire | Bordure rouge sur la case non cochee |
| Utilisateur bloque sans comprendre pourquoi | Action evidente en moins de 3 secondes |

2 fichiers modifies. Zero changement de logique metier.
