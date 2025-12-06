# 🧠 EmotionsCare Platform

Plateforme de bien-être émotionnel alimentée par l'IA, construite avec React, TypeScript et Supabase.

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** 20+ et **npm** 
- Compte **Supabase** (pré-configuré)
- Clés API optionnelles (**OpenAI**, **Hume AI** pour fonctionnalités avancées)

### Installation en 3 étapes
```bash
# 1. Clone et install
git clone <repo-url>
cd emotionscare-platform
npm install

# 2. Configuration (optionnel - fonctionne sans)
cp .env.example .env.local
# Éditer .env.local si vous voulez personnaliser

# 3. Lancement
npm run dev
```

**Ça fonctionne immédiatement !** Le projet est pré-configuré avec Supabase.

## 📁 Structure claire

```
src/
├── components/      # Composants UI réutilisables  
├── pages/          # Pages de l'application
├── hooks/          # Custom React hooks
├── lib/            # Utilitaires & configuration
├── services/       # Logique métier & API
├── integrations/   # Supabase & services externes
└── assets/         # Images, sons, fichiers
```

## 🛠️ Commandes essentielles

```bash
# Développement
npm run dev         # Serveur local (http://localhost:3000)
npm run build       # Build production
npm run preview     # Préview du build

# Qualité
npm run lint        # Vérification code
npm run format      # Formatage automatique  
npm run test        # Tests unitaires
```

## 📚 Guides & Documentation

- **[Configuration développement](./docs/DEVELOPMENT_SETUP.md)** - Guide détaillé
- **[Contribution](./CONTRIBUTING.md)** - Standards de code
- **[Contrat clinique Assess](./docs/ASSESS_CONTRACT.md)** - Spécification front ↔ Edge ↔ DB
- **[Déploiement](./docs/deploy.md)** - Checklist déploiement

## 🎯 Fonctionnalités principales

- **Interface moderne** - React 18 + TypeScript
- **Backend intégré** - Supabase (auth, base de données, stockage)
- **IA émotionnelle** - Analyse et recommandations personnalisées
- **Design system** - Composants cohérents avec Tailwind CSS
- **Performance** - Code splitting, lazy loading, optimisations

## 🔧 Configuration avancée

### Variables d'environnement (optionnelles)
```bash
# .env.local - Personnalisation optionnelle
VITE_API_URL=https://votre-api.com           # URL API custom
VITE_FIREBASE_API_KEY=votre_cle              # Intégration Firebase
VITE_UPLOAD_MAX_SIZE=10485760               # Limite upload (10MB)
```

### Ajout de composants
```bash
# Nouveau composant UI
src/components/MonComposant.tsx

# Nouvelle page
src/pages/MaPage.tsx  

# Nouveau hook
src/hooks/useMonHook.ts
```

## 🚀 Déploiement

Le projet est prêt pour déploiement sur :
- **Vercel** / **Netlify** (frontend)
- **Supabase** (backend automatique)

```bash
npm run build       # Génère le dossier dist/
npm run preview     # Test local du build
```

## 📞 Support

- 🐛 **Issues GitHub** pour les bugs
- 💬 **Discussions** pour les questions  
- 📧 **Email** : `support@emotionscare.dev`

---

**EmotionsCare** - L'IA au service de votre bien-être émotionnel 🧠💙