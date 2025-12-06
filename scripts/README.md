# 🛠️ EmotionsCare Deployment Scripts

This directory contains automated scripts to facilitate production deployment and verification.

---

## 📁 Available Scripts

### 1. `setup-production.sh` - Automated Production Setup
**Purpose:** Automates the complete production setup process

**What it does:**
- ✅ Checks Node.js and npm versions
- ✅ Installs/verifies Supabase CLI
- ✅ Generates VAPID keys (if needed)
- ✅ Validates email provider configuration
- ✅ Links to Supabase project
- ✅ Applies database migrations
- ✅ Sets Supabase secrets automatically
- ✅ Provides next steps

**Usage:**
```bash
# 1. Configure your .env file first
cp .env.example .env
# Edit .env with your values

# 2. Make script executable
chmod +x scripts/setup-production.sh

# 3. Run the script
./scripts/setup-production.sh
```

**Estimated time:** 5-10 minutes (with user input)

**Prerequisites:**
- `.env` file configured
- Supabase project created
- Node.js and npm installed

---

### 2. `verify-production.sh` - Production Verification
**Purpose:** Verifies that all production components are correctly configured

**What it checks:**
- ✅ Environment variables (required and optional)
- ✅ Supabase connection
- ✅ Database tables existence
- ✅ Materialized views
- ✅ Storage buckets
- ✅ Edge functions responsiveness
- ✅ Supabase secrets
- ✅ Node.js dependencies
- ✅ Build configuration
- ✅ Documentation completeness

**Usage:**
```bash
# Make script executable
chmod +x scripts/verify-production.sh

# Run verification
./scripts/verify-production.sh
```

**Output:**
- ✅ Green checkmarks for passed checks
- ⚠️ Yellow warnings for non-critical issues
- ❌ Red errors for critical issues

**Exit codes:**
- `0` - All checks passed
- `1` - Critical errors found

---

### 3. `apply-all-migrations.sql` - Consolidated Migrations
**Purpose:** Single SQL file containing all audit completion migrations

**What it includes:**
1. GDPR storage support (bucket + columns)
2. Audit notifications tracking (message_id, error_message)
3. Invitations error tracking
4. VR weekly materialized views (4 views)
5. Breath weekly refresh functions
6. Push subscriptions table
7. Onboarding goals table
8. Help article feedback table

**Usage:**

**Option A: Via Supabase Dashboard**
```
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy-paste entire file
5. Run query
```

**Option B: Via Supabase CLI**
```bash
supabase db push
```

**Duration:** 1-2 minutes

**Output:** Progress messages with ✅ checkmarks

---

## 🚀 Quick Start Guide

### First-Time Setup (10 minutes)

```bash
# 1. Clone and configure
git clone <repo>
cd emotionscare
cp .env.example .env
# Edit .env with your values

# 2. Run automated setup
chmod +x scripts/setup-production.sh
./scripts/setup-production.sh

# 3. Apply SQL migrations
# Copy scripts/apply-all-migrations.sql to Supabase SQL Editor
# Or use: supabase db push

# 4. Verify everything
chmod +x scripts/verify-production.sh
./scripts/verify-production.sh

# 5. Deploy!
npm run build
```

---

## 📊 Detailed Workflow

### Development Environment
```bash
# 1. Install dependencies
npm install

# 2. Configure local .env
cp .env.example .env

# 3. Start local Supabase (optional)
supabase start

# 4. Run dev server
npm run dev
```

### Staging Environment
```bash
# 1. Configure .env for staging
FRONTEND_URL=https://staging.emotionscare.com

# 2. Run setup script
./scripts/setup-production.sh

# 3. Deploy to staging
npm run build
# Upload to staging server

# 4. Verify
./scripts/verify-production.sh
```

### Production Environment
```bash
# 1. Configure .env for production
FRONTEND_URL=https://app.emotionscare.com
VITE_GA_MEASUREMENT_ID=G-PROD-ID
# Use production API keys

# 2. Run setup script
./scripts/setup-production.sh

# 3. Apply migrations via dashboard
# (More control than CLI for production)

# 4. Verify before deployment
./scripts/verify-production.sh

# 5. Build and deploy
npm run build
# Deploy to production server

# 6. Post-deployment verification
./scripts/verify-production.sh
```

---

## 🔧 Troubleshooting

