# 📖 Operational Runbooks

Quick reference guides for common operational tasks.

## Table of Contents
1. [User Management](#user-management)
2. [Database Operations](#database-operations)
3. [Deployment Operations](#deployment-operations)
4. [Monitoring & Alerts](#monitoring--alerts)
5. [Backup & Recovery](#backup--recovery)
6. [Scaling Operations](#scaling-operations)
7. [Troubleshooting](#troubleshooting)

---

## User Management

### Reset User Password

**Situation**: User forgot password and cannot login

**Steps**:
```bash
1. Verify user identity (security check)
2. Supabase dashboard > Authentication
3. Find user by email
4. Click "Generate Link"
5. Copy reset link
6. Send to user via secure channel
7. User sets new password via link
8. Verify user can login with new password
```

**Alternative (support access)**:
```sql
-- Set temporary password (user must change on login)
UPDATE auth.users
SET encrypted_password = crypt('TempPass123!', gen_salt('bf'))
WHERE email = 'user@example.com';

-- User should reset via "Forgot Password" link
```

### Grant Admin Access

**Situation**: Need to promote user to admin

**Steps**:
```sql
-- Add admin role
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'user-uuid';

-- Verify change
SELECT user_id, role FROM public.user_roles
WHERE user_id = 'user-uuid';

-- Log the action
INSERT INTO audit_logs (action, actor, target, timestamp)
VALUES ('promote_to_admin', 'current_user_id', 'user-uuid', NOW());
```

**Verify admin access**:
1. User logs in
2. Should see admin panel in settings
3. Can see all user data and settings

### Delete User Account

**Situation**: User requests complete account deletion (GDPR)

**Steps**:
```sql
-- Step 1: Backup user data (for legal hold)
CREATE TABLE user_deletion_backup AS
SELECT * FROM public.users WHERE id = 'user-uuid';

-- Step 2: Mark user as deleted (soft delete)
UPDATE public.users SET deleted_at = NOW()
WHERE id = 'user-uuid';

-- Step 3: Anonymize personal data
UPDATE public.users
SET email = NULL, name = 'Deleted User'
WHERE id = 'user-uuid';

-- Step 4: Delete auth user (after 30 days)
-- Scheduled job runs:
DELETE FROM auth.users WHERE id = 'user-uuid';
```

**Timeline**:
- Day 0: User requests deletion
- Day 0: Data backed up, marked as deleted
- Day 30: Hard delete executed
- Day 30: Confirmation email sent

### Ban User Account

**Situation**: User violates terms of service

**Steps**:
```sql
-- Ban user
UPDATE public.users
SET banned_at = NOW(), ban_reason = 'Violation of terms'
WHERE id = 'user-uuid';

-- Revoke all sessions
DELETE FROM auth.sessions
WHERE user_id = 'user-uuid';

-- Log incident
INSERT INTO security_incidents (type, user_id, reason, timestamp)
VALUES ('account_banned', 'user-uuid', 'Violation of terms', NOW());

-- Send user notification
SELECT * FROM public.users WHERE id = 'user-uuid';
-- Send email explaining ban and appeal process
```

**Unban process**:
```sql
-- After review/appeal
UPDATE public.users
SET banned_at = NULL, ban_reason = NULL
WHERE id = 'user-uuid';

-- Log decision
INSERT INTO audit_logs (action, details)
VALUES ('user_unbanned', jsonb_build_object(
  'user_id', 'user-uuid',
  'reason', 'Appeal approved',
  'timestamp', NOW()
));
```

---

## Database Operations

### Database Backup & Restore

**Manual Backup**:
```bash
# Supabase Dashboard > Backups
# Or via CLI:
supabase db push --remote production --dry-run

# Download backup
supabase db download backup.sql

# Verify backup
pg_dump -U postgres emotionscare > backup.sql
```

**Restore from Backup**:
```bash
# Using Supabase
1. Dashboard > Backups
2. Select backup from timestamp
3. Click "Restore"
4. Confirm (will replace current data)

# Or manually
psql -h $DB_HOST -U postgres < backup.sql
```

**Backup Verification**:
```sql
-- Check backup completeness
SELECT COUNT(*) as table_count FROM information_schema.tables
WHERE table_schema = 'public';

-- Verify recent data
SELECT COUNT(*) FROM public.journal_entries
WHERE created_at > NOW() - INTERVAL '7 days';

-- Check data integrity
SELECT COUNT(*) FROM public.users;
SELECT COUNT(*) FROM public.journal_entries;
```

### Database Migration

**Deploy Migration**:
```bash
# Create migration
supabase migration new add_feature

# Edit migration file
vim supabase/migrations/[timestamp]_add_feature.sql

# Test locally
supabase db reset

# Deploy to staging
supabase db push --remote staging

# Deploy to production
supabase db push --remote production
```

**Monitor Migration**:
```sql
-- Check migration status
SELECT * FROM _timescaledb_internal.hypertable WHERE table_name = 'table_name';

-- Check slow queries during migration
SELECT query, mean_time FROM pg_stat_statements
WHERE query LIKE '%table_name%'
ORDER BY mean_time DESC;

-- Kill long-running queries (if needed)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE duration > interval '10 minutes'
AND query LIKE '%ALTER TABLE%';
```

### Query Optimization

**Identify Slow Queries**:
```bash
# 1. Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- 1 second

# 2. Reload config
SELECT pg_reload_conf();

# 3. Check logs
tail -f /var/log/postgresql/postgresql.log | grep "duration:"

# 4. Analyze in Sentry
# Performance > Queries
```

**Optimize Identified Query**:
```sql
-- BEFORE: Slow query
SELECT * FROM journal_entries WHERE user_id = $1;

-- ANALYZE PLAN
EXPLAIN ANALYZE
SELECT * FROM journal_entries WHERE user_id = $1;

-- If Sequential Scan, add index
CREATE INDEX idx_journal_user ON journal_entries(user_id);

-- AFTER: Fast query with index
SELECT * FROM journal_entries WHERE user_id = $1;
```

---

## Deployment Operations

### Deploy to Staging

**Automated Deployment** (recommended):
```bash
git push origin feature-branch
# GitHub Actions triggers automatically
# Runs: lint → test → build → deploy to staging
# Takes ~10 minutes
```

**Manual Deployment**:
```bash
# 1. Ensure all tests pass locally
npm run test
npm run test:e2e

# 2. Build production bundle
npm run build

# 3. Deploy to staging
vercel deploy --prod --target staging

# 4. Verify deployment
curl https://staging.emotionscare.com/health
curl https://staging.emotionscare.com/api/health

# 5. Run smoke tests
npm run test:smoke:staging
```

### Deploy to Production

**Pre-Deployment**:
```bash
# 1. Verify staging is stable
curl https://staging.emotionscare.com/health

# 2. Get approval
# - Slack: #releases
# - Get +1 from team lead

# 3. Create deployment tag
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

**Production Deployment**:
```bash
# Option 1: Blue-Green (recommended)
vercel deploy --prod

# Option 2: Canary (gradual)
kubectl set image deployment/emotionscare \
  emotionscare=emotionscare:v1.0.0 --record

# Option 3: Rollback (if issues)
vercel rollback production

# Or
kubectl rollout undo deployment/emotionscare
```

**Post-Deployment**:
```bash
# 1. Verify endpoints
curl https://emotionscare.com/health
curl https://emotionscare.com/api/health

# 2. Run smoke tests
npm run test:smoke:production

# 3. Check Sentry for errors
# https://sentry.io/projects/emotionscare/

# 4. Monitor metrics
# Check error rate, response times, uptime
# Expected: < 0.5% error rate
```

### Rollback Procedure

**If Critical Issue Detected**:
```bash
# 1. Immediate notification
# Slack #incidents: "ROLLBACK IN PROGRESS"

# 2. Execute rollback
vercel rollback production

# 3. Verify health
curl https://emotionscare.com/health

# 4. Confirm stable
# Wait 5 minutes, monitor Sentry

# 5. Post-mortem
# Schedule meeting to discuss what went wrong
```

---

## Monitoring & Alerts

### Acknowledge Critical Alert

**When P1 Alert Triggered**:
```
1. Slack #alerts-critical notification received
2. Click alert link to Sentry
3. Acknowledge in Sentry
4. Open incident thread in #incidents
5. Check error details:
   - Error type
   - Affected endpoint
   - User count impacted
6. Check system metrics:
   - CPU usage
   - Memory usage
   - Database connections
7. Determine immediate action (fix vs rollback)
```

### Investigate Error Spike

**Steps**:
```
1. Open Sentry Dashboard
   https://sentry.io/projects/emotionscare/

2. Check Error Graph
   - When did it start?
   - Is it increasing/decreasing?
   - Which endpoint affected?

3. Review Error Details
   - Stack trace
   - User who triggered it
   - Browser/device info
   - Related issues

4. Check Database
   - Slow queries
   - High connection count
   - Disk space issues

5. Check Infrastructure
   - CPU usage
   - Memory available
   - Network I/O
```

### Update Monitoring Rules

**Add New Alert Rule**:
```
1. Sentry > Alerts > Alert Rules
2. Click "Create Alert Rule"
3. Configure:
   - Name: "High Error Rate"
   - Condition: error_rate > 5%
   - Time window: 5 minutes
   - Actions: Slack notification
4. Test rule (manual trigger)
5. Enable and monitor
```

---

## Backup & Recovery

### Schedule Automatic Backups

**Supabase Configuration**:
```
1. Dashboard > Project > Backups
2. Schedule > Daily 2:00 AM UTC
3. Retention > 7 days
4. Geo-redundancy > Enabled
5. Test backup > Click "Test Restore"
```

**Verify Backup Integrity**:
```bash
# Check backup exists
supabase backups list --remote production

# Test restore (to staging)
supabase backups restore <backup-id> --remote staging

# Verify data
# Connect to staging and count records
psql -h staging.db.supabase.co -U postgres
emotionscare=> SELECT COUNT(*) FROM public.users;
```

### Point-in-Time Recovery (PITR)

**Recovery Process**:
```bash
# If need to recover to specific time:
1. Determine recovery time
2. Supabase Dashboard > Backups
3. Click "Create PITR Restore"
4. Select timestamp
5. Confirm (will create new database)
6. Test recovered data
7. Update DNS to point to recovered database
```

---

## Scaling Operations

### Scale Application Horizontally

**Kubernetes Scaling**:
```bash
# Check current replicas
kubectl get deployment emotionscare

# Scale up to handle load
kubectl scale deployment emotionscare --replicas=3

# Verify scaling
kubectl get pods | grep emotionscare

# Monitor load
kubectl top nodes
kubectl top pods
```

**Vercel Auto-Scaling**:
```
1. Vercel Dashboard > Project > Settings
2. Serverless Functions > Max Duration
3. Auto-scaling enabled (default)
4. Concurrency: Unlimited (default)

No manual action needed - automatic
```

### Scale Database

**Read Replicas**:
```bash
# Add read replica
supabase db add-replica

# Point analytics/reporting to replica
# Update connection string:
DB_REPLICA_URL=postgres://...
```

**Vertical Scaling**:
```
1. Supabase Dashboard > Database > Compute Size
2. Select larger instance
3. Upgrade (a few seconds downtime)
4. Monitor: Should handle more load
```

### Cache Warming

**Pre-populate Cache**:
```typescript
// Run on deployment
async function warmCache() {
  // Fetch commonly used data
  const users = await db.users.findAll();
  const programs = await db.programs.findAll();

  // Store in Redis
  await redis.setex('users-all', 3600, JSON.stringify(users));
  await redis.setex('programs-all', 3600, JSON.stringify(programs));

  console.log('Cache warmed');
}

// Call on app startup
warmCache().catch(console.error);
```

---

## Troubleshooting

### Service Down - What to Do

**First 5 Minutes**:
```
1. Verify it's actually down
   - Try from different networks
   - Check status page
   - Check #incidents Slack

2. Check basic health
   - Ping server: ping emotionscare.com
   - Check DNS: nslookup emotionscare.com
   - Check HTTP: curl https://emotionscare.com/health

3. Check monitoring
   - Sentry: Any errors?
   - PagerDuty: Any incidents?
   - CloudWatch: Logs/Metrics?
```

**Next 5-10 Minutes**:
```
1. Determine root cause
   - Application error → Check logs
   - Database down → Check database
   - Network issue → Check DNS/firewall
   - Resource exhausted → Check metrics

2. Take action
   - If code bug → Rollback immediately
   - If database → Failover to replica
   - If network → Contact provider
   - If resource → Scale up

3. Notify users
   - Update status page
   - Post to Twitter
   - Send email (if long outage)
```

### High Error Rate

**Investigation Steps**:
```sql
-- 1. Which endpoint is failing?
SELECT endpoint, COUNT(*) as error_count
FROM errors
WHERE timestamp > NOW() - INTERVAL '5 minutes'
GROUP BY endpoint
ORDER BY error_count DESC;

-- 2. What's the error?
SELECT error_message, COUNT(*) as count
FROM errors
WHERE timestamp > NOW() - INTERVAL '5 minutes'
GROUP BY error_message
ORDER BY count DESC;

-- 3. When did it start?
SELECT
  DATE_TRUNC('minute', timestamp) as minute,
  COUNT(*) as error_count
FROM errors
WHERE timestamp > NOW() - INTERVAL '30 minutes'
GROUP BY DATE_TRUNC('minute', timestamp)
ORDER BY minute DESC;
```

**Common Issues**:
```
Cause: Database connection timeout
Fix: Check connection pool, restart connections

Cause: Third-party API down (OpenAI, Spotify, etc.)
Fix: Enable fallback/degraded mode, retry with backoff

Cause: Code bug from recent deployment
Fix: Rollback to previous version

Cause: Resource exhaustion (CPU, memory)
Fix: Scale up replicas or database
```

### Slow Performance

**Identify Slow Endpoint**:
```
1. Sentry Performance Dashboard
   https://sentry.io/projects/emotionscare/performance/

2. Sort by "Slowest Transactions"

3. Review:
   - Database query time
   - Network time
   - Other operations
```

**Optimization Steps**:
```sql
-- 1. Find the slow query
EXPLAIN ANALYZE SELECT * FROM large_table
WHERE complex_condition = true;

-- 2. Check index usage
SELECT * FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 3. Add missing index if needed
CREATE INDEX idx_name ON table_name(column_name);

-- 4. Reanalyze
ANALYZE table_name;
```

### High Database CPU

**Diagnosis**:
```sql
-- Find expensive queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check for table bloat
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check for missing indexes
SELECT indexname FROM pg_indexes
WHERE tablename NOT LIKE 'pg_%';
```

**Quick Fixes**:
```sql
-- Vacuum tables
VACUUM ANALYZE public.journal_entries;

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < NOW() - INTERVAL '1 hour';

-- Increase work_mem (temporary)
SET work_mem = '256MB';
```

---

## Emergency Contacts

```
On-Call Engineer: Check PagerDuty
Team Lead: [name@emotionscare.com]
VP Engineering: [name@emotionscare.com]
CEO: [name@emotionscare.com]

Slack: #incidents, #alerts-critical
Email: support@emotionscare.com
Phone: +1-XXX-XXX-XXXX (P1 only)
```

---

## Useful Commands

```bash
# Supabase
supabase start                    # Start local dev
supabase db push --remote prod    # Deploy migration
supabase functions deploy         # Deploy edge functions
supabase secrets list --remote    # List secrets

# Git/Deployment
git tag -a v1.0.0                 # Create release tag
vercel deploy --prod              # Deploy to production
vercel rollback production        # Rollback production

# Database
psql -h $DB_HOST -U postgres      # Connect to database
\dt                              # List tables
\d table_name                    # Show table schema

# Kubernetes (if using)
kubectl get pods                 # List pods
kubectl logs pod_name            # View logs
kubectl scale deployment/app --replicas=3  # Scale

# Monitoring
tail -f /var/log/app.log         # View live logs
grep ERROR /var/log/app.log      # Find errors
```

---

**Created**: 2025-11-14
**Version**: 1.0.0
**Status**: Quick Reference Guide - Production Use
