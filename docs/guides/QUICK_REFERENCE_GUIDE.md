# 📋 Quick Reference Guide - Common Commands & Procedures

**For Daily Use During Deployment & Operations**

---

## 🚀 Pre-Deployment Commands

### Run Pre-Deployment Checks (5 minutes)
```bash
./tests/staging/pre-deployment-checks.sh
# Expected output: ✅ All 9 phases passed
```

### Run Production Build (1 minute)
```bash
npm run build
# Expected: ✓ built in ~36 seconds
```

### Run Load Tests (15 minutes)
```bash
k6 run tests/load/k6-staging-tests.js
# Expected: P95 < 1000ms, error rate < 1%
```

### TypeScript Type Check (2 minutes)
```bash
npm run type-check
# Expected: No critical errors
```

---

## 🌐 Deployment Commands

### Merge to Main (5 minutes)
```bash
git merge --squash origin/claude/audit-completion-tasks-01MkZLzdArjQtMWWR6iCeb6m
git push origin main
# GitHub Actions automatically triggers 11-stage CI/CD
```

### Check Deployment Status
```bash
# Watch GitHub Actions progress:
# https://github.com/laeticiamng/emotionscare/actions

# Check Slack for deployment notifications
# #deployments channel
```

### Manual Staging Deploy (if needed)
```bash
vercel deploy --target staging
# Wait for deployment to complete
```

### Manual Production Deploy (if needed)
```bash
vercel deploy --prod
# Or use blue-green strategy per PRODUCTION_DEPLOYMENT_GUIDE.md
```

### Rollback Production (if critical issue)
```bash
vercel rollback production
# Or: kubectl rollout undo deployment/emotionscare
```

---

## 📊 Monitoring & Alerts

### Check Sentry Dashboard
```
https://sentry.io/projects/emotionscare/
```

### Monitor Logs
```bash
# View real-time logs
tail -f /var/log/app.log

# View specific errors
grep "ERROR" /var/log/app.log | tail -20

# Search for patterns
grep -i "authentication" /var/log/app.log
```

### Check Database Performance
```bash
# Connect to database
psql -h $DB_HOST -U postgres emotionscare

# Check active queries
SELECT * FROM pg_stat_activity;

# Check slow queries
SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC;

# Check connection count
SELECT count(*) FROM pg_stat_activity;
```

### Monitor API Health
```bash
curl https://emotionscare.com/health
curl https://emotionscare.com/api/health

# With timing
curl -w "Time: %{time_total}s\n" https://emotionscare.com/api/health
```

---

## 🔧 Operations Commands

### Database Backup
```bash
# Manual backup
supabase db download backup-$(date +%Y%m%d-%H%M%S).sql

# Or use Supabase dashboard:
# Dashboard > Backups > Create Backup
```

### Database Restore
```bash
# From backup file
psql -h $DB_HOST -U postgres < backup-20251114-120000.sql

# Or via Supabase dashboard:
# Dashboard > Backups > Select backup > Restore
```

### Reset User Password
```sql
-- Generate reset link in Supabase dashboard
-- Or set temporary password:
UPDATE auth.users
SET encrypted_password = crypt('TempPass123!', gen_salt('bf'))
WHERE email = 'user@example.com';
```

### Scale Application
```bash
# Kubernetes scaling
kubectl scale deployment emotionscare --replicas=3

# Vercel auto-scaling (automatic, no action needed)
# Check: Vercel Dashboard > Project > Settings > Serverless Functions
```

---

## 🚨 Incident Response

### When Alert Fires
```
1. Check Slack #alerts-critical
2. Click link to Sentry
3. Review error details
4. Check affected endpoint/user count
5. Determine immediate action (fix vs rollback)
6. Follow INCIDENT_RESPONSE_GUIDE.md for severity level
```

### Quick Diagnostics
```bash
# Check error rate
curl -s https://sentry.io/api/0/projects/emotionscare/emotionscare/stats/ \
  -H "Authorization: Bearer $SENTRY_TOKEN"

# Check response times
# Check Sentry Performance dashboard

# Check system resources
kubectl top nodes
kubectl top pods

# Check database
psql -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

### Immediate Actions
```bash
# Check logs
tail -100 /var/log/app.log

# Restart service (if needed)
kubectl rollout restart deployment/emotionscare

# Clear cache (if applicable)
redis-cli FLUSHALL

