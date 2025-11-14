# 🚀 Production Deployment Guide

Complete guide for deploying EmotionsCare to production after successful staging validation.

## Prerequisites

Before proceeding to production, ensure:

- [ ] Staging deployment completed successfully
- [ ] All staging validation checks passed (see STAGING_VALIDATION_GUIDE.md)
- [ ] Security audit completed
- [ ] Load testing results reviewed and approved
- [ ] Monitoring dashboards configured and tested
- [ ] Team trained on incident response procedures
- [ ] Rollback plan reviewed and tested
- [ ] Production infrastructure verified

## Pre-Production Checklist

### Environment Configuration

- [ ] Production domain configured and verified
- [ ] SSL/TLS certificate installed and valid
- [ ] CDN configured and cache policies set
- [ ] Database backup strategy configured
- [ ] Secrets securely stored (Sentry DSN, API keys, etc.)
- [ ] Environment variables validated for production
- [ ] Rate limiting configured (API endpoints)
- [ ] DDoS protection enabled

### Database & Infrastructure

- [ ] Production database provisioned and tested
- [ ] Database backups automated (daily snapshots)
- [ ] Database failover tested
- [ ] Read replicas configured (if needed)
- [ ] Supabase Edge Functions deployed
- [ ] Cloud Storage configured with proper ACLs
- [ ] RLS (Row Level Security) policies active
- [ ] Database migrations applied

### Monitoring & Alerting

