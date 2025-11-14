# 🔧 Troubleshooting Guide - Common Issues & Solutions

**Quick-reference troubleshooting guide for resolving common issues in production.**

---

## 📋 How to Use This Guide

1. **Identify the symptom** - Find what you're observing
2. **Check the checklist** - Quick diagnostics
3. **Follow the solution** - Step-by-step fix
4. **Verify success** - Confirm resolution
5. **Escalate if needed** - Next steps if unresolved

---

## 🚨 Critical Issues (P1)

### Issue 1: Service Down (HTTP 503/502)

**Symptom**:
- ❌ Website not accessible
- ❌ All API calls failing
- ❌ "Service Unavailable" error

**Quick Checklist**:
```
☐ Is the domain resolving? → ping emotionscare.com
☐ Can you reach the server? → curl -v https://emotionscare.com
☐ Check Sentry dashboard for errors
☐ Check system resources (CPU, memory, disk)
☐ Check database connection
☐ Verify all containers/services running
```

**Solution**:

**Step 1: Check Health Endpoints** (30 seconds)
```bash
# Check main health endpoint
curl -v https://emotionscare.com/health

# Check API health
curl -v https://emotionscare.com/api/health

# Check database health
curl -v https://emotionscare.com/api/database-health

# Expected: All return 200 OK
```

**Step 2: Check Services Status** (1 minute)
```bash
# If using Kubernetes:
kubectl get pods
kubectl describe pod [pod-name]
kubectl logs [pod-name] --tail=50

# If using Docker:
docker ps
docker logs [container-id]

# If using Vercel:
# Check: Dashboard > Project > Deployments > Activity
```

**Step 3: Check System Resources** (1 minute)
```bash
# CPU & Memory
kubectl top nodes
kubectl top pods

# Disk space
df -h

# Should all be < 80% used
```

**Step 4: Check Database** (1 minute)
```bash
# Connect to database
psql -h $DB_HOST -U postgres emotionscare

# Test basic query
SELECT 1;

# Check connection pool
SELECT count(*) FROM pg_stat_activity;

# Should return results, not timeout
```

**Step 5: Check Network** (1 minute)
```bash
# DNS resolution
nslookup emotionscare.com

# Network connectivity
traceroute emotionscare.com

# Port accessibility
nc -zv emotionscare.com 443
```

**If All Checks Pass**:
→ Application may be crashed, restart service:
```bash
# Kubernetes
kubectl rollout restart deployment/emotionscare

# Docker
docker restart emotionscare

# Vercel
# Trigger redeploy via Dashboard
```

**If Still Down**:
→ Execute **ROLLBACK_PROCEDURES.md** immediately

---

### Issue 2: Database Connection Error

**Symptom**:
- ❌ "Unable to connect to database"
- ❌ All database queries failing
- ❌ Auth failing (uses database)

**Quick Checklist**:
```
☐ Database running?
☐ Network connectivity to DB?
☐ Connection string correct?
☐ Database credentials valid?
☐ Connection pool exhausted?
☐ Database CPU/Memory high?
```

**Solution**:

**Step 1: Test Database Connectivity** (1 minute)
```bash
# Test basic connection
psql -h $DB_HOST -U $DB_USER -d emotionscare

# If fails with "connection refused":
  → Database not running or unreachable

# If fails with "password authentication":
  → Wrong credentials (check env vars)

# If succeeds but hangs:
  → Connection pool may be exhausted
```

**Step 2: Check Database Status** (1 minute)
```bash
# From Supabase dashboard:
# 1. Go to Project > Database > Status
# 2. Check if "Healthy" or showing errors
# 3. Check Resource usage graphs
# 4. Check Connection pool status

# CPU > 80%? → Database is under load
# Memory > 80%? → May need scaling
# Connections > limit? → Connection pool exhausted
```

**Step 3: Check Connection Pool** (1 minute)
```bash
# Connect to database
psql -h $DB_HOST -U postgres

# Check active connections
SELECT datname, count(*)
FROM pg_stat_activity
GROUP BY datname;

# Should be < max_connections setting
# If not, there may be a connection leak

# Kill long-running queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE query_start < now() - interval '30 minutes'
AND datname = 'emotionscare';
```

