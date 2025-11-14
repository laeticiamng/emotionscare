# ✅ Staging Deployment Validation Guide

Après chaque déploiement en staging, suivez cette checklist de validation.

---

## 🟢 Phase 1: Immediate Checks (5 minutes)

### 1.1 Health Checks

```bash
# Check application is running
curl -f https://staging.emotionscare.com/healthz.html

# Check API is responding
curl -f https://api-staging.emotionscare.com/health

# Check database connection
curl -f https://api-staging.emotionscare.com/db-health
```

**✅ Expected**: All return 200 OK

### 1.2 Basic Navigation

1. Open https://staging.emotionscare.com
2. Verify page loads without errors
3. Check console for JavaScript errors (F12)
4. Verify Service Worker registered (Network → WS)
5. Check no mixed HTTP/HTTPS content warnings

**✅ Expected**: Page loads, no 404s, no console errors

### 1.3 Authentication

```javascript
// Open browser console and test login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({
    email: 'test@staging.emotionscare.com',
    password: 'StagingPassword123!'
  })
});
console.log(await response.json());
```

**✅ Expected**: Returns auth token, 200 status

---

## 🟡 Phase 2: Smoke Tests (15 minutes)

### 2.1 User Registration Flow

**Step-by-step:**
1. Navigate to signup page
2. Enter:
   - Email: `test-{timestamp}@emotionscare.staging`
   - Password: `StagingTest123!`
   - Name: `Test User`
3. Click "Sign Up"
4. Check confirmation email in staging mailbox
5. Click email confirmation link
6. Verify logged in to dashboard
7. Check user preferences page accessible

**✅ Expected**: User successfully created and logged in

### 2.2 Meditation Session

1. Navigate to Meditation module
2. Select "Calme" program
3. Select "5 minutes"
4. Click "Start"
5. Wait 10 seconds
6. Click "Pause"
7. Click "Resume"
8. Click "Reset"
9. Click "Start" again
10. Wait for auto-complete (5 min)

**✅ Expected**:
- Timer counts down correctly
- Pause/resume works
- Completion notification appears
- Session saved to database

### 2.3 Journal Entry

1. Navigate to Journal
2. Create text entry:
   - Add title: "Staging Test Entry"
   - Add content: "This is a test entry for validation"
   - Click "Save"
3. Verify entry appears in list
4. Click entry to view details
5. Verify can edit and delete

**✅ Expected**: Entry saved, retrieved, and displayed correctly

### 2.4 Data Export (GDPR)

1. Navigate to Settings → Privacy
2. Click "Export My Data"
3. Wait for generation (may take 1-2 minutes)
4. Download ZIP file
5. Verify contains:
   - User profile
   - All journal entries
   - Meditation history
   - Settings

**✅ Expected**: ZIP file contains all user data

---

## 🟠 Phase 3: Integration Tests (30 minutes)

### 3.1 API Endpoints

```bash
# Test critical API endpoints

# Get user profile
curl -H "Authorization: Bearer {token}" \
  https://api-staging.emotionscare.com/users/profile

# Get journal entries
curl -H "Authorization: Bearer {token}" \
  https://api-staging.emotionscare.com/journal

# Get meditation history
curl -H "Authorization: Bearer {token}" \
  https://api-staging.emotionscare.com/meditation/history
```

**✅ Expected**: All endpoints return 200 with valid data

### 3.2 File Uploads

1. Navigate to Journal → Photo
2. Upload test image (JPG, PNG)
3. Verify image displays
4. Check GPT-4 Vision analysis (if enabled)
5. Verify metadata saved

**✅ Expected**: Image uploaded, stored, and displayed

### 3.3 Real-time Features

1. Open app in 2 browser windows
2. In window 1, create meditation session
3. Check window 2 for notification
4. In window 1, add journal entry
5. Check if updates propagate (if using realtime)

**✅ Expected**: Changes appear across sessions

### 3.4 Performance

```javascript
// Measure page performance
window.performance.timing
// ❌ onload time > 3 seconds = investigate
// ❌ FCP > 1.5 seconds = optimize

// Check for memory leaks
console.memory
```

---

## 🔴 Phase 4: Load Testing (Automated)

### 4.1 K6 Load Tests

```bash
# Run basic load test
k6 run tests/load/k6-staging-tests.js \
  --env BASE_URL="https://staging.emotionscare.com" \
  --vus 50 \
  --duration 5m

# Expected metrics:
# - p95 response time < 1000ms
# - Error rate < 1%
# - Success rate > 99%
```

