# 🚨 Incident Response Guide

Comprehensive procedures for responding to production incidents at EmotionsCare.

## Quick Reference

### Severity Levels

| Level | Definition | Response Time | Escalation |
|-------|-----------|----------------|------------|
| **P1 - Critical** | Service completely down, no users can access | < 5 minutes | Immediate escalation to lead + PagerDuty |
| **P2 - High** | Major feature broken, significant user impact | < 15 minutes | Escalation to lead |
| **P3 - Medium** | Feature partially broken, workaround available | < 1 hour | Notify team, no escalation |
| **P4 - Low** | Minor issue, no user impact | < 24 hours | Add to backlog |

### Alert Mapping to Severity

```
P1 (Critical):
- Service unavailable (500+ errors)
- Database connection lost
- All requests timing out
- Memory/CPU at 100%

P2 (High):
- Error rate > 5%
- Response time P95 > 3s
- Auth failures > 10%
- Key API integration down

P3 (Medium):
- Error rate 1-5%
- Response time P95 1-3s
- Single feature broken
- Degraded performance

P4 (Low):
- Error rate < 1%
- Non-critical warnings
- Cosmetic issues
```

## P1 - Critical Incident Response

### Timeline: First 5 Minutes

**Minute 0-1: Acknowledge**
```
☐ Acknowledge Slack alert in #alerts-critical
☐ Create incident thread in #incidents
☐ If PagerDuty alert: Accept it immediately
☐ Note exact time issue started
```

**Minute 1-2: Assessment**
```
☐ Open Sentry dashboard
☐ Check error message and stack trace
☐ Determine if:
  - Application crash
  - Database issue
  - External API failure
  - Infrastructure failure

☐ Check system metrics:
  - CPU usage
  - Memory usage
  - Disk space
  - Network latency
```

**Minute 2-3: Triage**
```
☐ Affected services (all vs specific)?
☐ User impact estimate
☐ Customer-facing vs internal?
☐ Can fix quickly or need rollback?

Decision Matrix:
  Fix time < 5 min  → Attempt fix
  Fix time > 5 min  → ROLLBACK
  Unknown cause     → ROLLBACK
```

**Minute 3-5: Action**
```
If attempting fix:
  ☐ Identify root cause
  ☐ Apply minimal fix
  ☐ Monitor for immediate effect
  ☐ Check for cascading issues

If rollback:
  ☐ Execute rollback procedure
  ☐ Verify service health
  ☐ Confirm user access restored
  ☐ Set up for investigation
```

### Actions by Incident Type

#### Service Completely Down (500+ errors)

```bash
# Step 1: Check if it's application or infrastructure
curl https://emotionscare.com/health  # If timeout/refused -> infra issue
curl https://emotionscare.com/api/health  # If 500 -> app issue

# Step 2: Check recent deployments
git log --oneline -5  # Last 5 commits

# Step 3: Decision point
# If deployed in last 15 min → ROLLBACK
# Otherwise → Investigate further

# Step 4: Rollback (if needed)
kubectl rollout undo deployment/emotionscare
kubectl get pods  # Wait for new pods to be ready
sleep 30
curl https://emotionscare.com/health  # Verify health

# Step 5: Investigate
# Once service is back up:
supabase functions logs <function-name> --follow
grep -r ERROR /var/log/app/*
```

#### Database Connection Lost

```bash
# Check database connectivity
psql -h $DB_HOST -U $DB_USER -d emotionscare -c "SELECT 1"

# If connection refused:
# Option 1: Restart connection pool
kubectl exec deployment/emotionscare -- \
  curl localhost:3000/admin/reset-db-pool

# Option 2: Scale down/up database connections
kubectl set env deployment/emotionscare \
  DB_POOL_SIZE=10

# Option 3: If Supabase hosted
# Check Supabase dashboard for alerts
# Restart Supabase compute instance

# Verify recovery
curl https://emotionscare.com/api/health
```

#### CPU/Memory Exhaustion

```bash
# Check resource usage
kubectl top pods --sort-by=memory
kubectl top nodes

# Kill processes using most memory
kubectl logs deployment/emotionscare | grep -i "memory\|OutOfMemory"

# Temporary relief: Scale up
kubectl scale deployment emotionscare --replicas=3

# Permanent fix: Find memory leak
# Use Node.js profiler:
node --prof app.js
node --prof-process isolate-*.log > analysis.txt

# Check for specific issues:
# - Unbound array growth
# - Event listener leaks
# - Circular references
```

#### External API Failure (Hume, OpenAI, Spotify)

