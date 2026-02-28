

# Plan final : Finaliser tous les tickets restants

## Vue d'ensemble

4 axes de travail concrets, environ 13 fichiers a modifier/creer.

---

## AXE 1 — XSS : Regle ESLint + derniers fichiers non proteges

### 1a. Creer la regle ESLint `ec/no-raw-innerhtml`

**Fichier** : `tools/eslint-plugin-ec/rules/no-raw-innerhtml.js`

Logique : detecter tout usage de `dangerouslySetInnerHTML` et reporter une erreur, sauf si le noeud parent est le composant `SafeHtml` (fichier `SafeHtml.tsx`) ou si l'appel est encapsule dans `DOMPurify.sanitize()`.

```text
JSXAttribute(node)
  if node.name === "dangerouslySetInnerHTML"
    -> check si la valeur contient "DOMPurify.sanitize" ou "sanitize("
    -> check si le fichier est SafeHtml.tsx ou ChartStyle.tsx (whitelist)
    -> sinon: report error "Utilise <SafeHtml> ou DOMPurify.sanitize()"
```

### 1b. Enregistrer la regle

**Fichier** : `tools/eslint-plugin-ec/index.js` — ajouter :
```
"no-raw-innerhtml": require("./rules/no-raw-innerhtml"),
```

### 1c. Activer dans eslint.config.js

Ajouter dans les rules du bloc `src/**` :
```
"ec/no-raw-innerhtml": "error",
```

### 1d. Migrer le dernier fichier non protege

**`src/pages/journal/PanasSuggestionsCard.tsx`** ligne 125 : le champ `suggestion.sanitized` semble deja sanitise en amont (le nom le suggere). Remplacer par `<SafeHtml html={suggestion.sanitized} />` pour uniformiser.

**`src/modules/journal/components/JournalList.tsx`** ligne 283 : deja protege par DOMPurify (lignes 276-280). OK, pas de changement necessaire (la regle ESLint le whitelistera car DOMPurify est present dans l'expression).

---

## AXE 2 — JWT : Finaliser la migration localStorage -> sessionStorage

### 2a. Migration du stockage token

Les 3 fichiers API utilisent deja le pattern `sessionStorage ?? localStorage` (fallback). Le nettoyage consiste a :

**`src/services/api/endpoints.ts`** (ligne 32) : garder tel quel (le fallback est necessaire pour la transition).

**`src/services/api/errorHandler.ts`** (ligne 90) : garder le `localStorage.removeItem` en cleanup (supprime les tokens legacy).

**Conclusion** : la migration JWT est deja complete. Les tokens sont ecrits en `sessionStorage` et le fallback `localStorage` est en lecture seule pour la retro-compatibilite.

### 2b. Ajouter un test unitaire verifiant le stockage

**Fichier** : `src/__tests__/jwt-storage.test.ts`

Test qui verifie :
- `sessionStorage.getItem('auth_token')` est utilise en priorite
- Aucun `localStorage.setItem('auth_token')` n'existe dans le code source (scan regex)

---

## AXE 3 — TypeScript strict : Supprimer @ts-nocheck des fichiers critiques

### Fichiers cibles (auth/security/privacy — 15 fichiers prioritaires)

Les fichiers critiques ou `@ts-nocheck` doit etre retire :

1. `src/types/auth.ts`
2. `src/types/privacy.ts`
3. `src/lib/validations/auth.ts`
4. `src/lib/consent.ts`
5. `src/lib/security/privacyConsent.ts`
6. `src/services/privacy.ts`
7. `src/services/securityAlertsService.ts`
8. `src/services/securityTrendsService.ts`
9. `src/utils/productionSecurity.ts`
10. `src/hooks/useSecurity.ts`
11. `src/hooks/useSecurityMonitor.ts`
12. `src/hooks/useAuthNavigation.ts`
13. `src/hooks/use-session-security.tsx`
14. `src/hooks/useConsentManagement.ts`
15. `src/hooks/useClinicalConsent.ts`

**Methode** : Pour chaque fichier, retirer `// @ts-nocheck` ligne 1, puis corriger les erreurs TypeScript resultantes (ajouter des types, remplacer `any` par des types concrets, typer les parametres de fonctions).

Cela sera fait fichier par fichier. Si un fichier genere trop d'erreurs en cascade (> 10), il sera reporte avec une note.

### Renforcer la regle ESLint

La regle `@typescript-eslint/ban-ts-comment` est deja configuree en `warn` avec `"ts-nocheck": "allow-with-description"`. Cela signifie que les nouveaux `@ts-nocheck` sans justification seront signales. C'est suffisant pour le moment.

---

## AXE 4 — Marketing factuel : Regle ESLint + scan residuel

### 4a. Creer la regle `ec/no-unsourced-stats`

**Fichier** : `tools/eslint-plugin-ec/rules/no-unsourced-stats.js`

Detecte dans les JSXText et les Literal les patterns comme :
- `25 000+`, `25,000+`, `12000+`
- `94%`, `98%` (pourcentages marketing > 90%)
- `+X utilisateurs`, `+X soignants`

Et reporte : "Chiffre marketing non source. Ajouter un commentaire `// SOURCE: ...` ou utiliser une formulation factuelle."

### 4b. Enregistrer et activer

- `tools/eslint-plugin-ec/index.js` : ajouter la regle
- `eslint.config.js` : activer `"ec/no-unsourced-stats": "warn"` dans le bloc `src/app/**`

### 4c. Scan final

Le scan regex `\d+,\d+\+` et `\d+k\+` ne retourne deja plus de resultats dans `src/components`. Les corrections precedentes (TrialBadge, SecurityPageEnhanced) sont toujours en place.

---

## Resume des fichiers

| Fichier | Action |
|---------|--------|
| `tools/eslint-plugin-ec/rules/no-raw-innerhtml.js` | Creer (regle XSS) |
| `tools/eslint-plugin-ec/rules/no-unsourced-stats.js` | Creer (regle marketing) |
| `tools/eslint-plugin-ec/index.js` | Ajouter 2 regles |
| `eslint.config.js` | Activer 2 regles |
| `src/pages/journal/PanasSuggestionsCard.tsx` | Migrer vers SafeHtml |
| `src/__tests__/jwt-storage.test.ts` | Creer test JWT |
| 15 fichiers auth/security/privacy | Retirer @ts-nocheck + fixer types |

**Total : ~20 fichiers modifies/crees**

