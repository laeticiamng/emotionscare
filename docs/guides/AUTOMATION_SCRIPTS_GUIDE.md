# 🤖 Automation Scripts & Utilities Guide

Guide to automation scripts and utilities for common operational tasks.

## Overview

This guide documents useful automation scripts for repetitive tasks in deployment, monitoring, and operations.

---

## Pre-Deployment Automation

### Automated Pre-Deployment Check

**Script**: `tests/staging/pre-deployment-checks.sh`

**What it does**:
```bash
✓ ESLint validation
✓ TypeScript type checking
✓ Unit tests
✓ E2E tests
✓ Production build verification
✓ Environment variable validation
✓ Docker build test
✓ Security checks
✓ Git status validation
```

**Usage**:
```bash
# Run full pre-deployment checks
./tests/staging/pre-deployment-checks.sh

# Run only code quality checks
./tests/staging/pre-deployment-checks.sh --lint-only

# Run only tests
./tests/staging/pre-deployment-checks.sh --test-only

# Verbose output
./tests/staging/pre-deployment-checks.sh --verbose
```

**Expected output**:
```
✅ All 9 phases passed
Ready for deployment
```

---

## CI/CD Automation

### GitHub Actions Workflow

**File**: `.github/workflows/staging-deploy.yml`

**Triggers**:
- Push to main branch
- Manual trigger (workflow_dispatch)

**Pipeline stages**:
```
1. Code Quality (ESLint, TypeScript)
2. Unit Tests (Jest)
3. E2E Tests (Playwright)
4. Production Build
5. Docker Build
6. Deploy to Staging
7. Smoke Tests
8. Load Tests (K6)
9. Lighthouse CI
10. Notifications
11. Report
```

**Accessing Results**:
```
GitHub Actions Dashboard:
https://github.com/laeticiamng/emotionscare/actions

View logs:
1. Click workflow run
2. Click job
3. View logs
```

---

## Load Testing Automation

### K6 Load Testing Script

**File**: `tests/load/k6-staging-tests.js`

**What it tests**:
- Homepage load (40% of traffic)
- User registration (30% of traffic)
- Authenticated flows (30% of traffic)

**Running locally**:
```bash
# Install K6
npm install -D k6

# Run tests
k6 run tests/load/k6-staging-tests.js

# With custom configuration
k6 run --vus 50 --duration 10m tests/load/k6-staging-tests.js

# Output to JSON
k6 run --out json=results.json tests/load/k6-staging-tests.js
```

**Expected results**:
```
P95 response time: < 1000ms ✓
Error rate: < 1% ✓
Requests successful: > 99% ✓
```

---

## Database Automation

### Backup Automation Script

**Manual backup**:
```bash
# Download latest backup from Supabase
supabase db download backup-$(date +%Y%m%d-%H%M%S).sql

# Verify backup integrity
psql -U postgres < backup-20251114-120000.sql

# Restore from backup
psql -h localhost -U postgres < backup-20251114-120000.sql
```

**Automated daily backups** (Supabase):
```
1. Dashboard > Backups
2. Schedule > Enable daily backups
3. Time: 2:00 AM UTC
4. Retention: 7 days
```

### Database Migration Automation

**Deploy migration**:
```bash
# Create migration file
supabase migration new create_new_table

# Edit migration in supabase/migrations/

# Test locally
supabase db reset

# Deploy to staging
supabase db push --remote staging

# Deploy to production
supabase db push --remote production
```

---

## Monitoring & Alerting Automation

### Alert Configuration

**Automated Sentry alerts** (14 rules):
```
See: SENTRY_ALERTS_SETUP.md for configuration
See: src/lib/sentry-alerts-config.ts for rule definitions
```

**Custom alert script** (optional):
```typescript
// Check error rate and send alert
async function checkErrorRate() {
  const stats = await getSentryStats();
  if (stats.errorRate > 0.05) {
    await sendAlert({
      severity: 'critical',
      message: `Error rate: ${stats.errorRate}%`,
      channel: '#alerts-critical'
    });
  }
}

// Run every 5 minutes
setInterval(checkErrorRate, 5 * 60 * 1000);
```

---

## Deployment Automation

### GitHub Actions Deployment

**File**: `.github/workflows/staging-deploy.yml`

**Automated deployment includes**:
1. Build Docker image
2. Push to registry
3. Deploy to staging
4. Run smoke tests
5. Send Slack notification
6. Generate report

**Manual deployment** (if needed):
```bash
# Deploy to staging
vercel deploy --target staging

# Deploy to production
vercel deploy --prod

# Rollback
vercel rollback [deployment-id]
```