**Step 4: Check Network Connectivity** (1 minute)
```bash
# Test connectivity to database host
ping $DB_HOST

# Test port connectivity
nc -zv $DB_HOST 5432

# If both fail:
  → Network issue, firewall may be blocking
  → Check VPC security groups
  → Check firewall rules
```

**Step 5: Restart Connection Pool** (1 minute)
```bash
# If connection pool exhausted, restart app
kubectl rollout restart deployment/emotionscare

# Watch logs for "connection pool initialized"
kubectl logs -f deployment/emotionscare --tail=20

# Should show normal operation after restart
```

**If Still Failing**:
→ Contact DevOps to scale database or investigate
→ May need to execute **ROLLBACK_PROCEDURES.md**

---

### Issue 3: Authentication Failures

**Symptom**:
- ❌ "Invalid credentials"
- ❌ Users can't login
- ❌ Session expired immediately
- ❌ JWT token invalid

**Quick Checklist**:
```
☐ Supabase Auth service running?
☐ JWT secret configured?
☐ Session storage working?
☐ User table accessible?
☐ Auth service responding?
```

**Solution**:

**Step 1: Check Supabase Auth Status** (1 minute)
```bash
# Test auth endpoint
curl -H "apikey: $SUPABASE_KEY" \
  "$SUPABASE_URL/auth/v1/me"

# Should return user info or 401 (no auth)
# If 503, auth service is down
```

**Step 2: Test Auth Flow** (2 minutes)
```bash
# Try login with test user
curl -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_KEY" \
  -d '{
    "email": "test@example.com",
    "password": "test-password"
  }'

# Should return access_token and refresh_token
# If fails, check credentials and Supabase logs
```

**Step 3: Check Session Storage** (1 minute)
```bash
# If using Redis for sessions:
redis-cli ping
# Should return PONG

redis-cli INFO
# Check memory usage and connected clients

# If Redis down:
redis-cli shutdown  # restart
systemctl restart redis
```

**Step 4: Check JWT Configuration** (1 minute)
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Should output secret (not empty)

# If empty, set it:
export JWT_SECRET="your-secret-here"

# Restart application
kubectl rollout restart deployment/emotionscare
```

**Step 5: Review Auth Logs** (2 minutes)
```bash
# Check Supabase Auth logs
# Dashboard > Project > Auth > Logs

# Look for:
├─ Error messages
├─ Failed login attempts
├─ Invalid token errors
└─ Service errors

# Or check application logs:
tail -100 /var/log/app.log | grep -i auth
```

**If Still Failing**:
→ May require session reset:
```bash
# Clear all sessions (WARNING: logs everyone out)
# In database:
DELETE FROM auth.sessions;

# Or wait for automatic cleanup (24-hour expiration)

# Then: ROLLBACK if auth critical
```

---

## ⚠️ High Priority Issues (P2)

### Issue 4: High Error Rate (>1%)

**Symptom**:
- ⚠️ Error rate 1-5%
- ⚠️ Some users experiencing errors
- ⚠️ Specific endpoints returning errors

**Quick Diagnostic**:
```bash
# Check Sentry error summary
curl -s https://sentry.io/api/0/projects/emotionscare/emotionscare/stats/ \
  -H "Authorization: Bearer $SENTRY_TOKEN"

# Top errors query:
# SELECT error_type, COUNT(*)
# FROM events WHERE timestamp > now() - interval '1 hour'
# GROUP BY error_type
# ORDER BY COUNT DESC
```

**Common Causes & Solutions**:

**Cause 1: Dependent Service Down**
```
Symptom: All requests to specific endpoint fail
Example: All music generation fails (Suno API down)

Solution:
1. Check 3rd party status page
2. Test direct API call
3. Fallback to cached response
4. Notify users (feature temporarily unavailable)
5. Monitor for service recovery
6. No rollback needed (graceful degradation)
```

**Cause 2: Database Query Timeout**
```
Symptom: "Query timeout" errors in logs
Example: Journal search timeout

Solution:
1. Check slow queries
   SELECT * FROM pg_stat_statements
   ORDER BY mean_time DESC
