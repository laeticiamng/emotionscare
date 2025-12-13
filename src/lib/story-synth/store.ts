// @ts-nocheck
/**
 * Story Store - Stockage persistant des histoires générées
 * Gestion du localStorage, indexation, recherche et synchronisation
 */

import { logger } from '@/lib/logger';

/** Clé de stockage principale */
const KEY = "ec_story_synth_v1";
const SETTINGS_KEY = "ec_story_settings_v1";
const DRAFTS_KEY = "ec_story_drafts_v1";
const INDEX_KEY = "ec_story_index_v1";

/** Record d'une histoire */
export type StoryRecord = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  title: string;
  content: string[];
  tags?: string[];
  mood?: string;
  category?: StoryCategory;
  wordCount?: number;
  readingTime?: number;
  isPublic?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  metadata?: StoryMetadata;
};

/** Catégories d'histoires */
export type StoryCategory =
  | 'emotion'
  | 'meditation'
  | 'relaxation'
  | 'motivation'
  | 'sleep'
  | 'anxiety'
  | 'journal'
  | 'gratitude'
  | 'custom';

/** Métadonnées d'histoire */
export interface StoryMetadata {
  prompt?: string;
  model?: string;
  temperature?: number;
  generationTime?: number;
  editCount?: number;
  lastEditor?: string;
  version?: number;
  checksum?: string;
}

/** Brouillon d'histoire */
export interface StoryDraft {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string[];
  tags?: string[];
  autoSaved: boolean;
}

/** Index de recherche */
export interface StoryIndex {
  byTag: Record<string, string[]>;
  byMood: Record<string, string[]>;
  byCategory: Record<string, string[]>;
  byDate: Record<string, string[]>;
  lastUpdated: string;
}

/** Options de filtrage */
export interface StoryFilterOptions {
  tags?: string[];
  mood?: string;
  category?: StoryCategory;
  dateFrom?: string;
  dateTo?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'wordCount';
  sortOrder?: 'asc' | 'desc';
}

/** Résultat de recherche */
export interface SearchResult {
  stories: StoryRecord[];
  total: number;
  hasMore: boolean;
  query?: string;
  executionTime: number;
}

/** Paramètres du store */
export interface StoreSettings {
  maxStories: number;
  autoSaveInterval: number;
  enableIndexing: boolean;
  compressionEnabled: boolean;
  syncEnabled: boolean;
  lastSyncTime?: string;
}

/** Stats du store */
export interface StoreStats {
  totalStories: number;
  totalDrafts: number;
  totalWords: number;
  averageLength: number;
  storageUsed: number;
  storageLimit: number;
  oldestStory?: string;
  newestStory?: string;
  mostUsedTags: Array<{ tag: string; count: number }>;
  moodDistribution: Record<string, number>;
}

/** Événement de changement */
export type StoreEvent =
  | { type: 'add'; story: StoryRecord }
  | { type: 'update'; story: StoryRecord }
  | { type: 'delete'; id: string }
  | { type: 'clear' }
  | { type: 'sync'; count: number };

// Configuration par défaut
const DEFAULT_SETTINGS: StoreSettings = {
  maxStories: 1000,
  autoSaveInterval: 30000,
  enableIndexing: true,
  compressionEnabled: false,
  syncEnabled: false
};

// Cache en mémoire
let storiesCache: StoryRecord[] | null = null;
let indexCache: StoryIndex | null = null;
let settingsCache: StoreSettings | null = null;

// Listeners
const listeners: Array<(event: StoreEvent) => void> = [];

/** Notifier les listeners */
function notifyListeners(event: StoreEvent): void {
  listeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      logger.error('Store listener error', error as Error, 'STORY_STORE');
    }
  });
}

/** S'abonner aux changements */
export function subscribe(callback: (event: StoreEvent) => void): () => void {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Charger les paramètres */
export function loadSettings(): StoreSettings {
  if (settingsCache) return settingsCache;

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    settingsCache = stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    return settingsCache;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Sauvegarder les paramètres */
export function saveSettings(settings: Partial<StoreSettings>): void {
  const current = loadSettings();
  settingsCache = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsCache));
}

/** Charger les histoires */
export function loadStories(): StoryRecord[] {
  if (storiesCache) return storiesCache;

  try {
    const stored = localStorage.getItem(KEY);
    storiesCache = stored ? JSON.parse(stored) : [];
    return storiesCache;
  } catch (error) {
    logger.error('Failed to load stories', error as Error, 'STORY_STORE');
    return [];
  }
}

