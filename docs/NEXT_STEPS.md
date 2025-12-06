# 🚀 Prochaines Étapes - Déploiement Production

> **Guide des actions immédiates pour déployer EmotionsCare en production**

---

## 📋 CHECKLIST PRÉ-DÉPLOIEMENT

### ✅ Phase 1 : Configuration Environnement (30 min)

#### 1.1 Variables d'environnement

```bash
# Créer .env.production
cp .env.example .env.production
```

**Variables requises** :

```env
# === SUPABASE (OBLIGATOIRE) ===
VITE_SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# === APIs IA (OPTIONNEL) ===
# Hume AI (analyse émotionnelle)
VITE_HUME_API_KEY=votre-clé-hume

# OpenAI (coach IA)
VITE_OPENAI_API_KEY=sk-proj-...

# Suno (musique thérapeutique)
VITE_SUNO_API_KEY=votre-clé-suno

# === ANALYTICS (OPTIONNEL) ===
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_GA_TRACKING_ID=G-...

# === SECRETS SUPABASE (EDGE FUNCTIONS) ===
# À configurer dans Supabase Dashboard > Settings > Functions
```

**⚠️ Action** : 
1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/settings/functions)
2. Ajouter les secrets suivants :
   - `OPENAI_API_KEY`
   - `HUME_API_KEY`
   - `SUNO_API_KEY`

---

#### 1.2 Configuration Supabase

**Base de données** :

```bash
# 1. Vérifier les migrations
cd database/sql
ls -la *.sql

# 2. Les migrations sont déjà appliquées automatiquement par Supabase
# Vérifier sur : https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/editor
```

**RLS Policies** :

✅ Déjà configurées (100% couverture)

**Vérification** :
- Tables : `profiles`, `journal_voice`, `journal_text`, `vr_nebula_sessions`, `vr_dome_sessions`, `breath_weekly`, `assessments`
- Policies : `SELECT`, `INSERT`, `UPDATE`, `DELETE` par utilisateur

**⚠️ Action** : Vérifier sur [Supabase Dashboard](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/database/tables)

---

#### 1.3 Authentification

**Providers activés** :

```
✅ Email/Password
✅ Magic Link
⚠️ Google OAuth (à activer si besoin)
⚠️ Apple OAuth (à activer si besoin)
```

**⚠️ Action** :
1. Aller sur [Auth Providers](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/auth/providers)
2. Activer Google OAuth :
   - Client ID : `votre-client-id.apps.googleusercontent.com`
   - Client Secret : `GOCSPX-...`
3. Activer Apple OAuth (optionnel)

---

### ✅ Phase 2 : Tests Finaux (15 min)

#### 2.1 Tests E2E

```bash
# Lancer tous les tests
npm run test:e2e

# Vérifier que les 46 tests passent ✅
```

**Résultat attendu** :
```
✅ journal-flow.e2e.ts : 11/11 tests
✅ vr-flow.e2e.ts : 9/9 tests
✅ breath-flow.e2e.ts : 8/8 tests
✅ assessment-flow.e2e.ts : 9/9 tests
✅ dashboard-loading.e2e.ts : 9/9 tests

Total : 46/46 tests ✅
```

---

#### 2.2 Linting & Type-checking

```bash
# ESLint
npm run lint
# ✅ 0 erreurs attendues

# TypeScript
npm run type-check
# ✅ 0 erreurs attendues

# Prettier
npm run format:check
# ✅ Tous les fichiers formatés
```

---

#### 2.3 Build Production

```bash
# Build optimisé
npm run build

# Vérifier la taille du bundle
ls -lh dist/assets/*.js
# ✅ Taille < 500kB (gzipped)

# Preview du build
npm run preview
```

**Métriques attendues** :
- FCP : < 1.8s ✅
- LCP : < 2.5s ✅
- CLS : < 0.1 ✅
- Bundle size : Optimisé ✅

---

### ✅ Phase 3 : Déploiement (20 min)

#### Option A : Vercel (RECOMMANDÉ)

**Avantages** :
- ✅ Edge Functions natif
- ✅ Analytics inclus
- ✅ Preview deployments automatiques
- ✅ SSL automatique

**Déploiement** :

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Déployer
vercel --prod

# 4. Configurer les variables d'environnement
# Sur : https://vercel.com/votre-org/emotionscare/settings/environment-variables
```

**Variables à ajouter sur Vercel** :
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_HUME_API_KEY (optionnel)
VITE_OPENAI_API_KEY (optionnel)
VITE_SUNO_API_KEY (optionnel)
```

