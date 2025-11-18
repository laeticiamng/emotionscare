# Accessibility Action Items - Quick Reference

**Priority**: CRITICAL → HIGH → MEDIUM  
**Total Issues**: 25+  
**Est. Effort**: 23 hours over 4 weeks  
**Compliance Target**: WCAG 2.1 AA (100%)

---

## PHASE 1: CRITICAL (Week 1 - 3 hours)

### Task 1.1: Enable jsx-a11y ESLint Plugin
**Status**: TODO  
**Severity**: 🔴 CRITICAL  
**Effort**: 15 minutes  
**Impact**: Prevents new violations automatically

**What**: Add eslint-plugin-jsx-a11y to eslint.config.js  
**Files**: `/home/user/emotionscare/eslint.config.js`  
**Action**:
```bash
# 1. Edit eslint.config.js
# 2. Add import: import jsxA11y from 'eslint-plugin-jsx-a11y';
# 3. Add to plugins section
# 4. Add 11 rules (see full audit report)
# 5. Run: npm run lint
```

**Verification**:
```bash
npm run lint | grep "jsx-a11y"
```

---

### Task 1.2: Fix Non-Interactive Clickable Divs
**Status**: TODO  
**Severity**: 🔴 CRITICAL  
**Effort**: 30 minutes  
**Impact**: Keyboard users can interact

**Issues Found**: 3 instances

#### Issue 1.2a: enhanced-navigation.tsx backdrop
**File**: `/home/user/emotionscare/src/components/ui/enhanced-navigation.tsx`  
**Line**: ~180-185  
**Problem**: `<div onClick={} />` - no keyboard support  
**Fix**: Convert to `<button>` with `aria-label`

#### Issue 1.2b: enhanced-accessibility.tsx backdrop
**File**: `/home/user/emotionscare/src/components/ui/enhanced-accessibility.tsx`  
**Line**: ~170+  
**Problem**: `<div onClick={} />` - no keyboard support  
**Fix**: Convert to `<button>` with `aria-label`

#### Issue 1.2c: InAppNotificationCenter items
**File**: `/home/user/emotionscare/src/components/InAppNotificationCenter.tsx`  
**Lines**: 112-158  
**Problem**: `<motion.div onClick={} />` - notification items not keyboard accessible  
**Fix**: Convert to `<motion.button>` with proper ARIA

**Test After**:
```bash
# 1. Click through with Tab key
# 2. Press Enter on focused elements
# 3. Screen reader announces action
```

---

### Task 1.3: Add aria-expanded to Collapsible Components
**Status**: TODO  
**Severity**: 🔴 HIGH  
**Effort**: 45 minutes  
**Impact**: Screen readers announce state

**Components to Fix**: 9 instances
- GlobalNav.tsx (Line 59)
- ConsentBanner.tsx (Line 152)
- HelpSearch.tsx
- All Radix UI wrappers

**Pattern**:
```tsx
// BEFORE
const [open, setOpen] = useState(false);
<button onClick={() => setOpen(!open)}>Menu</button>

// AFTER
const [open, setOpen] = useState(false);
<button 
  aria-expanded={open}
  onClick={() => setOpen(!open)}
>Menu</button>
```

**Files to Update** (minimum):
1. `/home/user/emotionscare/src/components/GlobalNav.tsx`
2. `/home/user/emotionscare/src/components/ConsentBanner.tsx`

---

### Task 1.4: Add aria-label to Icon-Only Buttons
**Status**: TODO  
**Severity**: 🔴 HIGH  
**Effort**: 20 minutes  
**Impact**: Screen readers announce button purpose

**Pattern**:
```tsx
// BEFORE
<Button size="icon"><X /></Button>

// AFTER
<Button size="icon" aria-label="Close dialog"><X /></Button>
```

**Quick Find**:
```bash
grep -r "size=\"icon\"" src/components --include="*.tsx" | wc -l
```

**Files with Most Issues**:
1. InAppNotificationCenter.tsx (2-3 buttons)
2. ConsentBanner.tsx (1-2 buttons)
3. GlobalNav.tsx (1 button)

---

## PHASE 2: HIGH PRIORITY (Week 2 - 4 hours)

### Task 2.1: Fix Hidden File Input Labels
**Status**: TODO  
**Severity**: 🟠 HIGH  
**Effort**: 20 minutes  
**Impact**: Keyboard users can access file uploads

**Issues Found**: 2 instances

#### Issue 2.1a: JournalBackup.tsx
**File**: `/home/user/emotionscare/src/components/journal/JournalBackup.tsx`  
**Lines**: 124-141

```tsx
// BEFORE
<input type="file" className="hidden" id="backup-file-input" onChange={handle} />
<Button onClick={() => fileInputRef.current?.click()}>Restore</Button>

// AFTER
<label htmlFor="backup-file-input" className="sr-only">Select backup file</label>
<input 
  type="file" 
  className="sr-only" 
  id="backup-file-input"
  onChange={handle}
  aria-label="Backup file"
/>
<Button 
  onClick={() => fileInputRef.current?.click()}
  aria-label="Restore backup from file"
>Restore</Button>
```

