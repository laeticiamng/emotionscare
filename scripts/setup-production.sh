#!/bin/bash

# =============================================================================
# EmotionsCare - Production Setup Script
# =============================================================================
# This script automates the production deployment setup
# Run this after configuring your .env file
# =============================================================================

set -e  # Exit on error

echo "🚀 EmotionsCare Production Setup"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Please copy .env.example to .env and configure it first:"
    echo "  cp .env.example .env"
    exit 1
fi

print_success ".env file found"
echo ""

# =============================================================================
# Step 1: Check Node.js and npm
# =============================================================================
echo "Step 1/7: Checking Node.js and npm..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
print_success "Node.js $NODE_VERSION"
print_success "npm $NPM_VERSION"
echo ""

# =============================================================================
# Step 2: Check Supabase CLI
# =============================================================================
echo "Step 2/7: Checking Supabase CLI..."

if ! command -v supabase &> /dev/null; then
    print_warning "Supabase CLI not found. Installing..."
    npm install -g supabase
    print_success "Supabase CLI installed"
else
    SUPABASE_VERSION=$(supabase --version)
    print_success "Supabase CLI $SUPABASE_VERSION"
fi
echo ""

# =============================================================================
# Step 3: Generate VAPID Keys (if not exists)
# =============================================================================
echo "Step 3/7: Checking VAPID keys..."

# Check if VAPID keys are in .env
if grep -q "VITE_VAPID_PUBLIC_KEY=your_vapid_public_key_here" .env; then
    print_warning "VAPID keys not configured in .env"

    read -p "Generate new VAPID keys? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installing web-push..."
        npm install -g web-push 2>/dev/null || true

        print_info "Generating VAPID keys..."
        VAPID_OUTPUT=$(npx web-push generate-vapid-keys)

        PUBLIC_KEY=$(echo "$VAPID_OUTPUT" | grep "Public Key:" | cut -d' ' -f3)
        PRIVATE_KEY=$(echo "$VAPID_OUTPUT" | grep "Private Key:" | cut -d' ' -f3)

        echo ""
        print_success "VAPID keys generated!"
        echo ""
        print_warning "⚠️  IMPORTANT: Add these to your .env file:"
        echo ""
        echo "VITE_VAPID_PUBLIC_KEY=$PUBLIC_KEY"
        echo "VAPID_PRIVATE_KEY=$PRIVATE_KEY"
        echo ""
        print_warning "Also add to Supabase secrets:"
        echo "supabase secrets set VAPID_PUBLIC_KEY=\"$PUBLIC_KEY\""
        echo "supabase secrets set VAPID_PRIVATE_KEY=\"$PRIVATE_KEY\""
        echo ""

        read -p "Press Enter to continue..."
    fi
else
    print_success "VAPID keys configured in .env"
fi
echo ""

# =============================================================================
# Step 4: Check Email Provider Configuration
# =============================================================================
echo "Step 4/7: Checking email provider..."

if grep -q "EMAIL_PROVIDER=resend" .env && grep -q "RESEND_API_KEY=re_" .env; then
    print_warning "Resend API key looks like placeholder"
    print_info "Get your API key from: https://resend.com"
elif grep -q "EMAIL_PROVIDER=sendgrid" .env && grep -q "SENDGRID_API_KEY=SG." .env; then
    print_warning "SendGrid API key looks like placeholder"
    print_info "Get your API key from: https://sendgrid.com"
else
    print_success "Email provider configured"
fi
echo ""

# =============================================================================
# Step 5: Link to Supabase Project
# =============================================================================
echo "Step 5/7: Linking to Supabase project..."

if [ ! -f .git/config ] || ! grep -q "supabase" .git/config; then
    print_info "This will link your local project to Supabase"
    read -p "Enter your Supabase project ID: " PROJECT_ID

    if [ -n "$PROJECT_ID" ]; then
        supabase link --project-ref "$PROJECT_ID" || print_error "Failed to link project"
        print_success "Linked to Supabase project"
    else
        print_warning "Skipping Supabase link"
    fi
else
    print_success "Already linked to Supabase"
fi
echo ""

# =============================================================================
# Step 6: Apply Migrations
# =============================================================================
echo "Step 6/7: Database migrations..."

