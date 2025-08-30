import { useEffect } from 'react';

interface QueuedMetric {
  endpoint: string;
  body: any;
  bodyHash: string;
  minuteBucket: string;
  timestamp: number;
}

class MetricsQueue {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'es_metrics_queue';
  private readonly STORE_NAME = 'metrics';
  private readonly MAX_SIZE_MB = 2;
  private readonly TTL_HOURS = 72;

  async init() {
    if (this.db) return;

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('bodyHash', 'bodyHash');
        }
      };
    });
  }

  async enqueue(endpoint: string, body: any) {
    await this.init();
    if (!this.db) return;

    const bodyHash = await this.hashBody(body);
    const minuteBucket = this.getMinuteBucket();
    
    // Check for duplicate
    const existing = await this.findDuplicate(endpoint, bodyHash, minuteBucket);
    if (existing) return;

    const metric: Omit<QueuedMetric, 'id'> = {
      endpoint,
      body,
      bodyHash,
      minuteBucket,
      timestamp: Date.now()
    };

    const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);
    await store.add(metric);

    // Cleanup if needed
    await this.cleanup();
  }

  async flush() {
    await this.init();
    if (!this.db || !navigator.onLine) return;

    const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
    const store = transaction.objectStore(this.STORE_NAME);
    const metrics = await this.getAllItems(store);

    const successful: number[] = [];

    for (const metric of metrics) {
      try {
        const response = await fetch(`/metrics/${metric.endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': metric.bodyHash
          },
          body: JSON.stringify(metric.body),
          credentials: 'include'
        });

        if (response.ok) {
          successful.push(metric.id);
        }
      } catch (error) {
        console.warn('Failed to flush metric:', error);
      }
    }

    // Remove successful items
    if (successful.length > 0) {
      const deleteTransaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const deleteStore = deleteTransaction.objectStore(this.STORE_NAME);
      
      for (const id of successful) {
        await deleteStore.delete(id);
      }
    }
  }

  private async hashBody(body: any): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(body));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private getMinuteBucket(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  private async findDuplicate(endpoint: string, bodyHash: string, minuteBucket: string): Promise<boolean> {
    if (!this.db) return false;

    const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
    const store = transaction.objectStore(this.STORE_NAME);
    const index = store.index('bodyHash');
    
    const items = await this.getAllItemsByIndex(index, bodyHash);
    return items.some(item => item.endpoint === endpoint && item.minuteBucket === minuteBucket);
  }

  private async getAllItems(store: IDBObjectStore): Promise<QueuedMetric[]> {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getAllItemsByIndex(index: IDBIndex, key: string): Promise<QueuedMetric[]> {
    return new Promise((resolve, reject) => {
      const request = index.getAll(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async cleanup() {
    if (!this.db) return;

    const cutoff = Date.now() - (this.TTL_HOURS * 60 * 60 * 1000);
    const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);
    const index = store.index('timestamp');
    
    // Delete old items
    const range = IDBKeyRange.upperBound(cutoff);
    await index.openCursor(range)?.delete();
  }
}

const metricsQueue = new MetricsQueue();

export function QueueFlusher() {
  useEffect(() => {
    // Flush immediately when online
    const handleOnline = () => {
      metricsQueue.flush();
    };

    // Flush every 60 seconds
    const interval = setInterval(() => {
      metricsQueue.flush();
    }, 60000);

    window.addEventListener('online', handleOnline);

    // Initial flush
    if (navigator.onLine) {
      metricsQueue.flush();
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
}

// Export the queue for use by other components
export { metricsQueue };