#### Issue 2.1b: JournalPhotoUpload.tsx
**File**: `/home/user/emotionscare/src/components/journal/JournalPhotoUpload.tsx`  
**Similar pattern**: Apply same fix

**Test**:
```bash
# 1. Tab to "Restore" button
# 2. Screen reader announces full label
```

---

### Task 2.2: Image Alt Text Audit & Fix
**Status**: TODO  
**Severity**: 🟠 HIGH  
**Effort**: 30 minutes  
**Impact**: Screen reader users understand images

**Audit Command**:
```bash
grep -r "<img" src/components --include="*.tsx" | grep -v "alt=" | head -20
```

**Standards**:
- Functional images: `alt="descriptive text"` (required)
- Decorative images: `alt=""` AND `aria-hidden="true"` (required)
- Avatar images: `alt="Avatar for username"` (recommended)

**Files to Check**:
1. `/src/components/ui/OptimizedImage.tsx` - Check all instances
2. `/src/components/ui/optimized-image.tsx` - Some may be missing alt
3. `/src/components/story/PosterArt.tsx` - Verify consistency
4. All component directories

---

### Task 2.3: Form Field Label Audit
**Status**: TODO  
**Severity**: 🟠 HIGH  
**Effort**: 1-2 hours  
**Impact**: Screen readers announce input purpose

**Requirement**: Every form input MUST have ONE of:
1. Associated `<label htmlFor="id">` element (BEST)
2. `aria-label="description"` (GOOD)
3. `aria-labelledby="id"` (GOOD)

**Files to Audit**:
1. `/src/components/ui/input.tsx` - Base component
2. `/src/components/ui/enhanced-form.tsx` - Form wrapper
3. `/src/features/clinical-optin/ConsentDialog.tsx` - Dialog form
4. All form pages

**Common Pattern - Fix Template**:
```tsx
// BEFORE
<label>Email</label>
<input type="email" />

// AFTER
<label htmlFor="email-input">Email</label>
<input id="email-input" type="email" />
```

---

### Task 2.4: Focus Indicator Review
**Status**: TODO  
**Severity**: 🟠 MEDIUM  
**Effort**: 20 minutes  
**Impact**: Keyboard users see focus

**Find Problem Cases**:
```bash
grep -r "focus-visible:ring-0" src/ --include="*.tsx"
```

**Issue**: `/src/features/clinical-optin/ConsentDialog.tsx` line 38
```tsx
// PROBLEM
<AlertDialogContent className="max-w-lg focus-visible:ring-0">

// FIX - Remove the ring-0
<AlertDialogContent className="max-w-lg">
```

**Test**:
```bash
# 1. Tab through entire page
# 2. Should see clear focus ring on all elements
# 3. Ring should have 4.5:1 contrast (AA standard)
```

---

## PHASE 3: MEDIUM PRIORITY (Week 3-4 - 6 hours)

### Task 3.1: Color Contrast Validation
**Status**: TODO  
**Severity**: 🟡 MEDIUM  
**Effort**: 45 minutes  
**Impact**: Color blind users can read

**Required Ratios**:
- Normal text: 4.5:1 (AA minimum)
- Large text: 3:1 (AA minimum)
- UI components: 3:1 (AA minimum)

**Areas to Test**:
1. Muted foreground text
2. Primary/secondary color combos
3. Error state colors
4. Disabled button appearance

**Tools**:
- Chrome DevTools Lighthouse
- axe DevTools
- WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

**Quick Test**:
```bash
# 1. Run Chrome DevTools → Accessibility
# 2. Check "Contrast issues"
# 3. Test with 200% zoom
```

---

### Task 3.2: Semantic HTML Structure
**Status**: TODO  
**Severity**: 🟡 MEDIUM  
**Effort**: 1 hour  
**Impact**: Screen readers understand page structure

**Checklist**:
- [ ] All pages have exactly one `<h1>`
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] All pages have `<main>` landmark
- [ ] Navigation in `<nav>` elements
- [ ] Lists in `<ul>` or `<ol>`

**Audit Command**:
```bash
grep -r "<h[1-6]" src/pages --include="*.tsx" | sort
```

**Fix**:
```tsx
// BEFORE
<div className="page">
  <h2>Welcome</h2>
  <h4>Section</h4>

// AFTER
<main>
  <h1>Page Title</h1>
  <h2>Section</h2>
  <h3>Subsection</h3>
</main>
```

---

### Task 3.3: ARIA Attributes Complete Audit
**Status**: TODO  
**Severity**: 🟡 MEDIUM  
**Effort**: 2 hours  
**Impact**: Complete screen reader information

**Missing Patterns**:
1. `aria-label` on icon buttons (20+ instances)
2. `aria-describedby` on complex elements
3. `aria-labelledby` on related elements
4. `role="alert"` on error messages
5. `aria-live="polite"` on status updates

**Audit Commands**:
```bash
# Find icon buttons without labels
grep -r "size=\"icon\"" src/components | grep -v "aria-label"

# Find buttons without text
grep -r "<button>" src/components | grep -v ">.*[a-z]" | head -20
```

