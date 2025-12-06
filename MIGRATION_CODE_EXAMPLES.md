# Migration Code Examples

Detailed examples for migrating away from deprecated/duplicate packages.

---

## 1. React Query v3 → v5 (@tanstack/react-query)

### Current Code (react-query v3)

**File: `/home/user/emotionscare/src/lib/react-query-config.ts`**
```typescript
import { QueryClient, QueryClientConfig } from 'react-query';
import { QueryCache, MutationCache } from 'react-query';

const queryClient = new QueryClient();
```

### Migration (No code changes needed!)

Since you're using **@tanstack/react-query v5**, the API is the same:

```typescript
import { QueryClient, QueryClientConfig } from '@tanstack/react-query';
import { QueryCache, MutationCache } from '@tanstack/react-query';

const queryClient = new QueryClient();
```

**Changes:**
1. Change import path from `'react-query'` → `'@tanstack/react-query'`
2. Everything else remains the same
3. Remove react-query v3 from package.json

### Files to Update
```bash
grep -r "from ['\"]react-query" src/
# Will find:
# src/lib/react-query-config.ts
# src/tests/utils.tsx  
# src/utils/enhancedCache.ts
```

### Step-by-Step

**Step 1:** Find and replace import statements
```bash
cd src/
# Find all occurrences
grep -r "from ['\"]react-query" .

# Replace with sed
sed -i "s/from ['\"']react-query['\"]]/from '@tanstack\/react-query'/g" **/*.ts **/*.tsx
```

**Step 2:** Verify replacements
```bash
grep -r "from ['\"]react-query" .  # Should return 0
grep -r "@tanstack/react-query" .  # Should show your updates
```

**Step 3:** Remove old package
```bash
npm uninstall react-query
```

**Step 4:** Verify no import errors
```bash
npm run typecheck
```

---

## 2. dayjs → date-fns (Date Library Consolidation)

### Current Code (dayjs)

**File: `/home/user/emotionscare/src/store/useBreathStore.ts`**
```typescript
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

// Usage examples
const today = dayjs();
const formatted = today.format('YYYY-MM-DD HH:mm:ss');
const isoWeekNum = today.isoWeek();
const nextWeek = today.add(7, 'day');
const startOfWeek = today.startOf('week');
```

### Migration (date-fns)

```typescript
import { 
  format, 
  addDays, 
  startOfWeek, 
  getISOWeek,
  getTime
} from 'date-fns';
import { fr } from 'date-fns/locale';

// Usage examples - equivalent to above
const today = new Date();
const formatted = format(today, 'yyyy-MM-dd HH:mm:ss');
const isoWeekNum = getISOWeek(today);
const nextWeek = addDays(today, 7);
const startOfWeekDate = startOfWeek(today);
```

### Common Conversions

| dayjs | date-fns |
|-------|----------|
| `dayjs()` | `new Date()` |
| `dayjs(timestamp)` | `new Date(timestamp)` |
| `dayjs('2024-01-01')` | `parse('2024-01-01', 'yyyy-MM-dd', new Date())` |
| `.format('YYYY-MM-DD')` | `format(date, 'yyyy-MM-dd')` |
| `.add(7, 'day')` | `addDays(date, 7)` |
| `.subtract(1, 'month')` | `subMonths(date, 1)` |
| `.startOf('week')` | `startOfWeek(date)` |
| `.endOf('month')` | `endOfMonth(date)` |
| `.isoWeek()` | `getISOWeek(date)` |
| `.isAfter()` | `isAfter(date1, date2)` |
| `.isBefore()` | `isBefore(date1, date2)` |
| `.isSame()` | `isSameDay(date1, date2)` |

### File-by-File Migration

**File 1: `src/store/useBreathStore.ts`**

```diff
- import dayjs from 'dayjs';
- import isoWeek from 'dayjs/plugin/isoWeek';
- dayjs.extend(isoWeek);

+ import { format, addDays, getISOWeek } from 'date-fns';

  function trackBreath() {
-   const timestamp = dayjs().valueOf();
+   const timestamp = new Date().getTime();
-   const weekNum = dayjs().isoWeek();
+   const weekNum = getISOWeek(new Date());
  }
```