/** Sauvegarder les histoires */
export function saveStories(list: StoryRecord[]): void {
  try {
    storiesCache = list;
    localStorage.setItem(KEY, JSON.stringify(list));

    // Mettre à jour l'index si activé
    const settings = loadSettings();
    if (settings.enableIndexing) {
      rebuildIndex();
    }
  } catch (error) {
    logger.error('Failed to save stories', error as Error, 'STORY_STORE');
    throw error;
  }
}

/** Ajouter une histoire */
export function addStory(s: StoryRecord): StoryRecord {
  const list = loadStories();
  const settings = loadSettings();

  // Enrichir l'histoire
  const enriched: StoryRecord = {
    ...s,
    createdAt: s.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    wordCount: calculateWordCount(s.content),
    readingTime: calculateReadingTime(s.content),
    metadata: {
      ...s.metadata,
      version: 1
    }
  };

  // Vérifier la limite
  if (list.length >= settings.maxStories) {
    // Supprimer les plus anciennes non favorites
    const nonFavorites = list.filter(story => !story.isFavorite);
    if (nonFavorites.length > 0) {
      const oldest = nonFavorites[nonFavorites.length - 1];
      deleteStory(oldest.id);
    }
  }

  list.unshift(enriched);
  saveStories(list);

  notifyListeners({ type: 'add', story: enriched });
  logger.info('Story added', { id: enriched.id }, 'STORY_STORE');

  return enriched;
}

/** Mettre à jour une histoire */
export function updateStory(id: string, updates: Partial<StoryRecord>): StoryRecord | null {
  const list = loadStories();
  const index = list.findIndex(s => s.id === id);

  if (index === -1) {
    logger.warn('Story not found for update', { id }, 'STORY_STORE');
    return null;
  }

  const updated: StoryRecord = {
    ...list[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    wordCount: updates.content ? calculateWordCount(updates.content) : list[index].wordCount,
    readingTime: updates.content ? calculateReadingTime(updates.content) : list[index].readingTime,
    metadata: {
      ...list[index].metadata,
      ...updates.metadata,
      editCount: (list[index].metadata?.editCount || 0) + 1,
      version: (list[index].metadata?.version || 0) + 1
    }
  };

  list[index] = updated;
  saveStories(list);

  notifyListeners({ type: 'update', story: updated });
  logger.info('Story updated', { id }, 'STORY_STORE');

  return updated;
}

/** Supprimer une histoire */
export function deleteStory(id: string): boolean {
  const list = loadStories();
  const index = list.findIndex(s => s.id === id);

  if (index === -1) {
    return false;
  }

  list.splice(index, 1);
  saveStories(list);

  notifyListeners({ type: 'delete', id });
  logger.info('Story deleted', { id }, 'STORY_STORE');

  return true;
}

/** Obtenir une histoire par ID */
export function getStory(id: string): StoryRecord | null {
  const list = loadStories();
  return list.find(s => s.id === id) || null;
}

/** Archiver une histoire */
export function archiveStory(id: string): StoryRecord | null {
  return updateStory(id, { isArchived: true });
}

/** Désarchiver une histoire */
export function unarchiveStory(id: string): StoryRecord | null {
  return updateStory(id, { isArchived: false });
}

/** Marquer comme favori */
export function toggleFavorite(id: string): StoryRecord | null {
  const story = getStory(id);
  if (!story) return null;
  return updateStory(id, { isFavorite: !story.isFavorite });
}

/** Calculer le nombre de mots */
function calculateWordCount(content: string[]): number {
  return content.join(' ').split(/\s+/).filter(Boolean).length;
}

/** Calculer le temps de lecture (mots par minute) */
function calculateReadingTime(content: string[], wpm: number = 200): number {
  const words = calculateWordCount(content);
  return Math.ceil(words / wpm);
}

/** Filtrer les histoires */
export function filterStories(options: StoryFilterOptions = {}): SearchResult {
  const startTime = performance.now();
  let stories = loadStories();

  // Filtres
  if (options.tags && options.tags.length > 0) {
    stories = stories.filter(s =>
      s.tags && options.tags!.some(tag => s.tags!.includes(tag))
    );
  }

  if (options.mood) {
    stories = stories.filter(s => s.mood === options.mood);
  }

  if (options.category) {
    stories = stories.filter(s => s.category === options.category);
  }

  if (options.dateFrom) {
    stories = stories.filter(s => s.createdAt >= options.dateFrom!);
  }

  if (options.dateTo) {
    stories = stories.filter(s => s.createdAt <= options.dateTo!);
  }

  if (options.isPublic !== undefined) {
    stories = stories.filter(s => s.isPublic === options.isPublic);
  }

  if (options.isFavorite !== undefined) {
    stories = stories.filter(s => s.isFavorite === options.isFavorite);
  }

  if (options.isArchived !== undefined) {
    stories = stories.filter(s => s.isArchived === options.isArchived);
  } else {
    // Par défaut, exclure les archivées
    stories = stories.filter(s => !s.isArchived);
  }

  // Recherche textuelle
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    stories = stories.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.content.some(p => p.toLowerCase().includes(query)) ||
      s.tags?.some(t => t.toLowerCase().includes(query))
    );
  }

  // Tri
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';

  stories.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'wordCount':
        comparison = (a.wordCount || 0) - (b.wordCount || 0);
        break;
      case 'updatedAt':
        comparison = (a.updatedAt || a.createdAt).localeCompare(b.updatedAt || b.createdAt);
        break;
      case 'createdAt':
      default:
        comparison = a.createdAt.localeCompare(b.createdAt);
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const total = stories.length;

  // Pagination
  if (options.offset) {
    stories = stories.slice(options.offset);
  }
  if (options.limit) {
    stories = stories.slice(0, options.limit);
  }

  return {
    stories,
    total,
    hasMore: options.limit ? total > (options.offset || 0) + options.limit : false,
    query: options.searchQuery,
    executionTime: performance.now() - startTime
  };
}

