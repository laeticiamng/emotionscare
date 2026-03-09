

# Plan : Finalisation de l'audit V3 — Derniers fichiers `@ts-nocheck` + coach migration

---

## Contexte

Il reste **3 fichiers pages** avec `@ts-nocheck` et **~757 fichiers composants** (dette historique massive). Le scope réaliste pour cette itération couvre les 3 pages restantes + la préparation de la migration coach localStorage → Supabase.

---

## Corrections à appliquer

### 1. `src/pages/journal/PanasSuggestionsCard.tsx` — Retirer `@ts-nocheck`

**Problème** : `composer.setText(prev => ...)` passe une fonction alors que le type `setText` est `(value: string) => void`.

**Fix** : Remplacer l'appel par une lecture directe du texte courant via `composer.text`, puis passer une string :
```ts
const current = composer.text
const plain = suggestionToPlainText(suggestion)
composer.setText(current.trim() ? `${current.trim()}\n\n${plain}` : plain)
```

### 2. `src/pages/flash-glow/index.tsx` — Retirer `@ts-nocheck` + fix dead code

**Problèmes identifiés** :
- **Dead code** : lignes 799-1081 sont après un `return` (ligne 797). Le composant retourne toujours le message "indisponible" et jamais l'UI réelle.
- **Type mismatch** : `flashHints` est `{ extendDuration: boolean }` mais le code accède à `flashHints?.exitMode` et `flashHints.companionPath` (propriétés inexistantes).

**Fix** :
- Supprimer le premier `return` prématuré (lignes 775-797) qui bloque l'affichage de l'UI fonctionnelle. L'UI "indisponible" est déjà gérée par le guard `if (!flashEnabled)` au-dessus.
- Typer `flashHints` correctement avec une interface locale :
  ```ts
  interface FlashHints {
    extendDuration: boolean;
    exitMode?: string;
    companionPath?: string;
  }
  ```
- Extraire les propriétés depuis `clinicalHints.hints` avec un parsing sûr, ou garder le guard conditionnel `flashHints?.exitMode` inchangé puisque la propriété sera `undefined` et le bouton ne s'affichera simplement pas.

### 3. `src/pages/index.ts` — Conserver `@ts-nocheck`

Ce fichier est un barrel d'exports qui référence des modules potentiellement manquants. Le retrait nécessiterait un audit de chaque export — hors scope. On le documente comme dette technique acceptée.

### 4. Coach localStorage → Supabase (préparation)

**`src/contexts/coach/useCoachHandlers.ts`** utilise 3 clés localStorage : `coachMessages`, `coach-emotion-history`, `coach-favorites`.

**Étape 1 (cette itération)** : Créer une migration SQL pour une table `coach_sessions` et `coach_favorites` dans Supabase.

**Étape 2 (différée)** : Refactorer le hook pour utiliser `useCoachLocalStorage` pattern déjà existant dans `src/contexts/coach/useLocalStorage.ts` qui gère déjà la migration localStorage → Supabase via `user_settings`.

**Plan SQL** :
- Pas de nouvelle table nécessaire — le pattern `user_settings` (clé/valeur par user) est déjà en place.
- Adapter `useCoachHandlers` pour utiliser le même pattern que `useCoachLocalStorage` : sauvegarder `emotionHistory` et `favorites` dans `user_settings` avec des clés dédiées.

---

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `src/pages/journal/PanasSuggestionsCard.tsx` | Retirer `@ts-nocheck`, fix `setText` |
| `src/pages/flash-glow/index.tsx` | Retirer `@ts-nocheck`, supprimer dead code, typer `flashHints` |
| `src/contexts/coach/useCoachHandlers.ts` | Migrer 3 clés localStorage vers `user_settings` Supabase |

---

## Hors scope (dette restante)

- ~757 fichiers composants avec `@ts-nocheck` — migration progressive sur plusieurs semaines
- `src/pages/index.ts` — barrel file, conservé avec `@ts-nocheck`
- Extraction i18n des pages institutional