**File 2: `src/hooks/useWeeklyScan.ts`**

```diff
- import dayjs from 'dayjs';
+ import { startOfWeek, endOfWeek, format } from 'date-fns';

  function getWeekRange() {
-   const start = dayjs().startOf('week');
-   const end = dayjs().endOf('week');
-   return {
-     start: start.toDate(),
-     end: end.toDate(),
-   };
+   const now = new Date();
+   return {
+     start: startOfWeek(now),
+     end: endOfWeek(now),
+   };
  }
```

**File 3: `src/hooks/useOrgScan.ts`**

```diff
- import dayjs from 'dayjs';
+ import { format, subDays } from 'date-fns';
+ import { fr } from 'date-fns/locale';

  function formatDate(date: Date) {
-   return dayjs(date).format('YYYY-MM-DD');
+   return format(date, 'yyyy-MM-dd');
  }

  function getLast30Days() {
-   return dayjs().subtract(30, 'days').toDate();
+   return subDays(new Date(), 30);
  }
```

**Complete the migration for remaining files:**
- `src/features/orchestration/__tests__/useWho5Orchestration.test.ts`
- `src/pages/b2b/reports/index.tsx`
- `src/pages/B2BReportsPage.tsx`
- `src/pages/B2BReportDetailPage.tsx`
- `src/services/breathApi.ts`

### Final Step

```bash
npm uninstall dayjs
npm run typecheck
npm run test
```

---

## 3. react-icons → lucide-react (Icon Library)

### Current Code (react-icons)

Find the usage:
```bash
grep -r "react-icons" src/
```

Example (typically in a component):
```typescript
import { FiSettings, FiUser, FiHome } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

export function Header() {
  return (
    <>
      <FiSettings />
      <FiUser />
      <MdDashboard />
    </>
  );
}
```

### Migration (lucide-react)

```typescript
import { Settings, User, Home, LayoutDashboard } from 'lucide-react';

export function Header() {
  return (
    <>
      <Settings />
      <User />
      <LayoutDashboard />
    </>
  );
}
```

### Icon Name Mapping

| react-icons | lucide-react | Notes |
|-------------|-------------|-------|
| `FiSettings` | `Settings` | Same name |
| `FiUser` | `User` | Same name |
| `FiHome` | `Home` | Same name |
| `MdDashboard` | `LayoutDashboard` | Slightly different |
| `IoCheckmark` | `Check` | Renamed |
| `BsArrowRight` | `ArrowRight` | Same name |

### Icon Finding Tool
Visit https://lucide.dev to search for icon equivalents

### Migration Script

```bash
#!/bin/bash
# Find the one react-icons import location
echo "Searching for react-icons usage..."
REACT_ICONS_FILE=$(grep -r "react-icons" src/ --include="*.ts" --include="*.tsx" | cut -d: -f1 | head -1)

if [ -z "$REACT_ICONS_FILE" ]; then
  echo "No react-icons imports found!"
  exit 0
fi

echo "Found in: $REACT_ICONS_FILE"
echo ""
echo "Manual steps required:"
echo "1. Open: $REACT_ICONS_FILE"
echo "2. Find all react-icons imports"
echo "3. Map to lucide-react equivalents"
echo "4. Replace imports"
echo "5. Run: npm uninstall react-icons"
```

### Post-Migration

```bash
# Verify
grep -r "react-icons" src/ || echo "No react-icons imports found"

# Uninstall
npm uninstall react-icons

# Test
npm run typecheck
npm run build
```

---

## 4. Chakra UI Removal (Complete)

### Current Code (Chakra UI)
```typescript
import { Button, Box, Text } from '@chakra-ui/react';

export function MyComponent() {
  return (
    <Box padding={4}>
      <Text>Hello</Text>
      <Button>Click me</Button>
    </Box>
  );
}
```

### Problem
**NO CODE USES CHAKRA UI** - it's entirely unused!

### Solution
Simply delete the packages:
```bash
npm uninstall @chakra-ui/react @chakra-ui/icons
```

### Verification
```bash
# Should return 0 files
grep -r "@chakra-ui" src/ | wc -l

# Confirm
grep -r "@chakra-ui" src/ || echo "✓ Chakra UI completely removed"
```