/** Recherche rapide par index */
export function searchByIndex(type: 'tag' | 'mood' | 'category', value: string): StoryRecord[] {
  const index = loadIndex();
  let ids: string[] = [];

  switch (type) {
    case 'tag':
      ids = index.byTag[value] || [];
      break;
    case 'mood':
      ids = index.byMood[value] || [];
      break;
    case 'category':
      ids = index.byCategory[value] || [];
      break;
  }

  const stories = loadStories();
  return ids.map(id => stories.find(s => s.id === id)).filter(Boolean) as StoryRecord[];
}

/** Charger l'index */
export function loadIndex(): StoryIndex {
  if (indexCache) return indexCache;

  try {
    const stored = localStorage.getItem(INDEX_KEY);
    if (stored) {
      indexCache = JSON.parse(stored);
      return indexCache!;
    }
  } catch {}

  return rebuildIndex();
}

/** Reconstruire l'index */
export function rebuildIndex(): StoryIndex {
  const stories = loadStories();

  const index: StoryIndex = {
    byTag: {},
    byMood: {},
    byCategory: {},
    byDate: {},
    lastUpdated: new Date().toISOString()
  };

  for (const story of stories) {
    // Index par tags
    if (story.tags) {
      for (const tag of story.tags) {
        if (!index.byTag[tag]) index.byTag[tag] = [];
        index.byTag[tag].push(story.id);
      }
    }

    // Index par mood
    if (story.mood) {
      if (!index.byMood[story.mood]) index.byMood[story.mood] = [];
      index.byMood[story.mood].push(story.id);
    }

    // Index par catégorie
    if (story.category) {
      if (!index.byCategory[story.category]) index.byCategory[story.category] = [];
      index.byCategory[story.category].push(story.id);
    }

    // Index par date (YYYY-MM)
    const dateKey = story.createdAt.slice(0, 7);
    if (!index.byDate[dateKey]) index.byDate[dateKey] = [];
    index.byDate[dateKey].push(story.id);
  }

  indexCache = index;
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));

  return index;
}