- [ ] Sentry project configured with production DSN
- [ ] Alert rules active for all critical metrics
- [ ] Slack integration tested (#alerts-critical channel)
- [ ] PagerDuty on-call schedule configured
- [ ] Email digest recipients configured
- [ ] Monitoring dashboard set up and shared
- [ ] Log aggregation configured
- [ ] APM (Application Performance Monitoring) enabled

### Security

- [ ] Security audit completed
- [ ] OWASP top 10 vulnerabilities checked
- [ ] SQL injection protection verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Rate limiting configured
- [ ] Authentication (Supabase Auth) verified
- [ ] Authorization (RLS policies) tested
- [ ] Secrets not exposed in code
- [ ] SSL/TLS certificate valid

### Team Preparation

- [ ] Incident response team identified
- [ ] On-call schedule created (primary + backup)
- [ ] Runbooks reviewed and accessible
- [ ] Team trained on alert response
- [ ] Communication channels established
- [ ] Rollback procedures tested with team

## Production Deployment Steps

### Phase 1: Pre-Deployment (1 hour before)

```bash
# 1. Final staging validation
echo "🔍 Running final staging validation..."
npm run build
npm run test:e2e
npm run test:load

# 2. Verify database is backed up
echo "💾 Verifying database backup..."
supabase db push --remote production  # Dry run

# 3. Check all monitoring is active
echo "📊 Checking monitoring systems..."
curl https://your-sentry-dsn/health
echo "Monitor status: https://status.sentry.io"

# 4. Notify team
echo "📢 Notifying team of deployment..."
# Send message to #releases Slack channel
```

### Phase 2: Deployment Strategy - Blue-Green

**Recommended for production**: Blue-Green deployment (zero downtime)

```bash
# 1. Deploy to "green" environment (staging copy)
echo "🟢 Deploying to green environment..."
docker build -t emotionscare:v1.0.0 .
docker push emotionscare:v1.0.0

# 2. Run smoke tests on green
echo "🧪 Running smoke tests on green..."
curl https://staging.emotionscare.com/health
# All checks must pass before proceeding

# 3. Switch traffic from blue to green
echo "🔄 Switching traffic..."
kubectl patch service emotionscare -p '{"spec":{"selector":{"version":"green"}}}'
# Alternative: Update load balancer DNS/routing

# 4. Monitor for errors
echo "👀 Monitoring green for 5 minutes..."
sleep 300
# Check Sentry error rate should be near 0

# 5. Keep blue running for instant rollback (30 mins)
echo "🔵 Keeping blue environment live for rollback..."
sleep 1800
kubectl delete deployment emotionscare-blue
```

### Phase 3: Canary Deployment (Optional - More Gradual)

If you prefer gradual rollout:

```bash
# Stage 1: 10% of traffic to new version
kubectl set image deployment/emotionscare \
  emotionscare=emotionscare:v1.0.0 --record
kubectl patch deployment emotionscare -p \
  '{"spec":{"strategy":{"canary":{"weight":10}}}}'

# Monitor for 15 minutes
sleep 900

# Stage 2: 25% of traffic
kubectl patch deployment emotionscare -p \
  '{"spec":{"strategy":{"canary":{"weight":25}}}}'
sleep 900

# Stage 3: 50% of traffic
kubectl patch deployment emotionscare -p \
  '{"spec":{"strategy":{"canary":{"weight":50}}}}'
sleep 900

# Stage 4: 100% of traffic
kubectl patch deployment emotionscare -p \
  '{"spec":{"strategy":{"canary":{"weight":100}}}}'
```

### Phase 4: Post-Deployment Validation (30 minutes)

```bash
# 1. Health checks
echo "🏥 Running health checks..."
curl https://emotionscare.com/health
curl https://emotionscare.com/api/health
# Should return 200 OK

# 2. Smoke tests
echo "🚬 Running smoke tests..."
npm run test:smoke:prod

# 3. Monitor Sentry
echo "📊 Checking Sentry for errors..."
# Error rate should be < 0.5%
# Check dashboard: https://sentry.io/projects/emotionscare/

# 4. Check performance
echo "⚡ Verifying performance metrics..."
# P95 response time should be < 1000ms
# Check Lighthouse score should be > 0.85

# 5. Verify database
echo "🗄️  Verifying database..."
curl https://emotionscare.com/api/system/health
# Should show all systems green

# 6. Check CDN
echo "📦 Verifying CDN..."
curl -I https://emotionscare.com/
# Check cache headers are present
```

### Phase 5: Team Communication

**If Successful** ✅
```
📢 Announcement to #releases channel:

✅ Production Deployment Complete

Version: v1.0.0
Deployment Time: 15 minutes
Status: All systems nominal

Key metrics:
- Error Rate: 0.1% (target: <1%)
- P95 Response Time: 850ms (target: <1000ms)
- Uptime: 100%
- Users Online: 2,341

Deployed features:
- Complete Sentry monitoring
- 14 automated alert rules
- Optimized API performance
- Enhanced user experience

Next monitoring window: 1 hour
Rollback status: Ready (keep blue environment 30 mins)
```

**If Issues Detected** ⚠️
```
🚨 Production Issue Detected

Issue: [Error Rate > 5%]
Severity: Critical
Action: ROLLBACK initiated

Timeline:
14:05 - Deployment to production
14:08 - Error rate spike detected in Sentry
14:10 - Automatic alert triggered
14:12 - Rollback to previous version
14:14 - Error rate normalized
14:15 - Incident review started

All users on stable version
Investigation ongoing in #incidents
```

## Rollback Procedure

In case of critical issues:

### Immediate Rollback (< 2 minutes)

```bash
# 1. Revert to previous version immediately
echo "⚠️  INITIATING ROLLBACK..."
kubectl set image deployment/emotionscare \
  emotionscare=emotionscare:v0.9.0 --record

# 2. Verify traffic is switched
kubectl get svc emotionscare -o wide
# Verify endpoints show previous version

# 3. Confirm health
curl https://emotionscare.com/health
# Should be healthy within 30 seconds

# 4. Monitor for 5 minutes
sleep 300

# 5. Verify no errors in Sentry
echo "Checking Sentry error rate..."
# Should return to normal baseline

echo "✅ Rollback complete"
```

### Investigation After Rollback

```bash
# 1. Review error logs
supabase functions logs <function-name> --follow

# 2. Check Sentry for patterns
# https://sentry.io/projects/emotionscare/issues/

# 3. Review CI/CD logs
# https://github.com/laeticiamng/emotionscare/actions

# 4. Database checks
supabase db stats production

# 5. Performance profiling
# Check Node.js CPU/memory usage
# Check database query performance
```

## Post-Deployment Monitoring (Next 24 Hours)

### Hour 1: Intensive Monitoring

```bash
# Every 5 minutes:
# - Error rate (should be < 0.5%)
# - Response time P95 (should be < 1000ms)
# - User sessions (should be growing)
# - Database CPU/memory (should be < 60%)

# Commands:
while true; do
  echo "=== $(date) ==="
  curl -s https://emotionscare.com/api/health | jq .
  sleep 300
done
```

### Hours 2-4: Elevated Monitoring

- Check every 15 minutes
- Verify key user flows (signup, meditation, journal)
- Monitor database slow queries
- Check external API integrations (Hume, OpenAI, Spotify)

### Hours 4-24: Standard Monitoring

- Check every hour
- Review daily metrics summary
- Check for any degradation
- Verify backups completed

## Key Metrics to Track

### Real-Time Metrics (Monitor Dashboard)

```
✅ System Health
- Uptime: 99.9%+
- Status Page: https://status.emotionscare.com

✅ Performance
- P50 Response Time: < 500ms
- P95 Response Time: < 1000ms
- P99 Response Time: < 3000ms

✅ Errors
- Error Rate: < 1%
- 5xx Errors: < 0.1%
- Timeout Rate: < 0.5%

✅ Business Metrics
- Active Users: 100+
- Successful Requests: > 99%
- Feature Usage: Track key flows
```

### Database Metrics

```
Connection Pool:
- Active: < 50
- Idle: 10-20
- Total: 80

Query Performance:
- P95 Query Time: < 500ms
- Slow Query Threshold: > 1000ms
- Average Query Time: < 100ms

Storage:
- Used: Track growth
- Backups: Daily at 2 AM UTC
- Replication Lag: < 1 second
```

## Incident Response

### Alert Triggered: High Error Rate

```
1. Immediate Actions (< 2 min)
   ☐ Acknowledge alert in Sentry
   ☐ Check #alerts-critical in Slack
   ☐ Open Sentry issue dashboard

2. Assessment (2-5 min)
   ☐ Error count trending up or down?
   ☐ Specific endpoint affected?
   ☐ User impact estimate
   ☐ Root cause category (code, infra, external API)

3. Decision (5-10 min)
   ☐ Can fix quickly (< 30 min)?
   ☐ Or trigger rollback?

4. Implementation
   ☐ If fix: Deploy hotfix, monitor closely
   ☐ If rollback: Execute rollback procedure
   ☐ Notify stakeholders

5. Resolution (30 min)
   ☐ Verify stable state
   ☐ Post-mortem scheduled
   ☐ Preventive measures identified
```

### Alert Triggered: Slow Performance

```
Response time > 3 seconds (P95)

1. Diagnosis
   - Check database CPU: Top slow queries
   - Check memory: Memory leaks?
   - Check external APIs: Are they slow?
   - Check network: Packet loss or high latency?

2. Quick Fixes
   - Clear cache
   - Restart unhealthy pods
   - Scale up if CPU high
   - Check for runaway processes

3. If Not Resolved
   - Enable query caching
   - Optimize slow query
   - Scale horizontally
   - Trigger rollback if needed
```

## Monitoring Dashboard URLs

```
Sentry Dashboard:
https://sentry.io/organizations/emotionscare/

Performance Metrics:
https://emotionscare-prod.grafana.cloud/

Database Monitoring:
https://app.supabase.com/project/[project-id]/

Logs Aggregation:
https://[log-service]/dashboards/emotionscare-prod

Alert Status:
https://status.emotionscare.com

Application Health:
https://emotionscare.com/health
```

## Production Environment Variables

Required environment variables for production:

```bash
# Core Application
VITE_APP_NAME=EmotionsCare
VITE_APP_ENV=production
NODE_ENV=production

# Sentry (Error Tracking)
VITE_SENTRY_DSN=https://your-production-key@sentry.io/1234567
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=0.5

# Supabase (Database & Auth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Keys (Third-party Integrations)
VITE_OPENAI_API_KEY=sk-...
VITE_HUME_API_KEY=...
VITE_SUNO_API_KEY=...
VITE_SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
VITE_GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ZOOM_ACCOUNT_ID=...
ZOOM_CLIENT_ID=...
ZOOM_CLIENT_SECRET=...
FIREBASE_FCM_API_KEY=...

# Resend (Email)
RESEND_API_KEY=re_...

# Alerts
VITE_ALERT_EMAIL_RECIPIENTS=ops@emotionscare.com
VITE_PAGERDUTY_SERVICE_ID=P1234567

# CDN & Storage
VITE_CDN_URL=https://cdn.emotionscare.com
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## Success Criteria

Production deployment is successful when:

✅ **Availability**
- [ ] Uptime > 99.5% in first 24 hours
- [ ] No unplanned outages

✅ **Performance**
- [ ] P95 response time < 1000ms
- [ ] Page load time < 2.5s (LCP)
- [ ] CLS < 0.1

✅ **Reliability**
- [ ] Error rate < 1%
- [ ] 5xx errors < 0.1%
- [ ] No critical alerts

✅ **Monitoring**
- [ ] Sentry capturing 100% of errors
- [ ] Alerts triggering correctly
- [ ] Logs aggregated and searchable
- [ ] Dashboards operational

✅ **Data Integrity**
- [ ] Database backups working
- [ ] Data consistency verified
- [ ] No data loss

## Post-Deployment Tasks

### Day 1
- [ ] Review deployment metrics
- [ ] Check user feedback
- [ ] Verify all integrations working
- [ ] Schedule post-mortem if issues found

### Week 1
- [ ] Performance baseline established
- [ ] Team feedback on monitoring/alerts
- [ ] Optimization opportunities identified
- [ ] Update runbooks based on learnings

### Month 1
- [ ] Review error patterns
- [ ] Optimize slow endpoints
- [ ] Plan next release cycle
- [ ] User metrics and adoption

## Rollback Decision Tree

```
Is Error Rate > 5%?
  YES → ROLLBACK immediately
  NO  → Continue

Is Any Core Feature Broken?
  YES → ROLLBACK immediately
  NO  → Continue

Is P95 Response Time > 3 seconds?
  YES → Can fix within 30 min?
        YES → Deploy hotfix
        NO  → ROLLBACK
  NO  → Monitor

Is Database Connection Healthy?
  NO  → ROLLBACK immediately
  YES → Continue monitoring

=== DEPLOY SUCCESSFUL ===
Monitor for 24 hours before
declaring stable.
```

## Key Contacts

```
On-Call Engineer: Check PagerDuty for current schedule
Team Lead: [name]@emotionscare.com
Security Team: security@emotionscare.com
DevOps Team: devops@emotionscare.com
Slack Channels: #alerts-critical, #incidents, #releases
```

## References

- Deployment Strategy: Kubernetes Blue-Green or Canary
- Incident Response: See INCIDENT_RESPONSE_GUIDE.md
- Monitoring: See MONITORING_SENTRY_GUIDE.md
- Rollback: See ROLLBACK_PROCEDURE.md
- SLA: See SERVICE_LEVEL_AGREEMENT.md

---

**Created**: 2025-11-14
**Version**: 1.0.0
**Status**: Ready for Production Deployment
**Next Review**: Post-deployment retrospective (Day 1)
