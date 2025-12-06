# Quick Fix Guide - Dependency Issues

## TL;DR - Quick Wins (5 minutes)

```bash
# 1. Remove entirely unused packages
npm uninstall @chakra-ui/react @chakra-ui/icons @heroicons/react classnames

# 2. Update vulnerable packages
npm install esbuild@latest
npm audit fix

# 3. Remove problematic vite-plugin
npm uninstall vite-plugin-imagemin
```

**Result:** 404 KB saved + 38 vulnerabilities fixed

---

## Issue #1: vite-plugin-imagemin (CRITICAL - 35 HIGH vulnerabilities)

### Problem
- Package version 0.6.1 has NO security fixes
- Brings in vulnerable dependencies: cross-spawn, glob, esbuild, got, etc.
- Unused or replaced by Vite's native image optimization

### Solution
```bash
# OPTION A: Simply remove (RECOMMENDED)
npm uninstall vite-plugin-imagemin

# OPTION B: Update to latest (if it exists)
npm update vite-plugin-imagemin@latest
```

### What to Check After
```bash
# Verify image optimization still works
npm run build
npm run build:analyze
```

---

## Issue #2: Chakra UI + Icons (355 KB unused)

### Problem
- @chakra-ui/react: 0 imports detected
- @chakra-ui/icons: 0 imports detected  
- App uses @radix-ui (17 packages) instead

### Solution
```bash
npm uninstall @chakra-ui/react @chakra-ui/icons
```

### Verification
```bash
grep -r "@chakra-ui" src/ || echo "No Chakra UI imports found"
```

---

## Issue #3: @heroicons/react (45 KB unused)

### Problem
- 0 imports in codebase
- Dead weight

### Solution
```bash
npm uninstall @heroicons/react
```

---

## Issue #4: classnames (3.8 KB unused)

### Problem
- classnames: 0 imports
- clsx is already in use and preferred

### Solution
```bash
npm uninstall classnames
```

---

## Issue #5: react-query v3 (DEPRECATED)

### Problem
- react-query@3.39.3 is deprecated
- @tanstack/react-query@5 is the modern replacement
- Both installed, causing confusion

### Solution

**Step 1: Identify all react-query imports**
```bash
grep -r "from ['\"]react-query" src/
# Output should show 1 location
```

**Step 2: Replace import**
```bash
# Change this:
import { QueryClient } from 'react-query';

# To this:
import { QueryClient } from '@tanstack/react-query';
```

**Step 3: Remove old package**
```bash
npm uninstall react-query
```

### Files to Update
- `/home/user/emotionscare/src/lib/react-query-config.ts`
- `/home/user/emotionscare/src/tests/utils.tsx`
- `/home/user/emotionscare/src/utils/enhancedCache.ts`

---

## Issue #6: dayjs (Date library duplication - 7.5 KB)

### Problem
- BOTH date-fns AND dayjs installed
- 9 dayjs imports + 10 date-fns imports = redundancy
- Can consolidate to one library

### Solution

**Option A: Keep date-fns (more feature-rich)**

Migrate dayjs → date-fns:
```javascript
// Change from:
import dayjs from 'dayjs';
const date = dayjs();
const formatted = date.format('YYYY-MM-DD');

// To:
import { format, isoWeek } from 'date-fns';
const date = new Date();
const formatted = format(date, 'yyyy-MM-dd');
const week = isoWeek(date);
```

Files using dayjs:
- `src/store/useBreathStore.ts`
- `src/hooks/useWeeklyScan.ts`
- `src/hooks/useOrgScan.ts`
- `src/features/orchestration/__tests__/useWho5Orchestration.test.ts`
- `src/pages/b2b/reports/index.tsx`
- `src/pages/B2BReportsPage.tsx`
- `src/pages/B2BReportDetailPage.tsx`
- `src/services/breathApi.ts`

Then remove:
```bash
npm uninstall dayjs
```

---

## Issue #7: Icon Library Duplication (230 KB total)

### Problem
```
react-icons@4.12.0         (185 KB) - 1 import
@heroicons/react@2.2.0     (45 KB)  - 0 imports
@radix-ui/react-icons      (18 KB)  - Used
lucide-react               (95 KB)  - 1067 imports ← PRIMARY
```

### Solution A: Remove unused (Quick)
```bash
npm uninstall @heroicons/react
```

### Solution B: Consolidate (Better - 185 KB savings)
**Step 1:** Find the 1 react-icons import
```bash
grep -r "react-icons" src/ --include="*.ts" --include="*.tsx"
```

**Step 2:** Migrate to lucide-react equivalent
```javascript
// Change from:
import { FiSettings } from 'react-icons/fi';

// To:
import { Settings } from 'lucide-react';
```

