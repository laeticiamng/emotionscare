#!/bin/bash

# Test script for VAPID push notifications setup
# Usage: ./test-vapid-setup.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧪 Testing VAPID Push Notifications Setup"
echo "=========================================="
echo ""

# Test counter
PASSED=0
FAILED=0
WARNINGS=0

# Test 1: Check if web-push is installed
echo -n "1. Checking if web-push is installed... "
if command -v npx &> /dev/null; then
    if npx web-push --version &> /dev/null; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ WARN${NC} - web-push not found, installing..."
        npm install -g web-push
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗ FAIL${NC} - npx not available"
    ((FAILED++))
fi
echo ""

# Test 2: Check environment variables
echo "2. Checking environment variables..."
echo "===================================="

# Check .env file
if [ -f .env ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    ((PASSED++))

    # Check VITE_VAPID_PUBLIC_KEY
    if grep -q "VITE_VAPID_PUBLIC_KEY" .env; then
        VAPID_PUBLIC=$(grep "VITE_VAPID_PUBLIC_KEY" .env | cut -d '=' -f2 | tr -d '"' | tr -d ' ')
        if [ ${#VAPID_PUBLIC} -eq 88 ]; then
            echo -e "${GREEN}✓ VITE_VAPID_PUBLIC_KEY is set and valid length (88 chars)${NC}"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠ VITE_VAPID_PUBLIC_KEY exists but length is ${#VAPID_PUBLIC} (expected 88)${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${RED}✗ VITE_VAPID_PUBLIC_KEY not found in .env${NC}"
        ((FAILED++))
    fi

    # Check VAPID_SUBJECT
    if grep -q "VAPID_SUBJECT" .env; then
        VAPID_SUBJECT=$(grep "VAPID_SUBJECT" .env | cut -d '=' -f2 | tr -d '"')
        if [[ $VAPID_SUBJECT == mailto:* ]]; then
            echo -e "${GREEN}✓ VAPID_SUBJECT is set with mailto: format${NC}"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠ VAPID_SUBJECT should start with 'mailto:'${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${RED}✗ VAPID_SUBJECT not found in .env${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
    ((FAILED++))
fi
echo ""

# Test 3: Generate new VAPID keys (demonstration)
echo "3. Generating sample VAPID keys (for reference)..."
echo "===================================================="

if command -v npx &> /dev/null; then
    echo -e "${BLUE}Sample VAPID keys:${NC}"
    npx web-push generate-vapid-keys
    echo ""
    echo -e "${YELLOW}Note: Use these keys if you haven't set up VAPID yet${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠ Cannot generate keys - npx not available${NC}"
    ((WARNINGS++))
fi

# Test 4: Check Supabase secrets
echo "4. Checking Supabase secrets setup..."
echo "======================================"

if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✓ Supabase CLI is installed${NC}"
    ((PASSED++))

    # Try to list secrets (requires project link)
    if supabase secrets list &> /dev/null; then
        echo -e "${GREEN}✓ Supabase project is linked${NC}"
        ((PASSED++))

        # Check if VAPID_PRIVATE_KEY exists
        if supabase secrets list | grep -q "VAPID_PRIVATE_KEY"; then
            echo -e "${GREEN}✓ VAPID_PRIVATE_KEY is set in Supabase secrets${NC}"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠ VAPID_PRIVATE_KEY not found in Supabase secrets${NC}"
            echo "  Set it with: supabase secrets set VAPID_PRIVATE_KEY=<your_private_key>"
            ((WARNINGS++))
        fi

        # Check if VAPID_SUBJECT exists
        if supabase secrets list | grep -q "VAPID_SUBJECT"; then
            echo -e "${GREEN}✓ VAPID_SUBJECT is set in Supabase secrets${NC}"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠ VAPID_SUBJECT not found in Supabase secrets${NC}"
            echo "  Set it with: supabase secrets set VAPID_SUBJECT=mailto:support@emotionscare.com"
            ((WARNINGS++))
        fi
    else
        echo -e "${YELLOW}⚠ Supabase project not linked${NC}"
        echo "  Link with: supabase link --project-ref <your-project-ref>"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠ Supabase CLI not installed${NC}"
    echo "  Install with: npm install -g supabase"
    ((WARNINGS++))
fi
echo ""

# Test 5: Check database table
echo "5. Checking push_subscriptions table..."
echo "========================================"

cat << 'EOF'
Run this SQL to verify the table exists:

SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'push_subscriptions'
ORDER BY ordinal_position;

Expected columns:
- id (uuid)
- user_id (uuid)
- endpoint (text)
- p256dh (text)
- auth (text)
- user_agent (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

EOF

echo -e "${BLUE}Manual verification required${NC}"
echo ""

# Test 6: Check migration file
echo "6. Checking migration file..."
echo "=============================="

MIGRATION_FILE="supabase/migrations/20251114120500_push_subscriptions_table.sql"

if [ -f "$MIGRATION_FILE" ]; then
    echo -e "${GREEN}✓ Migration file exists: $MIGRATION_FILE${NC}"
    ((PASSED++))

    if grep -q "CREATE TABLE.*push_subscriptions" "$MIGRATION_FILE"; then
        echo -e "${GREEN}✓ Migration creates push_subscriptions table${NC}"
        ((PASSED++))
    fi

    if grep -q "ENABLE ROW LEVEL SECURITY" "$MIGRATION_FILE"; then
        echo -e "${GREEN}✓ Migration enables RLS${NC}"
        ((PASSED++))
    fi
else
    echo -e "${RED}✗ Migration file not found${NC}"
    ((FAILED++))
fi
echo ""

# Test 7: Check frontend integration
echo "7. Checking frontend integration..."
echo "===================================="

ONBOARDING_FILE="src/hooks/useOnboarding.ts"

if [ -f "$ONBOARDING_FILE" ]; then
    echo -e "${GREEN}✓ useOnboarding hook exists${NC}"
    ((PASSED++))

    if grep -q "VITE_VAPID_PUBLIC_KEY" "$ONBOARDING_FILE"; then
        echo -e "${GREEN}✓ Hook uses VAPID public key${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ VAPID public key not referenced in hook${NC}"
        ((WARNINGS++))
    fi

    if grep -q "pushManager.subscribe" "$ONBOARDING_FILE"; then
        echo -e "${GREEN}✓ Hook implements push subscription${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ Push subscription not found in hook${NC}"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗ useOnboarding hook not found${NC}"
    ((FAILED++))
fi
echo ""

# Summary
echo "========================================"
echo "Test Summary:"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo "========================================"
echo ""

# Setup instructions if there are issues
if [ $FAILED -gt 0 ] || [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Setup Instructions:${NC}"
    echo ""
    echo "1. Generate VAPID keys:"
    echo "   npx web-push generate-vapid-keys"
    echo ""
    echo "2. Add to .env:"
    echo "   VITE_VAPID_PUBLIC_KEY=<public_key>"
    echo "   VAPID_SUBJECT=mailto:support@emotionscare.com"
    echo ""
    echo "3. Set Supabase secrets:"
    echo "   supabase secrets set VAPID_PRIVATE_KEY=<private_key>"
    echo "   supabase secrets set VAPID_SUBJECT=mailto:support@emotionscare.com"
    echo ""
    echo "4. Apply migrations:"
    echo "   supabase db push"
    echo ""
    echo "For detailed setup guide, see: docs/VAPID_KEYS_SETUP.md"
    echo ""
fi

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✓ All checks passed! VAPID setup is complete.${NC}"
    else
        echo -e "${YELLOW}⚠ Setup mostly complete but has warnings (see above)${NC}"
    fi
    exit 0
else
    echo -e "${RED}✗ Setup incomplete - see failed checks above${NC}"
    exit 1
fi
