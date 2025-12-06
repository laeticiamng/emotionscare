/**
 * Offline Queue Manager - Phase 4
 * Gestion des actions en queue quand hors-ligne
 * Utilise IndexedDB pour la persistance
 */

import { logger } from './logger';

export type QueueItemType = 'emotion' | 'journal' | 'music' | 'assessment' | 'music-playlist' | 'preference' | 'custom';
export type QueueItemStatus = 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict';

export interface QueueItem {
  id: string;
  type: QueueItemType;
  status: QueueItemStatus;
  data: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
  lastError?: string;
  conflictData?: any;
  priority: 'low' | 'normal' | 'high';
  endpoint: string; // API endpoint for this item
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export interface QueueStats {
  total: number;
  pending: number;
  syncing: number;
  failed: number;
  synced: number;
  conflicts: number;
}

const DB_NAME = 'EmotionsCareOfflineDB';
const DB_VERSION = 2;
const QUEUE_STORE = 'offlineQueue';
const METADATA_STORE = 'metadata';

export class OfflineQueueManager {
  private db: IDBDatabase | null = null;
  private isInitialized = false;
  private listeners: Set<(stats: QueueStats) => void> = new Set();
  private syncInProgress = false;

  /**
   * Initialiser la base de données
   */
  async initialize(): Promise<void> {
    if (this.isInitialized && this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        logger.error('Failed to open offline queue DB', request.error as Error, 'OFFLINE');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        logger.info('Offline queue DB initialized', {}, 'OFFLINE');
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        // Créer les stores
        if (!db.objectStoreNames.contains(QUEUE_STORE)) {
          const store = db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('priority', 'priority', { unique: false });
        }

        if (!db.objectStoreNames.contains(METADATA_STORE)) {
          db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Ajouter un item à la queue
   */
  async addToQueue(
    type: QueueItemType,
    data: any,
    endpoint: string,
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): Promise<QueueItem> {
    await this.initialize();

    const item: QueueItem = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'pending',
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3,
      priority,
      endpoint,
      method,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(QUEUE_STORE);
      const request = store.add(item);

      request.onerror = () => {
        logger.error('Failed to add item to queue', request.error as Error, 'OFFLINE');
        reject(request.error);
      };

      request.onsuccess = () => {
        logger.info(`Item added to queue: ${item.id}`, { type, priority }, 'OFFLINE');
        this.notifyListeners();
        resolve(item);
      };
    });
  }

  /**
   * Obtenir tous les items de la queue
   */
  async getAll(): Promise<QueueItem[]> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([QUEUE_STORE], 'readonly');
      const store = transaction.objectStore(QUEUE_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Obtenir les items en attente (prioritisés)
   */
  async getPending(): Promise<QueueItem[]> {
    const all = await this.getAll();
    return all
      .filter((item) => item.status === 'pending')
      .sort((a, b) => {
        // Priorité: high > normal > low
        const priorityMap = { high: 3, normal: 2, low: 1 };
        if (priorityMap[a.priority] !== priorityMap[b.priority]) {
          return priorityMap[b.priority] - priorityMap[a.priority];
        }
        // Puis par timestamp (plus ancien d'abord)
        return a.timestamp - b.timestamp;
      });
  }

  /**
   * Obtenir les statistiques
   */
  async getStats(): Promise<QueueStats> {
    const all = await this.getAll();

    return {
      total: all.length,
      pending: all.filter((item) => item.status === 'pending').length,
      syncing: all.filter((item) => item.status === 'syncing').length,
      synced: all.filter((item) => item.status === 'synced').length,
      failed: all.filter((item) => item.status === 'failed').length,
      conflicts: all.filter((item) => item.status === 'conflict').length,
    };
  }

  /**
   * Mettre à jour le statut d'un item
   */
  async updateItemStatus(
    id: string,
    status: QueueItemStatus,
    lastError?: string
  ): Promise<void> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(QUEUE_STORE);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const item = request.result;
        if (item) {
          item.status = status;
          if (lastError) item.lastError = lastError;

          const updateRequest = store.put(item);
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => {
            this.notifyListeners();
            resolve();
          };
        }
      };
    });
  }

  /**
   * Retirer un item de la queue
   */
  async removeFromQueue(id: string): Promise<void> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(QUEUE_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        logger.info(`Item removed from queue: ${id}`, {}, 'OFFLINE');
        this.notifyListeners();
        resolve();
      };
    });
  }

  /**
   * Synchroniser la queue
   */
  async sync(): Promise<{ synced: number; failed: number }> {
    if (this.syncInProgress) {
      logger.warn('Sync already in progress', undefined, 'OFFLINE');
      return { synced: 0, failed: 0 };
    }

    if (!navigator.onLine) {
      logger.warn('Cannot sync, offline', undefined, 'OFFLINE');
      return { synced: 0, failed: 0 };
    }

    this.syncInProgress = true;
    let synced = 0;
    let failed = 0;

    try {
      const pending = await this.getPending();

      for (const item of pending) {
        try {
          await this.updateItemStatus(item.id, 'syncing');
          const success = await this.syncItem(item);

          if (success) {
            await this.updateItemStatus(item.id, 'synced');
            synced++;
            logger.info(`Item synced: ${item.id}`, { type: item.type }, 'OFFLINE');
          } else {
            item.retries++;
            if (item.retries >= item.maxRetries) {
              await this.updateItemStatus(
                item.id,
                'failed',
                'Max retries exceeded'
              );
              failed++;
            } else {
              await this.updateItemStatus(item.id, 'pending');
            }
          }
        } catch (error) {
          item.retries++;
          const errorMsg = error instanceof Error ? error.message : String(error);

          if (item.retries >= item.maxRetries) {
            await this.updateItemStatus(item.id, 'failed', errorMsg);
            failed++;
          } else {
            await this.updateItemStatus(item.id, 'pending', errorMsg);
          }

          logger.error(`Failed to sync item ${item.id}`, error as Error, 'OFFLINE');
        }
      }

      logger.info(
        `Sync complete: ${synced} synced, ${failed} failed`,
        { synced, failed },
        'OFFLINE'
      );
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }

    return { synced, failed };
  }

  /**
   * Synchroniser un item
   */
  private async syncItem(item: QueueItem): Promise<boolean> {
    const token = localStorage.getItem('supabase.auth.token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(item.endpoint, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item.data),
      });

      if (response.ok) {
        return true;
      } else if (response.status === 409) {
        // Conflit détecté
        const conflict = await response.json();
        await this.updateItemStatus(
          item.id,
          'conflict',
          'Data conflict detected'
        );
        // Sauvegarder les données conflictuelles pour résolution manuelle
        item.conflictData = conflict;
        return false;
      } else if (response.status >= 500) {
        // Erreur serveur, peut être réessayée
        return false;
      } else {
        // Erreur client, ne pas réessayer
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Nettoyer la queue (items synced)
   */
  async cleanup(): Promise<number> {
    const all = await this.getAll();
    const oldSyncedItems = all.filter(
      (item) =>
        item.status === 'synced' &&
        Date.now() - item.timestamp > 7 * 24 * 60 * 60 * 1000 // 7 jours
    );

    let removed = 0;
    for (const item of oldSyncedItems) {
      await this.removeFromQueue(item.id);
      removed++;
    }

    if (removed > 0) {
      logger.info(`Cleaned up ${removed} old synced items`, {}, 'OFFLINE');
    }

    return removed;
  }

  /**
   * Écouter les changements
   */
  subscribe(listener: (stats: QueueStats) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifier les listeners
   */
  private async notifyListeners(): Promise<void> {
    const stats = await this.getStats();
    this.listeners.forEach((listener) => {
      try {
        listener(stats);
      } catch (error) {
        logger.error('Error in queue listener', error as Error, 'OFFLINE');
      }
    });
  }

  /**
   * Vider complètement la queue
   */
  async clear(): Promise<void> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(QUEUE_STORE);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        logger.info('Offline queue cleared', {}, 'OFFLINE');
        this.notifyListeners();
        resolve();
      };
    });
  }
}

// Export singleton
export const offlineQueue = new OfflineQueueManager();
