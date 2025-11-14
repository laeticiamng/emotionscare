#!/bin/bash

# Test script for generate_export edge function
# Usage: ./test-generate-export.sh <supabase_url> <user_token>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ "$#" -ne 2 ]; then
    echo -e "${RED}Usage: $0 <supabase_url> <user_token>${NC}"
    echo "Example: $0 https://abc.supabase.co eyJhbGc..."
    exit 1
fi

SUPABASE_URL=$1
USER_TOKEN=$2
ENDPOINT="${SUPABASE_URL}/functions/v1/generate_export"

echo "🧪 Testing generate_export Edge Function"
echo "========================================"
echo ""

# Test counter
PASSED=0
FAILED=0

# Helper function to run test
run_test() {
    local test_name=$1
    local export_type=$2
    local format=$3
    local expected_status=$4

    echo -n "Testing: $test_name... "

    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
        -H "Authorization: Bearer $USER_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"export_type\": \"$export_type\",
            \"format\": \"$format\"
        }")

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $HTTP_CODE)"
        ((PASSED++))

        # Parse and display response if successful
        if [ "$HTTP_CODE" -eq 200 ]; then
            SUCCESS=$(echo "$BODY" | jq -r '.success // false' 2>/dev/null)
            DOWNLOAD_URL=$(echo "$BODY" | jq -r '.download_url // "N/A"' 2>/dev/null)
            FILE_NAME=$(echo "$BODY" | jq -r '.file_name // "N/A"' 2>/dev/null)

            echo "    ↳ Success: $SUCCESS"
            echo "    ↳ File: $FILE_NAME"
            if [ "$DOWNLOAD_URL" != "N/A" ] && [ ${#DOWNLOAD_URL} -gt 50 ]; then
                echo "    ↳ Download URL: ${DOWNLOAD_URL:0:50}..."
            fi
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $HTTP_CODE)"
        ((FAILED++))
        echo "    ↳ Response: $BODY"
    fi
    echo ""
}

# Test 1: Analytics export (JSON)
run_test "Analytics export (JSON)" "analytics" "json" 200

# Test 2: VR sessions export (JSON)
run_test "VR sessions export (JSON)" "vr_sessions" "json" 200

# Test 3: VR sessions export (CSV)
run_test "VR sessions export (CSV)" "vr_sessions" "csv" 200

# Test 4: Breath sessions export
run_test "Breath sessions export" "breath_sessions" "json" 200

# Test 5: Music history export
run_test "Music history export" "music_history" "json" 200

# Test 6: Emotional logs export
run_test "Emotional logs export" "emotional_logs" "json" 200

# Test 7: Invalid export type (should fail)
echo -n "Testing: Invalid export type (error handling)... "
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"export_type": "invalid_type", "format": "json"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $HTTP_CODE - correctly rejected invalid type)"
    ((PASSED++))
    ERROR=$(echo "$BODY" | jq -r '.error // "N/A"' 2>/dev/null)
    echo "    ↳ Error message: $ERROR"
else
    echo -e "${RED}✗ FAIL${NC} (Expected 400, got $HTTP_CODE)"
    ((FAILED++))
fi
echo ""

# Test 8: Unauthorized access (no token)
echo -n "Testing: Unauthorized access (no token)... "
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -d '{"export_type": "analytics", "format": "json"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" -eq 401 ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $HTTP_CODE - correctly requires authentication)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Expected 401, got $HTTP_CODE)"
    ((FAILED++))
fi
echo ""

# Summary
echo "========================================"
echo "Test Summary:"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo "========================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
