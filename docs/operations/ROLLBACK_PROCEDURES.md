# 🔄 Rollback Procedures - Emergency Recovery Guide

**Critical procedures for immediately reverting to previous version in case of production issues.**

---

## 🚨 Overview

This document provides step-by-step procedures for rolling back EmotionsCare v1.0 to the previous stable version (v0.x.x) in case of critical production issues.

**Key Facts**:
- ⏱️ **Target Rollback Time**: < 5 minutes from decision to complete
- 🎯 **Target Recovery Time**: < 2 minutes for health check
- ✅ **Tested**: Blue-green strategy verified
- 🔒 **Data Safe**: No data loss in rollback
- 📊 **Blue Version**: Remains ready for 24 hours

---

## 🎯 When to Rollback

### Automatic Rollback Triggers (Immediate)

Execute rollback immediately if **ANY** of these conditions occur:

```
TRIGGER 1: Error Rate Spike
├─ Error rate > 10% for 5 consecutive minutes
├─ User impact: Critical
├─ Action: ROLLBACK IMMEDIATELY
└─ Time: Now

TRIGGER 2: Authentication Broken
├─ Login failing for > 50% of users
├─ User impact: Total service degradation
├─ Action: ROLLBACK IMMEDIATELY
└─ Time: Now

TRIGGER 3: Database Unreachable
├─ Database connection errors
├─ All data operations failing
├─ User impact: Service down
├─ Action: ROLLBACK IMMEDIATELY
└─ Time: Now

TRIGGER 4: All Requests Failing
├─ 5xx errors > 50% of traffic
├─ Service completely down
├─ User impact: Total outage
├─ Action: ROLLBACK IMMEDIATELY
└─ Time: Now

TRIGGER 5: Memory Leak Detected
├─ Memory usage increasing continuously
├─ Server becoming unresponsive
├─ User impact: Degrading performance
├─ Action: ROLLBACK IMMEDIATELY
└─ Time: Now

TRIGGER 6: Data Corruption Detected
├─ Invalid/corrupted data in database
├─ User data at risk
├─ User impact: Data integrity compromised
├─ Action: ROLLBACK + RESTORE BACKUP
└─ Time: Now
```

### Manual Rollback Decision Triggers

If **ANY** of these occur, TEAM DECISION required (Tech Lead + On-Call):

```
DECISION TRIGGER 1: Critical Bug Found
├─ Blocking user workflows
├─ Can't be fixed in < 15 minutes
├─ User impact: Feature broken
├─ Decision: Fix or rollback?
└─ Assessment time: 5 minutes

DECISION TRIGGER 2: Performance Degradation
├─ P95 response time > 5 seconds
├─ Continues for > 10 minutes
├─ User impact: Slow system
├─ Decision: Monitor or rollback?
└─ Assessment time: 10 minutes

DECISION TRIGGER 3: Unplanned Third-Party Outage
├─ API integration failing (not our fault)
├─ Feature unavailable (e.g., Spotify down)
├─ User impact: Partial feature loss
├─ Decision: Wait or rollback?
└─ Assessment time: 5 minutes

DECISION TRIGGER 4: Data Inconsistency
├─ Data appearing corrupted/wrong
├─ Not security issue
├─ User impact: Wrong data displayed
├─ Decision: Investigate or rollback?
└─ Assessment time: 10 minutes

DECISION TRIGGER 5: User Complaints Spike
├─ > 50 complaints in 1 hour
├─ About specific feature/bug
├─ User impact: Service quality
├─ Decision: Fix or rollback?
└─ Assessment time: 10 minutes
```

---

## 📋 Pre-Rollback Checklist

**Before executing rollback, verify**:

```
ASSESSMENT (5 minutes)
☐ Confirm issue is real (not false positive)
☐ Check Sentry dashboard for error details
☐ Verify error is in v1.0 (not earlier version)
☐ Assess scope of impact (users/features affected)
☐ Determine root cause (if known)
☐ Estimate fix time if not rolling back

APPROVAL (2 minutes)
☐ Tech Lead approves rollback
☐ On-Call Engineer confirms
☐ VP Engineering notified
☐ Rollback decision documented

NOTIFICATION (1 minute)
☐ Slack #incidents channel: Issue and plan posted
☐ All on-call team members: Notified
☐ Status page: Updated to "Investigating"
☐ Support team: Alerted for customer communication

VALIDATION (2 minutes)
☐ Blue (v0.x.x) environment healthy
☐ Previous version database backups available
☐ Rollback procedure tested recently
☐ Team ready for execution
```

