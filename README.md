
# EmotionsCare - Plateforme de bien-être émotionnel

## À propos du projet

EmotionsCare est une plateforme SaaS innovante dédiée au bien-être émotionnel en entreprise et pour les particuliers. Notre solution combine intelligence artificielle, analyse émotionnelle et techniques de relaxation pour aider les utilisateurs à comprendre et gérer leurs émotions efficacement.

## Fonctionnalités principales

- **Analyse émotionnelle** : Détection des émotions par texte, voix et expression faciale
- **Coaching personnalisé** : Recommandations adaptées à l'état émotionnel
- **Thérapie musicale** : Générations de musiques adaptées aux émotions détectées
- **Journal émotionnel** : Suivi de l'évolution émotionnelle au fil du temps
- **Gamification** : Défis, badges et récompenses pour encourager l'engagement
- **Réalité Virtuelle** : Sessions de relaxation immersives en VR
- **Cocoon social** : Communauté bienveillante pour partager et progresser ensemble

## Architecture technique

### Stack technologique

- **Frontend** : React 18, TypeScript, Tailwind CSS, Shadcn UI
- **State Management** : Context API, React Hooks
- **API Integration** : OpenAI, HumeAI, MusicGen
- **Authentication** : Supabase Auth
- **Database** : Supabase PostgreSQL
- **Storage** : Supabase Storage
- **Deployment** : Vite, Netlify/Vercel

### Structure du projet

```
src/
├── components/          # Composants React organisés par domaine
│   ├── ui/              # Composants UI réutilisables (shadcn)
│   ├── layout/          # Layouts et composants structurels
│   ├── music/           # Composants liés à la musique
│   ├── scan/            # Composants d'analyse émotionnelle
│   └── ...
├── contexts/            # Contextes React pour le state global
│   ├── ThemeContext.tsx # Gestion du thème
│   ├── AuthContext.tsx  # Gestion de l'authentification
│   ├── music/           # Contextes liés à la musique
│   └── ...
├── hooks/               # Custom hooks
├── pages/               # Composants de page
├── types/               # TypeScript type definitions
├── utils/               # Fonctions utilitaires
└── services/            # Services d'API et intégrations
```

## Routes principales

- `/` - Page d'accueil
- `/auth/login` - Connexion
- `/auth/register` - Inscription
- `/dashboard` - Tableau de bord utilisateur
- `/scan` - Analyse émotionnelle
- `/journal` - Journal émotionnel
- `/music` - Thérapie musicale
- `/vr` - Sessions de réalité virtuelle
- `/admin/dashboard` - Tableau de bord administrateur

## Configuration d'environnement

La plateforme EmotionsCare s'intègre avec plusieurs API tierces pour fournir ses fonctionnalités d'IA, d'analyse émotionnelle et de génération de musique.

### APIs intégrées

1. **OpenAI** - Pour GPT-4, DALL-E et Whisper
   - Utilisation : Conseils IA, génération de texte et d'images, transcription audio
   - Variable d'environnement : `NEXT_PUBLIC_OPENAI_API_KEY`

2. **Hume AI** - Pour l'analyse émotionnelle avancée
   - Utilisation : Détection d'émotions dans le texte, la voix et les expressions faciales
   - Variable d'environnement : `NEXT_PUBLIC_HUME_API_KEY`

3. **MusicGen** - Pour la génération de musique personnalisée
   - Utilisation : Création de musique adaptée aux émotions
   - Gérée par le backend

### Configuration du fichier .env.local

```
NEXT_PUBLIC_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_HUME_API_KEY=hume_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

## Installation et démarrage

```bash
# Cloner le repository
git clone https://github.com/your-username/emotions-care.git
cd emotions-care

# Installer les dépendances
npm install

# Créer un fichier .env.local avec les variables nécessaires
# (voir section Configuration d'environnement)

# Démarrer l'application en mode développement
npm run dev

# Build pour la production
npm run build

# Exécuter les tests
npm test

# Démarrer le serveur de production
npm start
```

## Système de design et thèmes

EmotionsCare utilise un système de design basé sur Tailwind CSS et Shadcn UI, avec prise en charge des thèmes clairs et sombres. Le thème est configurable par l'utilisateur et peut s'adapter automatiquement aux préférences système.

## Contextes globaux

- **ThemeContext** - Gestion du thème (clair/sombre)
- **AuthContext** - Authentification et informations utilisateur
- **UserModeContext** - Mode utilisateur (B2B/B2C)
- **LayoutContext** - Mise en page et navigation
- **MusicContext** - Lecture et gestion de la musique

## Gestion du responsive

L'application est entièrement responsive et optimisée pour les appareils mobiles, tablettes et desktop. Nous utilisons:

- Media queries via Tailwind
- Hook `useMediaQuery` pour la logique conditionnelle
- Layouts adaptifs pour chaque taille d'écran

## Tests et qualité

- ESLint pour la qualité du code
- TypeScript pour le typage statique
- Tests unitaires via `node --test`
- Tests d'intégration (à venir)

## Équipe et contribution

EmotionsCare est un produit développé par [Votre Entreprise], avec une équipe dédiée au développement, au design et à l'expérience utilisateur.

## Licence

Tous droits réservés © 2023-2025 [Votre Entreprise]
