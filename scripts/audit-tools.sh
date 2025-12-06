#!/bin/bash

# 🔍 EmotionsCare Audit Tools
# Scripts pour monitorer la dette technique

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 EmotionsCare Audit Tools${NC}"
echo "================================"
echo ""

# Function: Count @ts-nocheck
count_ts_nocheck() {
    echo -e "${YELLOW}📊 Counting @ts-nocheck...${NC}"
    COUNT=$(grep -r "@ts-nocheck" src/ 2>/dev/null | wc -l)
    echo -e "   Found: ${RED}${COUNT}${NC} files with @ts-nocheck"
    
    if [ "$COUNT" -eq 0 ]; then
        echo -e "   ${GREEN}✅ EXCELLENT! No @ts-nocheck found${NC}"
    elif [ "$COUNT" -lt 100 ]; then
        echo -e "   ${YELLOW}⚠️  GOOD progress, but still work to do${NC}"
    else
        echo -e "   ${RED}❌ CRITICAL: Too many @ts-nocheck${NC}"
    fi
    echo ""
}

# Function: Count console.*
count_console_logs() {
    echo -e "${YELLOW}📊 Counting console.* statements...${NC}"
    COUNT=$(grep -rE "console\.(log|error|warn|debug)" src/ 2>/dev/null | wc -l)
    echo -e "   Found: ${RED}${COUNT}${NC} console.* statements"
    
    if [ "$COUNT" -eq 0 ]; then
        echo -e "   ${GREEN}✅ PERFECT! No console.* in code${NC}"
    elif [ "$COUNT" -lt 50 ]; then
        echo -e "   ${YELLOW}⚠️  GOOD, almost there${NC}"
    else
        echo -e "   ${RED}❌ CRITICAL: Too many console.*${NC}"
    fi
    echo ""
}

# Function: Count any types
count_any_types() {
    echo -e "${YELLOW}📊 Counting 'any' types...${NC}"
    COUNT=$(grep -rE ":\s*any[\s);>]" src/ 2>/dev/null | wc -l)
    echo -e "   Found: ${RED}${COUNT}${NC} any types"
    
    if [ "$COUNT" -eq 0 ]; then
        echo -e "   ${GREEN}✅ PERFECT! Type-safe code${NC}"
    elif [ "$COUNT" -lt 100 ]; then
        echo -e "   ${YELLOW}⚠️  ACCEPTABLE, but can improve${NC}"
    else
        echo -e "   ${RED}❌ WARNING: Too many any types${NC}"
    fi
    echo ""
}

# Function: TypeScript errors
check_typescript() {
    echo -e "${YELLOW}📊 Running TypeScript check...${NC}"
    if npm run typecheck 2>&1 | grep -q "error TS"; then
        ERRORS=$(npm run typecheck 2>&1 | grep -c "error TS" || echo "0")
        echo -e "   ${RED}❌ Found ${ERRORS} TypeScript errors${NC}"
    else
        echo -e "   ${GREEN}✅ No TypeScript errors!${NC}"
    fi
    echo ""
}

# Function: Find large files
find_large_files() {
    echo -e "${YELLOW}📊 Finding large files (>500 lines)...${NC}"
    find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec wc -l {} + 2>/dev/null | \
        awk '$1 > 500 {print "   " $1 " lines: " $2}' | \
        sort -rn | \
        head -10
    echo ""
}

# Function: Duplicate code
find_duplicates() {
    echo -e "${YELLOW}📊 Checking for duplicate imports...${NC}"
    
    # Check for duplicate React imports
    DUPLICATES=$(grep -rh "^import.*react" src/ 2>/dev/null | sort | uniq -c | awk '$1 > 50 {print}')
    
    if [ -z "$DUPLICATES" ]; then
        echo -e "   ${GREEN}✅ No major duplicates found${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Found duplicate patterns:${NC}"
        echo "$DUPLICATES" | head -5
    fi
    echo ""
}

# Function: Check bundle size
check_bundle_size() {
    echo -e "${YELLOW}📊 Checking bundle size...${NC}"
    
    if [ -d "dist" ]; then
        SIZE=$(du -sh dist/ | cut -f1)
        echo -e "   Build size: ${BLUE}${SIZE}${NC}"
        
        # Find largest chunks
        echo -e "   ${YELLOW}Largest chunks:${NC}"
        find dist/assets -name "*.js" -exec ls -lh {} + 2>/dev/null | \
            awk '{print "   " $5 " - " $9}' | \
            sort -rh | \
            head -5
    else
        echo -e "   ${YELLOW}⚠️  No dist/ folder. Run 'npm run build' first${NC}"
    fi
    echo ""
}

