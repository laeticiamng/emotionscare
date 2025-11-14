# Edge Functions Test Scripts - New Features

Automated test scripts for the newly implemented edge functions (audit completion).

## 📋 Available Tests

### 1. test-generate-export.sh
Tests the `generate_export` edge function with multiple export types and formats.

**Usage:**
```bash
chmod +x test-generate-export.sh
./test-generate-export.sh <supabase_url> <user_token>
```

**Example:**
```bash
./test-generate-export.sh https://abc.supabase.co eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Tests performed:**
- ✅ Analytics export (JSON)
- ✅ VR sessions export (JSON)
- ✅ VR sessions export (CSV)
- ✅ Breath sessions export
- ✅ Music history export
- ✅ Emotional logs export
- ✅ Invalid export type (error handling)
- ✅ Unauthorized access (authentication check)

**Requirements:**
- `curl` installed
- `jq` installed (for JSON parsing)
- Valid user authentication token

**Getting a user token:**
```javascript
// In browser console after logging in:
localStorage.getItem('sb-<project>-auth-token')

// Or from network tab:
// Look for Authorization header in any API request
```

---

### 2. test-purge-deleted-users.sh
Tests the `purge_deleted_users` edge function for GDPR compliance.

⚠️ **WARNING**: This function PERMANENTLY DELETES user data. Only use in dev/staging!

**Usage:**
```bash
chmod +x test-purge-deleted-users.sh
./test-purge-deleted-users.sh <supabase_url> <service_role_key> <test_user_id>
```

**Example:**
```bash
./test-purge-deleted-users.sh \
  https://abc.supabase.co \
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... \
  550e8400-e29b-41d4-a716-446655440000
```

**Tests performed:**
- ✅ Create deletion request
- ✅ Run purge function
- ✅ Verify data deletion
- ✅ Verify data anonymization
- ✅ Run purge again (should find no users)
- ✅ Unauthorized access check

**Requirements:**
- `curl` installed
- `jq` installed
- Valid service role key (NOT user token)
- Test user with data to delete
- Access to run SQL queries for verification

**Setup:**
Before running, create a deletion request:
```sql
INSERT INTO delete_requests (user_id_hash, requested_at, purge_at)
VALUES (
  '<test_user_id>',
  NOW(),
  NOW() - INTERVAL '1 day'
);
```

---

### 3. test-vapid-setup.sh
Validates VAPID push notifications configuration.

**Usage:**
```bash
chmod +x test-vapid-setup.sh
./test-vapid-setup.sh
```

**Tests performed:**
- ✅ web-push CLI installation
- ✅ Environment variables (.env)
- ✅ VAPID key format validation
- ✅ Supabase secrets configuration
- ✅ Database table existence
- ✅ Migration file presence
- ✅ Frontend integration check

**Requirements:**
- Node.js and npm installed
- Supabase CLI installed (optional, for secrets check)
- .env file configured

---

## 🚀 Quick Start

### Install Dependencies

```bash
# Install jq (JSON processor)
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Fedora
sudo dnf install jq

# Windows (via Chocolatey)
choco install jq
```

### Make Scripts Executable

```bash
chmod +x test-generate-export.sh
chmod +x test-purge-deleted-users.sh
chmod +x test-vapid-setup.sh
```

### Run All Tests

```bash
# 1. Test VAPID setup (no arguments needed)
./test-vapid-setup.sh

# 2. Test generate_export (requires user token)
./test-generate-export.sh https://your-project.supabase.co <your_user_token>

# 3. Test purge_deleted_users (⚠️ DESTRUCTIVE - dev/staging only!)
# Create deletion request first (see above)
./test-purge-deleted-users.sh https://your-project.supabase.co <service_role_key> <test_user_id>
```

---

## 📊 Test Output

### Success Example
```
🧪 Testing generate_export Edge Function
========================================

Testing: Analytics export (JSON)... ✓ PASS (HTTP 200)
    ↳ Success: true
    ↳ File: analytics-550e8400-1731599400000.json
    ↳ Download URL: https://abc.supabase.co/storage/v1/object/sign...

Testing: VR sessions export (CSV)... ✓ PASS (HTTP 200)
    ↳ Success: true
    ↳ File: vr-sessions-550e8400-1731599401000.csv
    ↳ Download URL: https://abc.supabase.co/storage/v1/object/sign...

========================================
Test Summary:
  Passed: 8
  Failed: 0
========================================
✓ All tests passed!
```

### Failure Example
```
Testing: Analytics export (JSON)... ✗ FAIL (Expected 200, got 401)
    ↳ Response: {"error":"Authorization required"}

