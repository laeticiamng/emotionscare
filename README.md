# 🧠 EmotionsCare Platform

Une plateforme de bien-être émotionnel alimentée par l'IA, construite avec React, TypeScript, et Supabase.

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** 20+ et **npm** 10+
- Compte **Supabase** configuré
- Clés API **OpenAI** et **Hume AI**

### Installation
```bash
# Clone et install
git clone <repo-url>
cd emotionscare-platform
npm install

# Configuration environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés API

# Lancement développement
npm run dev
```

## 📁 Structure du projet

```
src/
├── components/          # Composants UI réutilisables
├── pages/              # Pages de l'application
├── hooks/              # Custom React hooks
├── contexts/           # React Context providers
├── lib/                # Fonctions utilitaires
├── services/           # Appels API et logique métier
├── types/              # Définitions TypeScript
├── core/               # État global et logique centrale
├── data/               # Données statiques et mocks
├── assets/             # Images, sons, fichiers statiques
└── styles/             # Styles CSS globaux
```

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement
npm run build           # Build de production
npm run preview         # Prévisualisation du build

# Tests
npm run test            # Tests unitaires
npm run test:e2e        # Tests end-to-end
npm run lint            # Vérification ESLint

# Base de données
npm run db:migrate      # Migrations Supabase
npm run db:refresh:*    # Refresh des métriques
```

## 📚 Documentation complète

- **[Guide de développement](./docs/DEVELOPMENT_SETUP.md)** - Configuration et outils
- **[Guide de contribution](./CONTRIBUTING.md)** - Standards et processus
- **Storybook** : `npm run storybook` - Interface des composants

## 🆘 Support

- 🐛 **Issues GitHub** pour bugs  
- 💬 **Discussions** pour questions
- 📧 **Contact** : support@emotionscare.dev

---

**EmotionsCare** - L'intelligence artificielle au service de votre bien-être émotionnel 🧠💙