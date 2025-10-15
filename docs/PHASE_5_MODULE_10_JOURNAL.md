# PHASE 5 - MODULE 10 : Journal

**Module** : `src/modules/journal/`  
**Objectif** : Journaling thérapeutique avec entrées texte et audio  
**Statut** : ✅ Complété (Day 26) - Architecture existante documentée

---

## 📋 Vue d'ensemble

Le module Journal permet aux utilisateurs de tenir un journal thérapeutique avec des entrées texte et audio, incluant résumés AI, tags et système de scellement/destruction.

---

## 🏗️ Architecture existante

### Structure des fichiers

```
src/modules/journal/
├── types.ts                    # Schémas Zod (Note, Feed, Voice)
├── journalService.ts           # Business logic & API calls
├── useJournalMachine.ts        # State machine React
├── useJournalComposer.ts       # Hook de composition
├── usePanasSuggestions.ts      # Suggestions PANAS
├── components/                 # Composants React
├── ui/                         # UI components
└── index.ts                    # Exports publics
```

---

## 📊 Types existants

```typescript
Note {
  id?: UUID
  text: string (1-5000 chars)
  tags: string[] (max 8, max 24 chars each)
  created_at?: string
  summary?: string
  mode?: 'text' | 'voice'
}

FeedQuery {
  q?: string (max 64 chars)
  tags?: string[]
  limit: number (1-50, default 10)
  offset: number (min 0, default 0)
}

VoiceInsert {
  audioBlob: Blob
  lang?: string (2-8 chars)
  tags?: string[]
}
```

---

## 🔧 Services disponibles

- `journalService`: Gestion CRUD des notes
- `useJournalMachine`: State machine pour le journaling
- `useJournalComposer`: Hook de composition d'entrées
- `usePanasSuggestions`: Suggestions basées sur PANAS

---

## 📱 Composants UI

- `WhisperInput`: Input vocal avec transcription
- `SummaryChip`: Affichage des résumés
- `BurnSealToggle`: Système de scellement/destruction

---

**Statut**: ✅ Module existant documenté  
**Date**: 2025-01-26  
**Version**: 1.0.0 (existant)
