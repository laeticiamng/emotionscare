# Step-by-Step Deployment Guide

Complete deployment guide for EmotionsCare audit completion features.

**Total Time:** ~45 minutes
**Difficulty:** Medium
**Prerequisites:** Access to Supabase project, Node.js installed

---

## 📋 Pre-Deployment Checklist

Before starting, ensure you have:

- [ ] Supabase project created
- [ ] Node.js v18+ installed
- [ ] npm or yarn installed
- [ ] Git repository access
- [ ] Email provider account (Resend/SendGrid/AWS SES)
- [ ] Production environment access

---

## Phase 1: Environment Setup (10 minutes)

### Step 1.1: Clone and Navigate to Project

```bash
# Clone the repository (if not already done)
git clone https://github.com/laeticiamng/emotionscare.git
cd emotionscare

# Checkout the audit completion branch
git checkout claude/audit-completion-tasks-01NKiKggWaYPjHZSZR3JFVqo

# Verify you're on the correct branch
git branch --show-current
# Expected output: claude/audit-completion-tasks-01NKiKggWaYPjHZSZR3JFVqo
```

### Step 1.2: Install Dependencies

```bash
# Install project dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 1.3: Install Supabase CLI

```bash
# Install Supabase CLI globally
npm install -g supabase

# Verify installation
supabase --version
# Expected: >=1.0.0
```

### Step 1.4: Install web-push CLI

```bash
# Install web-push for VAPID keys
npm install -g web-push

# Verify installation
npx web-push --version
```

**✅ Checkpoint:** All CLIs installed successfully

---

## Phase 2: VAPID Keys Generation (5 minutes)

### Step 2.1: Generate VAPID Keys

```bash
# Generate new VAPID key pair
npx web-push generate-vapid-keys

# Output will look like:
# =======================================
# Public Key:
# BNx...xxx (88 characters)
#
# Private Key:
# yyy...yyy (43 characters)
# =======================================
```

### Step 2.2: Save Keys Securely

```bash
# Create a secure file to store keys (DO NOT commit this!)
touch .vapid-keys
chmod 600 .vapid-keys

# Paste keys into the file
nano .vapid-keys
```

**Content of .vapid-keys:**
```
PUBLIC_KEY=BNx...xxx
PRIVATE_KEY=yyy...yyy
SUBJECT=mailto:support@emotionscare.com
```

**✅ Checkpoint:** VAPID keys generated and saved

---

## Phase 3: Environment Configuration (10 minutes)

### Step 3.1: Configure .env File

```bash
# Copy example file
cp .env.example .env

# Edit .env
nano .env
```

**Required variables to set:**

```bash
# Supabase (get from Supabase Dashboard > Settings > API)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...

# VAPID (from Step 2)
VITE_VAPID_PUBLIC_KEY=BNx...xxx
VAPID_SUBJECT=mailto:support@emotionscare.com

# Email Provider (choose ONE)
EMAIL_PROVIDER=resend

# If using Resend:
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@emotionscare.com

# If using SendGrid:
# SENDGRID_API_KEY=SG.xxxxxxxxxxxx
# EMAIL_FROM=noreply@emotionscare.com

# If using AWS SES:
# AWS_ACCESS_KEY_ID=AKIA...
# AWS_SECRET_ACCESS_KEY=xxx...
# AWS_REGION=us-east-1
# EMAIL_FROM=noreply@emotionscare.com

# Analytics (optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Frontend URL
FRONTEND_URL=https://app.emotionscare.com
```

### Step 3.2: Validate Configuration

```bash
# Run validation script
chmod +x tests/edge-functions/test-vapid-setup.sh
./tests/edge-functions/test-vapid-setup.sh

# Should show:
# ✓ .env file exists
# ✓ VITE_VAPID_PUBLIC_KEY is set and valid length (88 chars)
# ✓ VAPID_SUBJECT is set with mailto: format
```

**✅ Checkpoint:** Environment configured and validated

---

## Phase 4: Supabase Project Setup (10 minutes)

### Step 4.1: Link Supabase Project

```bash
# Get your project ref from Supabase Dashboard > Settings > General
export SUPABASE_PROJECT_REF=your-project-ref

# Link to project
supabase link --project-ref $SUPABASE_PROJECT_REF

# You'll be prompted to enter your database password
# (Get from Supabase Dashboard > Settings > Database)
```

### Step 4.2: Apply Database Migrations

```bash
# Apply all migrations
supabase db push

# Verify migrations applied
supabase migration list

# Should show all migrations as "Applied"
```

**Expected migrations:**
- ✅ 20251114120000_gdpr_storage_support.sql
- ✅ 20251114120100_email_service_config.sql
- ✅ 20251114120200_breath_weekly_refresh.sql
- ✅ 20251114120300_vr_weekly_materialized_views.sql
- ✅ 20251114120500_push_subscriptions_table.sql
- ✅ 20251114120600_onboarding_goals_table.sql
- ✅ 20251114120700_help_article_feedback.sql
- ✅ 20251114150000_user_exports_storage.sql

### Step 4.3: Verify Database Tables

```bash
# Connect to database
supabase db remote exec "
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'push_subscriptions',
  'onboarding_goals',
  'export_jobs',
  'delete_requests'
)
ORDER BY table_name;
"