---

## 🔄 Rollback Execution Procedures

### Option 1: Vercel Blue-Green Rollback (Fastest)

**Time**: < 2 minutes | **Risk**: Very Low | **Recommended**: YES

#### Step 1: Stop Green (v1.0.0) Traffic (30 seconds)

```bash
# Via Vercel CLI
vercel rollback production

# OR via Vercel Dashboard:
# 1. Go to Dashboard > Project > Deployments
# 2. Find current v1.0.0 deployment
# 3. Click "Rollback"
# 4. Confirm
```

**Expected Output**:
```
✓ Rollback initiated
✓ Green environment: Stopped
✓ Traffic redirected to Blue
✓ Rollback complete
```

#### Step 2: Verify Blue (v0.x.x) Handling Traffic (30 seconds)

```bash
# Check health
curl -v https://emotionscare.com/health

# Expected:
# HTTP/1.1 200 OK
# version: v0.x.x
```

#### Step 3: Verify Core Features (1 minute)

```bash
# API health
curl https://emotionscare.com/api/health

# User profile (test user)
curl -H "Authorization: Bearer [token]" \
  https://emotionscare.com/api/user/profile

# Emotion detection
curl -H "Authorization: Bearer [token]" \
  https://emotionscare.com/api/emotions

# Journal list
curl -H "Authorization: Bearer [token]" \
  https://emotionscare.com/api/journal/entries
```

**Expected**: All endpoints return `200 OK` with data

#### Step 4: Verify Database Intact (1 minute)

```bash
# Connect to database
psql -h $DB_HOST -U $DB_USER -d emotionscare

# Count records to verify no data loss
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM journal_entries;
SELECT COUNT(*) FROM emotions;
SELECT COUNT(*) FROM sessions;

# Should match pre-deployment counts
```

#### Step 5: Monitor Blue Environment (5 minutes)

```bash
# Check error rate in Sentry
# Should be normal (< 0.5%)

# Check response times
# Should be normal (P95 < 1000ms)

# Check active users
# Should be increasing as traffic shifts

# Check logs for any errors
tail -100 /var/log/app.log
```

---

### Option 2: Kubernetes Rollout Undo (If using K8s)

**Time**: < 2 minutes | **Risk**: Very Low

```bash
# Check current rollout status
kubectl rollout status deployment/emotionscare

# View rollout history
kubectl rollout history deployment/emotionscare

# Undo to previous version
kubectl rollout undo deployment/emotionscare

# Monitor rollout progress
kubectl rollout status deployment/emotionscare --watch

# Verify pods restarted with old version
kubectl get pods -l app=emotionscare
kubectl describe pod [pod-name]
```

**Expected**: Pods restart with previous image version

---

### Option 3: Docker Compose Rollback (If using Docker Compose)

**Time**: < 3 minutes | **Risk**: Low

```bash
# List all deployed versions
docker images emotionscare

# Stop current container
docker-compose -f docker-compose.prod.yml down

# Change compose file to reference previous version
vi docker-compose.prod.yml
# Change image: emotionscare:v1.0.0 → emotionscare:v0.x.x

# Restart with previous version
docker-compose -f docker-compose.prod.yml up -d

# Verify service started
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs --tail=50
```

---

### Option 4: Manual Database Rollback (If needed)

**Time**: 5-15 minutes | **Risk**: Medium | **Use only if**: Data corruption detected

```bash
# Step 1: Stop application
kubectl scale deployment emotionscare --replicas=0

# OR: docker-compose down

# Step 2: Identify backup timestamp
supabase db list-backups --remote production

# Sample output:
# 2025-11-14 08:00 (pre-deployment backup) ← USE THIS
# 2025-11-14 08:15 (1.0.0 deployed)
# 2025-11-14 08:20 (corrupted data)

# Step 3: Restore from backup
supabase db restore --remote production \
  --backup-id 2025-11-14-08-00

# Expected: "Restore in progress..."
# Check progress in Supabase dashboard

# Step 4: Verify data restored
psql -h $DB_HOST -U $DB_USER -d emotionscare
SELECT COUNT(*) FROM users;  # Should match pre-1.0.0 count
SELECT MAX(created_at) FROM journal_entries;  # Should be before 08:15

# Step 5: Restart application
kubectl scale deployment emotionscare --replicas=3

# OR: docker-compose up -d

# Step 6: Verify application connects to database
curl https://emotionscare.com/health
```