print_info "Migrations should be applied via Supabase Dashboard → SQL Editor"
print_info "Or run: supabase db push"
echo ""
print_info "Required migrations (in order):"
echo "  1. 20251114120000_gdpr_storage_support.sql"
echo "  2. 20251114120100_audit_notifications_tracking.sql"
echo "  3. 20251114120200_invitations_error_tracking.sql"
echo "  4. 20251114120300_vr_weekly_materialized_views.sql"
echo "  5. 20251114120400_breath_weekly_aggregates_refresh.sql"
echo "  6. 20251114120500_push_subscriptions_table.sql"
echo "  7. 20251114120600_onboarding_goals_table.sql"
echo "  8. 20251114120700_help_article_feedback_table.sql"
echo ""

read -p "Push migrations to Supabase now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    supabase db push || print_error "Failed to push migrations"
    print_success "Migrations applied"
fi
echo ""

# =============================================================================
# Step 7: Set Supabase Secrets
# =============================================================================
echo "Step 7/7: Supabase secrets..."

print_info "Setting up Supabase secrets..."
echo ""

# Read from .env
source .env 2>/dev/null || true

# Set secrets
if [ -n "$VAPID_PRIVATE_KEY" ] && [ "$VAPID_PRIVATE_KEY" != "your_vapid_private_key_here" ]; then
    print_info "Setting VAPID_PRIVATE_KEY..."
    supabase secrets set VAPID_PRIVATE_KEY="$VAPID_PRIVATE_KEY" 2>/dev/null || print_warning "Failed to set VAPID_PRIVATE_KEY"
fi

if [ -n "$VAPID_PUBLIC_KEY" ]; then
    print_info "Setting VAPID_PUBLIC_KEY..."
    supabase secrets set VAPID_PUBLIC_KEY="$VAPID_PUBLIC_KEY" 2>/dev/null || print_warning "Failed to set VAPID_PUBLIC_KEY"
fi

if [ -n "$VAPID_SUBJECT" ]; then
    print_info "Setting VAPID_SUBJECT..."
    supabase secrets set VAPID_SUBJECT="$VAPID_SUBJECT" 2>/dev/null || print_warning "Failed to set VAPID_SUBJECT"
fi

if [ -n "$EMAIL_PROVIDER" ]; then
    print_info "Setting EMAIL_PROVIDER..."
    supabase secrets set EMAIL_PROVIDER="$EMAIL_PROVIDER" 2>/dev/null || print_warning "Failed to set EMAIL_PROVIDER"
fi

if [ -n "$RESEND_API_KEY" ] && [ "$RESEND_API_KEY" != "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx" ]; then
    print_info "Setting RESEND_API_KEY..."
    supabase secrets set RESEND_API_KEY="$RESEND_API_KEY" 2>/dev/null || print_warning "Failed to set RESEND_API_KEY"
fi

if [ -n "$SENDGRID_API_KEY" ] && [[ "$SENDGRID_API_KEY" == SG.* ]]; then
    print_info "Setting SENDGRID_API_KEY..."
    supabase secrets set SENDGRID_API_KEY="$SENDGRID_API_KEY" 2>/dev/null || print_warning "Failed to set SENDGRID_API_KEY"
fi

if [ -n "$EMAIL_FROM" ]; then
    print_info "Setting EMAIL_FROM..."
    supabase secrets set EMAIL_FROM="$EMAIL_FROM" 2>/dev/null || print_warning "Failed to set EMAIL_FROM"
fi

if [ -n "$FRONTEND_URL" ]; then
    print_info "Setting FRONTEND_URL..."
    supabase secrets set FRONTEND_URL="$FRONTEND_URL" 2>/dev/null || print_warning "Failed to set FRONTEND_URL"
fi

echo ""
print_success "Secrets configuration complete"
echo ""

# =============================================================================
# Summary
# =============================================================================
echo "================================="
print_success "Setup Complete!"
echo "================================="
echo ""
print_info "Next steps:"
echo "  1. Create storage bucket 'gdpr-exports' in Supabase Dashboard"
echo "  2. Run initial refresh: SELECT refresh_vr_weekly_views();"
echo "  3. Run initial refresh: SELECT refresh_breath_weekly_metrics();"
echo "  4. Test email sending (see docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md)"
echo "  5. Test push notifications"
echo ""
print_info "Documentation:"
echo "  - Full report: docs/AUDIT_COMPLETION_FINAL_REPORT.md"
echo "  - Quick checklist: docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md"
echo "  - VAPID guide: docs/VAPID_KEYS_SETUP.md"
echo ""
print_success "EmotionsCare is ready for production! 🚀"
