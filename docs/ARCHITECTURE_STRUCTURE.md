# 📁 Architecture des Fichiers - EmotionsCare

> Date: 29 Janvier 2026 | Version: 2.0

---

## 🎯 Principes Directeurs

1. **Feature-First**: Chaque fonctionnalité métier dans `src/features/`
2. **Composants UI**: Réutilisables dans `src/components/`
3. **Kebab-case**: Convention unique pour tous les dossiers
4. **Max 7 fichiers**: Par dossier, sinon découper

---

## 📂 Structure Racine `src/`

```
src/
├── App.tsx                 # Point d'entrée React
├── main.tsx                # Bootstrap Vite
├── index.css               # Tokens CSS / Design System
│
├── features/               # 🎯 MODULES MÉTIER (autonomes)
│   ├── scan/               # Scan émotionnel
│   ├── journal/            # Journal de gratitude
│   ├── coach/              # Coach IA
│   ├── breath/             # Respiration
│   ├── meditation/         # Méditation
│   ├── gamification/       # Progression / Récompenses
│   └── ...
│
├── components/             # 🧩 COMPOSANTS RÉUTILISABLES
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Header, Footer, Sidebar
│   ├── navigation/         # Menus, Breadcrumbs
│   ├── accessibility/      # Skip links, Screen readers
│   ├── breath/             # Composants respiration
│   ├── screen-silk/        # Pause visuelle
│   └── ...
│
├── pages/                  # 📄 PAGES ROUTÉES
│   ├── app/                # Routes /app/*
│   ├── b2b/                # Routes B2B
│   ├── settings/           # Paramètres
│   ├── legal/              # CGU, Politique vie privée
│   └── [Page].tsx          # Pages publiques
│
├── hooks/                  # 🪝 HOOKS GÉNÉRIQUES
├── contexts/               # 🔗 REACT CONTEXT PROVIDERS
├── store/                  # 📦 ZUSTAND STORES
├── services/               # 🌐 APPELS API / SUPABASE
├── lib/                    # 🛠️ UTILITAIRES PURS
├── types/                  # 📝 TYPES TYPESCRIPT
├── routerV2/               # 🛣️ CONFIGURATION ROUTES
└── providers/              # 🎁 PROVIDERS GLOBAUX
```

---

## 🔄 Consolidations Effectuées

| Ancien | Nouveau | Raison |
|--------|---------|--------|
| `a11y/` | `accessibility/` | Nom explicite |
| `breathing/` | `breath/` | Doublon supprimé |
| `screenSilk/` | `screen-silk/` | Kebab-case standard |
| `layouts/` | `layout/` | Doublon supprimé |
| `src/AUDIT_*.md` | `docs/audits/` | Documentation centralisée |

---

## 📋 Conventions de Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composants React | PascalCase | `JournalNewPage.tsx` |
| Dossiers | kebab-case | `screen-silk/` |
| Hooks | camelCase + use | `useBreathSessions.ts` |
| Utilitaires | kebab-case | `date-utils.ts` |
| Types | PascalCase | `EmotionTypes.ts` |
| Constantes | SCREAMING_SNAKE | `API_ENDPOINTS.ts` |

---

## 🎨 Design System

- **Tokens CSS**: `src/index.css`
- **Configuration Tailwind**: `tailwind.config.ts`
- **Composants shadcn**: `src/components/ui/`

**Règle**: Ne jamais utiliser de couleurs hardcodées (`text-blue-500`).
Toujours utiliser les tokens sémantiques (`text-primary`, `bg-muted`).

---

## ✅ Checklist Qualité

- [ ] Pas de dossiers dupliqués
- [ ] Maximum 7 fichiers par dossier
- [ ] Imports relatifs cohérents
- [ ] Exports centralisés via `index.ts`
- [ ] Pas de couleurs hardcodées
- [ ] Pas de fichiers orphelins à la racine

---

*Généré par EmotionsCare Architecture Audit*
