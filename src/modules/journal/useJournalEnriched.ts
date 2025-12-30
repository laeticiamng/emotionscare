/**
 * useJournalEnriched - Hook enrichi pour le journal avec stats, favoris, archives
 */

import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import {
  listFeed,
  listFavorites,
  deleteNote,
  updateNote,
  toggleFavorite,
  getJournalStats,
  insertText,
} from '@/services/journal/journalApi'
import type { SanitizedNote, FeedQuery } from './types'

const FEED_QUERY_KEY = ['journal', 'feed'] as const
const FAVORITES_QUERY_KEY = ['journal', 'favorites'] as const
const STATS_QUERY_KEY = ['journal', 'stats'] as const
const PAGE_SIZE = 10

export interface JournalStats {
  totalNotes: number
  totalWords: number
  favoriteCount: number
  currentStreak: number
  longestStreak: number
  avgWordsPerNote: number
  lastEntryDate: string | null
}

export type JournalTab = 'notes' | 'favorites' | 'stats'

export function useJournalEnriched() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<JournalTab>('notes')
  const [search, setSearch] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [editingNote, setEditingNote] = useState<SanitizedNote | null>(null)

  // Feed query with infinite scroll
  const feedQuery = useInfiniteQuery({
    queryKey: [...FEED_QUERY_KEY, { search, activeTags }],
    queryFn: ({ pageParam = 0 }) =>
      listFeed({
        q: search.trim() || undefined,
        tags: activeTags.length ? activeTags : undefined,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
    staleTime: 60_000,
    initialPageParam: 0,
  })

  // Favorites query
  const favoritesQuery = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: listFavorites,
    staleTime: 60_000,
  })

  // Stats query
  const statsQuery = useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: getJournalStats,
    staleTime: 120_000,
  })

  const notes = useMemo(() => feedQuery.data?.pages.flat() ?? [], [feedQuery.data])
  const favorites = useMemo(() => favoritesQuery.data ?? [], [favoritesQuery.data])
  const stats = useMemo<JournalStats>(() => statsQuery.data ?? {
    totalNotes: 0,
    totalWords: 0,
    favoriteCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    avgWordsPerNote: 0,
    lastEntryDate: null,
  }, [statsQuery.data])

  // Available tags from notes
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const page of feedQuery.data?.pages ?? []) {
      for (const note of page) {
        note.tags.forEach(tag => tagSet.add(tag))
      }
    }
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
  }, [feedQuery.data])

  // Invalidate all queries
  const invalidateAll = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY })
    void queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY })
    void queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY })
  }, [queryClient])

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      invalidateAll()
      toast({
        title: 'Note supprimée',
        description: 'La note a été supprimée définitivement.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la note.',
        variant: 'destructive',
      })
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { text?: string; tags?: string[] } }) =>
      updateNote(id, updates),
    onSuccess: () => {
      invalidateAll()
      setEditingNote(null)
      toast({
        title: 'Note modifiée',
        description: 'Vos modifications ont été enregistrées.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la note.',
        variant: 'destructive',
      })
    },
  })

  // Toggle favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (newValue) => {
      invalidateAll()
      toast({
        title: newValue ? 'Ajouté aux favoris' : 'Retiré des favoris',
        duration: 2000,
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier les favoris.',
        variant: 'destructive',
      })
    },
  })

  // Create new note
  const createMutation = useMutation({
    mutationFn: insertText,
    onSuccess: () => {
      invalidateAll()
      toast({
        title: 'Note créée',
        description: 'Votre note a été enregistrée.',
      })
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la note.',
        variant: 'destructive',
      })
    },
  })

  // Actions
  const handleDelete = useCallback((noteId: string) => {
    if (window.confirm('Supprimer définitivement cette note ?')) {
      deleteMutation.mutate(noteId)
    }
  }, [deleteMutation])

  const handleToggleFavorite = useCallback((noteId: string) => {
    favoriteMutation.mutate(noteId)
  }, [favoriteMutation])

  const handleUpdate = useCallback((id: string, updates: { text?: string; tags?: string[] }) => {
    updateMutation.mutate({ id, updates })
  }, [updateMutation])

  const handleCreate = useCallback((text: string, tags: string[] = []) => {
    return createMutation.mutateAsync({ text, tags })
  }, [createMutation])

  const toggleTag = useCallback((tag: string) => {
    setActiveTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]))
  }, [])

  const resetTags = useCallback(() => {
    setActiveTags([])
  }, [])

  const loadMore = useCallback(() => {
    if (feedQuery.hasNextPage) {
      void feedQuery.fetchNextPage()
    }
  }, [feedQuery])

  // Check if a note is favorite
  const isFavorite = useCallback((noteId: string) => {
    return favorites.some(f => f.id === noteId)
  }, [favorites])

  return {
    // State
    activeTab,
    setActiveTab,
    search,
    setSearch,
    activeTags,
    availableTags,
    editingNote,
    setEditingNote,

    // Data
    notes,
    favorites,
    stats,

    // Loading states
    isLoading: feedQuery.isLoading,
    isFetchingMore: feedQuery.isFetchingNextPage,
    hasMore: Boolean(feedQuery.hasNextPage),
    isLoadingFavorites: favoritesQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,

    // Mutation states
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    isTogglingFavorite: favoriteMutation.isPending,

    // Actions
    handleDelete,
    handleToggleFavorite,
    handleUpdate,
    handleCreate,
    toggleTag,
    resetTags,
    loadMore,
    isFavorite,
    refresh: invalidateAll,
  }
}

export type UseJournalEnrichedReturn = ReturnType<typeof useJournalEnriched>
