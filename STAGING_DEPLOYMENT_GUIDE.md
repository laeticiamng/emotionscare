# 🚀 Staging Deployment Guide - EmotionsCare

## Vue d'ensemble

Ce guide détaille le processus de déploiement en environnement staging pour validation complète avant production.

---

## 📋 Pré-déploiement (Checklist)

### Code Quality
- [ ] `npm run lint` - Tous les fichiers passent ESLint
- [ ] `npm run type-check` - Aucune erreur TypeScript
- [ ] `npm run test:unit` - 95%+ des tests unitaires passent
- [ ] `npm run test:e2e` - Tous les tests E2E critiques passent

### Build Validation
- [ ] `npm run build` - Build complète sans erreurs
- [ ] `npm run build:analyze` - Vérifier bundle size (<500KB gzipped)
- [ ] `npm run build:lighthouse` - Lighthouse score >= 85

### Environment Configuration
- [ ] `.env.staging` configuré avec les bonnes valeurs
- [ ] Toutes les variables d'environnement documentées
- [ ] Secrets configurés dans GitHub Actions / Staging

---

## 🔧 Configuration Staging

### Variables d'Environnement (`.env.staging`)

```env
# API Configuration
VITE_SUPABASE_URL=https://staging-[project-id].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[staging-anon-key]
VITE_API_URL=https://api-staging.emotionscare.com

# AI Services
VITE_OPENAI_API_KEY=[staging-key]
VITE_HUME_API_KEY=[staging-key]
VITE_SUNO_API_KEY=[staging-key]

# Music Streaming
VITE_SPOTIFY_CLIENT_ID=[staging-client-id]
SPOTIFY_CLIENT_SECRET=[staging-secret]

# Firebase
VITE_FIREBASE_PROJECT_ID=emotionscare-staging
FIREBASE_FCM_API_KEY=[staging-fcm-key]

# Monitoring
VITE_SENTRY_DSN=https://[staging-key]@[staging-org].ingest.sentry.io/[staging-id]
VITE_SENTRY_ENVIRONMENT=staging
VITE_SENTRY_TRACES_SAMPLE_RATE=1.0
```

---

## 🚢 Deployment Steps

### 1. Build & Push to Staging

```bash
# Checkout staging branch
git checkout staging
git pull origin staging

# Install dependencies
npm install

# Run pre-deploy checks
npm run lint
npm run type-check
npm run test:unit
npm run test:e2e

# Build for staging
npm run build -- --mode staging

# Build Docker image
docker build -f services/api/Dockerfile -t emotionscare:staging .

# Push to registry (e.g., Docker Hub, AWS ECR)
docker tag emotionscare:staging [registry]/emotionscare:staging
docker push [registry]/emotionscare:staging
```

### 2. Deploy to Staging Environment

```bash
# Using Kubernetes
kubectl set image deployment/emotionscare-staging \
  emotionscare=[registry]/emotionscare:staging \
  --record

# Or using Docker Compose
docker-compose -f docker-compose.staging.yml up -d
```

### 3. Run Smoke Tests

```bash
# Health check
curl -f https://staging.emotionscare.com/healthz.html

# API health
curl -f https://api-staging.emotionscare.com/health

# Check database migrations
npm run db:migrate:status
```

---

## ✅ Validation Post-Déploiement

### Health Checks (Automated)

```javascript
// Simple health check
const healthChecks = [
  { url: 'https://staging.emotionscare.com/', method: 'GET' },
  { url: 'https://staging.emotionscare.com/app/home', method: 'GET' },
  { url: 'https://api-staging.emotionscare.com/health', method: 'GET' },
  { url: 'https://staging.emotionscare.com/offline.html', method: 'GET' },
];

// All should respond with 2xx status
```

### Lighthouse Performance

```bash
# Run Lighthouse CI
npm run lighthouse:ci -- --collect-url-list=urls.txt

# Expected scores:
# - Performance: >= 85
# - Accessibility: >= 90
# - SEO: >= 90
# - Best Practices: >= 85
```

### Load Testing

