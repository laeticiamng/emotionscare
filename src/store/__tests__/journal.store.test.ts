import { beforeEach, describe, expect, it } from 'vitest';

import { useJournalStore, type JournalEntry } from '../journal.store';

const buildEntry = (overrides: Partial<JournalEntry> = {}): JournalEntry => ({
  entry_id: overrides.entry_id ?? 'entry-1',
  created_at: overrides.created_at ?? '2025-06-06T08:00:00.000Z',
  mode: overrides.mode ?? 'text',
  mood_bucket: overrides.mood_bucket ?? 'clear',
  summary: overrides.summary ?? 'Résumé synthétique',
  suggestion: overrides.suggestion,
  transcript_url: overrides.transcript_url,
  media_url: overrides.media_url,
});

describe('useJournalStore', () => {
  beforeEach(() => {
    useJournalStore.setState({
      recording: false,
      uploading: false,
      currentEntry: undefined,
      entries: [],
      searchQuery: '',
    });
  });

  it('toggles recording and uploading flags independently', () => {
    const { setRecording, setUploading } = useJournalStore.getState();

    setRecording(true);
    setUploading(true);

    expect(useJournalStore.getState().recording).toBe(true);
    expect(useJournalStore.getState().uploading).toBe(true);

    setRecording(false);
    setUploading(false);

    expect(useJournalStore.getState().recording).toBe(false);
    expect(useJournalStore.getState().uploading).toBe(false);
  });

  it('pushes new entries at the top of the feed', () => {
    const entryA = buildEntry({ entry_id: 'entry-a' });
    const entryB = buildEntry({ entry_id: 'entry-b' });

    const { addEntry } = useJournalStore.getState();

    addEntry(entryA);
    addEntry(entryB);

    const { entries } = useJournalStore.getState();
    expect(entries).toHaveLength(2);
    expect(entries[0]).toEqual(entryB);
    expect(entries[1]).toEqual(entryA);
  });

  it('replaces the entire feed when setEntries is called', () => {
    const initial = [buildEntry({ entry_id: 'old-entry' })];
    const replacement = [buildEntry({ entry_id: 'replacement-1' }), buildEntry({ entry_id: 'replacement-2' })];

    useJournalStore.setState({ entries: initial });
    useJournalStore.getState().setEntries(replacement);

    expect(useJournalStore.getState().entries).toEqual(replacement);
  });

  it('stores the current entry and search query for detail view interactions', () => {
    const current = buildEntry({ entry_id: 'detail-entry', suggestion: 'Respiration profonde' });

    const { setCurrentEntry, setSearchQuery } = useJournalStore.getState();

    setCurrentEntry(current);
    setSearchQuery('#gratitude');

    const state = useJournalStore.getState();
    expect(state.currentEntry).toEqual(current);
    expect(state.searchQuery).toBe('#gratitude');
  });
});
