# Plan de migration vers la production

Ce document décrit les étapes recommandées pour déployer EmotionsCare en environnement de production.

## 1. Préparation de l'infrastructure

1. **Créez un projet Supabase de production**
   - Configurez la base de données PostgreSQL et les règles de sécurité.
   - Déployez les fonctions edge depuis `supabase/functions` à l'aide du CLI Supabase.
2. **Configurez un hébergeur pour le frontend** (Vercel ou Netlify)
   - Prévoyez l'activation du HTTPS et un nom de domaine personnalisé.
3. **Initialisez Sentry pour la surveillance**
   - Ajoutez la variable `NEXT_PUBLIC_SENTRY_DSN` dans les variables d'environnement.

## 2. Variables d'environnement

Rassemblez l'ensemble des clés nécessaires dans le fichier `.env.production` :

```bash
NEXT_PUBLIC_OPENAI_API_KEY=<clé OpenAI>
NEXT_PUBLIC_HUME_API_KEY=<clé Hume AI>
NEXT_PUBLIC_SUPABASE_URL=<url du projet Supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anonyme Supabase>
NEXT_PUBLIC_API_URL=<url de l'API backend>
NEXT_PUBLIC_WEB_URL=<url publique du frontend>
NEXT_PUBLIC_SENTRY_DSN=<clé Sentry>
```

Copiez ce fichier vers le gestionnaire de variables de votre hébergeur (Vercel, Netlify…).

## 3. Construction et déploiement du frontend

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez la construction de production :
   ```bash
   npm run build
   ```
3. Déployez le contenu du dossier `dist/` sur votre hébergeur.

## 4. Migration et initialisation de la base

1. Appliquez les migrations Supabase le cas échéant via le CLI :
   ```bash
   supabase db push
   ```
2. Créez les utilisateurs de démonstration si nécessaire :
   ```bash
   npx ts-node scripts/ensureTestUser.ts
   ```
3. Vérifiez les règles d'accès et les politiques RLS pour sécuriser les données.

## 5. Mise en place du CI/CD

1. Activez GitHub Actions pour automatiser les tests à chaque commit (`.github/workflows/ci.yml`).
2. Configurez un pipeline de déploiement continu sur Vercel/Netlify déclenché après la réussite des tests.

## 6. Checklist finale avant mise en ligne

- [ ] Toutes les variables d'environnement de production sont renseignées.
- [ ] Les fonctions Supabase sont déployées et accessibles.
- [ ] Le build frontend s'exécute sans erreur (`npm run build`).
- [ ] Les tests unitaires passent (`npm test`).
- [ ] Sentry et le monitoring sont actifs.
- [ ] La politique de sécurité (CSP, HTTPS, Auth) est vérifiée.

Une fois ces étapes validées, la plateforme est prête pour le passage en production.