# Function: Security audit
security_audit() {
    echo -e "${YELLOW}📊 Running security audit...${NC}"
    
    VULNERABILITIES=$(npm audit --json 2>/dev/null | grep -o '"vulnerabilities":[^,]*' | grep -o '[0-9]*' | tail -1)
    
    if [ "$VULNERABILITIES" = "0" ]; then
        echo -e "   ${GREEN}✅ No vulnerabilities found!${NC}"
    else
        echo -e "   ${RED}⚠️  Found ${VULNERABILITIES} vulnerabilities${NC}"
        echo -e "   ${YELLOW}Run 'npm audit' for details${NC}"
    fi
    echo ""
}

# Function: Generate full report
generate_report() {
    echo -e "${BLUE}📝 Generating full audit report...${NC}"
    echo ""
    
    REPORT_FILE="docs/AUDIT_REPORT_$(date +%Y%m%d).md"
    
    cat > "$REPORT_FILE" << EOF
# 📊 Audit Report - $(date +%Y-%m-%d)

## TypeScript Status
- @ts-nocheck files: $(grep -r "@ts-nocheck" src/ 2>/dev/null | wc -l)
- any types: $(grep -rE ":\s*any[\s);>]" src/ 2>/dev/null | wc -l)

## Code Quality
- console.* statements: $(grep -rE "console\.(log|error|warn)" src/ 2>/dev/null | wc -l)
- Files > 500 lines: $(find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec wc -l {} + 2>/dev/null | awk '$1 > 500' | wc -l)

## Security
- npm vulnerabilities: $(npm audit --json 2>/dev/null | grep -o '"vulnerabilities":[^,]*' | grep -o '[0-9]*' | tail -1)

## Bundle Size
- Total dist size: $(du -sh dist/ 2>/dev/null | cut -f1 || echo "Not built")

---

Generated by audit-tools.sh
EOF

    echo -e "   ${GREEN}✅ Report saved to ${REPORT_FILE}${NC}"
    echo ""
}

# Function: Show progress
show_progress() {
    echo -e "${BLUE}📈 Sprint Progress${NC}"
    echo "================================"
    echo ""
    
    # Week 1 targets
    TS_NOCHECK_TARGET=2959
    CONSOLE_TARGET=1755
    
    CURRENT_TS=$(grep -r "@ts-nocheck" src/ 2>/dev/null | wc -l)
    CURRENT_CONSOLE=$(grep -rE "console\." src/ 2>/dev/null | wc -l)
    
    TS_PROGRESS=$((100 - (CURRENT_TS * 100 / 2964)))
    CONSOLE_PROGRESS=$((100 - (CURRENT_CONSOLE * 100 / 1855)))
    
    echo -e "TypeScript cleanup: ${GREEN}${TS_PROGRESS}%${NC} complete"
    echo -e "Logger migration:   ${GREEN}${CONSOLE_PROGRESS}%${NC} complete"
    echo ""
}

# Main menu
show_menu() {
    echo -e "${BLUE}Select an option:${NC}"
    echo "1) Full audit (all checks)"
    echo "2) Count @ts-nocheck"
    echo "3) Count console.*"
    echo "4) Count any types"
    echo "5) TypeScript check"
    echo "6) Find large files"
    echo "7) Check bundle size"
    echo "8) Security audit"
    echo "9) Generate report"
    echo "10) Show progress"
    echo "0) Exit"
    echo ""
    read -p "Choice: " choice
}

# Execute choice
case "${1:-menu}" in
    1|full)
        count_ts_nocheck
        count_console_logs
        count_any_types
        check_typescript
        find_large_files
        check_bundle_size
        security_audit
        ;;
    2|ts)
        count_ts_nocheck
        ;;
    3|console)
        count_console_logs
        ;;
    4|any)
        count_any_types
        ;;
    5|check)
        check_typescript
        ;;
    6|large)
        find_large_files
        ;;
    7|bundle)
        check_bundle_size
        ;;
    8|security)
        security_audit
        ;;
    9|report)
        generate_report
        ;;
    10|progress)
        show_progress
        ;;
    menu)
        show_menu
        case $choice in
            1) bash "$0" full ;;
            2) bash "$0" ts ;;
            3) bash "$0" console ;;
            4) bash "$0" any ;;
            5) bash "$0" check ;;
            6) bash "$0" large ;;
            7) bash "$0" bundle ;;
            8) bash "$0" security ;;
            9) bash "$0" report ;;
            10) bash "$0" progress ;;
            0) exit 0 ;;
            *) echo "Invalid choice" ;;
        esac
        ;;
    *)
        echo "Usage: $0 [full|ts|console|any|check|large|bundle|security|report|progress]"
        exit 1
        ;;
esac

echo -e "${GREEN}✅ Done!${NC}"