### `setup-production.sh` fails

**Error: "Supabase CLI not found"**
```bash
npm install -g supabase
```

**Error: "Cannot link to Supabase project"**
```bash
# Login first
supabase login

# Then link
supabase link --project-ref YOUR_PROJECT_ID
```

**Error: "Failed to set secrets"**
```bash
# Ensure you're logged in
supabase login

# Check your project is linked
supabase projects list
```

---

### `verify-production.sh` reports errors

**"Cannot connect to Supabase"**
- Check `VITE_SUPABASE_URL` in .env
- Check `VITE_SUPABASE_PUBLISHABLE_KEY` in .env
- Verify project is running (not paused)

**"Secret missing: VAPID_PRIVATE_KEY"**
```bash
# Generate and set
npx web-push generate-vapid-keys
# Copy private key
supabase secrets set VAPID_PRIVATE_KEY="your_key"
```

**"Email provider not configured"**
- Verify `EMAIL_PROVIDER` in .env
- Set API key (RESEND_API_KEY or SENDGRID_API_KEY)
- Run `supabase secrets set` for backend

---

### `apply-all-migrations.sql` fails

**Error: "relation already exists"**
- This is normal for idempotent migrations
- Script handles this with `IF NOT EXISTS`
- Safe to ignore

**Error: "permission denied"**
- Ensure you're using service_role key
- Run via Supabase Dashboard (authenticated)

**Error: "materialized view not found"**
- Check source tables exist first
- Run migrations in order (1-8)

---

## 📚 Additional Resources

### Documentation
- [Full Audit Report](../docs/AUDIT_COMPLETION_FINAL_REPORT.md)
- [Deployment Checklist](../docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md)
- [VAPID Setup Guide](../docs/VAPID_KEYS_SETUP.md)

### Migration Files
All individual migration files are in `supabase/migrations/`:
```
20251114120000_gdpr_storage_support.sql
20251114120100_audit_notifications_tracking.sql
20251114120200_invitations_error_tracking.sql
20251114120300_vr_weekly_materialized_views.sql
20251114120400_breath_weekly_aggregates_refresh.sql
20251114120500_push_subscriptions_table.sql
20251114120600_onboarding_goals_table.sql
20251114120700_help_article_feedback_table.sql
```

### Edge Functions
Modified edge functions in `supabase/functions/`:
- `dsar-handler` - GDPR data exports
- `scheduled-audits` - Email notifications
- `send-invitation` - Team invitations
- `help-center-ai` - Help center API
- `_shared/email-service.ts` - Email service

---

## ✅ Pre-Deployment Checklist

Use this checklist before deploying to production:

### Configuration
- [ ] `.env` file configured for production
- [ ] VAPID keys generated
- [ ] Email provider account created (Resend/SendGrid)
- [ ] Google Analytics ID set (if using)
- [ ] Sentry DSN set (if using)

### Supabase
- [ ] Production project created
- [ ] All secrets configured
- [ ] Storage bucket `gdpr-exports` created
- [ ] All migrations applied
- [ ] Views refreshed initially

### Testing
- [ ] `./scripts/verify-production.sh` passes
- [ ] Email sending tested
- [ ] Push notifications tested
- [ ] VR/Breath KPIs display data
- [ ] E2E tests pass

### Documentation
- [ ] README.md updated
- [ ] Deployment docs reviewed
- [ ] Team trained on new features

---

## 🎯 Success Metrics

After deployment, verify these metrics:

**Performance**
- VR queries: < 50ms ✅
- Breath queries: < 30ms ✅
- Email delivery: > 98% ✅

**Functionality**
- Push notifications enabled ✅
- KPIs display correctly ✅
- Email notifications sent ✅
- GDPR exports stored securely ✅

**Monitoring**
- No errors in edge function logs ✅
- Views refresh daily ✅
- Storage bucket accessible ✅

---

## 📞 Support

**Issues?**
1. Check logs in Supabase Dashboard
2. Run `./scripts/verify-production.sh`
3. Review [troubleshooting guide](../docs/AUDIT_COMPLETION_FINAL_REPORT.md#troubleshooting)
4. Check migration files for details

**Questions?**
- Review full documentation in `docs/`
- Check individual migration files
- Inspect edge function code

---

**Last updated:** 2025-11-14
**Version:** 1.0