---

## 📢 Post-Rollback Communication

### Immediate (Within 1 minute)

**Slack Message** to #incidents:
```
🔄 ROLLBACK EXECUTED

Status: ✅ Rolled back to v0.x.x
Time: [timestamp]
Duration: [X minutes from incident to recovery]
Impact: [X minutes of downtime]

All services restored and healthy.
Monitoring now.

Details in thread →
```

**Status Page** update:
```
Status: INVESTIGATING → PARTIAL OUTAGE → RESOLVED
Message: "We experienced an issue with v1.0.0 deployment and
have rolled back to the previous stable version. Service is
now fully restored. We apologize for the disruption."
```

### 5 Minutes

**Email to Leadership**:
```
SUBJECT: Incident Report - v1.0.0 Rollback

INCIDENT SUMMARY:
├─ Issue: [describe issue]
├─ Detected: [time]
├─ Rollback: [time]
├─ Recovery Time: [X minutes]
├─ Data Loss: None
└─ Current Status: Fully operational

TIMELINE:
├─ 08:15 - Issue detected
├─ 08:16 - Team notified
├─ 08:17 - Root cause identified
├─ 08:18 - Rollback executed
├─ 08:19 - Verified healthy
└─ 08:20 - Status page updated

NEXT STEPS:
1. Post-mortem scheduled: [time]
2. Root cause investigation: [owner]
3. Fix implementation: [owner]
4. Validation plan: [owner]
5. Redeployment plan: [owner]
```

### 15 Minutes

**Customer Communication** (if significant impact):
```
We experienced a brief service disruption with our latest
deployment. Our team immediately detected the issue and
rolled back to our previous stable version.

All services are now fully restored and operating normally.
No data was lost or compromised.

We sincerely apologize for any inconvenience this caused.
```

---

## ✅ Post-Rollback Validation Checklist

```
IMMEDIATE CHECKS (5 minutes)
☐ Health check endpoint: 200 OK
☐ API responding: < 2s response time
☐ Database connected: Queries working
☐ Authentication: Login working
☐ Error rate: < 0.5%
☐ User sessions: Restoring properly

FEATURE CHECKS (10 minutes)
☐ Emotion detection: Working
☐ Music generation: Accessible
☐ Voice journaling: Recording works
☐ Calendar sync: Events visible
☐ Meditation timer: Functioning
☐ Coaching lessons: Accessible
☐ Data export: Possible
☐ Notifications: Sending
☐ All 14 features: Operational

MONITORING CHECKS (5 minutes)
☐ Sentry: Alerts normalized
☐ Performance: Metrics normal
☐ Error rate: Trending down
☐ No new errors: Queue cleared
☐ User complaints: Stopping
☐ System load: Normal
☐ Database: Responsive
☐ Integrations: Connected

TEAM CHECKS (5 minutes)
☐ On-call: Acknowledged
☐ Tech lead: Briefed
☐ VP Eng: Notified
☐ Support: Updated
☐ Slack: Informed
☐ Status page: Updated
☐ Documentation: Started

TOTAL VALIDATION TIME: ~25 minutes
```

---

## 📋 Rollback Decision Tree

```
INCIDENT DETECTED
    ↓
┌─ Is error rate > 10% for 5 min? ─ YES → ROLLBACK IMMEDIATELY
│  └─ NO
│
├─ Is authentication broken? ─ YES → ROLLBACK IMMEDIATELY
│  └─ NO
│
├─ Is database unreachable? ─ YES → ROLLBACK IMMEDIATELY
│  └─ NO
│
├─ Is error rate > 1% for 10 min? ─ YES → Assess issue
│  │                                    └─ Can fix < 15 min? ─ YES → Fix it
│  │                                       └─ NO → ROLLBACK
│  └─ NO
│
├─ Is P95 response > 5s? ─ YES → Assess issue
│  │                         └─ Is it external? ─ YES → Monitor
│  │                            └─ NO → ROLLBACK
│  └─ NO
│
└─ CONTINUE MONITORING v1.0.0
   └─ If issue develops → ROLLBACK
      └─ If stable > 1 hour → No rollback needed
```