### 4.2 Lighthouse Audit

```bash
# Run automated Lighthouse
npm run lighthouse:ci

# Expected scores:
# - Performance: >= 85
# - Accessibility: >= 90
# - SEO: >= 90
# - Best Practices: >= 85
```

### 4.3 Security Scan

```bash
# Check security headers
curl -I https://staging.emotionscare.com | grep -E "X-|Strict|CSP|X-Frame"

# Expected headers:
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Strict-Transport-Security: present
# - Content-Security-Policy: present
```

---

## 📊 Phase 5: Monitoring Validation

### 5.1 Sentry Monitoring

1. Go to https://sentry.io/emotionscare/staging/
2. Check last 1 hour events:
   - No critical errors (threshold: < 10)
   - No spike in error rate
   - No new error patterns

**✅ Expected**: 0-5 errors from expected sources

### 5.2 Database Monitoring

```sql
-- Connect to staging Supabase

-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, mean_exec_time FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check replication lag
SELECT slot_name, restart_lsn FROM pg_replication_slots;
```

### 5.3 CDN & Cache

```bash
# Check cache headers
curl -I https://staging.emotionscare.com/main.js | grep -i "cache"

# Expected:
# - Cache-Control: public, max-age=31536000
# - CF-Cache-Status: HIT (or MISS for first request)
```

---

## 🧪 Phase 6: User Acceptance Testing (30 minutes)

### 6.1 Critical User Flows

**Flow 1: New User Onboarding**
- [ ] User registers
- [ ] Email verification works
- [ ] Onboarding completed
- [ ] Can start meditation
- [ ] Can create journal entry

**Flow 2: Returning User**
- [ ] User logs in
- [ ] Dashboard displays
- [ ] Previous data accessible
- [ ] Can create new entry
- [ ] Can export data

**Flow 3: Feature Usage**
- [ ] Music module loads
- [ ] Meditation works
- [ ] Journal accepts text/voice/photo
- [ ] Coach responds
- [ ] Notifications work

### 6.2 Edge Cases

- [ ] Network interruption → offline mode works
- [ ] Login expiration → redirect to login
- [ ] Very long sessions (1+ hours) → stable
- [ ] Large file uploads (10MB) → handled
- [ ] Mobile → responsive design works

---

## 📋 Phase 7: Sign-off Checklist

### Automated Checks
- [ ] All linting passes
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Bundle size < 500KB

### Health Checks
- [ ] Healthz endpoint responds
- [ ] API health endpoint responds
- [ ] Database connection works
- [ ] Redis connection works (if used)

### Smoke Tests
- [ ] Homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] Basic CRUD operations work
- [ ] API endpoints respond

### Load Testing
- [ ] P95 response time < 1000ms
- [ ] Error rate < 1%
- [ ] Can handle 50 concurrent users
- [ ] No memory leaks
- [ ] CPU usage < 80%

### Monitoring
- [ ] Sentry integration working
- [ ] No critical errors
- [ ] Performance metrics normal
- [ ] Database performance normal
- [ ] Cache hit rate > 80%

### Security
- [ ] HTTPS working
- [ ] Security headers present
- [ ] No exposed secrets
- [ ] CSP policy enforced
- [ ] XSS protection enabled

---

## ✅ Approval & Sign-off

**By**: DevOps / Release Manager
**Date**: ___________
**Status**: ⭕ Approved / ⭕ Needs Review / ⭕ Rejected

**Notes**:
```
_________________________________
_________________________________
_________________________________
```

**Next Steps**:
- [ ] Production deployment scheduled
- [ ] Stakeholders notified
- [ ] Release notes prepared
- [ ] Incident response plan reviewed

---

## 🔄 Rollback Procedure

If validation fails at any point:

```bash
# Immediate rollback
kubectl rollout undo deployment/emotionscare-staging

# Or manually redeploy previous version
docker pull [registry]/emotionscare:staging-previous
docker-compose up -d

# Verify rollback
curl -f https://staging.emotionscare.com/healthz.html
```

---

## 📞 Support Contacts

- **DevOps Lead**: @devops-lead
- **Backend Lead**: @backend-lead
- **Frontend Lead**: @frontend-lead
- **On-Call**: Check PagerDuty schedule

**Escalation**: Post in #incidents channel or page on-call