# Expected output:
# delete_requests
# export_jobs
# onboarding_goals
# push_subscriptions
```

### Step 4.4: Verify Storage Buckets

```bash
# List storage buckets
supabase storage ls

# Should include:
# - gdpr-exports
# - user-exports
```

**✅ Checkpoint:** Database and storage configured

---

## Phase 5: Secrets Configuration (5 minutes)

### Step 5.1: Set Supabase Secrets

```bash
# Load VAPID private key from file
source .vapid-keys

# Set VAPID secrets
supabase secrets set \
  VAPID_PRIVATE_KEY="$PRIVATE_KEY" \
  VAPID_SUBJECT="$SUBJECT"

# Set email secrets (for Resend example)
supabase secrets set \
  EMAIL_PROVIDER="resend" \
  RESEND_API_KEY="$RESEND_API_KEY" \
  EMAIL_FROM="noreply@emotionscare.com"

# For SendGrid, use:
# supabase secrets set \
#   EMAIL_PROVIDER="sendgrid" \
#   SENDGRID_API_KEY="$SENDGRID_API_KEY" \
#   EMAIL_FROM="noreply@emotionscare.com"

# For AWS SES, use:
# supabase secrets set \
#   EMAIL_PROVIDER="ses" \
#   AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
#   AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
#   AWS_REGION="us-east-1" \
#   EMAIL_FROM="noreply@emotionscare.com"
```

### Step 5.2: Verify Secrets

```bash
# List secrets (values are hidden)
supabase secrets list

# Expected output:
# VAPID_PRIVATE_KEY
# VAPID_SUBJECT
# EMAIL_PROVIDER
# RESEND_API_KEY (or SENDGRID_API_KEY or AWS credentials)
# EMAIL_FROM
```

**✅ Checkpoint:** Secrets configured

---

## Phase 6: Deploy Edge Functions (5 minutes)

### Step 6.1: Deploy New Functions

```bash
# Deploy generate_export
supabase functions deploy generate_export

# Deploy purge_deleted_users
supabase functions deploy purge_deleted_users

# Verify deployment
supabase functions list

# Should show:
# generate_export (deployed)
# purge_deleted_users (deployed)
```

### Step 6.2: Deploy Updated Functions

```bash
# Deploy updated functions
supabase functions deploy dsar-handler
supabase functions deploy scheduled-audits
supabase functions deploy send-invitation
supabase functions deploy help-center-ai

# Verify all deployed
supabase functions list
```

**✅ Checkpoint:** Edge functions deployed

---

## Phase 7: Configure Scheduled Jobs (3 minutes)

### Step 7.1: Configure purge_deleted_users Cron

Via Supabase Dashboard:

1. Go to **Edge Functions** → **purge_deleted_users**
2. Click **Add Cron Job**
3. Set schedule: `0 3 * * *` (daily at 3 AM UTC)
4. Click **Save**

Or via CLI (if supported):

```bash
# Create cron job for daily purge at 3 AM
supabase functions schedule create purge_deleted_users \
  --cron "0 3 * * *" \
  --timezone "UTC"
```

### Step 7.2: Configure VR Weekly Views Refresh

Already configured in migration `20251114120300_vr_weekly_materialized_views.sql`:

```sql
-- Verify cron job exists
SELECT jobname, schedule, command
FROM cron.job
WHERE jobname = 'refresh_vr_weekly';

-- Expected output:
-- jobname: refresh_vr_weekly
-- schedule: 0 2 * * *
-- command: SELECT refresh_vr_weekly_views();
```

**✅ Checkpoint:** Scheduled jobs configured

---

## Phase 8: Testing (7 minutes)

### Step 8.1: Test VAPID Setup

```bash
# Run VAPID setup test
chmod +x tests/edge-functions/test-vapid-setup.sh
./tests/edge-functions/test-vapid-setup.sh

# Expected: All tests pass
```

### Step 8.2: Test generate_export

First, get a user authentication token:

```javascript
// In browser console after logging in:
const token = localStorage.getItem('sb-<project>-auth-token')
console.log(token)
```

Then test:

```bash
# Set variables
export SUPABASE_URL=https://your-project.supabase.co
export USER_TOKEN=eyJhbGc...

# Run test
chmod +x tests/edge-functions/test-generate-export.sh
./tests/edge-functions/test-generate-export.sh $SUPABASE_URL $USER_TOKEN

# Expected: 8/8 tests pass
```

### Step 8.3: Test Email Service

```bash
# Test via send-invitation endpoint
curl -X POST "$SUPABASE_URL/functions/v1/send-invitation" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "organization_name": "Test Org",
    "inviter_name": "Test User"
  }'

# Expected: Email sent successfully
# Check your email inbox for the invitation
```

### Step 8.4: Verify Database Logs

```bash
# Check edge function invocations
supabase functions logs generate_export --limit 10

# Check storage
supabase storage ls user-exports