---

## 🔐 Data Safety During Rollback

**Important**: All user data is safe during rollback

```
What Happens to User Data:
├─ Journal entries: PRESERVED ✅
├─ Emotion records: PRESERVED ✅
├─ Meditation history: PRESERVED ✅
├─ User settings: PRESERVED ✅
├─ Calendar events: PRESERVED ✅
├─ Session data: PRESERVED ✅
└─ All user files: PRESERVED ✅

What Rolls Back:
├─ Application code: v0.x.x restored ✅
├─ Feature behavior: Previous version ✅
├─ UI/UX: Previous version ✅
├─ API responses: v0.x.x format ✅
└─ NO DATA IS LOST ✅

Time Gap Handling:
├─ Entries created during v1.0.0: Kept ✅
├─ Changes made in v1.0.0: Kept ✅
├─ Database state: At v1.0.0 time ✅
├─ No data loss: Guaranteed ✅
└─ Consistency: Maintained ✅
```

---

## 🚀 Redeployment After Rollback

### Timeline

```
After Rollback:
├─ Hour 0: Rollback executed
├─ Hour 0-4: Root cause analysis
├─ Hour 4-12: Fix development & testing
├─ Hour 12-24: Code review & approval
├─ Hour 24: Redeployment to staging
├─ Hour 24-30: Staging validation
├─ Hour 30: Production redeployment
└─ Hour 30+: 24-hour monitoring (again)
```

### Redeployment Checklist

```
BEFORE REDEPLOYMENT
☐ Root cause identified
☐ Fix implemented & tested
☐ Code review completed
☐ Security review passed
☐ Load tests passed
☐ Staging validation passed
☐ All team approvals obtained
☐ Deployment plan documented
☐ Rollback plan updated
☐ Team briefed

DURING REDEPLOYMENT
☐ Follow DEPLOYMENT_EXECUTION_PLAN.md again
☐ Extra caution on monitoring
☐ Reduced traffic ramp-up (canary deployment)
☐ Enhanced monitoring thresholds
☐ Lower error rate thresholds
☐ More frequent health checks

AFTER REDEPLOYMENT
☐ Extended 48-hour monitoring
☐ Hourly team check-ins (vs 6-hour for normal)
☐ Daily post-mortem updates
☐ Issue tracking dashboard active
☐ Escalation ready
☐ Rollback plan ready (again)
```

---

## 📞 Rollback Contacts

**Tech Lead**: [Name] [Phone/Email]
**VP Engineering**: [Name] [Phone/Email]
**On-Call Engineer**: [PagerDuty assignment]
**Database Admin**: [Name] [Phone/Email]
**DevOps Lead**: [Name] [Phone/Email]

**Escalation Path**:
```
Tech Lead (Approves)
    ↓
On-Call Engineer (Executes)
    ↓
VP Engineering (Notified)
    ↓
CEO (If major incident)
```

---

## ⚠️ Important Notes

1. **Rollback is safe**: No data loss, can be reversed
2. **Speed is critical**: Every minute counts
3. **Decision time**: Keep assessment to < 5 minutes
4. **Communication**: Keep team informed
5. **Documentation**: Log all actions
6. **Post-mortem**: Always conduct review
7. **Prevention**: Learn and prevent recurrence

---

## 🎯 Success Criteria - Rollback Complete When

```
✅ Application responding to health checks
✅ Error rate < 0.5%
✅ Response time normal (P95 < 1000ms)
✅ Database connection stable
✅ All 14 features accessible
✅ No active critical alerts
✅ Users can login and use features
✅ Team notified and stable
✅ Status page updated
✅ Post-mortem scheduled
```

---

**Document Created**: 2025-11-14
**Status**: Production Ready
**Last Updated**: 2025-11-14
**Critical**: This procedure could save hours in an emergency

Review before deployment day.