```bash
# Check which API is down
curl https://api.hume.ai/health        # Hume
curl https://api.openai.com/v1/models  # OpenAI
curl https://api.spotify.com/v1/me      # Spotify

# Temporary fix: Disable affected feature
# Set feature flag or maintenance mode
export FEATURE_MUSIC_GENERATION_ENABLED=false
kubectl set env deployment/emotionscare \
  FEATURE_MUSIC_GENERATION_ENABLED=false

# Notify users
# Send notification about temporary unavailability
curl -X POST https://emotionscare.com/api/notifications \
  -d '{"type":"maintenance","feature":"music"}'

# Monitor API recovery
# Keep checking until API is back
while true; do
  curl https://api.hume.ai/health && echo "✅ API back" && break
  echo "⏳ Waiting..."
  sleep 30
done

# Re-enable feature
export FEATURE_MUSIC_GENERATION_ENABLED=true
kubectl set env deployment/emotionscare \
  FEATURE_MUSIC_GENERATION_ENABLED=true
```

## P2 - High Severity Response

### Timeline: First 15 Minutes

**Step 1: Assess (1 min)**
- Error rate 5-10%?
- Single feature or multiple?
- Performance degradation or errors?

**Step 2: Decide (1 min)**
- Can fix in < 5 minutes?
- Or does it need escalation?

**Step 3: Fix or Escalate (remaining time)**
- Attempt hotfix if confident
- Escalate to team lead if complex
- Don't delay - escalate if unsure

### Common P2 Issues

**Error Rate Spike (5-10%)**
```
Diagnosis:
1. Which endpoint is failing?
   - Check Sentry grouping
   - Look for error pattern

2. Is it code or infrastructure?
   - Check logs for errors
   - Check database connections
   - Check memory/CPU

3. Deployment correlation?
   - Check git log
   - Was code deployed recently?

Fix options:
a) Quick config change (feature flag)
b) Redeploy without cache
c) Hotfix for obvious bug
d) Rollback if too complex

If no quick fix → ROLLBACK
```

**Performance Degradation (P95 > 3s)**
```
Investigation:
1. Which endpoints are slow?
   - Check Sentry performance tab
   - Identify slow transactions

2. Is it consistent or intermittent?
   - Watch metrics in real-time
   - Pattern analysis

3. Correlate with other events:
   - Database query changes?
   - External API latency?
   - Memory pressure?
   - Network saturation?

Solutions:
- Increase cache TTL
- Optimize slow query
- Scale horizontally
- Reduce data payload size
- Enable database connection pooling
```

**Feature Broken (but app functional)**
```
Example: Users can't create journal entries

Steps:
1. Isolate the issue
   - Is it all users or specific?
   - Is it all entries or specific type?
   - Is it create/read/update/delete?

2. Check relevant component
   - Journal API endpoint
   - Journal service
   - Database table
   - Permissions/RLS

3. Apply minimal fix
   - Check for recent code changes
   - Verify database state
   - Check for constraint violations
   - Review error logs

4. If not obvious → Rollback
```

## P3 - Medium Severity Response

### Timeline: First 1 Hour

- Assess impact (can users work around it?)
- If workaround exists, document it
- Schedule fix for non-critical window
- No need to escalate unless multiple issues

Examples:
- Single page not loading (but others work)
- One feature has wrong UI (but functional)
- Cosmetic bug
- Performance slightly slow (P95 900ms, target 1000ms)

## P4 - Low Severity Response

### Timeline: Next Business Day

- Add to backlog
- Discuss in standup
- Schedule in next sprint
- No escalation needed

Examples:
- Typo in UI
- Non-critical warning in logs
- Deprecated API warning
- Unused dependency

## Communication During Incident

### Status Updates (Every 5-10 minutes)

Post to #incidents channel:

```
🔴 [P1 - CRITICAL] High Error Rate (6%)

Time: 14:08 UTC
Duration: 2 minutes
Impact: All users affected

Current Status:
- Investigating root cause
- Error messages: Database timeout
- Affected: Journal creation endpoint
- Estimated fix: 5 minutes

Actions Taken:
✓ Identified error pattern
✓ Escalated to database team
→ Checking slow queries
→ Considering rollback

Last Updated: 14:10 UTC
Next Update: 14:15 UTC
```

### All-Clear Message

```
✅ [RESOLVED] High Error Rate Incident

Duration: 8 minutes (14:08 - 14:16 UTC)
Root Cause: Slow database query (migration issue)
Impact: 150 requests failed (0.3% of total)

Resolution:
- Reverted problematic database migration
- All services back to normal
- Error rate: 0.05%
- P95 response time: 850ms

Follow-up:
- Database team reviewing migration
- Post-mortem scheduled for 10:00 UTC tomorrow
- Monitoring enhanced for database performance

Status: STABLE ✅
```

