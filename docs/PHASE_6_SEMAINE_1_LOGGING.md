# Phase 6 - Semaine 1 : Système de Logging Unifié

**Date**: 2025-10-18  
**Objectif**: Éliminer les 434 occurrences de `console.log` et unifier le logging

---

## 🎯 Objectifs

1. ✅ Remplacer tous les `console.log/warn/error/info` par `logger`
2. ✅ Utiliser le logger existant (`src/lib/logger.ts`)
3. ✅ Ajouter des contextes appropriés pour chaque log
4. ✅ Garantir la sécurité (PII scrubbing déjà intégré)

---

## 📋 Plan d'Exécution

### Étape 1 : Script Automatique ✅

**Fichier créé**: `scripts/replace-console-logs.js`

**Fonctionnalités**:
- Détecte automatiquement tous les `console.*` dans les fichiers
- Remplace par le logger approprié :
  - `console.log` → `logger.info`
  - `console.info` → `logger.info`
  - `console.warn` → `logger.warn`
  - `console.error` → `logger.error`
  - `console.debug` → `logger.debug`
- Ajoute automatiquement l'import `import { logger } from '@/lib/logger';`
- Génère un rapport des modifications

**Usage**:
```bash
# Traiter tous les fichiers src
node scripts/replace-console-logs.js

# Traiter un module spécifique
node scripts/replace-console-logs.js "src/modules/journal/**/*.{ts,tsx}"
```

---

### Étape 2 : Ordre de Traitement

**Priorité 1 - Modules Critiques** (à traiter en premier):
1. `src/modules/journal/**`
2. `src/modules/breath/**`
3. `src/modules/flash-glow/**`
4. `src/hooks/**`
5. `src/lib/**`
6. `src/services/**`

**Priorité 2 - Composants UI**:
1. `src/components/core/**`
2. `src/components/dashboard/**`
3. `src/pages/**`

**Priorité 3 - Reste**:
1. `src/components/**` (autres)
2. Tests (si nécessaire)

---

## 🔧 Logger Existant

**Fichier**: `src/lib/logger.ts`

**Fonctionnalités**:
- ✅ PII Scrubbing automatique (emails, tokens, données sensibles)
- ✅ Intégration Sentry pour erreurs/warnings
- ✅ Mode développement vs production
- ✅ Stockage des logs en mémoire (1000 derniers)
- ✅ Export des logs pour débogage

**API**:
```typescript
import { logger } from '@/lib/logger';

// Basic usage
logger.debug('Debug message', { data });
logger.info('Info message', { data });
logger.warn('Warning message', { data });
logger.error('Error message', { data });

// With context
logger.info('User logged in', { userId }, 'AUTH');
logger.error('API call failed', { error }, 'API');
```

---

## 📊 Métriques Avant/Après

### Avant
- ❌ 434 `console.log` dans 205 fichiers
- ❌ Pas de contexte
- ❌ Pas de PII scrubbing
- ❌ Pas de monitoring centralisé

### Après (Objectif)
- ✅ 0 `console.log` direct
- ✅ 100% des logs avec contexte
- ✅ PII scrubbing automatique
- ✅ Monitoring Sentry actif
- ✅ Logs exportables pour support

---

## 🎓 Bonnes Pratiques

### ✅ À FAIRE
```typescript
// ✅ Avec contexte et données structurées
logger.info('Session created', { sessionId, duration }, 'BREATH');

// ✅ Erreurs avec objet Error
logger.error('Failed to save note', { error, noteId }, 'JOURNAL');

// ✅ Warnings pour comportements inattendus
logger.warn('Deprecated API used', { apiName }, 'API');
```

### ❌ À ÉVITER
```typescript
// ❌ Console direct
console.log('User logged in');

// ❌ Sans contexte
logger.info('Something happened');

// ❌ Logs verbeux en production
logger.debug('Rendering component with props', { ...allProps });
```

---

## 🔐 Sécurité

Le logger inclut un **scrubbing automatique** pour :
- Emails
- Tokens (Bearer, API keys)
- Passwords
- Données PII (noms, adresses, téléphones)
- Contenu utilisateur (tronqué à 512 chars)

**Mots-clés sensibles détectés**:
```typescript
['token', 'secret', 'password', 'authorization', 
 'cookie', 'session', 'email', 'phone', 'address', 
 'name', 'user', 'userid', 'id', 'text', 'message', 
 'content', 'body', 'summary']
```

---

## 🧪 Tests

### Vérification Post-Migration
```bash
# Vérifier qu'aucun console.log ne reste
npm run lint

# Vérifier que l'app fonctionne
npm run dev

# Tester l'export des logs
# Ouvrir la console dev et taper:
# logger.exportLogs()
```

### ESLint Rule (à ajouter)
```json
{
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }]
  }
}
```

---

## 📈 Résultats Attendus

1. **Code Quality**:
   - Score +5 points (de 78 → 83)
   - 0 console.log dans le codebase

2. **Monitoring**:
   - 100% des erreurs remontées à Sentry
   - Logs structurés pour analytics

3. **Sécurité**:
   - Aucune fuite de PII dans les logs
   - Conformité RGPD

4. **DX (Developer Experience)**:
   - Logs plus clairs avec contexte
   - Débogage facilité avec `logger.exportLogs()`

---

## 🚀 Prochaines Étapes

1. ✅ Exécuter le script sur modules critiques
2. ⏳ Vérifier manuellement les contextes ajoutés
3. ⏳ Ajouter ESLint rule `no-console`
4. ⏳ Documenter les contextes standards par module
5. ⏳ Former l'équipe aux nouvelles pratiques

---

## 📝 Notes

- Le script préserve les `console.warn` et `console.error` dans les tests
- Les fichiers `*.test.ts` sont ignorés automatiquement
- Chaque module peut avoir son contexte standard (ex: 'JOURNAL', 'BREATH', 'AUTH')

---

**Auteur**: Lovable AI  
**Référence Plan**: `audit-results/PLAN_ACTION_PRIORITAIRE.md`
