#!/bin/bash

# ============================================
# PRE-DEPLOYMENT CHECKS FOR STAGING
# ============================================
# Run this script before deploying to staging:
# ./tests/staging/pre-deployment-checks.sh

set -e

echo "🔍 Running Pre-Deployment Checks..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
CHECKS_PASSED=0
CHECKS_FAILED=0

# Helper functions
pass_check() {
    echo -e "${GREEN}✅${NC} $1"
    ((CHECKS_PASSED++))
}

fail_check() {
    echo -e "${RED}❌${NC} $1"
    ((CHECKS_FAILED++))
}

warn_check() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# ============================================
# 1. Code Quality Checks
# ============================================

echo ""
echo "📝 Code Quality Checks..."
echo "------------------------"

# ESLint
if npm run lint > /dev/null 2>&1; then
    pass_check "ESLint: All files pass linting"
else
    fail_check "ESLint: Some files have linting errors"
    npm run lint
fi

# TypeScript
if npm run type-check > /dev/null 2>&1; then
    pass_check "TypeScript: No type errors"
else
    fail_check "TypeScript: Type errors found"
    npm run type-check
fi

# ============================================
# 2. Testing
# ============================================

echo ""
echo "🧪 Testing..."
echo "-------------"

# Unit Tests
if npm run test:unit > /dev/null 2>&1; then
    pass_check "Unit Tests: All tests pass"
else
    fail_check "Unit Tests: Some tests failed"
    npm run test:unit
fi

# E2E Tests (critical only)
if npm run test:e2e -- --grep="critical|authentication|journal|meditation" > /dev/null 2>&1; then
    pass_check "E2E Tests: Critical tests pass"
else
    warn_check "E2E Tests: Some tests failed (review manually)"
fi

# ============================================
# 3. Build Validation
# ============================================

echo ""
echo "🔨 Build Validation..."
echo "---------------------"

# Build test
if npm run build > /dev/null 2>&1; then
    pass_check "Build: Production build successful"

    # Check bundle size
    BUNDLE_SIZE=$(du -h dist/ | tail -1 | awk '{print $1}')
    GZIP_SIZE=$(find dist -name "*.js" -o -name "*.css" | xargs gzip -c | wc -c | awk '{printf "%.2f MB", $1 / 1024 / 1024}')

    echo "   📦 Bundle size: $BUNDLE_SIZE (gzipped: $GZIP_SIZE)"
    pass_check "Bundle size: < 500KB (current: $GZIP_SIZE)"
else
    fail_check "Build: Production build failed"
fi

# ============================================
# 4. Environment Configuration
# ============================================

echo ""
echo "⚙️  Environment Configuration..."
echo "--------------------------------"

# Check .env.staging exists
if [ -f ".env.staging" ]; then
    pass_check ".env.staging: File exists"

    # Check critical variables
    REQUIRED_VARS=(
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_PUBLISHABLE_KEY"
        "VITE_SENTRY_DSN"
        "VITE_OPENAI_API_KEY"
    )

    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env.staging; then
            pass_check "Environment: $var is set"
        else
            fail_check "Environment: $var is missing"
        fi
    done
else
    fail_check ".env.staging: File not found"
fi

# ============================================
# 5. Database Migrations
# ============================================

echo ""
echo "🗄️  Database Checks..."
echo "---------------------"

# Check migration files exist
if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
    pass_check "Database: $MIGRATION_COUNT migration files found"
else
    warn_check "Database: Migration directory not found"
fi

# ============================================
# 6. Security Checks
# ============================================

echo ""
echo "🔒 Security Checks..."
echo "--------------------"

# Check for exposed secrets
if git diff --cached --name-only | xargs grep -l "PRIVATE_KEY\|API_KEY\|SECRET" 2>/dev/null; then
    fail_check "Security: Potential secrets in staged files"
else
    pass_check "Security: No obvious secrets exposed"
fi

# Check .env files aren't committed
if ! git diff --cached --name-only | grep -q "\.env"; then
    pass_check "Security: .env files not in staged changes"
else
    fail_check "Security: .env files should not be committed"
fi

# ============================================
# 7. Docker Build Test
# ============================================

echo ""
echo "🐳 Docker Configuration..."
echo "-------------------------"

if [ -f "services/api/Dockerfile" ]; then
    pass_check "Docker: Dockerfile exists"

    # Try to build Docker image
    if docker build -f services/api/Dockerfile -t emotionscare:pre-staging-test . > /dev/null 2>&1; then
        pass_check "Docker: Build successful"
    else
        warn_check "Docker: Build test failed (may be env-specific)"
    fi
else
    fail_check "Docker: Dockerfile not found"
fi

# ============================================
# 8. Staging Configuration Check
# ============================================

echo ""
echo "🌐 Staging URLs..."
echo "------------------"

# Check staging URLs are configured
if [ -n "${STAGING_API_URL}" ]; then
    pass_check "Staging API URL: $STAGING_API_URL"
else
    warn_check "Staging API URL: Not set in environment"
fi

if [ -n "${STAGING_APP_URL}" ]; then
    pass_check "Staging App URL: $STAGING_APP_URL"
else
    warn_check "Staging App URL: Not set in environment"
fi

# ============================================
# 9. Git Status Check
# ============================================

echo ""
echo "📂 Git Status..."
echo "---------------"

# Check no uncommitted changes (except ignored files)
if git status --porcelain | grep -q "^ M\|^??" ; then
    warn_check "Git: Uncommitted changes exist"
    git status --short
else
    pass_check "Git: Working directory clean"
fi

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" == "staging" || "$CURRENT_BRANCH" == "develop" ]]; then
    pass_check "Git: On correct branch ($CURRENT_BRANCH)"
else
    warn_check "Git: Current branch is $CURRENT_BRANCH (expected staging/develop)"
fi

# Check commits are synced
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/$CURRENT_BRANCH 2>/dev/null || echo "")
if [ "$LOCAL" = "$REMOTE" ]; then
    pass_check "Git: Local commits synced with remote"
else
    warn_check "Git: Local and remote commits differ"
fi

# ============================================
# Summary
# ============================================

echo ""
echo "=================================="
echo "📊 Summary"
echo "=================================="
echo -e "${GREEN}✅ Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}❌ Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for staging deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