```bash
# Run K6 load tests
k6 run tests/load/k6-staging-tests.js \
  --env BASE_URL="https://staging.emotionscare.com" \
  --summary-export=k6-staging-summary.json

# Thresholds:
# - 95% requests < 500ms
# - Error rate < 1%
# - Response time p95 < 1000ms
```

### API Integration Tests

```bash
# Test critical API flows
npm run test:api:staging

# Test flows:
# - Authentication (login, signup, logout)
# - Journal creation (text, voice, photo)
# - Meditation session (start, pause, complete)
# - Coach program enrollment
# - Data export (GDPR)
```

### Frontend E2E Tests

```bash
# Test critical user paths
npx playwright test --project=staging --headed

# Test scenarios:
# - User registration flow
# - First meditation session
# - Journal entry creation
# - Listening to music
# - Viewing progress dashboard
```

---

## 🔍 Monitoring & Observability

### Sentry Configuration

```javascript
// All errors automatically captured in staging
// Check https://sentry.io/emotionscare/staging/

// Key metrics to monitor:
// - Error rate
// - Unhandled exceptions
// - Performance issues
// - User sessions
```

### Supabase Monitoring

```sql
-- Check realtime subscriptions
SELECT * FROM pg_stat_replication;

-- Monitor slow queries
SELECT * FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC;
```

### Application Logs

```bash
# Stream logs from staging
docker logs -f emotionscare-staging

# Or via Kubernetes
kubectl logs -f deployment/emotionscare-staging
```

---

## 🧪 Test Scenarios

### Critical User Paths

#### Scenario 1: User Registration & First Session
1. Go to staging.emotionscare.com
2. Click "Sign up"
3. Enter email, password, name
4. Verify email (check staging email inbox)
5. Complete onboarding
6. Start first meditation (5 minutes)
7. Verify completion notification

#### Scenario 2: Journal Entry Creation
1. Login to staging
2. Navigate to Journal
3. Create text entry
4. Create voice entry (test Whisper API)
5. Add photo (test GPT-4 Vision)
6. Verify all entries saved

#### Scenario 3: Music Therapy
1. Navigate to Music module
2. Select emotional state
3. Trigger music generation (test Suno API)
4. Verify audio plays
5. Export to Spotify (test OAuth)

#### Scenario 4: Data Export (GDPR)
1. Navigate to Settings > Privacy
2. Click "Export my data"
3. Wait for generation
4. Download ZIP file
5. Verify all data included

---

## 🚨 Rollback Plan

### If deployment fails

```bash
# Immediate rollback
kubectl rollout undo deployment/emotionscare-staging

# Or revert to previous image
docker-compose -f docker-compose.staging.yml down
docker pull [registry]/emotionscare:staging-previous
docker-compose -f docker-compose.staging.yml up -d

# Verify rollback successful
curl -f https://staging.emotionscare.com/healthz.html
```

### Incident Response

1. **Immediate Actions**
   - Rollback to stable version
   - Post incident message in #staging channel
   - Notify team leads

2. **Investigation**
   - Check Sentry for error patterns
   - Review application logs
   - Check database integrity

3. **Communication**
   - Update status page
   - Notify stakeholders
   - Post mortem after resolution

---

## 📊 Deployment Metrics

Track these metrics for each staging deployment:

| Metric | Threshold | Action |
|--------|-----------|--------|
| Build time | < 10 min | Investigate if > 15 min |
| Deploy time | < 5 min | Investigate if > 10 min |
| Health check pass rate | 100% | Rollback if < 99% |
| Lighthouse score | >= 85 | Review if < 80 |
| Error rate (first hour) | < 1% | Monitor closely |
| P95 response time | < 1000ms | Investigate if > 2000ms |

---

## 🔗 Related Documentation

- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- [Monitoring & Alerts](./docs/monitoring.md)
- [Incident Response](./docs/incident-response.md)
- [Architecture](./ARCHITECTURE.md)

---

## 👥 Contacts

- **Deployment Lead**: DevOps team
- **On-Call Engineer**: See PagerDuty schedule
- **Backend Support**: #backend Slack channel
- **Frontend Support**: #frontend Slack channel

---

**Last Updated**: 2025-01-14
**Status**: Active
