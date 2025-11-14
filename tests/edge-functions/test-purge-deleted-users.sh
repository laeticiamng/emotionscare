#!/bin/bash

# Test script for purge_deleted_users edge function
# ⚠️  WARNING: This function PERMANENTLY DELETES data. Only run in dev/staging!
# Usage: ./test-purge-deleted-users.sh <supabase_url> <service_role_key> <test_user_id>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ "$#" -ne 3 ]; then
    echo -e "${RED}Usage: $0 <supabase_url> <service_role_key> <test_user_id>${NC}"
    echo "Example: $0 https://abc.supabase.co eyJhbGc... user-uuid-123"
    echo ""
    echo -e "${YELLOW}⚠️  WARNING: This will PERMANENTLY DELETE the test user's data!${NC}"
    exit 1
fi

SUPABASE_URL=$1
SERVICE_ROLE_KEY=$2
TEST_USER_ID=$3
ENDPOINT="${SUPABASE_URL}/functions/v1/purge_deleted_users"

echo "🧪 Testing purge_deleted_users Edge Function"
echo "=============================================="
echo -e "${YELLOW}⚠️  WARNING: Testing GDPR deletion on test user: $TEST_USER_ID${NC}"
echo ""

read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Test cancelled."
    exit 0
fi

echo ""

# Test counter
PASSED=0
FAILED=0

# Step 1: Create deletion request
echo "Step 1: Creating deletion request for test user..."
echo "=================================================="

# Use psql or Supabase API to create deletion request
# For this script, we'll assume it's created manually or via SQL

cat << EOF

To create a deletion request, run this SQL:

INSERT INTO delete_requests (user_id_hash, requested_at, purge_at)
VALUES (
  '$TEST_USER_ID',
  NOW(),
  NOW() - INTERVAL '1 day'  -- Set to past for immediate processing
);

EOF

read -p "Have you created the deletion request? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Please create the deletion request first."
    exit 0
fi

echo ""

# Step 2: Check initial data
echo "Step 2: Checking initial data before purge..."
echo "=============================================="
echo "Note: Verify manually via SQL that test user has data in tables"
echo ""

# Step 3: Run purge function
echo "Step 3: Running purge_deleted_users function..."
echo "=================================================="

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
    SUCCESS=$(echo "$BODY" | jq -r '.success // false' 2>/dev/null)
    PURGED=$(echo "$BODY" | jq -r '.purged // 0' 2>/dev/null)
    FAILED_PURGE=$(echo "$BODY" | jq -r '.failed // 0' 2>/dev/null)

    if [ "$SUCCESS" = "true" ] && [ "$PURGED" -gt 0 ]; then
        echo -e "${GREEN}✓ PASS: Purge executed successfully${NC}"
        echo "  ↳ Purged: $PURGED user(s)"
        echo "  ↳ Failed: $FAILED_PURGE"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ PARTIAL: Function succeeded but no users purged${NC}"
        echo "  ↳ This might be expected if no deletion requests are ready"
    fi
else
    echo -e "${RED}✗ FAIL: Unexpected HTTP status${NC}"
    ((FAILED++))
fi

echo ""

# Step 4: Verify data deletion
echo "Step 4: Verification checklist..."
echo "=================================="
echo ""
echo "Please verify manually with these SQL queries:"
echo ""

cat << EOF
-- 1. Check user deleted from auth.users
SELECT COUNT(*) FROM auth.users WHERE id = '$TEST_USER_ID';
-- Expected: 0

-- 2. Check personal data deleted
SELECT COUNT(*) FROM user_consent_preferences WHERE user_id = '$TEST_USER_ID';
SELECT COUNT(*) FROM vr_sessions WHERE user_id = '$TEST_USER_ID';
SELECT COUNT(*) FROM breath_sessions WHERE user_id = '$TEST_USER_ID';
-- Expected: 0 for all

-- 3. Check audit logs anonymized (not deleted)
SELECT COUNT(*) FROM audit_logs WHERE user_id = 'DELETED_USER';
-- Expected: > 0 (anonymized records)

-- 4. Check consent logs anonymized
SELECT user_id, email FROM consent_logs WHERE user_id = 'DELETED_USER' LIMIT 1;
-- Expected: user_id = 'DELETED_USER', email = 'deleted@anonymized.local'

-- 5. Check purge was logged
SELECT * FROM audit_logs
WHERE action = 'USER_PURGED'
ORDER BY timestamp DESC
LIMIT 1;
-- Should show details about the purge

-- 6. Check deletion request removed
SELECT COUNT(*) FROM delete_requests WHERE user_id_hash = '$TEST_USER_ID';
-- Expected: 0

EOF

echo ""

# Test 5: Run again (should find no users)
echo "Step 5: Running purge again (should find no users)..."
echo "======================================================"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ]; then
    MESSAGE=$(echo "$BODY" | jq -r '.message // ""' 2>/dev/null)
    if [[ "$MESSAGE" == *"No users to purge"* ]]; then
        echo -e "${GREEN}✓ PASS: Correctly reports no users to purge${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ PARTIAL: Success but unexpected message${NC}"
    fi
else
    echo -e "${RED}✗ FAIL: Unexpected HTTP status${NC}"
    ((FAILED++))
fi

echo ""

# Test 6: Unauthorized access (without service role key)
echo "Step 6: Testing unauthorized access (no service role)..."
echo "=========================================================="

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
    -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" -eq 401 ] || [ "$HTTP_CODE" -eq 403 ]; then
    echo -e "${GREEN}✓ PASS: Correctly requires service role authentication${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Note: Expected 401/403, got $HTTP_CODE${NC}"
    echo "  (Function may not enforce service role - check implementation)"
fi

echo ""

# Summary
echo "========================================"
echo "Test Summary:"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo "========================================"
echo ""
echo -e "${YELLOW}Important: Complete manual verification with SQL queries above!${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Automated tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some automated tests failed${NC}"
    exit 1
fi