**Step 3:** Remove react-icons
```bash
npm uninstall react-icons
```

---

## Issue #8: xlsx Library (1 HIGH vulnerability - UNAVOIDABLE)

### Problem
- `xlsx@0.18.5` has 2 unpatched vulnerabilities
- No fix available in NPM
- Cannot remove without replacing functionality

### Mitigation
```javascript
// If you must keep xlsx, at least:
// 1. Validate all input data
import { read, utils } from 'xlsx';

function safeExcelParse(file) {
  try {
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large');
    }
    
    // Sanitize data after parsing
    const workbook = read(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(sheet);
    
    // Validate data structure
    return sanitizeExcelData(data);
  } catch (error) {
    console.error('Excel parsing failed:', error);
    throw error;
  }
}
```

### Long-term Solution
Consider migration to alternatives:
```bash
# Option 1: exceljs (most popular)
npm install exceljs

# Option 2: node-xlsx
npm install node-xlsx

# Option 3: Better handling with server-side only parsing
# Move xlsx parsing to backend API
```

---

## Issue #9: esbuild (MODERATE vulnerability)

### Problem
- Current: 0.21.5 (has CVE-2025-22891)
- Fixed in: 0.27.0+

### Solution
```bash
npm install esbuild@latest
```

---

## Issue #10: cypress (Optional - potentially unused)

### Problem
- Optional dependency
- Project uses @playwright/test actively
- cypress@13.5.0 adds ~200 MB to node_modules (optional)

### Solution
```bash
# Check if cypress is used
grep -r "cypress" . --include="*.config.*" --exclude-dir=node_modules

# If not used:
npm uninstall cypress
```

---

## Full Migration Script (Automated)

```bash
#!/bin/bash

echo "=== EmotionsCare Dependency Cleanup ==="

# PHASE 1: Critical Security Fixes (No code changes)
echo "Phase 1: Security fixes..."
npm install esbuild@latest
npm uninstall vite-plugin-imagemin @chakra-ui/react @chakra-ui/icons @heroicons/react classnames

# PHASE 2: Remove deprecated packages
echo "Phase 2: Remove deprecated packages..."
npm uninstall react-query

# PHASE 3: Update imports (manual steps shown above)
echo "Phase 3: MANUAL STEPS REQUIRED"
echo "1. Update react-query → @tanstack/react-query imports"
echo "2. Update dayjs → date-fns usage"
echo "3. Update react-icons → lucide-react usage"

# Verification
echo ""
echo "=== Verification ==="
npm audit --audit-level=high
npm run build
npm run build:analyze
```

---

## Verification Checklist

After each change:

```bash
# 1. Check for import errors
npm run typecheck

# 2. Run tests
npm run test

# 3. Check security
npm audit --audit-level=high

# 4. Verify build size
npm run build:analyze

# 5. Final verification
npm ls --depth=0
```

---

## Expected Results

### Bundle Size Reduction
```
Before: ~4.8 MB (gzipped)
After:  ~4.0 MB (gzipped)
Savings: ~800 KB (17%)
```

### Vulnerability Reduction
```
Before: 39 HIGH + 4 MODERATE
After:  1 HIGH (xlsx unavoidable) + 0 MODERATE
Fixed:  38 vulnerabilities
```

### Dependency Count
```
Before: 143 production dependencies
After:  ~125 production dependencies (-18)
```

---

## Rollback Instructions (if issues)

```bash
# If you need to rollback
git checkout package.json package-lock.json
npm ci

# Or keep a backup
git stash
```

---

## Emergency Contact Points

If migration breaks something:

1. **React Query v5 Migration:**
   - Docs: https://tanstack.com/query/latest/docs/react/compat-layer
   - Breaking changes: Minor API changes

2. **date-fns vs dayjs:**
   - date-fns: More tree-shakeable
   - API differences: methods on object vs standalone functions

3. **Icon migration (lucide):**
   - Icon name changes: FiSettings → Settings
   - List: https://lucide.dev/icons

4. **xlsx alternatives:**
   - ExcelJS: Full feature parity
   - Docs: https://docs.sheetjs.com

---

## Recommended Order

1. **FIRST** (5 min, no code changes):
   - esbuild update
   - Remove @chakra-ui packages
   - Remove classnames
   - npm audit fix

2. **SECOND** (30 min, minimal code changes):
   - Remove react-query v3 (1 import location)

3. **THIRD** (2-3 hours, more code changes):
   - Remove dayjs (9 import locations)
   - Optionally: Consolidate icons

4. **VERIFY** (30 min):
   - Full test suite
   - Build analysis
   - npm audit check

---

*Last Updated: 2025-11-18*
