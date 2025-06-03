# Emergency Bun/Vitest Build Fix

## Problème
Erreur d'intégrité Bun 1.2.15 ↔︎ @vitest/browser ➜ build impossible.

## Solution appliquée
1. Purge cache + locks.
2. Suppression temporaire de @vitest/browser.
3. Override version via npm fallback (`npm install --legacy-peer-deps`).

## Commandes rapides
```bash
node scripts/emergency-build-fix.js   # appliquer le correctif
git checkout -- package.json          # restauration état initial
pnpm install                          # ré-installation standard
```

Roadmap
  • Retenter intégration @vitest/browser quand Bun ≥ 1.3 stable.
  • Basculer les tests E2E navigateur vers Playwright uniquement.