/** Gérer les brouillons */
export function loadDrafts(): StoryDraft[] {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveDraft(draft: StoryDraft): void {
  const drafts = loadDrafts();
  const index = drafts.findIndex(d => d.id === draft.id);

  if (index >= 0) {
    drafts[index] = { ...draft, updatedAt: new Date().toISOString() };
  } else {
    drafts.unshift({ ...draft, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }

  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function deleteDraft(id: string): boolean {
  const drafts = loadDrafts();
  const index = drafts.findIndex(d => d.id === id);
  if (index === -1) return false;

  drafts.splice(index, 1);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  return true;
}

export function promoteDraftToStory(draftId: string): StoryRecord | null {
  const draft = loadDrafts().find(d => d.id === draftId);
  if (!draft) return null;

  const story = addStory({
    id: draft.id,
    createdAt: draft.createdAt,
    title: draft.title,
    content: draft.content,
    tags: draft.tags
  });

  deleteDraft(draftId);
  return story;
}

/** Obtenir les statistiques */
export function getStats(): StoreStats {
  const stories = loadStories();
  const drafts = loadDrafts();

  const totalWords = stories.reduce((sum, s) => sum + (s.wordCount || 0), 0);
  const storageUsed = new Blob([localStorage.getItem(KEY) || '']).size;

  // Tags les plus utilisés
  const tagCounts: Record<string, number> = {};
  stories.forEach(s => {
    s.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const mostUsedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Distribution des moods
  const moodDistribution: Record<string, number> = {};
  stories.forEach(s => {
    if (s.mood) {
      moodDistribution[s.mood] = (moodDistribution[s.mood] || 0) + 1;
    }
  });

  return {
    totalStories: stories.length,
    totalDrafts: drafts.length,
    totalWords,
    averageLength: stories.length > 0 ? Math.round(totalWords / stories.length) : 0,
    storageUsed,
    storageLimit: 5 * 1024 * 1024, // 5MB localStorage limit
    oldestStory: stories.length > 0 ? stories[stories.length - 1].createdAt : undefined,
    newestStory: stories.length > 0 ? stories[0].createdAt : undefined,
    mostUsedTags,
    moodDistribution
  };
}

/** Exporter toutes les histoires */
export function exportAllStories(): string {
  const stories = loadStories();
  return JSON.stringify(stories, null, 2);
}

/** Importer des histoires */
export function importStories(json: string, merge: boolean = true): number {
  try {
    const imported: StoryRecord[] = JSON.parse(json);

    if (!Array.isArray(imported)) {
      throw new Error('Invalid import format');
    }

    if (merge) {
      const existing = loadStories();
      const existingIds = new Set(existing.map(s => s.id));
      const newStories = imported.filter(s => !existingIds.has(s.id));
      saveStories([...newStories, ...existing]);
      return newStories.length;
    } else {
      saveStories(imported);
      return imported.length;
    }
  } catch (error) {
    logger.error('Import failed', error as Error, 'STORY_STORE');
    throw error;
  }
}

/** Vider le cache */
export function clearCache(): void {
  storiesCache = null;
  indexCache = null;
  settingsCache = null;
}

/** Vider tout le store */
export function clearAll(): void {
  localStorage.removeItem(KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(DRAFTS_KEY);
  localStorage.removeItem(INDEX_KEY);
  clearCache();
  notifyListeners({ type: 'clear' });
  logger.info('Store cleared', {}, 'STORY_STORE');
}

/** Obtenir tous les tags uniques */
export function getAllTags(): string[] {
  const stories = loadStories();
  const tags = new Set<string>();
  stories.forEach(s => s.tags?.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

/** Obtenir toutes les catégories utilisées */
export function getUsedCategories(): StoryCategory[] {
  const stories = loadStories();
  const categories = new Set<StoryCategory>();
  stories.forEach(s => {
    if (s.category) categories.add(s.category);
  });
  return Array.from(categories);
}

/** Obtenir les histoires récentes */
export function getRecentStories(limit: number = 5): StoryRecord[] {
  return filterStories({ limit, sortBy: 'createdAt', sortOrder: 'desc' }).stories;
}

/** Obtenir les favoris */
export function getFavorites(): StoryRecord[] {
  return filterStories({ isFavorite: true }).stories;
}

/** Dupliquer une histoire */
export function duplicateStory(id: string): StoryRecord | null {
  const original = getStory(id);
  if (!original) return null;

  return addStory({
    ...original,
    id: `${original.id}-copy-${Date.now()}`,
    title: `${original.title} (copie)`,
    isFavorite: false,
    isPublic: false,
    metadata: {
      ...original.metadata,
      version: 1,
      editCount: 0
    }
  });
}

export default {
  loadStories,
  saveStories,
  addStory,
  updateStory,
  deleteStory,
  getStory,
  archiveStory,
  unarchiveStory,
  toggleFavorite,
  filterStories,
  searchByIndex,
  loadIndex,
  rebuildIndex,
  loadDrafts,
  saveDraft,
  deleteDraft,
  promoteDraftToStory,
  getStats,
  exportAllStories,
  importStories,
  clearCache,
  clearAll,
  getAllTags,
  getUsedCategories,
  getRecentStories,
  getFavorites,
  duplicateStory,
  subscribe,
  loadSettings,
  saveSettings
};
