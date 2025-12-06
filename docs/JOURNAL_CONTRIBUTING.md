# 🤝 Contributing to Journal Module

Thank you for your interest in contributing! This guide will help you get started.

---

## 📋 Table of Contents

1. [Development Setup](#development-setup)
2. [Code Standards](#code-standards)
3. [Testing](#testing)
4. [Pull Request Process](#pull-request-process)
5. [Project Structure](#project-structure)

---

## 🚀 Development Setup

### Prerequisites
- Node.js 20.x
- npm (not bun - incompatible with @vitest/browser)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/emotionscare.git
cd emotionscare

# Install dependencies
npm ci

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Running Tests

```bash
# Unit + Integration tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# E2E tests
npm run test:e2e

# Performance tests
npm test -- src/modules/journal/__tests__/performance.test.ts
```

---

## 📝 Code Standards

### TypeScript
- ✅ **Strict mode enabled** (`"strict": true`)
- ✅ **No `@ts-nocheck`** annotations allowed
- ✅ **100% type coverage** - all props, returns typed
- ✅ **Interfaces over types** for objects

### Naming Conventions
- **Components:** `PascalCase.tsx` (JournalComposer.tsx)
- **Hooks:** `camelCase.ts` with `use` prefix (useJournalComposer.ts)
- **Services:** `camelCase.ts` (journalService.ts)
- **Types:** `PascalCase` interfaces (JournalEntry)
- **Constants:** `UPPER_SNAKE_CASE`

### File Organization
- **Max 7 files per directory** - split if exceeded
- **Colocation:** Tests near source (`__tests__/` subfolder)
- **Index exports:** Public API in `index.ts`

### React Best Practices
```typescript
// ✅ Good: Arrow function + memo
export const JournalComposer = memo<JournalComposerProps>(({ ... }) => {
  // Component logic
});

// ✅ Good: Typed props
interface JournalComposerProps {
  onSubmit: (note: Note) => Promise<void>;
  initialTags?: string[];
}

// ✅ Good: JSDoc for public components
/**
 * Journal composer for creating voice or text notes
 * @param onSubmit - Callback when note is submitted
 * @param initialTags - Optional initial tags
 */
```

### ESLint & Prettier
```bash
# Lint check
npm run lint

# Format check
npm run format:check

# Auto-fix
npm run lint -- --fix
npm run format
```

---

## 🧪 Testing

### Coverage Requirements
- ✅ **≥ 90% lines coverage**
- ✅ **≥ 85% branches coverage**
- ✅ **All critical paths tested**
- ✅ **Regression tests for bugs**

### Test Structure

**Unit Tests** (`*.test.tsx`)
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JournalComposer } from '../JournalComposer';

describe('JournalComposer', () => {
  it('should submit text note on form submit', async () => {
    const onSubmit = vi.fn();
    render(<JournalComposer onSubmit={onSubmit} />);
    
    await userEvent.type(screen.getByRole('textbox'), 'My note');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'My note' })
    );
  });
});
```

**Integration Tests** (`*.integration.test.tsx`)
```typescript
it('should use prompt in composer', async () => {
  render(<JournalView />);
  
  await userEvent.click(screen.getByText(/use this prompt/i));
  
  expect(screen.getByRole('textbox')).toHaveValue('Prompt text');
});
```

**E2E Tests** (`e2e/*.spec.ts`)
```typescript
test('create journal reminder', async ({ page }) => {
  await page.goto('/settings/journal');
  await page.click('text=Add Reminder');
  // ... test steps
});
```

### Testing Best Practices
- ✅ Use `getByRole` / `getByLabelText` over `getByTestId`
- ✅ Test user behavior, not implementation
- ✅ Mock external dependencies (Supabase, Edge Functions)
- ✅ Clean up after each test

---

## 🔄 Pull Request Process

### Branch Naming
```
feature/journal-export-pdf
fix/journal-reminder-validation
refactor/journal-composer-cleanup
docs/journal-architecture-update
```

### Commit Messages
```
feat(journal): add export to PDF functionality
fix(journal): validate reminder time format
refactor(journal): simplify composer state management
docs(journal): update architecture diagrams
test(journal): add E2E tests for settings page
```

### PR Checklist
Before submitting a PR, ensure:

- [ ] Code follows TypeScript strict mode (0 errors)
- [ ] All tests pass (`npm test`)
- [ ] Coverage meets thresholds (≥ 90% lines)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatted (`npm run format:check`)
- [ ] No `@ts-nocheck` or `console.log` left
- [ ] Documentation updated (if needed)
- [ ] Accessibility verified (keyboard nav, ARIA labels)
- [ ] No performance regression
- [ ] Changelog updated (if user-facing change)

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- Unit tests added/updated
- Integration tests added/updated
- E2E tests added/updated
- Manual testing performed

## Screenshots (if UI change)
[Add screenshots]

## Checklist
- [ ] All tests pass
- [ ] TypeScript strict mode
- [ ] Accessibility verified
- [ ] Documentation updated
```

---

## 📁 Project Structure

When adding new files, follow this structure:

```
src/modules/journal/
├── components/           # Business components
│   ├── MyComponent.tsx
│   └── __tests__/
│       └── MyComponent.test.tsx
├── ui/                  # Atomic UI components
├── __tests__/           # Module-level tests
├── hooks/               # Custom hooks (if needed)
├── index.ts             # Public exports
├── types.ts             # TypeScript types
└── *.service.ts         # Services
```

### Adding a New Component
1. Create component file in appropriate folder
2. Create test file in `__tests__/` subfolder
3. Export from `index.ts` if public
4. Update documentation if needed

### Adding a New Hook
1. Create hook file with `use` prefix
2. Create comprehensive tests
3. Document parameters and return type
4. Export from `index.ts`

---

## 🐛 Debugging

### Browser DevTools
- React DevTools: Inspect component tree
- Network tab: Check API calls
- Console: View logs (remove before commit!)

### Supabase Debugging
```typescript
// Enable query logging
const { data, error } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', userId);

console.log('Query result:', { data, error }); // Remove before commit
```

### Testing Debugging
```bash
# Run single test file
npm test -- JournalComposer.test.tsx

# Debug mode
npm test -- --inspect-brk

# UI mode (Vitest)
npm test -- --ui
```

---

## 📞 Getting Help

- **Questions:** Open a GitHub Discussion
- **Bugs:** Open a GitHub Issue with reproduction steps
- **Security:** Email security@emotionscare.com

---

**Happy Contributing! 🎉**