### Kubernetes Deployment (if applicable)

```bash
# Deploy new version
kubectl set image deployment/emotionscare \
  emotionscare=emotionscare:v1.0.0 --record

# Check deployment status
kubectl rollout status deployment/emotionscare

# Rollback if needed
kubectl rollout undo deployment/emotionscare
```

---

## Security Automation

### Vulnerability Scanning

**Automated scanning** (runs on every push):
```bash
# Manual scan
npm audit

# Fix vulnerabilities
npm audit fix

# Scan specific package
npm audit [package-name]
```

**SAST scanning** (if configured):
```bash
# Using Snyk
snyk test
snyk monitor

# Using npm audit
npm audit --audit-level=high
```

---

## Performance Monitoring Automation

### Web Vitals Collection

**Automatic collection** (happens on every page load):
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);  // Send to monitoring
getLCP(console.log);
getFID(console.log);
```

### Lighthouse CI

**Automated on every deployment**:
```bash
# Configured in: lighthouserc.json

# Manual run
npm install -g @lhci/cli@latest
lhci run

# Upload results
lhci upload
```

---

## Utility Scripts

### Health Check Script

**Check system health**:
```bash
#!/bin/bash
# check-health.sh

echo "🏥 Checking system health..."

# Check API
if curl -f https://emotionscare.com/api/health > /dev/null; then
  echo "✅ API health: OK"
else
  echo "❌ API health: FAILED"
fi

# Check database
if psql -h $DB_HOST -U $DB_USER -d emotionscare -c "SELECT 1" > /dev/null; then
  echo "✅ Database health: OK"
else
  echo "❌ Database health: FAILED"
fi

# Check storage
if aws s3 ls $S3_BUCKET > /dev/null; then
  echo "✅ Storage health: OK"
else
  echo "❌ Storage health: FAILED"
fi

echo "Done."
```

### Deployment Notification Script

**Send deployment notification**:
```bash
#!/bin/bash
# notify-deployment.sh

ENVIRONMENT=$1
VERSION=$2
STATUS=$3

MESSAGE="
🚀 Deployment Notification

Environment: $ENVIRONMENT
Version: $VERSION
Status: $STATUS

Deployed at: $(date)
Deployed by: $USER
"

# Send to Slack
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d "{\"text\": \"$MESSAGE\"}"

echo "✅ Notification sent"
```

### Log Analysis Script

**Analyze recent errors**:
```bash
#!/bin/bash
# analyze-logs.sh

echo "🔍 Analyzing recent errors..."

# Count errors by type
echo "Top errors:"
grep ERROR /var/log/app.log | awk -F: '{print $NF}' | sort | uniq -c | sort -rn | head -10

# Find slowest queries
echo "Slowest queries:"
grep "duration:" /var/log/app.log | awk '{print $NF}' | sort -n | tail -10

# List unique users with errors
echo "Users with errors:"
grep ERROR /var/log/app.log | awk '{print $3}' | sort | uniq

echo "Done."
```

---

## Scheduled Tasks

### Daily Tasks (Cron Jobs)

**Example crontab** (scheduled tasks):
```bash
# Database backup (2 AM UTC daily)
0 2 * * * supabase db backup > /var/log/backup.log 2>&1

# Health check (every 5 minutes)
*/5 * * * * /home/user/scripts/check-health.sh > /var/log/health.log 2>&1

# Log rotation (daily)
0 0 * * * logrotate /etc/logrotate.d/emotionscare

# Performance report (weekly, Monday 9 AM)
0 9 * * 1 /home/user/scripts/weekly-report.sh > /var/log/report.log 2>&1

# Security scan (weekly, Sunday midnight)
0 0 * * 0 npm audit > /var/log/audit.log 2>&1
```

### Monthly Tasks

```bash
# Full database optimization
0 3 1 * * psql -h $DB_HOST -U $DB_USER -d emotionscare -c "VACUUM ANALYZE;"

# Archive old logs
0 4 1 * * find /var/log -name "*.log" -mtime +30 -gzip

# Compliance audit
0 9 1 * * /home/user/scripts/compliance-audit.sh

# Team retrospective reminder
0 15 * * 5 curl -X POST $SLACK_WEBHOOK -d '{"text":"Reminder: Friday retrospective at 4 PM"}'
```

---

## Custom Monitoring Scripts

### Real-Time Error Monitor

```bash
#!/bin/bash
# monitor-errors.sh - Real-time error monitoring

