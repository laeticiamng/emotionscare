# 📊 Reports Directory

Ce dossier contient les rapports d'audit générés automatiquement.

## 📁 Structure

```
reports/
├── accessibility/     # Rapports WCAG et a11y
├── archive/           # Anciens rapports archivés
├── dependencies/      # Audits npm
└── *.md               # Rapports actifs
```

## 📋 Rapports Actifs

| Fichier | Description |
|---------|-------------|
| `AUDIT_COHERENCE_COMPLET.md` | Cohérence globale de l'architecture |
| `AUDIT_ACCESSIBILITE_COMPLET.md` | Conformité WCAG 2.1 AA |
| `AUDIT_UX_COMPLET.md` | Audit UX et ergonomie |
| `FINAL_AUDIT_REPORT.md` | Rapport d'audit final consolidé |

## 🔄 Génération

```bash
npm run audit:full
```

## 📅 Dernière mise à jour

31 décembre 2025
