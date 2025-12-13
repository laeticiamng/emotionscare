// @ts-nocheck
/**
 * Boss Grit Store - Gestion des tâches de motivation
 * Système de tâches avec persistance, filtres et statistiques
 */

import { logger } from '@/lib/logger';

const KEY = "boss_grit_tasks_v1";
const HISTORY_KEY = "boss_grit_history_v1";
const SETTINGS_KEY = "boss_grit_settings_v1";

/** Priorité de tâche */
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

/** Statut de tâche */
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'cancelled' | 'archived';

/** Catégorie de tâche */
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'social' | 'other';

/** Tâche de base */
export type GritTask = {
  id: string;
  label: string;
  done?: boolean;
};

/** Tâche étendue */
export interface ExtendedGritTask extends GritTask {
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: TaskCategory;
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  tags?: string[];
  subtasks?: Subtask[];
  notes?: string;
  reminder?: number;
  recurring?: RecurringConfig;
  points?: number;
}

/** Sous-tâche */
export interface Subtask {
  id: string;
  label: string;
  done: boolean;
  completedAt?: number;
}

/** Configuration de récurrence */
export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: number;
  daysOfWeek?: number[];
}

/** Entrée d'historique */
export interface HistoryEntry {
  id: string;
  taskId: string;
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'restored';
  timestamp: number;
  data?: Record<string, unknown>;
}

/** Paramètres du store */
export interface GritSettings {
  defaultPriority: TaskPriority;
  defaultCategory: TaskCategory;
  pointsPerTask: number;
  enableReminders: boolean;
  enableRecurring: boolean;
  showCompletedTasks: boolean;
  sortBy: 'priority' | 'dueDate' | 'createdAt' | 'label';
  sortOrder: 'asc' | 'desc';
}

/** Stats utilisateur */
export interface GritStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  streak: number;
  totalPoints: number;
  completionRate: number;
  byCategory: Record<TaskCategory, number>;
  byPriority: Record<TaskPriority, number>;
}

/** Filtres de tâche */
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: TaskCategory[];
  tags?: string[];
  search?: string;
  dueBefore?: number;
  dueAfter?: number;
}

// Paramètres par défaut
const DEFAULT_SETTINGS: GritSettings = {
  defaultPriority: 'medium',
  defaultCategory: 'other',
  pointsPerTask: 10,
  enableReminders: true,
  enableRecurring: true,
  showCompletedTasks: true,
  sortBy: 'priority',
  sortOrder: 'desc'
};

// Listeners
const listeners: Array<(tasks: ExtendedGritTask[]) => void> = [];