---

## 5. classnames Removal

### Current Code (classnames)
```typescript
import classnames from 'classnames';

const buttonClass = classnames(
  'px-4 py-2',
  'rounded-md',
  {
    'bg-blue-500': isPrimary,
    'bg-gray-500': !isPrimary,
  },
  disabled && 'opacity-50'
);
```

### Migration (clsx - already in use)
```typescript
import clsx from 'clsx';

const buttonClass = clsx(
  'px-4 py-2',
  'rounded-md',
  {
    'bg-blue-500': isPrimary,
    'bg-gray-500': !isPrimary,
  },
  disabled && 'opacity-50'
);
```

### Verification
```bash
# Find classnames usage
grep -r "classnames" src/ || echo "No classnames found"

# Remove
npm uninstall classnames
```

---

## 6. @heroicons Removal

### Problem
**NOT A SINGLE IMPORT** - completely unused

### Solution
```bash
npm uninstall @heroicons/react

# Verify
grep -r "@heroicons" src/ || echo "✓ @heroicons removed"
```

---

## 7. esbuild Update (No Code Changes)

### Current
```json
{
  "esbuild": "0.21.5"  // Has CVE-2025-22891
}
```

### Solution
```bash
npm install esbuild@latest

# Verify in package.json
jq '.dependencies.esbuild' package.json
```

### No Code Changes Required
This is a build tool update - no source code affected.

---

## Complete Migration Checklist

- [ ] React Query v3 → v5
  - [ ] Update imports in 3 files
  - [ ] Test: `npm run typecheck`
  - [ ] Remove: `npm uninstall react-query`

- [ ] dayjs → date-fns
  - [ ] Migrate 8 files with dayjs usage
  - [ ] Update all usage patterns
  - [ ] Test: `npm run test`
  - [ ] Remove: `npm uninstall dayjs`

- [ ] Icon consolidation
  - [ ] Find 1 react-icons usage
  - [ ] Map to lucide-react
  - [ ] Remove: `npm uninstall react-icons`
  - [ ] Remove: `npm uninstall @heroicons/react`

- [ ] Dead code removal
  - [ ] Remove: `npm uninstall @chakra-ui/react @chakra-ui/icons classnames`

- [ ] Security updates
  - [ ] Update: `npm install esbuild@latest`
  - [ ] Remove: `npm uninstall vite-plugin-imagemin`

- [ ] Verification
  - [ ] `npm run typecheck` - no errors
  - [ ] `npm run test` - tests pass
  - [ ] `npm audit` - check remaining vulnerabilities
  - [ ] `npm run build` - build succeeds

---

## Testing Template

Create a test file to verify migrations:

**File: `src/migrations.test.ts`**
```typescript
import { describe, it, expect } from 'vitest';
import { format, addDays } from 'date-fns';

describe('Migration Tests', () => {
  it('date-fns should replace dayjs functionality', () => {
    const today = new Date('2024-01-15');
    const nextWeek = addDays(today, 7);
    
    expect(format(nextWeek, 'yyyy-MM-dd')).toBe('2024-01-22');
  });

  it('lucide-react should have icon equivalents', () => {
    // Verify lucide-react exports
    import('lucide-react').then(module => {
      expect(module.Settings).toBeDefined();
      expect(module.User).toBeDefined();
    });
  });

  it('@tanstack/react-query should work like react-query', async () => {
    const { QueryClient } = await import('@tanstack/react-query');
    const client = new QueryClient();
    expect(client).toBeDefined();
  });
});
```

Run with:
```bash
npm run test -- src/migrations.test.ts
```

---

## Rollback Procedure (If Issues Arise)

```bash
# If migration causes issues:
git diff package.json  # See what changed
git checkout package.json package-lock.json
npm ci  # Clean install with original packages

# Or keep a backup branch:
git branch -b backup-pre-migration
git checkout main  # Go back to main
```

---

## Performance Check

After migrations:
```bash
npm run build:analyze
```

Expected improvements:
- Bundle size: -17% (~800 KB)
- Vulnerabilities: -38 (from 39 HIGH to 1)
- Dependencies: -18 packages

---

*Reference: 2025-11-18*
