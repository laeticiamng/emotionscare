# 📊 Reports Directory

Ce dossier contient tous les rapports d'audit et analyses générés automatiquement.

## 📁 Structure :
- `accessibility/` - Rapports d'accessibilité WCAG
- `performance/` - Analyses de performance
- `dependencies/` - Audits des dépendances
- `code-quality/` - Rapports de qualité de code
- `security/` - Analyses de sécurité

## 🔄 Auto-génération :
Les rapports sont automatiquement générés via :
```bash
npm run audit:full
```

## 📋 Archive :
Les anciens rapports sont conservés dans `archive/` avec timestamp.