/** Charger les tâches */
export function loadTasks(): GritTask[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/** Charger les tâches étendues */
export function loadExtendedTasks(): ExtendedGritTask[] {
  try {
    const tasks = JSON.parse(localStorage.getItem(KEY) || "[]");
    return tasks.map((t: GritTask | ExtendedGritTask) => normalizeTask(t));
  } catch {
    return [];
  }
}

/** Normaliser une tâche vers le format étendu */
function normalizeTask(task: GritTask | ExtendedGritTask): ExtendedGritTask {
  const now = Date.now();
  return {
    id: task.id,
    label: task.label,
    done: task.done,
    description: (task as ExtendedGritTask).description,
    status: (task as ExtendedGritTask).status || (task.done ? 'done' : 'pending'),
    priority: (task as ExtendedGritTask).priority || 'medium',
    category: (task as ExtendedGritTask).category,
    dueDate: (task as ExtendedGritTask).dueDate,
    createdAt: (task as ExtendedGritTask).createdAt || now,
    updatedAt: (task as ExtendedGritTask).updatedAt || now,
    completedAt: (task as ExtendedGritTask).completedAt,
    tags: (task as ExtendedGritTask).tags || [],
    subtasks: (task as ExtendedGritTask).subtasks || [],
    notes: (task as ExtendedGritTask).notes,
    reminder: (task as ExtendedGritTask).reminder,
    recurring: (task as ExtendedGritTask).recurring,
    points: (task as ExtendedGritTask).points || DEFAULT_SETTINGS.pointsPerTask
  };
}

/** Sauvegarder les tâches */
export function saveTasks(list: GritTask[] | ExtendedGritTask[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
  notifyListeners();
}

/** Notifier les listeners */
function notifyListeners(): void {
  const tasks = loadExtendedTasks();
  listeners.forEach(listener => listener(tasks));
}

/** Créer/Mettre à jour une tâche */
export function upsertTask(t: GritTask | Partial<ExtendedGritTask>): ExtendedGritTask {
  const list = loadExtendedTasks();
  const now = Date.now();
  const index = list.findIndex(x => x.id === t.id);

  let task: ExtendedGritTask;

  if (index >= 0) {
    // Mise à jour
    task = {
      ...list[index],
      ...t,
      updatedAt: now
    };

    // Gérer le changement de statut
    if (t.done !== undefined && t.done !== list[index].done) {
      task.status = t.done ? 'done' : 'pending';
      if (t.done) {
        task.completedAt = now;
      }
    }

    list[index] = task;
    addHistory(task.id, 'updated');
  } else {
    // Création
    task = normalizeTask({
      id: t.id || generateId(),
      label: t.label || '',
      done: t.done || false,
      ...t,
      createdAt: now,
      updatedAt: now
    } as ExtendedGritTask);

    list.push(task);
    addHistory(task.id, 'created');
  }

  saveTasks(list);
  logger.debug('Task upserted', { taskId: task.id }, 'GRIT');

  return task;
}

/** Supprimer une tâche */
export function removeTask(id: string): boolean {
  const list = loadExtendedTasks();
  const index = list.findIndex(x => x.id === id);

  if (index === -1) return false;

  list.splice(index, 1);
  saveTasks(list);
  addHistory(id, 'deleted');

  logger.debug('Task removed', { taskId: id }, 'GRIT');
  return true;
}

/** Obtenir une tâche par ID */
export function getTask(id: string): ExtendedGritTask | null {
  const list = loadExtendedTasks();
  return list.find(t => t.id === id) || null;
}

/** Compléter une tâche */
export function completeTask(id: string): ExtendedGritTask | null {
  const task = getTask(id);
  if (!task) return null;

  return upsertTask({
    ...task,
    done: true,
    status: 'done',
    completedAt: Date.now()
  });
}

/** Réouvrir une tâche */
export function reopenTask(id: string): ExtendedGritTask | null {
  const task = getTask(id);
  if (!task) return null;

  return upsertTask({
    ...task,
    done: false,
    status: 'pending',
    completedAt: undefined
  });
}

/** Archiver une tâche */
export function archiveTask(id: string): ExtendedGritTask | null {
  const task = getTask(id);
  if (!task) return null;

  return upsertTask({
    ...task,
    status: 'archived'
  });
}

/** Filtrer les tâches */
export function filterTasks(filters: TaskFilters): ExtendedGritTask[] {
  let tasks = loadExtendedTasks();

  if (filters.status?.length) {
    tasks = tasks.filter(t => filters.status!.includes(t.status));
  }

  if (filters.priority?.length) {
    tasks = tasks.filter(t => filters.priority!.includes(t.priority));
  }

  if (filters.category?.length) {
    tasks = tasks.filter(t => t.category && filters.category!.includes(t.category));
  }

  if (filters.tags?.length) {
    tasks = tasks.filter(t => t.tags?.some(tag => filters.tags!.includes(tag)));
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    tasks = tasks.filter(t =>
      t.label.toLowerCase().includes(searchLower) ||
      t.description?.toLowerCase().includes(searchLower)
    );
  }

  if (filters.dueBefore) {
    tasks = tasks.filter(t => t.dueDate && t.dueDate <= filters.dueBefore!);
  }

  if (filters.dueAfter) {
    tasks = tasks.filter(t => t.dueDate && t.dueDate >= filters.dueAfter!);
  }

  return tasks;
}

/** Trier les tâches */
export function sortTasks(
  tasks: ExtendedGritTask[],
  sortBy: GritSettings['sortBy'] = 'priority',
  sortOrder: GritSettings['sortOrder'] = 'desc'
): ExtendedGritTask[] {
  const priorityOrder: Record<TaskPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'priority':
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'dueDate':
        comparison = (a.dueDate || Infinity) - (b.dueDate || Infinity);
        break;
      case 'createdAt':
        comparison = a.createdAt - b.createdAt;
        break;
      case 'label':
        comparison = a.label.localeCompare(b.label);
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

/** Obtenir les stats */
export function getStats(): GritStats {
  const tasks = loadExtendedTasks();

  const stats: GritStats = {
    totalTasks: tasks.length,
    completedTasks: 0,
    pendingTasks: 0,
    streak: 0,
    totalPoints: 0,
    completionRate: 0,
    byCategory: {
      work: 0,
      personal: 0,
      health: 0,
      learning: 0,
      social: 0,
      other: 0
    },
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    }
  };

  for (const task of tasks) {
    if (task.done || task.status === 'done') {
      stats.completedTasks++;
      stats.totalPoints += task.points || DEFAULT_SETTINGS.pointsPerTask;
    } else if (task.status === 'pending' || task.status === 'in_progress') {
      stats.pendingTasks++;
    }

    if (task.category) {
      stats.byCategory[task.category]++;
    }

    stats.byPriority[task.priority]++;
  }

  if (stats.totalTasks > 0) {
    stats.completionRate = (stats.completedTasks / stats.totalTasks) * 100;
  }

  // Calculer le streak
  stats.streak = calculateStreak(tasks);

  return stats;
}

/** Calculer le streak de complétion */
function calculateStreak(tasks: ExtendedGritTask[]): number {
  const completedDates = tasks
    .filter(t => t.completedAt)
    .map(t => new Date(t.completedAt!).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (completedDates.length === 0) return 0;

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Vérifier si l'utilisateur a complété une tâche aujourd'hui ou hier
  if (completedDates[0] !== today && completedDates[0] !== yesterday) {
    return 0;
  }

  for (let i = 0; i < completedDates.length - 1; i++) {
    const current = new Date(completedDates[i]).getTime();
    const next = new Date(completedDates[i + 1]).getTime();
    const diff = current - next;

    if (diff <= 86400000 * 2) { // Max 2 jours d'écart
      streak++;
    } else {
      break;
    }
  }

  return streak + 1;
}

/** Générer un ID */
function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/** Ajouter une entrée d'historique */
function addHistory(taskId: string, action: HistoryEntry['action'], data?: Record<string, unknown>): void {
  try {
    const history: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

    history.push({
      id: `hist_${Date.now()}`,
      taskId,
      action,
      timestamp: Date.now(),
      data
    });

    // Garder les 500 dernières entrées
    while (history.length > 500) {
      history.shift();
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Ignorer les erreurs d'historique
  }
}

/** Obtenir l'historique */
export function getHistory(taskId?: string): HistoryEntry[] {
  try {
    const history: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return taskId ? history.filter(h => h.taskId === taskId) : history;
  } catch {
    return [];
  }
}

/** Charger les paramètres */
export function loadSettings(): GritSettings {
  try {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** Sauvegarder les paramètres */
export function saveSettings(settings: Partial<GritSettings>): GritSettings {
  const current = loadSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}

/** S'abonner aux changements */
export function subscribeTasks(listener: (tasks: ExtendedGritTask[]) => void): () => void {
  listeners.push(listener);
  listener(loadExtendedTasks());

  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

/** Effacer toutes les données */
export function clearAllData(): void {
  localStorage.removeItem(KEY);
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  notifyListeners();
  logger.info('Grit data cleared', {}, 'GRIT');
}

/** Exporter les données */
export function exportData(): string {
  return JSON.stringify({
    tasks: loadExtendedTasks(),
    settings: loadSettings(),
    history: getHistory(),
    exportedAt: new Date().toISOString()
  }, null, 2);
}

/** Importer les données */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);

    if (data.tasks) {
      saveTasks(data.tasks);
    }

    if (data.settings) {
      saveSettings(data.settings);
    }

    logger.info('Grit data imported', { taskCount: data.tasks?.length }, 'GRIT');
    return true;
  } catch (error) {
    logger.error('Grit data import failed', error as Error, 'GRIT');
    return false;
  }
}

export default {
  loadTasks,
  loadExtendedTasks,
  saveTasks,
  upsertTask,
  removeTask,
  getTask,
  completeTask,
  reopenTask,
  archiveTask,
  filterTasks,
  sortTasks,
  getStats,
  getHistory,
  loadSettings,
  saveSettings,
  subscribeTasks,
  clearAllData,
  exportData,
  importData
};
