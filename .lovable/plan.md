
# Audit complet et remediation finale - Routes, redirections et modules

---

## Problemes critiques identifies

Apres analyse approfondie du code et verification visuelle en navigateur :

### 1. Routes deprecated = 404 (BUG CRITIQUE)
Le router (ligne 899 de `router.tsx`) filtre les routes `deprecated: true` avec :
```text
const canonicalRoutes = ROUTES_REGISTRY.filter(route => !route.deprecated && route.path !== '*');
```
Resultat : les routes `/app/social-cocon`, `/app/communaute`, `/app/feed`, `/app/friends`, `/app/groups`, `/app/voice-analysis`, `/app/auras`, `/app/particulier`, `/app/particulier/mood`, `/mode-selection` retournent une **erreur 404** au lieu de rediriger vers la route canonique.

### 2. Routes hidden toujours accessibles
Les routes marquees `hidden: true` (`/app/api-keys`, `/app/webhooks`, `/app/api-docs`, `/system-health`, `/k6-analytics`, `/test`, `/dev/test-accounts`) ne sont pas filtrees par le router. Le champ `hidden` est annote mais jamais consomme.

### 3. Chaines de redirections cassees dans aliases.tsx
Exemples :
- `/community` redirige vers `/app/social-cocon` (qui est deprecated et 404)
- `/feed` redirige vers `/app/communaute` (deprecated, 404)
- `/app/social-b2c` redirige vers `/app/social-cocon` (deprecated, 404)

### 4. Duplications dans le registry
- `/app/context-lens` apparait **2 fois** (lignes 1007 et 2729)
- `/app/faq` apparait alors que `/faq` existe deja (doublon public)
- `/app/accessibility-settings` doublon de `/settings/accessibility`
- B2B teams : `/app/teams` et `/b2b/teams` pointent vers le meme composant

---

## Plan en 3 phases

### Phase 1 : Corriger les redirections cassees

**Fichier : `src/routerV2/router.tsx`**
- Modifier la logique de filtrage pour que les routes `deprecated` generent des redirections `<Navigate>` vers la route canonique au lieu d'etre supprimees
- Filtrer les routes `hidden: true` pour les exclure du router en production

**Fichier : `src/routerV2/aliases.tsx`**
- Corriger les alias qui pointent vers des routes deprecated :
  - `/community` : `/app/social-cocon` -> `/app/entraide`
  - `/feed` : `/app/communaute` -> `/app/entraide`  
  - `/app/social-b2c` : `/app/social-cocon` -> `/app/entraide`

### Phase 2 : Nettoyer le registry des doublons

**Fichier : `src/routerV2/registry.ts`**
- Supprimer le doublon `context-lens-duplicate` (ligne 2729)
- Marquer `/app/faq` comme `deprecated: true` (doublon de `/faq`)
- Marquer `/app/accessibility-settings` comme `deprecated: true` (doublon de `/settings/accessibility`)
- Ajouter `status: 'stable'` aux modules fonctionnels principaux qui n'ont pas encore de statut (scan, music, coach, journal, breath, etc.)
- Marquer les routes admin/monitoring internes comme `hidden: true` quand elles ne sont pas utiles aux beta-testeurs

### Phase 3 : Implementer le filtrage dans le router

**Fichier : `src/routerV2/router.tsx`**
Remplacer le filtrage actuel par une logique qui :
1. Exclut les routes `hidden: true` en production
2. Genere des `<Navigate>` automatiques pour les routes `deprecated: true` vers leur route canonique (en utilisant un mapping `deprecatedRedirects`)

La logique cible :
```text
// Routes normales (ni deprecated, ni hidden en prod)
const activeRoutes = ROUTES_REGISTRY.filter(route => 
  !route.deprecated && 
  !(route.hidden && !import.meta.env.DEV)
);

// Routes deprecated avec redirection
const deprecatedRoutes = ROUTES_REGISTRY.filter(route => route.deprecated);
// -> Generer <Navigate to={canonicalTarget} replace /> pour chacune
```

Pour determiner la cible de redirection des routes deprecated, on ajoutera un champ `redirectTo` dans le schema ou on utilisera un mapping explicite dans `router.tsx`.

---

## Fichiers a modifier

| Fichier | Modifications |
|---------|--------------|
| `src/routerV2/schema.ts` | Ajouter `redirectTo?: string` au type `RouteMeta` |
| `src/routerV2/registry.ts` | Ajouter `redirectTo` aux routes deprecated, supprimer doublons, completer les `status` manquants |
| `src/routerV2/router.tsx` | Filtrer `hidden` en prod, generer des `<Navigate>` pour `deprecated` avec `redirectTo` |
| `src/routerV2/aliases.tsx` | Corriger 3 alias casses (`/community`, `/feed`, `/app/social-b2c`) |

Total : **4 fichiers a modifier**. Impact : aucune route ne produira plus de 404 involontaire, les outils dev seront invisibles en production, et les beta-testeurs ne tomberont plus sur des pages mortes.

---

## Detail des redirections deprecated

| Route deprecated | Redirige vers |
|-----------------|---------------|
| `/app/social-cocon` | `/app/entraide` |
| `/app/communaute` | `/app/entraide` |
| `/app/feed` | `/app/entraide` |
| `/app/friends` | `/app/buddies` |
| `/app/groups` | `/app/entraide` |
| `/app/voice-analysis` | `/app/scan` |
| `/app/auras` | `/app/leaderboard` |
| `/app/particulier` | `/app/consumer/home` |
| `/app/particulier/mood` | `/app/scan` |
| `/mode-selection` | `/` |
| `/app/community` (legacy) | `/app/entraide` |
| `/app/context-lens` (doublon) | Supprime (garder l'original) |