while true; do
  ERROR_COUNT=$(curl -s https://sentry.io/api/0/projects/emotionscare/emotionscare/stats/ \
    -H "Authorization: Bearer $SENTRY_TOKEN" | jq '.[] | .stats' | grep -o '[0-9]*' | tail -1)

  if [ "$ERROR_COUNT" -gt 10 ]; then
    echo "⚠️  HIGH ERROR RATE: $ERROR_COUNT errors in last minute"
    # Send alert
    curl -X POST $SLACK_WEBHOOK -d "{\"text\": \"⚠️  Error rate spike: $ERROR_COUNT errors\"}"
  fi

  sleep 60
done
```

### Performance Tracker

```bash
#!/bin/bash
# track-performance.sh - Track performance over time

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_FILE="performance_history.csv"

# Get metrics
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' https://emotionscare.com/api/health)
ERROR_RATE=$(curl -s https://sentry.io/api/0/... | jq '.error_rate')
UPTIME="99.95"

# Append to history
echo "$TIMESTAMP,$RESPONSE_TIME,$ERROR_RATE,$UPTIME" >> $RESULTS_FILE

# Analyze trends (every 100 measurements)
if (( $(wc -l < $RESULTS_FILE) % 100 == 0 )); then
  python3 analyze_trends.py $RESULTS_FILE
fi
```

---

## Integration Examples

### Slack Bot Integration

**Send deployment status to Slack**:
```bash
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d '{
    "text": "Deployment Status",
    "attachments": [{
      "color": "good",
      "fields": [
        {"title": "Environment", "value": "Production", "short": true},
        {"title": "Version", "value": "1.0.0", "short": true},
        {"title": "Status", "value": "✅ Successful", "short": false},
        {"title": "Duration", "value": "15 minutes", "short": true}
      ]
    }]
  }'
```

### PagerDuty Integration

**Trigger incident from script**:
```bash
#!/bin/bash
curl -X POST https://events.pagerduty.com/v2/enqueue \
  -H 'Content-Type: application/json' \
  -d '{
    "routing_key": "'$PAGERDUTY_KEY'",
    "event_action": "trigger",
    "payload": {
      "summary": "High error rate detected",
      "severity": "critical",
      "source": "automated-monitoring"
    }
  }'
```

---

## Troubleshooting Automation

### Auto-Recovery Script

```bash
#!/bin/bash
# auto-recovery.sh - Attempt automatic recovery

if [[ $(curl -s https://emotionscare.com/health) == *"error"* ]]; then
  echo "Health check failed, attempting recovery..."

  # Clear cache
  redis-cli FLUSHALL

  # Restart service (if using Kubernetes)
  kubectl rollout restart deployment/emotionscare

  # Wait for recovery
  sleep 30

  # Verify recovery
  if curl -f https://emotionscare.com/health > /dev/null; then
    echo "✅ Service recovered"
    curl -X POST $SLACK_WEBHOOK -d '{"text": "✅ Service auto-recovered"}'
  else
    echo "❌ Service still down, escalating"
    # Escalate to team
  fi
fi
```

---

## Documentation

### Generate Documentation

```bash
#!/bin/bash
# generate-docs.sh

# Generate API documentation
npm run docs:generate

# Generate deployment checklist
node scripts/generate-checklist.js

# Generate SLA report
node scripts/generate-sla-report.js

echo "✅ Documentation generated"
```

---

## Best Practices

### Safe Automation

1. **Test in staging first**
   - Run scripts in staging before production
   - Verify results manually
   - Get approval before automating

2. **Add logging**
   - Log all automation actions
   - Include timestamps
   - Save to permanent location

3. **Error handling**
   - Catch and report errors
   - Don't fail silently
   - Send alerts on failures

4. **Monitoring**
   - Log script execution
   - Monitor script success rate
   - Alert if scripts fail

5. **Documentation**
   - Document what script does
   - Document how to run it
   - Document expected output

---

## Quick Reference

### Common Commands

```bash
# Pre-deployment
./tests/staging/pre-deployment-checks.sh

# Load testing
k6 run tests/load/k6-staging-tests.js

# Database backup
supabase db download backup.sql

# Health check
curl https://emotionscare.com/health

# Error monitoring
npm audit

# Performance check
npm run lighthouse

# Deploy
vercel deploy --prod

# Rollback
vercel rollback [id]
```

---

## Support

**Questions about automation?**
- Check script comments
- Review OPERATIONAL_RUNBOOKS.md
- Ask team lead
- Check Slack #devops

---

**Created**: 2025-11-14
**Version**: 1.0.0
**Status**: Active - Use for Automation
**Last Updated**: 2025-11-14