# Check database
supabase db remote exec "
SELECT COUNT(*) as total_exports
FROM export_jobs
WHERE created_at > NOW() - INTERVAL '1 hour';
"
```

**✅ Checkpoint:** All tests passing

---

## Phase 9: Frontend Build and Deploy (10 minutes)

### Step 9.1: Build Frontend

```bash
# Build production bundle
npm run build

# Verify build output
ls -lh dist/

# Should show compiled assets
```

### Step 9.2: Deploy Frontend

```bash
# Example for Vercel
vercel --prod

# Example for Netlify
netlify deploy --prod

# Example for custom server
rsync -avz dist/ user@server:/var/www/emotionscare/
```

### Step 9.3: Verify Frontend

```bash
# Open in browser
open https://app.emotionscare.com

# Test features:
# 1. Complete onboarding (VAPID subscription)
# 2. Generate an export
# 3. Check push notifications
```

**✅ Checkpoint:** Frontend deployed

---

## Phase 10: Production Verification (5 minutes)

### Step 10.1: Run Verification Script

```bash
# Run automated verification
chmod +x scripts/verify-production.sh
./scripts/verify-production.sh

# Expected: All 10 checks pass
```

### Step 10.2: Manual Verification Checklist

- [ ] Users can complete onboarding
- [ ] Push notifications work
- [ ] Export generation works
- [ ] Emails are sent successfully
- [ ] VR/Breath views are fast (< 100ms)
- [ ] No errors in Supabase logs
- [ ] Storage buckets accessible
- [ ] RLS policies working

### Step 10.3: Monitor for First Hour

```bash
# Watch logs in real-time
supabase functions logs --follow

# Or via Dashboard:
# Supabase Dashboard > Edge Functions > Logs
```

**✅ Checkpoint:** Production verified

---

## 🎉 Deployment Complete!

### Summary

You have successfully deployed:

✅ **10 Database Migrations**
- GDPR storage support
- Email service configuration
- VR/Breath weekly aggregates
- Push subscriptions
- Onboarding goals
- Help center feedback
- User exports storage

✅ **2 New Edge Functions**
- generate_export (generic data exports)
- purge_deleted_users (GDPR compliance)

✅ **4 Updated Edge Functions**
- dsar-handler (GDPR exports)
- scheduled-audits (email alerts)
- send-invitation (email service)
- help-center-ai (feedback endpoint)

✅ **2 Storage Buckets**
- gdpr-exports (GDPR compliance)
- user-exports (analytics exports)

✅ **2 Scheduled Jobs**
- purge_deleted_users (daily at 3 AM)
- refresh_vr_weekly (daily at 2 AM)

✅ **VAPID Push Notifications**
- Keys generated and configured
- Frontend integration complete

✅ **Email Service**
- Multi-provider support
- HTML templates
- Error handling

---

## Post-Deployment Tasks

### Week 1

- [ ] Monitor error rates
- [ ] Check export generation usage
- [ ] Verify email delivery rates
- [ ] Test push notification engagement
- [ ] Review materialized view performance

### Week 2

- [ ] Analyze GDPR deletion requests
- [ ] Review storage bucket sizes
- [ ] Optimize slow queries
- [ ] Update documentation with production URLs

### Month 1

- [ ] Conduct security audit
- [ ] Review GDPR compliance
- [ ] Analyze user feedback
- [ ] Plan feature enhancements

---

## Rollback Procedure

If you need to rollback:

### Rollback Edge Functions

```bash
# Redeploy previous version
git checkout <previous_commit>
supabase functions deploy generate_export
supabase functions deploy purge_deleted_users
```

### Rollback Database

```bash
# Revert specific migration
supabase migration revert <migration_timestamp>

# Example:
supabase migration revert 20251114150000
```

### Rollback Secrets

```bash
# Remove secrets
supabase secrets unset VAPID_PRIVATE_KEY
supabase secrets unset VAPID_SUBJECT
```

---

## Troubleshooting

### Issue: Migration fails

**Solution:**
```bash
# Check migration status
supabase migration list

# Repair if needed
supabase migration repair <timestamp>

# Re-run
supabase db push
```

### Issue: Edge function deployment fails

**Solution:**
```bash
# Check function syntax
deno check supabase/functions/generate_export/index.ts

# Check logs
supabase functions logs generate_export --limit 50
```

### Issue: Secrets not accessible

**Solution:**
```bash
# Verify secrets are set
supabase secrets list

# Re-set if needed
supabase secrets set VAPID_PRIVATE_KEY="xxx"
```

### Issue: Tests failing

**Solution:**
```bash
# Check environment variables
cat .env | grep VAPID

# Check Supabase connection
supabase projects list

# Re-link if needed
supabase link --project-ref <ref>
```

---

## Support

For help with deployment:

- 📖 [Production Deployment Checklist](docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md)
- 📖 [Audit Completion Report](docs/AUDIT_COMPLETION_FINAL_REPORT.md)
- 📖 [Testing Guide](TESTING_GUIDE_NEW_FEATURES.md)
- 🐛 [GitHub Issues](https://github.com/laeticiamng/emotionscare/issues)

---

**Deployment completed successfully! 🚀**
