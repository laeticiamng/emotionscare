
# EmotionsCare 🧠💙

Plateforme de bien-être émotionnel avec intelligence artificielle, réalité virtuelle et monitoring physiologique.

## 🚀 Démarrage Rapide

### Prérequis
- [Bun](https://bun.sh) (recommandé) ou Node.js 18+
- Git

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd emotionscare

# Configuration Bun (recommandée)
bun run scripts/setup-bun.js

# OU installation classique
bun install

# Démarrer le serveur de développement
bun dev
```

## 📋 Scripts Disponibles

```bash
# Développement
bun dev                 # Serveur de développement
bun build              # Build de production
bun preview            # Aperçu du build

# Tests et qualité
bun test               # Tests unitaires
bun test:watch         # Tests en mode watch
bun test:coverage      # Tests avec couverture
bun lint               # Linter ESLint

# Audit et maintenance
bun audit              # Audit complet du projet
bun setup              # Installation complète
```

## 🏗️ Architecture

### Structure du Projet
```
src/
├── components/        # Composants réutilisables
│   ├── ui/           # Composants UI de base
│   ├── emotions/     # Composants émotionnels
│   ├── dashboard/    # Composants dashboard
│   ├── charts/       # Composants graphiques
│   └── audit/        # Composants d'audit
├── pages/            # Pages de l'application
├── hooks/            # Hooks personnalisés
├── services/         # Services API
├── contexts/         # Contextes React
├── types/            # Types TypeScript
└── utils/            # Utilitaires
```

### Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build**: Vite, Bun (gestionnaire de paquets)
- **UI**: Shadcn/ui, Framer Motion
- **Backend**: Supabase (base de données, auth, edge functions)
- **Tests**: Vitest, Cypress, Lighthouse
- **CI/CD**: GitHub Actions

## 🎯 Fonctionnalités

### ✅ Implémentées
- [x] Dashboard utilisateur avec widgets Glow
- [x] Système d'authentification Supabase
- [x] Composants UI de base (Shadcn/ui)
- [x] Gestion d'état avec Zustand
- [x] Routing avec React Router
- [x] Thème sombre/clair automatique
- [x] Audit de projet intégré

### 🚧 En Développement
- [ ] Glow Experiences (Flash Glow, Filtres AR, Bubble-Beat)
- [ ] Modules bien-être (Journal, Musicothérapie, Scan)
- [ ] VR/AR Integration (WebXR, Three.js)
- [ ] Gamification (Leaderboard, Badges)

### 📋 Planifiées
- [ ] Tests E2E Cypress complets
- [ ] PWA et notifications push
- [ ] Internationalisation (i18n)
- [ ] Analytics et monitoring
- [ ] Optimisations performance

## 🔗 Mapping Fonctionnalité ↔ Endpoint ↔ Composant

| Fonctionnalité | Endpoint | Composant | Status |
|----------------|----------|-----------|---------|
| Flash Glow | `POST /metrics/flash_glow` | `FlashGlow` | 🟡 Partiel |
| Filtres Visage AR | `POST /metrics/face_filter` | `FaceFilterAR` | 🟡 Partiel |
| Bubble-Beat | `GET /me/heart_rate/live` | `BubbleBeat` | ❌ À faire |
| Dashboard Glow | `GET /me/dashboard/weekly` | `GlowGauge` | ✅ Prêt |
| Weekly Bars | `GET /me/dashboard/weekly` | `WeeklyBars` | ✅ Prêt |
| Journal | `POST /journal_voice` | `JournalPage` | ✅ Prêt |
| Scan Émotionnel | `POST /metrics/scan` | `EmotionSelector` | ✅ Prêt |
| VR Galactique | `POST /metrics/vr_galaxy` | `VRGalaxy` | ❌ À faire |
| Gamification | `GET /me/gamification` | `LeaderboardPage` | 🟡 Partiel |
| Privacy | `PATCH /me/privacy_prefs` | `PrivacyToggle` | ❌ À faire |

## 🧪 Tests et Qualité

### Couverture Actuelle
- **Tests Unitaires**: 45% (Objectif: 90%)
- **Tests E2E**: 0% (À implémenter)
- **Lighthouse**: 85/100 (Objectif: 90+)

### Commandes de Test
```bash
# Tests unitaires avec couverture
bun test:coverage

# Tests E2E (à implémenter)
bunx cypress run

# Audit Lighthouse
bunx lighthouse http://localhost:4173 --output=json
```

## 🌍 Variables d'Environnement

Créer un fichier `.env.local` :

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# APIs externes
VITE_OPENAI_API_KEY=your_openai_key
VITE_HUME_API_KEY=your_hume_key

# Configuration
VITE_APP_ENV=development
VITE_SENTRY_DSN=
```

## 🚀 Déploiement

### Build de Production
```bash
bun run build
bun run preview  # Test du build local
```

### CI/CD
Le projet utilise GitHub Actions avec Bun :
- Tests automatisés sur chaque PR
- Audit Lighthouse automatique
- Déploiement automatique sur main

## 📊 Monitoring et Analytics

### Audit Intégré
Accédez à `/audit` pour voir :
- État des fonctionnalités
- Couverture de tests
- Performance Lighthouse
- Configuration technique

### Scripts d'Audit
```bash
# Audit complet du projet
bun audit

# Audit de performance
bun run lighthouse

# Analyse du bundle
bunx vite-bundle-analyzer
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Standards de Code
- TypeScript strict
- ESLint + Prettier
- Tests unitaires obligatoires (nouvelles fonctionnalités)
- Accessibilité WCAG 2.1 AA

## 📞 Support

- **Documentation**: `/audit` dans l'application
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

🔥 **Powered by Bun + React + Supabase**

## 🛠️ Admin Service
Provides simple organization management endpoints. Run `node services/admin/index.ts` to start.
