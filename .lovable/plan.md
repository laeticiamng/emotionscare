
# Plan d'optimisation ergonomique finale : Registre, doublons et modules

---

## Constat

Les interventions precedentes ont ameliore :
- Le **menu de navigation** (reduit a ~25 liens, bien organise)
- Le **dashboard** (5 actions prioritaires)
- Les **pages experimentales** (boutons retour, badges "Bientot")
- Le **catalogue ModulesDashboard** (filtres, badges statut)

**Ce qui reste non traite** : le registre de routes (`registry.ts`, 2709 lignes) contient encore ~200 routes sans aucun marquage `hidden`, `status` ou `deprecated` (sauf 1 route). Cela signifie que :

1. Les **routes en doublon** (`/app/social-cocon`, `/app/communaute`, `/app/feed`, `/app/friends`, `/app/groups`, `/app/auras`, `/app/voice-analysis`, `/app/particulier`, `/app/particulier/mood`) sont toujours accessibles et creent de la confusion
2. Les **routes dev-only** (`/app/api-keys`, `/app/webhooks`, `/app/api-docs`, `/system-health`, `/k6-analytics`) restent visibles en production
3. Les **modules experimentaux** (`/app/hume-ai`, `/app/suno`, `/app/brain-viewer`, `/app/wearables`, `/app/context-lens`) n'ont pas de marquage `status` dans le registre

---

## Plan en 2 phases

### Phase 1 : Marquage systematique dans `registry.ts`

Ajouter les champs `hidden`, `deprecated` et `status` aux routes appropriees :

**Routes a marquer `hidden: true` (dev-only, retirer de tout listing)** :
- `/app/api-keys` -- outil developpeur
- `/app/webhooks` -- outil developpeur
- `/app/api-docs` -- documentation technique
- `/system-health` -- monitoring interne
- `/k6-analytics` -- tests de charge
- `/test` -- page de test
- `/validation` -- page de validation
- `/dev/test-accounts` -- comptes de test

**Routes a marquer `deprecated: true` (doublons vers une route canonique)** :
- `/app/social-cocon` -- doublon de `/app/entraide`
- `/app/communaute` -- doublon de `/app/entraide`
- `/app/feed` -- doublon de `/app/entraide` (deja pointe vers `B2CCommunautePage`)
- `/app/friends` -- doublon de `/app/buddies`
- `/app/groups` -- doublon de `/app/entraide`
- `/app/voice-analysis` -- doublon du scan vocal (`/app/scan/voice`)
- `/app/auras` -- doublon de `/app/leaderboard`
- `/app/particulier` -- doublon de `/app/home`
- `/app/particulier/mood` -- doublon de `/app/scan`
- `/mode-selection` -- redondant avec homepage

**Routes a marquer `status: 'coming-soon'`** :
- `/app/hume-ai` -- API pas completement connectee
- `/app/suno` -- generateur musical IA non connecte
- `/app/brain-viewer` -- visualisation 3D sans donnees reelles
- `/app/wearables` -- donnees tendances generees aleatoirement (mock)
- `/app/context-lens` -- experimental

**Routes a marquer `status: 'beta'`** :
- `/app/exchange` -- Exchange Hub
- `/app/workshops` -- donnees localStorage
- `/app/webinars` -- donnees localStorage
- `/app/integrations` -- aucune integration reelle
- `/app/themes` -- fonctionnel en localStorage uniquement
- `/app/customization` -- sans persistance
- `/app/widgets` -- fonctionnel en localStorage
- `/app/timecraft` -- module recemment ajoute

### Phase 2 : Redirection des doublons vers routes canoniques

Modifier les composants des routes dupliquees pour qu'ils redirigent automatiquement vers la route canonique, au lieu de rendre un composant distinct. Cela se fait en remplacant le composant par un `Navigate` dans le registre ou dans les pages elles-memes.

Pour les routes deja marquees `deprecated: true` dans le registre, ajouter la redirection dans le router (via `aliases.tsx` ou directement dans le composant mappe).

---

## Fichiers a modifier

| Fichier | Modification |
|---------|-------------|
| `src/routerV2/registry.ts` | Ajouter `hidden`, `deprecated`, `status` a ~30 routes |

C'est le seul fichier a modifier. L'impact est architectural : toute logique de filtrage dans le menu, le catalogue ou le router peut ensuite s'appuyer sur ces champs pour masquer/rediriger automatiquement.

---

## Detail technique

Chaque route modifiee recevra un ou plusieurs de ces champs :

```text
{
  name: 'api-keys',
  path: '/app/api-keys',
  ...
  hidden: true,        // <-- AJOUTE
  status: 'dev-only',  // <-- AJOUTE
}

{
  name: 'communaute-b2c',
  path: '/app/communaute',
  ...
  deprecated: true,    // <-- AJOUTE (redirection vers /app/entraide)
}

{
  name: 'hume-ai-realtime',
  path: '/app/hume-ai',
  ...
  status: 'coming-soon', // <-- AJOUTE
}
```

Cela permettra ensuite a tout composant de filtrage (menu, catalogue, router) de respecter ces metadonnees sans modifier chaque composant individuellement.