2. Add index if needed
   CREATE INDEX idx_journal_emotion ON journal(emotion)
3. Optimize query if possible
4. Increase timeout (temporary)
5. Restart app

Or escalate for query optimization
```

**Cause 3: Memory Leak**
```
Symptom: Error rate increases over time
         Memory usage climbing
         Errors after several hours running

Solution:
1. Restart application immediately
   kubectl rollout restart deployment/emotionscare
2. Check for memory leaks in code
3. Monitor memory usage after restart
4. If recurring, investigate code
5. Potential rollback if leak in v1.0
```

---

### Issue 5: Slow Response Times (P95 > 2 seconds)

**Symptom**:
- 🐌 Website loading slow
- 🐌 API responses > 2-5 seconds
- 🐌 User complaints about sluggishness

**Quick Diagnostic**:
```bash
# Measure response time
time curl https://emotionscare.com/api/health

# Check P95 in Sentry
# Performance dashboard > P95 Response Time

# Check Lighthouse scores
# Should be > 85
```

**Common Causes & Solutions**:

**Cause 1: Database Slow**
```
Symptom: All API responses slow, especially read-heavy endpoints

Check:
1. Active queries: SELECT * FROM pg_stat_activity
2. Long-running queries (> 1 sec)
3. Missing indexes
4. Table bloat: ANALYZE; VACUUM;

Solution:
1. Kill long-running queries
2. Add missing indexes
3. Analyze/vacuum database
4. Increase connection pool
5. Cache frequently accessed data
```

**Cause 2: High CPU/Memory Usage**
```
Symptom: Server under load, slow response

Check:
kubectl top nodes      # CPU/memory usage
kubectl top pods       # Per-pod usage
top / htop            # System processes

Solution:
1. Scale up pods:
   kubectl scale deployment emotionscare --replicas=5

2. Identify resource-heavy process:
   kubectl top pods | sort -k3 -rn

3. Add resource limits if needed

4. Restart heavy-eating pod:
   kubectl delete pod [pod-name]
```

**Cause 3: Code Performance Issue**
```
Symptom: Specific endpoint slow, others fast

Check:
1. Sentry Performance > Slowest Transactions
2. Find the slow endpoint
3. Check implementation
4. Look for N+1 queries

Solution:
1. Add caching:
   - Redis for frequent queries
   - Browser cache headers
   - CDN for static assets

2. Optimize database queries:
   - Add indexes
   - Join optimization
   - Query analysis

3. Code optimization:
   - Profile the code
   - Reduce computation
   - Parallelize if possible
```

---

### Issue 6: API Integration Failures

**Symptom**:
- ❌ Specific feature not working (Spotify, Zoom, etc.)
- ❌ Error calling external API
- ❌ "Service unavailable" from 3rd party

**Solution by Integration**:

**Spotify/Apple Music Integration Down**:
```bash
# Test Spotify API connectivity
curl -X GET "https://api.spotify.com/v1/me" \
  -H "Authorization: Bearer $SPOTIFY_TOKEN" \
  -H "Content-Type: application/json"

# Check token validity
# If 401: Token expired, refresh needed
# If 503: Spotify API down (not our issue)

# Solutions:
1. If token expired: Refresh via OAuth
2. If API down: Wait for Spotify to recover
3. Fall back to cached playlists
4. Notify users (feature temporarily unavailable)
```

**Emotion Detection (Hume API) Down**:
```bash
# Test Hume API
curl -X GET "https://api.hume.ai/v0/models" \
  -H "X-Hume-Api-Key: $HUME_API_KEY"

# If fails: Hume API may be down
# Check: https://status.hume.ai

# Solution:
1. Use last known emotion from cache
2. Fallback to user input emotion
3. Gracefully degrade feature
4. Notify user: "Emotion detection temporarily unavailable"
```

**Music Generation (Suno AI) Down**:
```bash
# Try generating music
curl -X POST "https://api.suno.ai/api/generate/" \
  -H "Authorization: Bearer $SUNO_API_KEY"

# If fails consistently:
1. Check Suno status
2. Verify API key
3. Check rate limits

