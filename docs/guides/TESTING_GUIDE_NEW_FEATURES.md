# Testing Guide - New Features

Complete testing guide for the newly implemented features in the audit completion PR.

---

## 📋 Table of Contents

1. [Setup Requirements](#setup-requirements)
2. [Testing generate_export Function](#testing-generate_export-function)
3. [Testing purge_deleted_users Function](#testing-purge_deleted_users-function)
4. [Testing VAPID Push Notifications](#testing-vapid-push-notifications)
5. [Testing Email Service](#testing-email-service)
6. [Testing Materialized Views](#testing-materialized-views)
7. [Testing Storage Buckets](#testing-storage-buckets)
8. [Integration Tests](#integration-tests)
9. [Troubleshooting](#troubleshooting)

---

## Setup Requirements

### Prerequisites

```bash
# Ensure you have:
- Node.js v18+ installed
- Supabase CLI installed (v1.x)
- Access to Supabase project
- Valid authentication token
- Environment variables configured

# Verify installations
node --version
npm --version
supabase --version
```

### Environment Configuration

```bash
# Copy and configure .env
cp .env.example .env

# Required variables for new features
VITE_VAPID_PUBLIC_KEY=<your_vapid_public_key>
VAPID_PRIVATE_KEY=<your_vapid_private_key>
VAPID_SUBJECT=mailto:support@emotionscare.com
EMAIL_PROVIDER=resend
RESEND_API_KEY=<your_resend_api_key>
EMAIL_FROM=noreply@emotionscare.com
```

### Apply Migrations

```bash
# Link to your Supabase project
supabase link --project-ref <your-project-ref>

# Apply all migrations
supabase db push

# OR use the consolidated script
psql -h db.<your-project>.supabase.co \
     -U postgres \
     -d postgres \
     -f scripts/apply-all-migrations.sql
```

---

## Testing generate_export Function

### Function Overview

**Endpoint:** `/functions/v1/generate_export`
**Method:** POST
**Authentication:** Required (user token)
**Purpose:** Generate exports for analytics, VR/Breath sessions, music history, emotional logs

### Test Case 1: Analytics Export (JSON)

```bash
# Get user authentication token first
# (Login to your app and copy the token from localStorage or network tab)

export USER_TOKEN="<your_user_auth_token>"
export SUPABASE_URL="https://<your-project>.supabase.co"

curl -X POST "${SUPABASE_URL}/functions/v1/generate_export" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "export_type": "analytics",
    "date_from": "2025-10-01T00:00:00Z",
    "date_to": "2025-11-14T23:59:59Z",
    "format": "json"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "export_type": "analytics",
  "format": "json",
  "download_url": "https://...<signed_url>...",
  "file_name": "analytics-<user_id>-<timestamp>.json",
  "record_count": 42,
  "generated_at": "2025-11-14T15:30:00.000Z"
}
```

**Validation:**
- ✅ Response status: 200
- ✅ `success: true`
- ✅ `download_url` is a valid signed URL
- ✅ File name includes user_id and timestamp
- ✅ `record_count` reflects actual data

### Test Case 2: VR Sessions Export (CSV)

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/generate_export" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "export_type": "vr_sessions",
    "date_from": "2025-11-01T00:00:00Z",
    "date_to": "2025-11-14T23:59:59Z",
    "format": "csv"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "export_type": "vr_sessions",
  "format": "csv",
  "download_url": "https://...<signed_url>...",
  "file_name": "vr-sessions-<user_id>-<timestamp>.csv",
  "record_count": 15,
  "generated_at": "2025-11-14T15:35:00.000Z"
}
```

**Download and Verify:**
```bash
# Download the export
curl "${download_url}" -o export.csv

# Verify CSV format
cat export.csv | head -20

# Expected CSV structure:
# Export Type: vr_sessions
# User ID: <user_id>
# Generated At: <timestamp>
# Date Range: ... to ...
#
# Sessions:
# ID,Created At,Duration,Type,Metadata
# "uuid-1","2025-11-01T10:00:00Z","1200","relaxation","{...}"
```

### Test Case 3: Breath Sessions Export

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/generate_export" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "export_type": "breath_sessions",
    "format": "json"
  }'
```

### Test Case 4: Music History Export

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/generate_export" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "export_type": "music_history",
    "format": "json"
  }'
```

### Test Case 5: Emotional Logs Export

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/generate_export" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "export_type": "emotional_logs",
    "format": "csv"
  }'
```

### Test Case 6: Invalid Export Type (Error Handling)

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/generate_export" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "export_type": "invalid_type",
    "format": "json"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid export type",
  "allowed_types": [
    "analytics",
    "vr_sessions",
    "breath_sessions",
    "music_history",
    "emotional_logs",
    "custom"
  ]
}
```

### Test Case 7: Unauthorized Access

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/generate_export" \
  -H "Content-Type: application/json" \
  -d '{
    "export_type": "analytics",
    "format": "json"
  }'
```

**Expected Response:**
```json
{
  "error": "Authorization required"
}
```

**Status Code:** 401

### Verify in Database

```sql
-- Check export_jobs table
SELECT * FROM export_jobs
WHERE user_id = '<your_user_id>'
ORDER BY created_at DESC
LIMIT 5;

-- Verify export was logged
-- Should show:
-- - export_type: 'analytics', 'vr_sessions', etc.
-- - status: 'completed'
-- - format: 'json' or 'csv'
-- - file_path: filename in storage
-- - completed_at: timestamp
```

### Verify in Storage

```bash
# Via Supabase Dashboard:
# Storage → user-exports bucket → Check for files

# Via CLI:
supabase storage ls user-exports

# Download a file to verify
supabase storage download user-exports/<file_name> -
```

---

## Testing purge_deleted_users Function

### Function Overview

**Endpoint:** `/functions/v1/purge_deleted_users`
**Method:** POST
**Authentication:** Required (SERVICE_ROLE_KEY only)
**Purpose:** GDPR Article 17 - Right to Erasure
**Execution:** Should be configured as cron job (daily at 3 AM)

### ⚠️ WARNING

This function **permanently deletes user data**. Only test in a development/staging environment with test data.

### Setup Test Data

```sql
-- Create a test user deletion request
-- First, get a test user ID
SELECT id, email FROM auth.users WHERE email LIKE '%test%' LIMIT 1;

-- Create deletion request with immediate purge time (for testing)
INSERT INTO delete_requests (user_id_hash, requested_at, purge_at)
VALUES (
  '<test_user_id>',
  NOW(),
  NOW() - INTERVAL '1 day'  -- Set to past so it processes immediately
);

-- Verify request was created
SELECT * FROM delete_requests WHERE user_id_hash = '<test_user_id>';
```

### Test Case 1: Successful Purge

```bash
export SERVICE_ROLE_KEY="<your_service_role_key>"
export SUPABASE_URL="https://<your-project>.supabase.co"

curl -X POST "${SUPABASE_URL}/functions/v1/purge_deleted_users" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Purge completed. Purged: 1, Failed: 0",
  "total": 1,
  "purged": 1,
  "failed": 0,
  "errors": []
}
```

### Test Case 2: No Users to Purge

```bash
# Run again immediately after successful purge
curl -X POST "${SUPABASE_URL}/functions/v1/purge_deleted_users" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "No users to purge",
  "purged_count": 0
}
```

### Verify Data Deletion

```sql
-- Check that user data was deleted from all tables
SELECT COUNT(*) FROM user_consent_preferences WHERE user_id = '<test_user_id>';
-- Expected: 0

SELECT COUNT(*) FROM user_music_preferences WHERE user_id = '<test_user_id>';
-- Expected: 0

SELECT COUNT(*) FROM vr_sessions WHERE user_id = '<test_user_id>';
-- Expected: 0

SELECT COUNT(*) FROM breath_sessions WHERE user_id = '<test_user_id>';
-- Expected: 0

SELECT COUNT(*) FROM emotional_check_ins WHERE user_id = '<test_user_id>';
-- Expected: 0

SELECT COUNT(*) FROM export_jobs WHERE user_id_hash = '<test_user_id>';
-- Expected: 0

SELECT COUNT(*) FROM push_subscriptions WHERE user_id = '<test_user_id>';
-- Expected: 0

SELECT COUNT(*) FROM onboarding_goals WHERE user_id = '<test_user_id>';
-- Expected: 0

-- Check that audit logs were ANONYMIZED (not deleted)
SELECT * FROM audit_logs WHERE user_id = 'DELETED_USER' LIMIT 5;
-- Expected: Contains previously user-specific logs, now anonymized

-- Check that consent logs were ANONYMIZED
SELECT * FROM consent_logs WHERE user_id = 'DELETED_USER' LIMIT 5;
-- Expected: user_id = 'DELETED_USER', email = 'deleted@anonymized.local'

-- Check purge was logged
SELECT * FROM audit_logs
WHERE action = 'USER_PURGED'
ORDER BY timestamp DESC
LIMIT 1;
-- Expected: Contains details about the purge

-- Check deletion request was removed
SELECT COUNT(*) FROM delete_requests WHERE user_id_hash = '<test_user_id>';
-- Expected: 0

-- Check user was deleted from auth.users
SELECT COUNT(*) FROM auth.users WHERE id = '<test_user_id>';
-- Expected: 0
```

### Verify Storage Deletion

```bash
# Check that user files were deleted
supabase storage ls gdpr-exports | grep '<test_user_id>'
# Expected: No results

supabase storage ls user-exports | grep '<test_user_id>'
# Expected: No results
```

### Configure Cron Job (Production)

```bash
# Via Supabase Dashboard:
# 1. Go to Edge Functions
# 2. Select purge_deleted_users
# 3. Configure Cron: 0 3 * * * (daily at 3 AM UTC)

# Or via CLI (if supported):
supabase functions schedule create purge_deleted_users \
  --cron "0 3 * * *" \
  --project-ref <your-project-ref>
```

---

## Testing VAPID Push Notifications

### Generate VAPID Keys

```bash
# Generate new VAPID key pair
npx web-push generate-vapid-keys

# Output:
# =======================================
# Public Key:
# BNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#
# Private Key:
# yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
# =======================================
```

### Configure Environment

```bash
# Frontend (.env)
VITE_VAPID_PUBLIC_KEY="BNxxx...xxx"

# Backend (Supabase secrets)
supabase secrets set \
  VAPID_PRIVATE_KEY="yyyyyyyy" \
  VAPID_SUBJECT="mailto:support@emotionscare.com"
```

### Test Case 1: Request Push Permission

```typescript
// In browser console or test app
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Push notifications supported');

  // Register service worker
  const registration = await navigator.serviceWorker.register('/sw.js');
  console.log('Service Worker registered:', registration);

  // Request notification permission
  const permission = await Notification.requestPermission();
  console.log('Notification permission:', permission);
  // Expected: 'granted', 'denied', or 'default'
} else {
  console.error('Push notifications not supported');
}
```

### Test Case 2: Subscribe to Push

```typescript
// In your app's onboarding flow
import { useOnboarding } from '@/hooks/useOnboarding';

const { enableNotifications } = useOnboarding();

// User clicks "Enable Notifications"
const success = await enableNotifications();
console.log('Notifications enabled:', success);
// Expected: true
```

### Verify in Database

```sql
-- Check push_subscriptions table
SELECT * FROM push_subscriptions
WHERE user_id = '<your_user_id>'
ORDER BY created_at DESC
LIMIT 1;

-- Should contain:
-- - endpoint: Push service URL
-- - p256dh: Public key
-- - auth: Auth secret
-- - user_agent: Browser info
```

### Test Case 3: Send Test Notification

```typescript
// Backend test (Node.js script)
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:support@emotionscare.com',
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Get subscription from database
const subscription = {
  endpoint: '...',
  keys: {
    p256dh: '...',
    auth: '...'
  }
};

const payload = JSON.stringify({
  title: 'Test Notification',
  body: 'VAPID push notification is working!',
  icon: '/logo.png'
});

try {
  await webpush.sendNotification(subscription, payload);
  console.log('✅ Push notification sent successfully');
} catch (error) {
  console.error('❌ Push notification failed:', error);
}
```

---

## Testing Email Service

### Test Case 1: Scheduled Audit Email (Resend)

```bash
# Configure email service
export EMAIL_PROVIDER=resend
export RESEND_API_KEY=re_xxxxxxxxxx
export EMAIL_FROM=noreply@emotionscare.com

# Trigger scheduled-audits function
curl -X POST "${SUPABASE_URL}/functions/v1/scheduled-audits" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}"
```

**Expected:**
- Email sent to configured admin addresses
- Subject: "🔔 Alerte Audit de Conformité - ..."
- Contains HTML formatted content
- Audit data in email body

### Test Case 2: Invitation Email

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/send-invitation" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "organization_name": "Test Organization",
    "inviter_name": "John Doe"
  }'
```

**Expected:**
- Email sent to test@example.com
- Subject: "Invitation to join Test Organization"
- Contains invitation link
- Professional HTML template

### Test with Different Providers

```bash
# Test with SendGrid
export EMAIL_PROVIDER=sendgrid
export SENDGRID_API_KEY=SG.xxxxxxxxxx
# Test invitation again

# Test with AWS SES
export EMAIL_PROVIDER=ses
export AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxx
export AWS_SECRET_ACCESS_KEY=xxxxxxxxxx
export AWS_REGION=us-east-1
# Test invitation again
```

### Verify Email Logs

```sql
-- Check audit_logs for email events
SELECT * FROM audit_logs
WHERE action LIKE '%EMAIL%'
ORDER BY timestamp DESC
LIMIT 10;
```

---

## Testing Materialized Views

### Test Case 1: VR Weekly Aggregates Performance

```sql
-- Before (slow query on raw data)
EXPLAIN ANALYZE
SELECT
  user_id,
  DATE_TRUNC('week', created_at) AS week,
  COUNT(*) AS session_count,
  AVG(duration) AS avg_duration
FROM vr_sessions
WHERE user_id = '<test_user_id>'
  AND created_at >= NOW() - INTERVAL '3 months'
GROUP BY user_id, DATE_TRUNC('week', created_at)
ORDER BY week DESC;

-- Note the execution time (e.g., 250ms)

-- After (fast query on materialized view)
EXPLAIN ANALYZE
SELECT *
FROM vr_combined_weekly_user
WHERE user_id = '<test_user_id>'
  AND week_start >= NOW() - INTERVAL '3 months'
ORDER BY week_start DESC;

-- Note the execution time (e.g., 5ms)
-- Expected: 10-100x faster
```

### Test Case 2: Verify View Data

```sql
-- Check vr_combined_weekly_user
SELECT * FROM vr_combined_weekly_user
WHERE user_id = '<test_user_id>'
ORDER BY week_start DESC
LIMIT 5;

-- Should show aggregated data:
-- - week_start
-- - total_sessions (nature + detente combined)
-- - avg_duration
-- - total_duration
-- - peak_frequency
-- - stress_reduction_avg
```

### Test Case 3: Refresh Materialized Views

```sql
-- Manual refresh
REFRESH MATERIALIZED VIEW CONCURRENTLY vr_combined_weekly_user;
REFRESH MATERIALIZED VIEW CONCURRENTLY vr_nature_weekly_user;
REFRESH MATERIALIZED VIEW CONCURRENTLY vr_detente_weekly_user;
REFRESH MATERIALIZED VIEW CONCURRENTLY vr_detente_weekly_org;

-- Or use the refresh function
SELECT refresh_vr_weekly_views();
-- Expected: Returns 'Refreshed all VR weekly materialized views'
```

### Test Case 4: Automated Refresh (Cron)

```sql
-- Check pg_cron configuration
SELECT * FROM cron.job WHERE jobname = 'refresh_vr_weekly';

-- Expected:
-- schedule: '0 2 * * *' (daily at 2 AM)
-- command: 'SELECT refresh_vr_weekly_views();'
```

---

## Testing Storage Buckets

### Test Case 1: GDPR Exports Bucket

```bash
# List buckets
supabase storage list

# Check gdpr-exports bucket exists
supabase storage ls gdpr-exports

# Test upload (as service role)
echo '{"test": "data"}' > test-export.json
supabase storage upload gdpr-exports test-export.json

# Test download
supabase storage download gdpr-exports test-export.json

# Clean up
supabase storage rm gdpr-exports test-export.json
```

### Test Case 2: User Exports Bucket

```bash
# Check user-exports bucket exists
supabase storage ls user-exports

# Should be empty initially (populated by generate_export function)
```

### Test Case 3: Storage Policies

```sql
-- Verify RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'objects' AND schemaname = 'storage';
-- Expected: rowsecurity = true

-- Check policies
SELECT
  policyname,
  tablename,
  roles
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Expected policies:
-- - Users can upload their own exports
-- - Users can read their own exports
-- - Users can delete their own exports
-- - Service role can manage all exports
```

---

## Integration Tests

### End-to-End Test: Complete GDPR Export Flow

```bash
#!/bin/bash
# test-gdpr-flow.sh

# 1. Request DSAR (Data Subject Access Request)
echo "1. Requesting DSAR..."
DSAR_RESPONSE=$(curl -X POST "${SUPABASE_URL}/functions/v1/dsar-handler/generate-package" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"requestId": "'$REQUEST_ID'"}')

echo "$DSAR_RESPONSE"

# 2. Verify export in storage
PACKAGE_URL=$(echo "$DSAR_RESPONSE" | jq -r '.package_url')
echo "2. Package URL: $PACKAGE_URL"

# 3. Download export
echo "3. Downloading export..."
curl "$PACKAGE_URL" -o gdpr-export.json

# 4. Verify export contents
echo "4. Verifying export contents..."
cat gdpr-export.json | jq .

# 5. Check export_jobs table
echo "5. Checking export_jobs table..."
# (Run SQL query)

echo "✅ GDPR export flow test complete"
```

### End-to-End Test: User Deletion Flow

```bash
#!/bin/bash
# test-deletion-flow.sh

TEST_USER_ID="<test_user_id>"

# 1. Create deletion request
echo "1. Creating deletion request..."
psql -c "INSERT INTO delete_requests (user_id_hash, requested_at, purge_at) VALUES ('$TEST_USER_ID', NOW(), NOW() - INTERVAL '1 day');"

# 2. Run purge function
echo "2. Running purge function..."
PURGE_RESPONSE=$(curl -X POST "${SUPABASE_URL}/functions/v1/purge_deleted_users" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}")

echo "$PURGE_RESPONSE"

# 3. Verify deletion
echo "3. Verifying user data deletion..."
psql -c "SELECT COUNT(*) FROM auth.users WHERE id = '$TEST_USER_ID';"
# Expected: 0

# 4. Verify anonymization
echo "4. Verifying data anonymization..."
psql -c "SELECT COUNT(*) FROM audit_logs WHERE user_id = 'DELETED_USER';"
# Expected: > 0 (anonymized records)

echo "✅ User deletion flow test complete"
```

---

## Troubleshooting

### Issue: generate_export returns 401

**Solution:**
```bash
# Verify token is valid
curl "${SUPABASE_URL}/auth/v1/user" \
  -H "Authorization: Bearer ${USER_TOKEN}"

# If expired, get new token by logging in
```

### Issue: purge_deleted_users fails with "No users to purge"

**Solution:**
```sql
-- Check purge_at date
SELECT user_id_hash, purge_at, NOW()
FROM delete_requests;

-- Ensure purge_at is in the past
UPDATE delete_requests
SET purge_at = NOW() - INTERVAL '1 day'
WHERE user_id_hash = '<test_user_id>';
```

### Issue: VAPID subscription fails

**Solution:**
```javascript
// Check VAPID key format
console.log('VAPID key length:', import.meta.env.VITE_VAPID_PUBLIC_KEY.length);
// Expected: 88 characters

// Verify service worker is registered
navigator.serviceWorker.ready.then(registration => {
  console.log('Service Worker ready:', registration);
});

// Check browser console for errors
```

### Issue: Email not sending

**Solution:**
```bash
# Verify environment variables
echo $EMAIL_PROVIDER
echo $RESEND_API_KEY
echo $EMAIL_FROM

# Check Supabase secrets
supabase secrets list

# Test API key directly
curl https://api.resend.com/emails \
  -H "Authorization: Bearer ${RESEND_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "'$EMAIL_FROM'",
    "to": "test@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

### Issue: Materialized views not refreshing

**Solution:**
```sql
-- Check cron job exists
SELECT * FROM cron.job;

-- Manually refresh
REFRESH MATERIALIZED VIEW CONCURRENTLY vr_combined_weekly_user;

-- Check for errors
SELECT jobname, status, message
FROM cron.job_run_details
WHERE jobname = 'refresh_vr_weekly'
ORDER BY start_time DESC
LIMIT 5;
```

### Issue: Storage upload fails

**Solution:**
```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id IN ('gdpr-exports', 'user-exports');

-- Check policies
SELECT * FROM storage.objects LIMIT 1;

-- Verify RLS policies
SELECT policyname FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';
```

---

## Test Results Template

Use this template to document your test results:

```markdown
## Test Results - [Date]

### generate_export Function
- [ ] Analytics export (JSON) - PASS/FAIL
- [ ] VR sessions export (CSV) - PASS/FAIL
- [ ] Breath sessions export - PASS/FAIL
- [ ] Music history export - PASS/FAIL
- [ ] Emotional logs export - PASS/FAIL
- [ ] Error handling (invalid type) - PASS/FAIL
- [ ] Authentication check - PASS/FAIL

### purge_deleted_users Function
- [ ] Successful purge - PASS/FAIL
- [ ] No users to purge - PASS/FAIL
- [ ] Data deletion verification - PASS/FAIL
- [ ] Anonymization verification - PASS/FAIL
- [ ] Storage deletion verification - PASS/FAIL

### VAPID Push Notifications
- [ ] Keys generation - PASS/FAIL
- [ ] Service worker registration - PASS/FAIL
- [ ] Push subscription - PASS/FAIL
- [ ] Database verification - PASS/FAIL
- [ ] Test notification - PASS/FAIL

### Email Service
- [ ] Scheduled audit email - PASS/FAIL
- [ ] Invitation email - PASS/FAIL
- [ ] Multiple providers - PASS/FAIL

### Materialized Views
- [ ] Performance improvement - PASS/FAIL
- [ ] Data accuracy - PASS/FAIL
- [ ] Manual refresh - PASS/FAIL
- [ ] Automated refresh - PASS/FAIL

### Storage Buckets
- [ ] gdpr-exports bucket - PASS/FAIL
- [ ] user-exports bucket - PASS/FAIL
- [ ] RLS policies - PASS/FAIL

### Notes:
[Add any additional observations or issues found during testing]
```

---

## Continuous Monitoring

### Production Monitoring Checklist

```bash
# Daily checks
- [ ] Check purge_deleted_users logs
- [ ] Verify cron jobs are running
- [ ] Monitor storage bucket sizes
- [ ] Check for failed exports

# Weekly checks
- [ ] Review email delivery rates
- [ ] Analyze export request patterns
- [ ] Check materialized view refresh times
- [ ] Audit GDPR compliance metrics

# Monthly checks
- [ ] Review deleted user counts
- [ ] Analyze push notification engagement
- [ ] Storage cleanup audit
- [ ] Performance benchmarks
```

---

**Happy Testing! 🧪**

For issues or questions, refer to:
- `docs/AUDIT_COMPLETION_FINAL_REPORT.md`
- `docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md`
- `PULL_REQUEST_AUDIT_COMPLETION.md`
