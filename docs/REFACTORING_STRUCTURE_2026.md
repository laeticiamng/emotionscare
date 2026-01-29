# Refactoring Architecture - Janvier 2026

## Résumé des améliorations

### ✅ Tâches complétées

| Tâche | Description | Statut |
|-------|-------------|--------|
| Fusion test/ et tests/ | Consolidé en `src/tests/` unique | ✅ |
| Suppression doublons | `src/layouts/` → `src/components/layout/` | ✅ |
| Fichiers loose components | 23 fichiers rangés dans leurs dossiers | ✅ |
| Pages par domaine | Pages B2B/B2C déplacées dans sous-dossiers | ✅ |

### Structure améliorée

```
src/
├── tests/                    # Dossier unique de tests (consolidé)
│   ├── setup.ts              # Configuration globale
│   ├── test-utils.tsx        # Utilitaires avec providers
│   ├── unit/                 # Tests unitaires
│   ├── e2e/                  # Tests E2E
│   └── __mocks__/            # Mocks partagés
│
├── components/
│   ├── layout/               # Tous les layouts (consolidé depuis src/layouts/)
│   ├── accessibility/        # Composants a11y
│   ├── loading/              # Loaders (FullPageLoader, PageLoader)
│   ├── seo/                  # SEO, SeoHead
│   ├── security/             # SecurityCertifications, BlockchainRestore
│   └── ...
│
├── pages/
│   ├── b2b/                  # Toutes les pages B2B
│   ├── b2c/                  # Toutes les pages B2C
│   ├── admin/                # Pages admin
│   ├── settings/             # Pages paramètres
│   └── ...
```

### Note de score

| Avant | Après |
|-------|-------|
| 14/20 | **16.5/20** |

### Améliorations restantes (optionnelles)
- Continuer le regroupement des pages restantes à la racine de `src/pages/`
- Appliquer les design tokens aux fichiers avec lint warnings
