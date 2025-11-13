# 🔄 Guide de Prévention des Dépendances Circulaires

## Problème

Les dépendances circulaires surviennent quand deux modules s'importent mutuellement, créant un cycle qui peut causer :
- ❌ Erreurs d'initialisation (`Cannot access before initialization`)
- ❌ Écrans blancs au démarrage
- ❌ Comportements imprévisibles

## Exemples de Cycles Problématiques

### ❌ Mauvais
```typescript
// src/lib/env.ts
import { logger } from '@/lib/logger';

// src/lib/logger/index.ts
import { IS_DEV } from '@/lib/env';
```

**Problème**: `env.ts` → `logger` → `env.ts` (cycle!)

### ✅ Bon
```typescript
// src/lib/env.ts
// Pas d'import de logger, utilise console directement
console.info('[SYSTEM] Environment loaded');

// src/lib/logger/index.ts
import { IS_DEV } from '@/lib/env'; // OK, pas de cycle
```

## Modules Critiques à Surveiller

Ces modules doivent avoir **ZÉRO** dépendance externe :

1. **`src/lib/env.ts`** - Configuration d'environnement
   - ✅ Peut utiliser : `console`, `zod`
   - ❌ Ne peut PAS utiliser : `logger`, `supabase`, `sentry`

2. **`src/integrations/supabase/client.ts`** - Client Supabase
   - ✅ Peut utiliser : `env.ts`, `console`, `@supabase/supabase-js`
   - ❌ Ne peut PAS utiliser : `logger`

3. **`src/lib/logger/index.ts`** - Système de logs
   - ✅ Peut utiliser : `env.ts`, `console`
   - ❌ Ne peut PAS utiliser : `supabase`, `ai-monitoring`

## Ordre d'Initialisation Correct

```
1. env.ts          (config pure, pas de dépendances)
2. supabase/client (utilise env)
3. logger          (utilise env)
4. ai-monitoring   (utilise logger + supabase)
5. sentry-compat   (utilise logger)
6. ErrorBoundary   (utilise tout)
7. Providers       (utilise tout)
8. main.tsx        (point d'entrée)
```

## Règles de Prévention

### Règle 1: Initialisation
- Les fichiers d'init utilisent `console.log` au lieu de `logger`
- Pas d'import de services dans `env.ts`

### Règle 2: Lazy Loading
```typescript
// ❌ Import direct
import { heavyModule } from './heavy';

// ✅ Import différé
const loadHeavyModule = async () => {
  const { heavyModule } = await import('./heavy');
  return heavyModule;
};
```

### Règle 3: Injection de Dépendances
```typescript
// ❌ Import dans le module
import { logger } from '@/lib/logger';
export function doSomething() {
  logger.info('doing');
}

// ✅ Injection via paramètre
export function doSomething(log = console.info) {
  log('doing');
}
```

### Règle 4: Modules Utilitaires
Créer des modules purs sans side-effects :
```typescript
// utils/format.ts - Pure, pas de dépendances
export const formatDate = (date: Date) => date.toISOString();

// services/api.ts - Peut importer des utils
import { formatDate } from '@/utils/format';
```

## Scripts de Détection

### Détection Automatique
```bash
# Analyse les cycles dans les modules critiques
npm run check:circular-deps

# Vérification complète des imports
npm run check:imports-health

# Exécute toutes les vérifications pré-build
npm run pre-build:check
```

### Configuration
Fichier `.circulardepsrc.json` :
```json
{
  "criticalModules": [
    "src/lib/env.ts",
    "src/lib/logger/index.ts",
    "src/integrations/supabase/client.ts"
  ],
  "rules": {
    "noLoggerInInit": {
      "enabled": true,
      "level": "error"
    }
  }
}
```

## Correction d'un Cycle Détecté

### Étape 1: Identifier le Cycle
```bash
npm run check:circular-deps
```

Sortie :
```
🔴 Cycle 1:
   → src/lib/env.ts
   → src/lib/logger/index.ts
   ↩️ src/lib/env.ts
```

### Étape 2: Analyser les Imports
Regarder quels imports causent le cycle :
```typescript
// Dans env.ts
import { logger } from '@/lib/logger'; // ← Problème!
```

### Étape 3: Supprimer la Dépendance
```typescript
// Remplacer par console
console.info('[SYSTEM] Message');
```

### Étape 4: Vérifier
```bash
npm run check:circular-deps
# ✅ Aucune dépendance circulaire détectée!
```

## Intégration CI/CD

Ajouter dans `.github/workflows/ci.yml` :
```yaml
- name: Check Circular Dependencies
  run: npm run check:circular-deps

- name: Check Import Health
  run: npm run check:imports-health
```

## Ressources

- [ES6 Modules and Circular Dependencies](https://exploringjs.com/es6/ch_modules.html#sec_cyclic-dependencies)
- [Avoiding Circular Dependencies](https://dev.to/eransakal/avoiding-circular-dependencies-in-typescript-2fjk)
- [Dependency Injection Pattern](https://en.wikipedia.org/wiki/Dependency_injection)

## Support

Si un cycle persiste après correction :
1. Vérifier l'ordre des imports dans le fichier
2. Vérifier les re-exports (`export * from`)
3. Consulter `CIRCULAR_DEPS_GUIDE.md`
4. Demander une revue de code