# Check health after restart
curl https://emotionscare.com/health
```

---

## 📝 Common Procedures

### Create Release Tag
```bash
git tag -a v1.0.0 -m "Release EmotionsCare v1.0"
git push origin v1.0.0
```

### Deploy Edge Functions
```bash
# List functions
supabase functions list --remote production

# Deploy single function
supabase functions deploy send-email --remote production

# Deploy all functions
supabase functions deploy --remote production
```

### Database Migration
```bash
# Create migration
supabase migration new feature_name

# Test locally
supabase db reset

# Deploy to staging
supabase db push --remote staging

# Deploy to production
supabase db push --remote production
```

### Update Secrets
```bash
# Set secret for staging
vercel env add SECRET_NAME staging

# Set secret for production
vercel env add SECRET_NAME production

# List secrets
vercel env ls
```

---

## 🔍 Verification Commands

### Verify Deployment Success
```bash
# Check API endpoints
curl -v https://emotionscare.com/api/health
curl -v https://emotionscare.com/api/user/profile

# Check response times
time curl https://emotionscare.com/

# Check Sentry metrics
# Dashboard: https://sentry.io/projects/emotionscare/

# Check alerts
# Slack: #alerts-critical, #alerts-high, #alerts-medium

# Run smoke tests
npm run test:smoke:production

# Check database
psql -c "SELECT COUNT(*) FROM users;"
```

### Performance Check
```bash
# Lighthouse score
npm run perf:lighthouse

# Bundle analysis
npm run build:analyze

# Performance profiling
npm run perf:sourcemap
```

---

## 📞 Key Contacts & Resources

**On-Call Engineer**: Check PagerDuty
**Tech Lead**: [email/name]
**Slack Channels**: #incidents, #alerts-critical, #deployments
**Email**: incidents@emotionscare.com

---

## 🗂️ Important Directories

```
.github/workflows/           → CI/CD pipelines
tests/                       → Test files
tests/staging/              → Staging deployment scripts
tests/load/                 → K6 load tests
supabase/migrations/        → Database migrations
supabase/functions/         → Edge functions
src/lib/                    → Core libraries
src/services/               → Business logic
```

---

## 📋 Pre-Deployment Checklist Template

```
Infrastructure:
  ☐ Supabase configured
  ☐ Sentry project ready
  ☐ Slack channels ready
  ☐ PagerDuty configured
  ☐ Status page ready

Code:
  ☐ All commits reviewed
  ☐ Security approved
  ☐ Tests passing
  ☐ Build successful
  ☐ No hardcoded secrets

Team:
  ☐ Tech lead assigned
  ☐ DevOps ready
  ☐ QA prepared
  ☐ On-call engineer assigned
  ☐ Product owner ready
```

---

## 🎯 Success Criteria Checklist

```
Deployment Successful When:
  ☐ All 14 features accessible
  ☐ Error rate < 0.5%
  ☐ P95 response < 1000ms
  ☐ All alerts firing
  ☐ Slack notifications work
  ☐ PagerDuty escalation works
  ☐ No user complaints
  ☐ 24-hour monitoring stable
```

---

## 💡 Useful Environment Variables

```bash
# Sentry
SENTRY_DSN=https://...@sentry.io/...
SENTRY_TOKEN=sn_...

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGc...
DATABASE_URL=postgresql://...

# External APIs
OPENAI_API_KEY=sk-...
HUME_API_KEY=...
SUNO_API_KEY=...

# Integrations
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
PAGERDUTY_KEY=...

# Application
ENVIRONMENT=production
LOG_LEVEL=info
DEBUG=false
```

---

## 🔐 Security Reminders

```
NEVER:
  ❌ Commit secrets/API keys
  ❌ Log sensitive data
  ❌ Hardcode credentials
  ❌ Skip security checks
  ❌ Deploy without review

ALWAYS:
  ✅ Use environment variables for secrets
  ✅ Review security checklist
  ✅ Run security tests
  ✅ Check for PII in logs
  ✅ Verify encryption enabled
```

---

**Last Updated**: 2025-11-14
**Status**: Production Ready

For detailed procedures, see the comprehensive guides:
- Deployment: `PRODUCTION_DEPLOYMENT_GUIDE.md`
- Operations: `OPERATIONAL_RUNBOOKS.md`
- Incidents: `INCIDENT_RESPONSE_GUIDE.md`
