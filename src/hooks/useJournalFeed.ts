import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  createJournalTextEntry,
  fetchJournalFeed,
  JournalFeedEntry,
  mapLocalEntry,
} from '@/services/journalFeed.service';
import { loadEntries, upsertEntry, JournalEntryRec } from '@/lib/journal/store';
import { sanitizeInput as sanitizePlain } from '@/lib/validation/dataValidator';

const LOCAL_CREATE_EVENT = 'local-journal-update';

const emitLocalEvent = () => {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent(LOCAL_CREATE_EVENT));
  }
};

type CreateEntryInput = {
  content: string;
  tags?: string[];
};

export const useJournalFeed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [localEntries, setLocalEntries] = useState(() => loadEntries());

  const refreshLocal = () => {
    setLocalEntries(loadEntries());
  };

  const { data: remoteEntries = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['journal-feed', user?.id],
    queryFn: fetchJournalFeed,
    enabled: Boolean(user?.id),
    staleTime: 60 * 1000,
  });

  const createRemote = useMutation({
    mutationFn: createJournalTextEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['journal-feed', user?.id] });
      emitLocalEvent();
    },
  });

  const createLocal = ({ content, tags }: CreateEntryInput) => {
    const record: JournalEntryRec = {
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      createdAt: new Date().toISOString(),
      content: sanitizePlain(content),
      tags,
    };
    upsertEntry(record);
    refreshLocal();
    emitLocalEvent();
    return record;
  };

  const entriesSource: JournalFeedEntry[] = useMemo(() => {
    const base = user?.id ? remoteEntries : localEntries.map(mapLocalEntry);
    return [...base].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [localEntries, remoteEntries, user?.id]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    entriesSource.forEach(entry => {
      entry.tags.forEach(tag => set.add(tag));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [entriesSource]);

  const filteredEntries = useMemo(() => {
    const trimmedQuery = search.trim().toLowerCase();
    return entriesSource.filter(entry => {
      const matchesTag = tagFilter ? entry.tags.includes(tagFilter) : true;
      if (!matchesTag) return false;
      if (!trimmedQuery) return true;
      const textMatch = entry.text.toLowerCase().includes(trimmedQuery);
      const tagMatch = entry.tags.some(tag => tag.includes(trimmedQuery));
      return textMatch || tagMatch;
    });
  }, [entriesSource, search, tagFilter]);

  const createEntry = async (input: CreateEntryInput) => {
    if (user?.id) {
      await createRemote.mutateAsync(input);
      return;
    }
    createLocal(input);
  };

  const isCreating = createRemote.isPending;
  const creationError = createRemote.error as Error | null;

  return {
    entries: filteredEntries,
    tags: availableTags,
    search,
    setSearch,
    tagFilter,
    setTagFilter,
    isLoading,
    isError,
    error,
    refetch,
    createEntry,
    isCreating,
    creationError,
  };
};