========================================
Test Summary:
  Passed: 0
  Failed: 1
========================================
✗ Some tests failed
```

---

## 🔧 Troubleshooting

### Error: "curl: command not found"
```bash
# Install curl
# macOS (should be pre-installed)
# Ubuntu/Debian
sudo apt-get install curl
```

### Error: "jq: command not found"
```bash
# Install jq (see Install Dependencies above)
```

### Error: "401 Unauthorized"
**Problem:** Invalid or expired authentication token

**Solution:**
1. Get a fresh token by logging into your app
2. Copy the token from localStorage or network tab
3. Ensure you're using the correct token type:
   - User token for generate_export
   - Service role key for purge_deleted_users

### Error: "No users to purge"
**Problem:** No deletion requests ready to process

**Solution:**
1. Create a deletion request with SQL (see setup above)
2. Ensure `purge_at` is in the past
3. Verify the user_id_hash matches your test user

### Error: "Storage upload failed"
**Problem:** Storage bucket doesn't exist or has incorrect permissions

**Solution:**
```bash
# Apply storage migration
supabase db push

# Or run specific migration
psql -f supabase/migrations/20251114150000_user_exports_storage.sql
```

---

## 📝 Test Checklist

Use this checklist to track your testing progress:

### Pre-deployment Testing
- [ ] Run test-vapid-setup.sh
- [ ] Fix any VAPID configuration warnings
- [ ] Run test-generate-export.sh with user token
- [ ] Verify all 8 tests pass
- [ ] Download and inspect an export file
- [ ] Create test deletion request in dev/staging
- [ ] Run test-purge-deleted-users.sh
- [ ] Verify data deletion with SQL queries
- [ ] Verify data anonymization

### Post-deployment Testing (Production)
- [ ] Test generate_export with real user
- [ ] Verify export downloads correctly
- [ ] Verify exports logged in export_jobs
- [ ] Test push notification subscription
- [ ] Verify subscription saved in push_subscriptions
- [ ] Configure purge_deleted_users cron job
- [ ] Monitor logs for any errors

---

## 🔗 Related Documentation

- [Testing Guide](../../TESTING_GUIDE_NEW_FEATURES.md) - Comprehensive manual testing guide
- [Validation Report](../../EDGE_FUNCTIONS_VALIDATION_REPORT.md) - Automated validation results
- [Pull Request](../../PULL_REQUEST_AUDIT_COMPLETION.md) - Complete PR documentation
- [VAPID Setup](../../docs/VAPID_KEYS_SETUP.md) - VAPID configuration guide
- [Production Deployment](../../docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md) - Deployment guide

---

## 💡 Tips

### Debugging Failed Tests

1. **Enable verbose curl output:**
```bash
# Add -v flag to curl commands in scripts
curl -v -X POST ...
```

2. **Check edge function logs:**
```bash
supabase functions logs generate_export
supabase functions logs purge_deleted_users
```

3. **Verify database state:**
```sql
-- Check export_jobs
SELECT * FROM export_jobs ORDER BY created_at DESC LIMIT 5;

-- Check push_subscriptions
SELECT * FROM push_subscriptions ORDER BY created_at DESC LIMIT 5;

-- Check delete_requests
SELECT * FROM delete_requests;
```

### Running Tests in CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Test Edge Functions
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    USER_TOKEN: ${{ secrets.TEST_USER_TOKEN }}
    SERVICE_ROLE_KEY: ${{ secrets.SERVICE_ROLE_KEY }}
  run: |
    chmod +x tests/edge-functions/*.sh
    ./tests/edge-functions/test-vapid-setup.sh
    ./tests/edge-functions/test-generate-export.sh $SUPABASE_URL $USER_TOKEN
```

### Creating Test Data

```sql
-- Create test user with data
INSERT INTO vr_sessions (user_id, session_type, duration)
VALUES ('<test_user_id>', 'nature', 1200);

INSERT INTO breath_sessions (user_id, technique, duration)
VALUES ('<test_user_id>', 'box_breathing', 300);

INSERT INTO user_music_preferences (user_id, genre)
VALUES ('<test_user_id>', 'ambient');
```

---

## ✅ Success Criteria

All tests should pass with:
- ✅ 0 failed tests
- ✅ All HTTP status codes as expected
- ✅ Valid JSON responses
- ✅ Download URLs accessible
- ✅ Data correctly saved to database
- ✅ No errors in edge function logs

---

**Happy Testing! 🧪**
