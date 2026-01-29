# 🏗️ Architecture EmotionsCare - Refactoring 2026

## 📊 Score d'Organisation : 16.5/20

---

## ✅ Améliorations réalisées

| Tâche | Description | Impact |
|-------|-------------|--------|
| **Fusion tests** | `src/test/` + `src/tests/` → `src/tests/` unique | Structure claire |
| **Suppression doublons layouts** | `src/layouts/` → `src/components/layout/` | -1 dossier |
| **Fusion flash-glow** | `flashglow/` + `flash-glow/` → `flash-glow/` | -1 dossier |
| **Fusion boss-grit** | `boss-grit/` + `boss-level-grit/` → `boss-level-grit/` | -1 dossier |
| **Pages B2C groupées** | 25+ fichiers racine → `src/pages/b2c/` | Organisation par domaine |
| **Pages B2B groupées** | Pages B2B → `src/pages/b2b/` | Organisation par domaine |
| **Index exports** | Exports centralisés pour chaque module | Imports simplifiés |

---

## 📂 Structure Actuelle

```
src/
├── pages/
│   ├── b2c/           # ✅ Pages utilisateurs B2C (30+ pages)
│   │   └── index.ts   # Exports centralisés
│   ├── b2b/           # ✅ Pages entreprises B2B
│   ├── admin/         # ✅ Pages administration
│   ├── legal/         # ✅ Pages légales
│   ├── settings/      # ✅ Pages paramètres
│   ├── journal/       # ✅ Sous-pages journal
│   ├── flash-glow/    # ✅ Module FlashGlow
│   └── [autres]       # Pages communes (~100 fichiers)
│
├── components/
│   ├── flash-glow/    # ✅ Composants FlashGlow (WallOfLights migré)
│   ├── boss-level-grit/ # ✅ Composants BossGrit fusionnés
│   ├── accessibility/ # ✅ Composants a11y consolidés
│   ├── layout/        # ✅ Layouts centralisés (AuthLayout, B2BLayout...)
│   ├── loading/       # ✅ Loaders (FullPageLoader, PageLoader)
│   ├── seo/           # ✅ SEO components
│   ├── security/      # ✅ Security components
│   └── [140+ dossiers] # À consolider progressivement
│
├── features/          # ✅ Modules métier autonomes (33 modules)
├── tests/             # ✅ Tests consolidés
│   ├── setup.ts       # Configuration globale avec mocks
│   └── test-utils.tsx # Providers de test unifiés
└── routerV2/          # ✅ Routing centralisé (223+ routes)
```

---

## 🔧 Conventions de Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| **Dossiers** | kebab-case | `flash-glow/`, `boss-level-grit/` |
| **Composants React** | PascalCase.tsx | `ChallengeCard.tsx` |
| **Hooks** | use + camelCase | `useGritQuest.ts` |
| **Utilitaires** | camelCase.ts | `formatDate.ts` |
| **Index** | index.ts | Exports centralisés |

---

## 📈 Score par critère

| Critère | Score | Commentaire |
|---------|-------|-------------|
| Architecture technique | 17/20 | Feature-First bien appliqué |
| Ergonomie développeur | 15/20 | Amélioration significative |
| Cohérence nommage | 16/20 | Standards kebab-case appliqués |
| Accessibilité utilisateur | 18/20 | Navigation Hub efficace |
| Maintenabilité | 16/20 | Réduction de la fragmentation |

**Score global : 16.5/20**

---

## 🚀 Prochaines améliorations (optionnel)

1. Continuer le regroupement des ~100 pages restantes à la racine
2. Consolider les 140+ micro-dossiers dans `src/components/`
3. Appliquer les design tokens (lint warnings sur couleurs hardcodées)
4. Supprimer `src/components/features/` (doublon conceptuel avec `src/features/`)