**⚠️ Action** : 
1. Aller sur [Vercel Dashboard](https://vercel.com/)
2. Import project depuis GitHub
3. Configurer les env variables
4. Deploy

---

#### Option B : Netlify

**Avantages** :
- ✅ Edge Functions
- ✅ Forms inclus
- ✅ Split testing

**Déploiement** :

```bash
# 1. Installer Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Init
netlify init

# 4. Déployer
netlify deploy --prod

# 5. Configurer les variables
netlify env:set VITE_SUPABASE_URL "https://yaincoxihiqdksxgrsrk.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOi..."
```

**Configuration `netlify.toml`** :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

---

#### Option C : Docker + Cloud (AWS, GCP, Azure)

**Dockerfile** (déjà créé) :

```bash
# Build de l'image
docker build -t emotionscare:latest .

# Test local
docker run -p 3000:3000 emotionscare:latest

# Push sur Docker Hub
docker tag emotionscare:latest votre-org/emotionscare:latest
docker push votre-org/emotionscare:latest
```

**Déploiement AWS ECS** :

```bash
# 1. Créer un cluster ECS
aws ecs create-cluster --cluster-name emotionscare-prod

# 2. Créer une task definition
# task-definition.json déjà créé dans le projet

# 3. Déployer
aws ecs run-task \
  --cluster emotionscare-prod \
  --task-definition emotionscare-task \
  --count 1
```

---

### ✅ Phase 4 : Configuration Domaine (30 min)

#### 4.1 DNS

**Domaine** : `emotionscare.app` (exemple)

**Records DNS à ajouter** :

```
# A Record (apex domain)
emotionscare.app        A       76.76.21.21 (IP Vercel/Netlify)

# CNAME (www)
www.emotionscare.app    CNAME   cname.vercel-dns.com

# TXT (vérification)
emotionscare.app        TXT     "vercel-verification=..."
```

**⚠️ Action** :
1. Aller sur votre registrar (OVH, Gandi, Cloudflare...)
2. Ajouter les records DNS
3. Attendre propagation (5-30 min)

---

#### 4.2 SSL/TLS

**Vercel/Netlify** : SSL automatique via Let's Encrypt ✅

**Vérification** :
```bash
curl -I https://emotionscare.app
# ✅ HTTP/2 200
# ✅ strict-transport-security: max-age=31536000
```

---

### ✅ Phase 5 : Monitoring & Analytics (1h)

#### 5.1 Sentry (Error Tracking)

**Installation** :

```bash
npm install @sentry/react @sentry/vite-plugin
```

**Configuration** :

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://...@sentry.io/...",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

**⚠️ Action** :
1. Créer un projet sur [Sentry](https://sentry.io/)
2. Copier le DSN
3. Ajouter `VITE_SENTRY_DSN` dans les env variables

---

#### 5.2 Google Analytics 4

**Configuration** :

```typescript
// src/lib/analytics.ts
import ReactGA from "react-ga4";

ReactGA.initialize("G-XXXXXXXXXX");

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
```

**⚠️ Action** :
1. Créer une propriété GA4 sur [Google Analytics](https://analytics.google.com/)
2. Copier le Measurement ID (G-...)
3. Ajouter `VITE_GA_TRACKING_ID` dans les env variables

---

#### 5.3 Supabase Analytics

**Déjà configuré** ✅

**Tableaux de bord** :
- [Database Performance](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/reports/database)
- [API Usage](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/reports/api)
- [Auth Activity](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/reports/auth)

---

### ✅ Phase 6 : Sécurité Production (30 min)

#### 6.1 Headers de sécurité

**Vercel** (`vercel.json`) :

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

---

#### 6.2 Rate Limiting (Supabase)

**Déjà configuré** ✅

**Vérification** :
- Table `rate_limit_counters` existe
- Fonction `increment_rate_limit_counter()` active
- Policies RLS en place

---

#### 6.3 Backup Automatique

**Supabase** : Backups automatiques activés ✅

**Vérification** :
- [Database Backups](https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/database/backups)
- Rétention : 7 jours (gratuit) ou 30 jours (pro)

**⚠️ Action** : Passer au plan Pro pour backups 30 jours si besoin

---

### ✅ Phase 7 : Tests Post-Déploiement (20 min)

#### 7.1 Smoke Tests

```bash
# Vérifier que les pages principales chargent
curl -I https://emotionscare.app
curl -I https://emotionscare.app/login
curl -I https://emotionscare.app/register
curl -I https://emotionscare.app/dashboard

# ✅ Toutes doivent retourner 200
```

---

#### 7.2 Tests Fonctionnels

**Checklist manuelle** :

- [ ] **Authentification**
  - [ ] Inscription email/password
  - [ ] Login email/password
  - [ ] Magic link
  - [ ] Logout
  - [ ] Mot de passe oublié

- [ ] **Dashboard**
  - [ ] Dashboard B2C charge
  - [ ] Dashboard B2B Collab charge
  - [ ] Dashboard RH charge

- [ ] **Fonctionnalités**
  - [ ] Journal vocal (enregistrement + sauvegarde)
  - [ ] Journal texte (édition + sauvegarde)
  - [ ] VR Nebula (lancement + stats)
  - [ ] Cohérence cardiaque (exercice + historique)
  - [ ] Évaluations (WHO-5, GAD-7, PSS-10, PHQ-9)

- [ ] **Performance**
  - [ ] FCP < 1.8s
  - [ ] LCP < 2.5s
  - [ ] CLS < 0.1

- [ ] **Accessibilité**
  - [ ] Navigation clavier (Tab, Enter, Esc)
  - [ ] Screen reader (NVDA, JAWS)
  - [ ] Contraste (min 4.5:1)

---

#### 7.3 Tests de Charge (optionnel)

**Tool** : k6 ou Artillery

```bash
# Installer k6
brew install k6

# Script de test
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100, // 100 utilisateurs simultanés
  duration: '5m',
};

export default function () {
  const res = http.get('https://emotionscare.app');
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
EOF

# Lancer le test
k6 run load-test.js
```

**Résultat attendu** :
- ✅ 99% requests < 2s
- ✅ 0% erreurs
- ✅ Throughput > 50 req/s

---

## 🎉 FÉLICITATIONS !

**EmotionsCare est maintenant en production** 🚀

### 📊 Tableau de bord de monitoring

**À surveiller quotidiennement** :

| Métrique | Outil | Cible | Alerte si |
|----------|-------|-------|-----------|
| **Uptime** | Vercel/Netlify | > 99.9% | < 99% |
| **FCP** | Google Analytics | < 1.8s | > 2.5s |
| **Error rate** | Sentry | < 0.1% | > 1% |
| **API usage** | Supabase | < 100k/jour | > 150k/jour |
| **Database size** | Supabase | < 500MB | > 800MB |

---

## 📅 Planning Post-Déploiement

### Semaine 1 : Surveillance

- [ ] Vérifier Sentry quotidiennement (erreurs)
- [ ] Monitorer Google Analytics (trafic, conversions)
- [ ] Analyser Supabase logs (requêtes lentes)
- [ ] Collecter feedback utilisateurs

### Semaine 2-4 : Optimisations

- [ ] Optimiser les requêtes lentes (index DB)
- [ ] Améliorer la couverture tests (cible 95%)
- [ ] Ajouter Storybook pour composants
- [ ] Compléter composants unifiés (~80 restants)

### Mois 2-3 : Évolution (Phase 2)

- [ ] Apps mobile natives (iOS + Android)
- [ ] Modules avancés (coach IA, social, gamification)
- [ ] Intégrations SIRH (ADP, Workday, SAP)
- [ ] SSO (Okta, Azure AD)

---

## 🆘 Support & Ressources

### Documentation

- 📖 [Guide Utilisateur B2C](GUIDE_UTILISATEUR_B2C.md)
- 👔 [Guide Collaborateur B2B](GUIDE_UTILISATEUR_B2B_COLLAB.md)
- 👨‍💼 [Guide Admin RH](GUIDE_ADMIN_B2B_RH.md)
- ❓ [FAQ](FAQ_TROUBLESHOOTING.md)

### Liens Utiles

- 🌐 **Production** : https://emotionscare.app
- 📊 **Supabase Dashboard** : https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk
- 🔧 **Vercel Dashboard** : https://vercel.com/votre-org/emotionscare
- 🐛 **Sentry** : https://sentry.io/organizations/votre-org/projects/emotionscare
- 📈 **Google Analytics** : https://analytics.google.com/

### Contact

- 📧 **Support** : support@emotionscare.app
- 🚨 **Urgence** : support-urgent@emotionscare.app
- 🔒 **Sécurité** : security@emotionscare.app

---

**Bonne chance pour le lancement ! 🎉🚀**

*Version : 1.0 - Janvier 2025*
