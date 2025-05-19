
# EmotionsCare - Plateforme de bien-être émotionnel

## À propos du projet

EmotionsCare est une plateforme SaaS innovante dédiée au bien-être émotionnel en entreprise et pour les particuliers. Notre solution combine intelligence artificielle, analyse émotionnelle et techniques de relaxation pour aider les utilisateurs à comprendre et gérer leurs émotions efficacement.

## Fonctionnalités principales

- **Analyse émotionnelle** : Détection des émotions par texte, voix et expression faciale
- **Coaching personnalisé** : Recommandations adaptées à l'état émotionnel
- **Thérapie musicale** : Générations de musiques adaptées aux émotions détectées
- **Journal émotionnel** : Suivi de l'évolution émotionnelle au fil du temps
- **Personnalisation prédictive** : Interface et suggestions IA qui s'adaptent automatiquement à vos besoins
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

- `/` - Page d'accueil (publique, aucune authentification requise)
- `/auth/login` - Connexion
- `/auth/register` - Inscription
- `/dashboard` - Tableau de bord utilisateur
- `/scan` - Analyse émotionnelle
- `/journal` - Journal émotionnel
- `/music` - Thérapie musicale
- `/vr` - Sessions de réalité virtuelle
- `/predictive` - Tableau de bord d'intelligence prédictive
- `/admin/dashboard` - Tableau de bord administrateur

## Configuration d'environnement

La plateforme EmotionsCare s'intègre avec plusieurs API tierces pour fournir ses fonctionnalités d'IA, d'analyse émotionnelle et de génération de musique.

### APIs intégrées

1. **OpenAI** - Pour GPT-4, DALL-E et Whisper
   - Utilisation : Conseils IA, génération de texte et d'images, transcription audio
   - Variable d'environnement : `VITE_OPENAI_API_KEY`

2. **Hume AI** - Pour l'analyse émotionnelle avancée
   - Utilisation : Détection d'émotions dans le texte, la voix et les expressions faciales
   - Variable d'environnement : `VITE_HUME_API_KEY`

3. **MusicGen** - Pour la génération de musique personnalisée
   - Utilisation : Création de musique adaptée aux émotions
   - Gérée par le backend

4. **Supabase** - Authentification, base de données et stockage
   - Utilisation : Gestion des utilisateurs et des fichiers
   - Variables d'environnement : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Firebase** (optionnel) - Utilisé pour la configuration de l'exemple
   - Variables d'environnement : `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`

### Configuration du fichier .env.local

Un exemple de configuration est fourni dans `src/.env.example`. Copiez ce fichier
vers `.env.local` puis renseignez vos propres clés et URLs.

```
NEXT_PUBLIC_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_HUME_API_KEY=hume_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEB_URL=http://localhost:3000


> **Note**
> L'ancienne variable `SKIP_AUTH_CHECK` utilisée pour désactiver l'authentification en développement a été supprimée. Les tableaux de bord sont désormais toujours protégés.

### Utilisateurs de test

Trois comptes standards sont mis à disposition pour les démonstrations :

| Email              | Mot de passe | Rôle      |
| ------------------ | ------------ | --------- |
| `b2c@exemple.fr`   | `b2c`        | B2C       |
| `user@exemple.fr`  | `user`       | B2B User  |
| `admin@exemple.fr` | `admin`      | B2B Admin |

Si l'un de ces comptes n'existe pas dans votre base Supabase, vous pouvez les créer ou les réinitialiser avec la commande suivante :


```bash
npx ts-node scripts/ensureTestUser.ts
```

Cette commande nécessite la variable `SUPABASE_SERVICE_ROLE_KEY` dans votre `.env.local` afin d'utiliser l'API d'administration Supabase.

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

# Vérifier les types TypeScript
npm run type-check

# Démarrer le serveur de production
npm start
```

## Système de design et thèmes

EmotionsCare utilise un système de design basé sur Tailwind CSS et Shadcn UI, avec prise en charge des thèmes clairs et sombres. Le thème est configurable par l'utilisateur et peut s'adapter automatiquement aux préférences système.

Le `ThemeContext` expose également des préférences d'accessibilité comme `soundEnabled` et `reduceMotion` ainsi que leurs setters correspondants. Ces valeurs sont définies dans `src/types/theme.ts` et stockées via `useLocalStorage`.

## Contextes globaux

- **ThemeContext** - Gestion du thème (clair/sombre)
- **AuthContext** - Authentification et informations utilisateur
- **UserModeContext** - Mode utilisateur (B2B/B2C)
- **LayoutContext** - Mise en page et navigation
- **MusicContext** - Lecture et gestion de la musique (source unique via `useMusic`)
L'ordre d'injection de ces contextes est géré par le composant `AppProviders`. La hiérarchie complète est détaillée dans `docs/layout-shell-audit.md`.

