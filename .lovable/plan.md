

# Fix UX "next step invisible" sur le Scanner emotionnel

## Probleme identifie

Le composant `SamSliders.tsx` affiche 2 curseurs (valence + arousal) avec un badge "Mis a jour" qui disparait apres 1 seconde. Ensuite : **rien**. Pas de bouton, pas de guidage, pas de promesse. L'utilisateur ne sait pas quoi faire apres avoir bouge les curseurs.

Le systeme enregistre automatiquement en arriere-plan (via `publishMood` + auto-submit SAM), mais l'utilisateur n'a **aucun signal visuel** que quelque chose s'est passe ou qu'il y a une suite.

## Corrections (1 fichier principal)

### Fichier : `src/features/scan/SamSliders.tsx`

**1. Ajouter une phrase-guidage en haut (microcopy)**
- Au-dessus des curseurs, afficher : "Etape 1 : indiquez votre ressenti, puis decouvrez vos recommandations"
- Donne un contexte immediat et une promesse de resultat

**2. Afficher un resume du ressenti detecte apres ajustement**
- Sous les curseurs, afficher une phrase dynamique combinant valence + arousal :
  - Exemple : "Vous semblez **plutot stresse(e)** avec un **niveau d'energie modere**"
- Remplace le badge ephemere "Mis a jour" par un retour permanent et comprehensible

**3. Ajouter un bouton CTA "Voir mes recommandations"**
- Bouton principal visible sous les curseurs, toujours accessible sans scroller
- Au clic : scroll automatique vers le panneau `MicroGestes` (recommandations) qui existe deja dans la page mais est dans la colonne de droite (invisible sur mobile)
- Sur mobile : le bouton scrolle vers la section recommandations qui est sous les curseurs

**4. Ajouter un teaser de resultat**
- Sous le bouton, une ligne discrete : "Musique, respiration et micro-gestes adaptes a votre etat"
- Motive l'utilisateur a cliquer

### Resultat attendu sur l'ecran

```text
+------------------------------------------+
| Etape 1 : indiquez votre ressenti        |
+------------------------------------------+
| Comment vous sentez-vous ?               |
| [Plutot positif]                         |
| ----o------ (slider)                     |
|                                          |
| Quel est votre niveau d'energie ?        |
| [Calme]                                  |
| ------o---- (slider)                     |
|                                          |
| Vous semblez detendu(e) et positif(ve)   |
|                                          |
| [ Voir mes recommandations ]  (bouton)   |
| Musique, respiration et micro-gestes     |
| adaptes a votre etat                     |
+------------------------------------------+
```

### Impact

| Avant | Apres |
|-------|-------|
| Slider + badge ephemere + rien | Guidage + resume permanent + CTA clair |
| "J'ai bouge, et maintenant ?" | "Je vois mon etat, je clique pour la suite" |
| Recommandations cachees a droite/en bas | Bouton qui y amene directement |

1 fichier modifie (`SamSliders.tsx`), zero changement de logique metier (l'auto-save continue de fonctionner en arriere-plan).