---

### Task 3.4: Screen Reader Testing
**Status**: TODO  
**Severity**: 🟡 MEDIUM  
**Effort**: 2 hours  
**Impact**: Real user validation

**Tools**:
- Windows: NVDA (free) - https://www.nvaccess.org/
- Mac: VoiceOver (built-in) - Cmd+F5
- Mobile: TalkBack (Android), VoiceOver (iOS)

**Test Script**:
```
1. Enable screen reader
2. Navigate with Tab/Arrow keys
3. Verify all interactive elements are announced
4. Check form labels are clear
5. Verify error messages are heard
6. Test link destinations
```

---

## PHASE 4: POLISH (Ongoing - 2 hours/week)

### Task 4.1: Automated Testing Setup
**Status**: TODO  
**Effort**: 3 hours  
**Impact**: Prevent regressions

**Add to CI/CD**:
```bash
# 1. jest-axe for unit tests
npm install --save-dev jest-axe

# 2. Add to test files
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

# 3. Test components
it('should have no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

### Task 4.2: Documentation & Training
**Status**: TODO  
**Effort**: 2 hours  
**Impact**: Team knowledge

**Create**:
- [ ] A11y coding guidelines
- [ ] Testing checklist
- [ ] Component a11y requirements
- [ ] Quick reference card

---

### Task 4.3: Maintenance & Monitoring
**Status**: TODO  
**Effort**: 1 hour/week  
**Impact**: Stay compliant

**Checklist**:
- [ ] Weekly a11y lint check
- [ ] Monthly manual audit
- [ ] Quarterly team review
- [ ] User feedback collection

---

## Testing Checklist (After Each Fix)

```
[ ] Run npm run lint (check jsx-a11y rules)
[ ] Run npm run test:e2e (axe-core scan)
[ ] Manual keyboard test (Tab through)
[ ] Screen reader test (NVDA/VoiceOver)
[ ] Zoom test (200% browser zoom)
[ ] Color blind test (use browser extension)
```

---

## Quick Reference: File Locations

### Critical Files
1. **ESLint Config**: `/home/user/emotionscare/eslint.config.js`
2. **Interactive Divs**: 
   - `/src/components/ui/enhanced-navigation.tsx` (line ~180)
   - `/src/components/ui/enhanced-accessibility.tsx` (line ~170)
   - `/src/components/InAppNotificationCenter.tsx` (line 112-158)

3. **Collapsible State**: 
   - `/src/components/GlobalNav.tsx` (line 59)
   - `/src/components/ConsentBanner.tsx` (line 152)

4. **Hidden Inputs**:
   - `/src/components/journal/JournalBackup.tsx` (line 124-141)
   - `/src/components/journal/JournalPhotoUpload.tsx`

5. **Focus Issues**:
   - `/src/features/clinical-optin/ConsentDialog.tsx` (line 38)

### Testing Files
- E2E Tests: `/tests/e2e/a11y.spec.ts`
- A11y Utils: `/src/lib/accessibility-checker.ts`
- A11y Styles: `/src/styles/accessibility.css`

---

## Commands Reference

```bash
# Check for jsx-a11y violations
npm run lint | grep jsx-a11y

# Run accessibility E2E tests
npm run test:e2e -- --grep "Accessibilité"

# Check for non-accessible divs
grep -r "<div.*onClick" src/components --include="*.tsx"

# Check image alt attributes
grep -r "<img" src/components --include="*.tsx" | grep -v "alt="

# Find hidden inputs
grep -r "type=\"file\"" src/components --include="*.tsx" -A 3

# Find buttons without aria-label (icon buttons)
grep -r "size=\"icon\"" src/components --include="*.tsx" | grep -v "aria-label"

# Build and verify
npm run build
npm run typecheck
npm run test
```

---

## Success Metrics

After completing all phases:
```
✓ 0 critical jsx-a11y violations
✓ 0 non-interactive clickables
✓ 100% buttons have labels
✓ 100% images have alt text
✓ 100% form fields have labels
✓ 0 missing aria-expanded states
✓ All links have keyboard access
✓ Tab order is logical
✓ Focus visible on all elements
✓ Color contrast 4.5:1 minimum
✓ No auto-playing media
✓ Prefers-reduced-motion respected
✓ Landmarks present (<main>, <nav>)
✓ Heading hierarchy correct
✓ Error messages clear and accessible
✓ Screen reader compatible
✓ Keyboard navigable
✓ WCAG 2.1 AA Compliant (100%)
```

---

## Contacts & Resources

### Internal
- QA/Testing Lead: TBD
- Design/Brand: TBD
- Product Manager: TBD

### External Resources
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- Radix UI A11y: https://www.radix-ui.com/docs/accessibility
- MDN ARIA: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
- WebAIM: https://webaim.org/

### Tools
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/
- Lighthouse: Built into Chrome DevTools
- NVDA: https://www.nvaccess.org/ (free screen reader)

---

**Last Updated**: 2025-11-18  
**Next Review**: 2025-12-18 (Monthly)