## Post-Incident (After Service Recovered)

### Immediate Follow-up (Same day)

```
☐ Document timeline in #incidents
☐ Collect error logs and metrics
☐ Take screenshots of dashboards
☐ Record what worked / what didn't
☐ List action items for prevention
```

### Post-Mortem (Within 24 hours)

Attend meeting with:
- On-call engineer (responder)
- Team lead (escalation point)
- Subject matter expert (if applicable)
- DevOps (if infrastructure issue)

Discuss:
1. What happened? (Timeline)
2. Why did it happen? (Root cause)
3. How did we respond? (Actions taken)
4. What went well? (Positive aspects)
5. What could improve? (Learning points)
6. How do we prevent? (Action items)

Output: Post-mortem document with action items

### Prevention & Monitoring

For each incident, implement:
- [ ] New alert rule (to catch earlier)
- [ ] Code change (if software bug)
- [ ] Documentation (runbook update)
- [ ] Process improvement (if human error)
- [ ] Test case (to prevent regression)

## Escalation Contacts

### On-Call Engineer (Primary)
- Slack: @on-call
- Phone: Check PagerDuty
- Actions: Assess, diagnose, fix/rollback

### Team Lead (Secondary)
- Slack: @[name]
- Phone: [number]
- Actions: Escalate decisions, approve rollback

### DevOps/Infrastructure (Tertiary)
- Slack: #devops
- Phone: [number]
- Actions: Infrastructure fixes, scaling

### Security Team (For Security Incidents)
- Slack: @security
- Email: security@emotionscare.com
- Actions: Breach assessment, user notification

## Tools & Dashboards

### Real-Time Monitoring

```
Sentry Performance Dashboard:
  https://sentry.io/projects/emotionscare/

Error Rate & Trends:
  https://sentry.io/issues/?query=is%3Aunresolved

Response Times:
  https://sentry.io/performance/

Database Monitoring:
  https://app.supabase.com/project/[id]/

System Health:
  https://emotionscare.com/health
  https://emotionscare.com/api/health

Kubernetes Status:
  kubectl get pods -w
  kubectl describe pod [pod-name]

Logs:
  kubectl logs deployment/emotionscare -f
  supabase functions logs [name] --follow
```

### Debugging Commands

```bash
# Check service health
curl -v https://emotionscare.com/health

# Check API health
curl -v https://emotionscare.com/api/health

# View recent logs
kubectl logs deployment/emotionscare -n prod --tail=100

# Check pod status
kubectl get pods -n prod

# Check events
kubectl get events -n prod --sort-by='.lastTimestamp'

# Check resource usage
kubectl top pods -n prod
kubectl top nodes

# Database connection test
psql -h $DB_HOST -U $DB_USER -c "SELECT 1"

# Check Sentry error rate
curl https://sentry.io/api/0/projects/emotionscare/emotionscare/stats/ \
  -H "Authorization: Bearer $SENTRY_TOKEN"
```

## Incident Severity Examples

### P1 Examples
- Homepage returns 500 error
- Login broken for all users
- Database completely inaccessible
- Memory/CPU at 100% for 5+ minutes
- Datadog shows all requests failing

### P2 Examples
- Journal creation fails (but read works)
- 8% of requests timeout
- Music feature completely broken
- API response time > 3 seconds consistently
- Authentication service intermittently failing

### P3 Examples
- One user reports issue
- Performance slightly degraded (900ms)
- Specific edge case broken
- Non-critical API slow (< 2s)
- UI display bug

### P4 Examples
- Typo in error message
- Missing console log
- Optimization opportunity
- Deprecated API warning
- Non-critical test failing

## Running Incident Drill

Monthly, run incident simulations:

```bash
# Scenario 1: Database Failure
# Simulate: kubectl delete statefulset postgres
# Response: Team exercises recovery procedure

# Scenario 2: High Error Rate
# Simulate: Deploy buggy code
# Response: Team identifies and rolls back

# Scenario 3: Performance Degradation
# Simulate: Slow database query
# Response: Team troubleshoots and optimizes

# Scenario 4: External API Failure
# Simulate: Block Hume API calls
# Response: Team enables fallback/maintenance mode
```

Document drill results and improve procedures.

---

**Created**: 2025-11-14
**Version**: 1.0.0
**Last Updated**: 2025-11-14
**Status**: Active - All Production Deployments
