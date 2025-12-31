# Tests EmotionsCare

Ce dossier contient tous les tests pour l'application EmotionsCare.

## Structure des Tests

```
tests/
├── e2e/                    # Tests End-to-End (Playwright)
│   └── gdpr-monitoring.spec.ts
├── integration/            # Tests d'intégration
│   └── edge-functions-rgpd.spec.ts
└── README.md
```

## Tests E2E - Playwright

### Prérequis

```bash
# Installer les dépendances Playwright
npm install -D @playwright/test @axe-core/playwright

# Installer les navigateurs
npx playwright install
```

### Exécution des Tests E2E

```bash
# Lancer tous les tests E2E
npm run test:e2e

# Lancer les tests en mode UI (interface visuelle)
npx playwright test --ui

# Lancer un fichier de test spécifique
npx playwright test tests/e2e/gdpr-monitoring.spec.ts

# Lancer en mode debug
npx playwright test --debug

# Lancer avec un navigateur spécifique
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Tests d'Accessibilité WCAG AA

Les tests E2E incluent des validations d'accessibilité avec axe-core :

```bash
# Lancer uniquement les tests d'accessibilité
npx playwright test tests/e2e/gdpr-monitoring.spec.ts -g "accessibilité"
```

Les tests vérifient :
- ✅ Contraste des couleurs WCAG AA
- ✅ Labels ARIA appropriés
- ✅ Navigation au clavier
- ✅ Structure HTML sémantique
- ✅ Images avec attributs alt
- ✅ Formulaires avec labels

### Rapport des Tests

```bash
# Générer et ouvrir le rapport HTML
npx playwright show-report
```

## Tests d'Intégration - Edge Functions RGPD

### Configuration

Les tests d'intégration nécessitent les variables d'environnement Supabase :

```bash
# .env.test (créer ce fichier à la racine)
VITE_SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

### Exécution

```bash
# Lancer tous les tests d'intégration
npx playwright test tests/integration/

# Lancer uniquement les tests Edge Functions RGPD
npx playwright test tests/integration/edge-functions-rgpd.spec.ts

# Voir les logs détaillés
DEBUG=pw:api npx playwright test tests/integration/
```

### Edge Functions Testées

#### 1. compliance-audit/*
- ✅ `/latest` - Récupère le dernier audit
- ✅ `/history` - Historique des audits
- ✅ `/run` - Lance un nouvel audit

#### 2. gdpr-alert-detector
- ✅ Détection alertes export
- ✅ Détection alertes suppression urgente
- ✅ Validation types d'événements
- ✅ Rejet types invalides

#### 3. dsar-handler
- ✅ Création demande DSAR
- ✅ Récupération statut
- ✅ Liste des demandes
- ✅ Validation types de requêtes
- ✅ Performance < 30s

### Scénarios d'Intégration

Les tests incluent des scénarios complets :

```typescript
// Scénario: Audit → Alerte → DSAR
1. Lancer un audit de conformité
2. Déclencher une alerte si score < 70
3. Créer une demande DSAR pour améliorer
```

### Tests de Sécurité

Les tests vérifient également :
- ❌ Rejet payloads malformés
- ❌ Gestion null/undefined
- ❌ Protection contre injections SQL/XSS
- ❌ Protection contre path traversal
- ❌ Protection contre JNDI injection

## Configuration Playwright

Créer `playwright.config.ts` à la racine :

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Scripts NPM Recommandés

Ajouter à `package.json` :

```json
{
  "scripts": {
    "test:e2e": "playwright test tests/e2e/",
    "test:e2e:ui": "playwright test --ui",
    "test:integration": "playwright test tests/integration/",
    "test:all": "playwright test",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/tests.yml
name: Tests E2E

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Bonnes Pratiques

### Tests E2E
- ✅ Utiliser des sélecteurs stables (roles, labels)
- ✅ Attendre les états de chargement
- ✅ Éviter les timeouts arbitraires
- ✅ Nettoyer après chaque test
- ✅ Utiliser beforeEach/afterEach

### Tests d'Intégration
- ✅ Isoler chaque test
- ✅ Gérer les erreurs attendues
- ✅ Vérifier les structures de données
- ✅ Tester les cas limites
- ✅ Logger pour debug

### Accessibilité
- ✅ Tester tous les niveaux WCAG (A, AA, AAA)
- ✅ Vérifier navigation clavier
- ✅ Tester lecteurs d'écran
- ✅ Valider les contrastes
- ✅ Auditer régulièrement

## Debugging

### Mode Debug
```bash
# Pause sur échec
PWDEBUG=1 npx playwright test

# Voir les requêtes réseau
DEBUG=pw:api npx playwright test

# Ralentir l'exécution
npx playwright test --slow-mo=1000
```

### Screenshots
```typescript
// Capturer screenshot sur échec
test('mon test', async ({ page }) => {
  await page.screenshot({ path: 'debug.png' });
});
```

### Traces
```bash
# Ouvrir les traces
npx playwright show-trace trace.zip
```

## Support

Pour toute question :
- 📚 Documentation : `src/audit-report.md`
- 🐛 Issues : Créer un ticket avec logs
- 💬 Chat : Équipe DevOps

---

**Dernière mise à jour** : 31 décembre 2025  
**Version** : 1.1.0