## Préférences utilisateur par défaut

La constante `DEFAULT_PREFERENCES` centralise les valeurs initiales utilisées
dans les contextes de préférences utilisateur. Elle est définie dans
`src/constants/defaults.ts` et réexportée par `src/types/preferences.ts`.
Sa structure est la suivante :

```ts
{
  theme: 'system',
  fontSize: 'medium',
  fontFamily: 'system',
  reduceMotion: false,
  colorBlindMode: false,
  autoplayMedia: true,
  soundEnabled: true,
  emotionalCamouflage: false,
  aiSuggestions: true,
  notifications_enabled: true,
  language: 'fr',
  privacy: {
    shareData: false,
    allowAnalytics: true,
    showProfile: true,
    shareActivity: true,
    allowMessages: true,
    allowNotifications: true
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    frequency: 'daily',
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    inAppEnabled: true
  }
}
```

Les composants peuvent l'importer via :

```ts
import { DEFAULT_PREFERENCES } from '@/types/preferences';
```

## Gestion du responsive

L'application est entièrement responsive et optimisée pour les appareils mobiles, tablettes et desktop. Nous utilisons:

- Media queries via Tailwind
- Hook `useMediaQuery` pour la logique conditionnelle
- Layouts adaptifs pour chaque taille d'écran

## Tests et qualité

- ESLint pour la qualité du code (`npm run lint`)
- Vérification de type TypeScript (`npm run type-check`)
- Tests unitaires (placeholder) (`npm run test`)
- Nettoyage du build (`npm run clean`)

### Conventions de typage

Les interfaces et propriétés utilisent systématiquement l'anglais en `camelCase`.
Les champs en `snake_case` ne subsistent que pour la compatibilité avec
certaines sources de données. La commande `npm run type-check` doit s'exécuter
sans erreur pour valider la cohérence des types.

## Données de test

Les fichiers de mock utilisés pendant le développement se trouvent dans les
répertoires `src/data` et `src/mocks`. Ils respectent les interfaces TypeScript
définies dans `src/types` et sont régulièrement alignés avec celles-ci. Veillez
à mettre à jour ces mocks en même temps que les types pour éviter toute erreur
de typage.

## Notifications CI

Par défaut, GitHub envoie un email à chaque échec du workflow CI. Pour 
éviter d'être submergé par ces messages :

1. Ouvrez **Settings > Notifications** sur GitHub et désactivez
   l'option *Actions*.
2. Vous pouvez toujours réactiver les alertes en cas d'incident majeur
   depuis cette même page.

## Monitoring & Alerting

L'application intègre **Sentry** pour la surveillance des erreurs et des incidents.
Le fichier `src/monitoring.ts` initialise Sentry si la variable d'environnement
`NEXT_PUBLIC_SENTRY_DSN` est présente. Les erreurs non gérées et les variables
d'environnement manquantes sont automatiquement reportées sur le tableau de bord
Sentry.

Pour activer la surveillance, ajoutez dans votre `.env.local` la clé :

```bash
NEXT_PUBLIC_SENTRY_DSN=<votre_DSN_Sentry>
```

Le tableau de bord et la gestion des alertes sont configurables directement sur
Sentry.

## Sécurité proactive

## Plan de mise en production

Le document [`docs/migration-prod.md`](docs/migration-prod.md) décrit l'ensemble des étapes pour migrer la plateforme vers un environnement de production sécurisé.


Un tableau de bord dédié permet aux administrateurs de suivre les incidents et l'état de la plateforme.
Il est accessible via la route `/b2b/admin/security`.
Tous les utilisateurs disposent d'un widget « Sécurité » dans leurs paramètres pour consulter les dernières alertes.

## Documentation technique

Vous trouverez dans le dossier `src/docs` plusieurs guides détaillés :

- `ARCHITECTURE.md` : présentation de la structure du projet
- `API_INTEGRATION.md` : intégration des services tiers
- `BUILD_CHECKLIST.md` : étapes à vérifier avant un déploiement
- `home-routing-audit.md` : audit et conventions d'accès public
- `RoutingFlow.md` : schéma du flux d'accès (accueil → login → dashboard)


## Équipe et contribution

EmotionsCare est un produit développé par [Votre Entreprise], avec une équipe dédiée au développement, au design et à l'expérience utilisateur.

## Licence

Tous droits réservés © 2023-2025 [Votre Entreprise]