# Solution:
1. Queue generation request
2. Return cached music
3. Retry in background
4. Notify when ready
```

---

## 🔍 Diagnostic Commands Reference

### System Health Check

```bash
# 1-minute system overview
echo "=== SYSTEM HEALTH ===" && \
curl https://emotionscare.com/health && echo && \
echo "=== DISK SPACE ===" && df -h && echo && \
echo "=== MEMORY ===" && free -h && echo && \
echo "=== CPU ===" && top -bn1 | head -5
```

### Database Health Check

```bash
# Complete database diagnostics
psql -h $DB_HOST -U postgres emotionscare << EOF
SELECT 'ACTIVE CONNECTIONS' as check, COUNT(*) FROM pg_stat_activity;
SELECT 'SLOW QUERIES', COUNT(*) FROM pg_stat_statements WHERE mean_time > 1000;
SELECT 'TABLE BLOAT', schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
  FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 5;
SELECT 'DB SIZE', pg_size_pretty(pg_database_size('emotionscare'));
SELECT 'INDEX COUNT', COUNT(*) FROM pg_indexes WHERE schemaname = 'public';
EOF
```

### Application Health Check

```bash
# Multi-endpoint health verification
echo "API Health:" && \
curl -s https://emotionscare.com/api/health && echo && \
echo "DB Health:" && \
curl -s https://emotionscare.com/api/database-health && echo && \
echo "Error Rate:" && \
curl -s https://sentry.io/api/0/projects/emotionscare/emotionscare/stats/ \
  -H "Authorization: Bearer $SENTRY_TOKEN" | jq '.[]'
```

---

## 📊 Monitoring Checklist - Do This Hourly

During incident or degraded performance:

```bash
#!/bin/bash
# hourly-check.sh

echo "=== EMOTIONSCARE HOURLY HEALTH CHECK ==="
echo "Time: $(date)"

# API Health
echo "1. API Response Time:"
time curl -s https://emotionscare.com/api/health > /dev/null

# Error Rate
echo "2. Current Error Rate:"
curl -s https://sentry.io/api/0/projects/emotionscare/emotionscare/stats/ \
  -H "Authorization: Bearer $SENTRY_TOKEN" | jq '.[] | select(.timestamp > now - 3600) | .stats[1]'

# Active Users
echo "3. Active Users:"
psql -h $DB_HOST -U postgres emotionscare -c \
  "SELECT COUNT(DISTINCT user_id) FROM sessions WHERE expires_at > NOW();"

# Database Connections
echo "4. Database Connections:"
psql -h $DB_HOST -U postgres -c \
  "SELECT COUNT(*) FROM pg_stat_activity WHERE datname = 'emotionscare';"

# System Resources
echo "5. System Resources:"
kubectl top nodes
kubectl top pods

# Service Status
echo "6. Service Status:"
kubectl get pods

# Recent Errors
echo "7. Recent Errors (last 10):"
tail -20 /var/log/app.log | grep -i error
```

---

## 🆘 When to Escalate

**Escalate to Senior Engineer if**:
```
☐ Issue not resolved in 15 minutes
☐ Requires code change to fix
☐ Requires database optimization beyond simple fix
☐ Requires scaling infrastructure
☐ Root cause unknown after diagnostics
☐ Impact growing over time
☐ Multiple systems affected
```

**Escalate to VP Engineering if**:
```
☐ User-facing impact > 30 minutes
☐ Error rate > 5%
☐ All services down (consider rollback)
☐ Data integrity concerns
☐ Security issue detected
☐ Major revenue impact
```

---

## 📞 Support Escalation

```
Level 1: On-Call Engineer
├─ Assess issue
├─ Run diagnostics
├─ Attempt fix
└─ Escalate if needed (15 min timeout)

Level 2: Senior Engineer
├─ Complex troubleshooting
├─ Code changes
├─ Infrastructure scaling
└─ Escalate if critical (30 min timeout)

Level 3: Tech Lead / VP Engineering
├─ Strategic decisions
├─ Rollback authorization
├─ Customer communication
└─ Major incident coordination
```

---

**Document Created**: 2025-11-14
**Status**: Production Ready
**Use During**: Production issues and incidents

Keep this guide readily accessible during deployment and operations.

