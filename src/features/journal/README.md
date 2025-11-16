# Journal Feature

This directory contains all code related to the journal/diary functionality.

## Structure

```
journal/
├── components/          # React components specific to journal
│   ├── JournalEditor.tsx
│   ├── JournalList.tsx
│   ├── JournalCard.tsx
│   └── index.ts
├── hooks/              # Custom hooks for journal
│   ├── useJournalEntries.ts
│   ├── useCreateEntry.ts
│   ├── useUpdateEntry.ts
│   ├── useDeleteEntry.ts
│   └── index.ts
├── services/           # API client and business logic
│   ├── journalApi.ts
│   ├── journalService.ts
│   └── index.ts
├── types/              # Local types (if not in contracts)
│   └── index.ts
└── index.ts            # Public exports
```

## Usage

```typescript
// Import from the feature
import { JournalEditor, useJournalEntries } from '@/features/journal';

// Or import specific items
import { JournalList } from '@/features/journal/components';
import { useCreateEntry } from '@/features/journal/hooks';
```

## Guidelines

1. **Keep it cohesive**: All journal-related code lives here
2. **Export publicly**: Only export what's needed by other features via `index.ts`
3. **Use contracts**: Import types and schemas from `@emotionscare/contracts`
4. **Avoid cross-feature imports**: If you need something from another feature, consider moving it to `src/shared/`
