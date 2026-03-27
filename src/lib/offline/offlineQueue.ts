// @ts-nocheck
/**
 * Queue offline IndexedDB pour POST /metrics/* avec TTL et dédup
 */

import { logger } from '@/lib/logger';

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body: any;
  headers: Record<string, string>;
  timestamp: number;
  ttl: number;
  retries: number;
  sessionId: string;
}

class OfflineQueueManager {
  private dbName = 'emotionscare-offline';
  private dbVersion = 1;
  private storeName = 'pending-requests';
  private db: IDBDatabase | null = null;

  /**
   * Initialiser IndexedDB
   */
  async initialize(): Promise<boolean> {
    if (!('indexedDB' in window)) {
      logger.warn('IndexedDB not supported', undefined, 'SYSTEM');
      return false;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('sessionId', 'sessionId');
        }
      };
    });
  }

  /**
   * Ajouter une requête à la queue
   */
  async enqueue(url: string, options: RequestInit, sessionId: string, ttlMs: number = 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.initialize();
    if (!this.db) throw new Error('IndexedDB not available');

    // Générer ID unique pour dédup
    const requestId = this.generateRequestId(url, options.body, sessionId);

    // Vérifier si déjà en queue (dédup)
    const existing = await this.getRequest(requestId);
    if (existing) {
      logger.info('Request already queued, skipping', { requestId }, 'SYSTEM');
      return;
    }

    const queuedRequest: QueuedRequest = {
      id: requestId,
      url,
      method: options.method || 'GET',
      body: options.body,
      headers: (options.headers as Record<string, string>) || {},
      timestamp: Date.now(),
      ttl: ttlMs,
      retries: 0,
      sessionId
    };

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.add(queuedRequest);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    logger.info('Request queued for offline sync', { requestId }, 'SYSTEM');
  }

  /**
   * Traiter la queue quand on est online
   */
  async processQueue(): Promise<number> {
    if (!this.db) return 0;
    if (!navigator.onLine) return 0;

    const requests = await this.getAllPendingRequests();
    const now = Date.now();
    let processed = 0;

    for (const request of requests) {
      // Ignorer les requêtes expirées
      if (now > request.timestamp + request.ttl) {
        await this.removeRequest(request.id);
        continue;
      }

      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });

        if (response.ok) {
          await this.removeRequest(request.id);
          processed++;
          logger.info('Offline request synced', { id: request.id }, 'SYSTEM');
        } else if (response.status >= 400 && response.status < 500) {
          // Erreur client, abandon
          await this.removeRequest(request.id);
        } else {
          // Erreur serveur, retry plus tard
          request.retries++;
          if (request.retries > 3) {
            await this.removeRequest(request.id);
          } else {
            await this.updateRequest(request);
          }
        }
      } catch (error) {
        logger.error('Failed to sync request', error as Error, 'SYSTEM');
        request.retries++;
        if (request.retries > 3) {
          await this.removeRequest(request.id);
        } else {
          await this.updateRequest(request);
        }
      }
    }

    return processed;
  }

  /**
   * Nettoyer les requêtes expirées
   */
  async cleanupExpiredRequests(): Promise<number> {
    if (!this.db) return 0;

    const requests = await this.getAllPendingRequests();
    const now = Date.now();
    let cleaned = 0;

    for (const request of requests) {
      if (now > request.timestamp + request.ttl) {
        await this.removeRequest(request.id);
        cleaned++;
      }
    }

    logger.info(`Cleaned ${cleaned} expired offline requests`, { cleaned }, 'SYSTEM');
    return cleaned;
  }

  /**
   * Obtenir le statut de la queue
   */
  async getQueueStatus(): Promise<{
    pendingCount: number;
    oldestTimestamp: number | null;
    totalSize: number;
  }> {
    if (!this.db) {
      return { pendingCount: 0, oldestTimestamp: null, totalSize: 0 };
    }

    const requests = await this.getAllPendingRequests();
    
    return {
      pendingCount: requests.length,
      oldestTimestamp: requests.length > 0 ? Math.min(...requests.map(r => r.timestamp)) : null,
      totalSize: JSON.stringify(requests).length
    };
  }

  /**
   * Générer ID unique pour déduplication
   */
  private generateRequestId(url: string, body: any, sessionId: string): string {
    const content = `${url}:${JSON.stringify(body)}:${sessionId}`;
    return this.simpleHash(content);
  }

  /**
   * Hash simple
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Méthodes IndexedDB helpers
   */
  private async getRequest(id: string): Promise<QueuedRequest | null> {
    if (!this.db) return null;

    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  private async getAllPendingRequests(): Promise<QueuedRequest[]> {
    if (!this.db) return [];

    const transaction = this.db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async removeRequest(id: string): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async updateRequest(request: QueuedRequest): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const updateRequest = store.put(request);
      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    });
  }
}

export const offlineQueueManager = new OfflineQueueManager();

/**
 * Auto-process queue when coming back online
 */
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    logger.info('Back online, processing queue...', undefined, 'SYSTEM');
    offlineQueueManager.processQueue();
  });

  // Cleanup expired requests every hour
  setInterval(() => {
    offlineQueueManager.cleanupExpiredRequests();
  }, 60 * 60 * 1000);
}

/**
 * Hook pour utiliser la queue offline
 */
export const useOfflineQueue = () => {
  const [status, setStatus] = useState<{
    pendingCount: number;
    isOnline: boolean;
    lastSync: number | null;
  }>({
    pendingCount: 0,
    isOnline: navigator.onLine,
    lastSync: null
  });

  const queueRequest = async (url: string, options: RequestInit, sessionId: string) => {
    await offlineQueueManager.enqueue(url, options, sessionId);
    updateStatus();
  };

  const processQueue = async (): Promise<number> => {
    const processed = await offlineQueueManager.processQueue();
    updateStatus();
    return processed;
  };

  const updateStatus = async () => {
    const queueStatus = await offlineQueueManager.getQueueStatus();
    setStatus(prev => ({
      ...prev,
      pendingCount: queueStatus.pendingCount,
      isOnline: navigator.onLine
    }));
  };

  const forceSync = async (): Promise<number> => {
    const processed = await processQueue();
    setStatus(prev => ({
      ...prev,
      lastSync: Date.now()
    }));
    return processed;
  };

  useEffect(() => {
    updateStatus();

    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      processQueue();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    status,
    queueRequest,
    processQueue,
    forceSync
  };
};

// Nécessaire pour le hook
import { useState, useEffect } from 'react';