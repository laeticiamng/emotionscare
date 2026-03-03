

## Audit visuel -- Resultats

### Test 1 : Hero desktop 1366x768 -- PASSE

Badge, titre, sous-titre, et les 2 CTAs ("Commencer gratuitement" + "Comment ca marche") sont tous visibles above-the-fold. Aucun probleme.

### Test 2 : Signup mobile 390x844 -- ECHEC (persiste)

Le correctif precedent (`justify-start overflow-y-auto`) n'a pas resolu le probleme. Le bouton "Creer mon compte", les options Google/GitHub et le lien "Se connecter" restent inaccessibles en scrollant.

### Cause racine

Le `SignupPage` est rendu a l'interieur de `MarketingLayout` qui a cette structure :

```text
<div class="relative min-h-screen">           ← MarketingLayout wrapper
  <header class="fixed top-0 h-16 z-50">      ← header fixe 64px
  <main class="pt-16">                         ← padding-top pour le header
    <div class="min-h-screen overflow-y-auto"> ← SignupPage container (PROBLEME)
      ... formulaire ...
    </div>
  </main>
  <Footer />
</div>
```

Le probleme : `min-h-screen` (100vh) sur le container du SignupPage cree un conteneur de scroll imbrique qui prend exactement la hauteur du viewport. Mais ce conteneur est deja a l'interieur de `<main class="pt-16">`, donc le scroll du document ne peut pas atteindre le bas du formulaire. Le `overflow-y-auto` cree un scroll interne qui entre en conflit avec le scroll natif de la page.

### Correction

Fichier : `src/pages/SignupPage.tsx`, ligne 119.

Remplacer :
```
min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-start p-4 pt-20 pb-40 overflow-y-auto
```

Par :
```
min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-start p-4 pt-20 pb-40
```

Changements :
- `min-h-screen` → `min-h-[calc(100vh-4rem)]` : soustrait les 64px du header fixe pour que la hauteur minimale soit correcte
- Suppression de `overflow-y-auto` : laisse le scroll natif du document gerer le defilement au lieu de creer un scroll imbrique

Le formulaire depassant 100vh sur mobile, le scroll natif de la page permettra d'atteindre le bouton "Creer mon compte" et les options sociales en bas.

### Fichiers a modifier

| Fichier | Modification |
|---------|-------------|
| `src/pages/SignupPage.tsx` ligne 119 | Remplacer `min-h-screen` par `min-h-[calc(100vh-4rem)]` et supprimer `overflow-y-auto` |

