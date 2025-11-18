/**
 * Tests for Offline Queue Manager
 * Critical service for offline-first functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { QueueItem, QueueStats, QueueItemType } from '../offlineQueue';

// Mock IndexedDB
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
};

// Mock logger
vi.mock('../logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Setup mock for IndexedDB
global.indexedDB = mockIndexedDB as any;

describe('OfflineQueueManager', () => {
  let mockDB: any;
  let mockTransaction: any;
  let mockObjectStore: any;
  let mockRequest: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock database objects
    mockObjectStore = {
      add: vi.fn(),
      put: vi.fn(),
      get: vi.fn(),
      getAll: vi.fn(),
      delete: vi.fn(),
      createIndex: vi.fn(),
      index: vi.fn(),
    };

    mockTransaction = {
      objectStore: vi.fn().mockReturnValue(mockObjectStore),
      oncomplete: null,
      onerror: null,
    };

    mockDB = {
      transaction: vi.fn().mockReturnValue(mockTransaction),
      createObjectStore: vi.fn().mockReturnValue(mockObjectStore),
      objectStoreNames: {
        contains: vi.fn().mockReturnValue(false),
      },
      close: vi.fn(),
    };

    mockRequest = {
      result: mockDB,
      error: null,
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
    };

    mockIndexedDB.open.mockReturnValue(mockRequest);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should open IndexedDB database', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      // Simulate successful DB open
      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      expect(mockIndexedDB.open).toHaveBeenCalledWith(
        'EmotionsCareOfflineDB',
        2
      );
    });

    it('should create object stores on first run', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      // Simulate DB upgrade
      setTimeout(() => {
        if (mockRequest.onupgradeneeded) {
          mockRequest.onupgradeneeded();
        }
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      expect(mockDB.createObjectStore).toHaveBeenCalledWith(
        'offlineQueue',
        expect.objectContaining({ keyPath: 'id' })
      );
    });

    it('should handle initialization errors', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      const error = new Error('DB open failed');

      setTimeout(() => {
        mockRequest.error = error;
        if (mockRequest.onerror) mockRequest.onerror();
      }, 0);

      await expect(manager.initialize()).rejects.toThrow();
    });

    it('should not reinitialize if already initialized', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      mockIndexedDB.open.mockClear();

      await manager.initialize();

      expect(mockIndexedDB.open).not.toHaveBeenCalled();
    });
  });

  describe('addToQueue', () => {
    it('should add item to queue', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      // Initialize DB
      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
        result: null,
        error: null,
      };

      mockObjectStore.add.mockReturnValue(mockAddRequest);

      const addPromise = manager.addToQueue(
        'journal',
        { text: 'Test entry' },
        '/api/journal',
        'POST',
        'normal'
      );

      setTimeout(() => {
        if (mockAddRequest.onsuccess) mockAddRequest.onsuccess();
      }, 0);

      const item = await addPromise;

      expect(item).toBeDefined();
      expect(item.type).toBe('journal');
      expect(item.status).toBe('pending');
      expect(item.endpoint).toBe('/api/journal');
      expect(item.method).toBe('POST');
      expect(item.priority).toBe('normal');
      expect(mockObjectStore.add).toHaveBeenCalled();
    });

    it('should generate unique IDs', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
      };

      mockObjectStore.add.mockReturnValue(mockAddRequest);

      const promise1 = manager.addToQueue(
        'emotion',
        {},
        '/api/emotion',
        'POST'
      );

      const promise2 = manager.addToQueue(
        'emotion',
        {},
        '/api/emotion',
        'POST'
      );

      setTimeout(() => {
        if (mockAddRequest.onsuccess) mockAddRequest.onsuccess();
      }, 0);

      const [item1, item2] = await Promise.all([promise1, promise2]);

      expect(item1.id).not.toBe(item2.id);
    });

    it('should handle add errors', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const error = new Error('Add failed');
      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
        error,
      };

      mockObjectStore.add.mockReturnValue(mockAddRequest);

      const addPromise = manager.addToQueue(
        'journal',
        {},
        '/api/journal',
        'POST'
      );

      setTimeout(() => {
        if (mockAddRequest.onerror) mockAddRequest.onerror();
      }, 0);

      await expect(addPromise).rejects.toThrow();
    });

    it('should set default values', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
      };

      mockObjectStore.add.mockReturnValue(mockAddRequest);

      const addPromise = manager.addToQueue(
        'music',
        {},
        '/api/music'
        // No method or priority specified
      );

      setTimeout(() => {
        if (mockAddRequest.onsuccess) mockAddRequest.onsuccess();
      }, 0);

      const item = await addPromise;

      expect(item.method).toBe('POST'); // Default
      expect(item.priority).toBe('normal'); // Default
      expect(item.retries).toBe(0);
      expect(item.maxRetries).toBe(3);
    });
  });

  describe('getAll', () => {
    it('should retrieve all queue items', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const mockItems: QueueItem[] = [
        {
          id: 'item-1',
          type: 'journal',
          status: 'pending',
          data: {},
          timestamp: Date.now(),
          retries: 0,
          maxRetries: 3,
          priority: 'normal',
          endpoint: '/api/journal',
          method: 'POST',
        },
        {
          id: 'item-2',
          type: 'emotion',
          status: 'synced',
          data: {},
          timestamp: Date.now(),
          retries: 0,
          maxRetries: 3,
          priority: 'high',
          endpoint: '/api/emotion',
          method: 'POST',
        },
      ];

      const mockGetAllRequest = {
        onsuccess: null,
        onerror: null,
        result: mockItems,
      };

      mockObjectStore.getAll.mockReturnValue(mockGetAllRequest);

      const getAllPromise = manager.getAll();

      setTimeout(() => {
        if (mockGetAllRequest.onsuccess) mockGetAllRequest.onsuccess();
      }, 0);

      const items = await getAllPromise;

      expect(items).toHaveLength(2);
      expect(items[0].id).toBe('item-1');
      expect(items[1].id).toBe('item-2');
    });

    it('should return empty array when queue is empty', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const mockGetAllRequest = {
        onsuccess: null,
        onerror: null,
        result: [],
      };

      mockObjectStore.getAll.mockReturnValue(mockGetAllRequest);

      const getAllPromise = manager.getAll();

      setTimeout(() => {
        if (mockGetAllRequest.onsuccess) mockGetAllRequest.onsuccess();
      }, 0);

      const items = await getAllPromise;

      expect(items).toEqual([]);
    });
  });

  describe('getStats', () => {
    it('should calculate queue statistics', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const mockItems: QueueItem[] = [
        {
          id: '1',
          type: 'journal',
          status: 'pending',
          data: {},
          timestamp: Date.now(),
          retries: 0,
          maxRetries: 3,
          priority: 'normal',
          endpoint: '/api',
          method: 'POST',
        },
        {
          id: '2',
          type: 'emotion',
          status: 'syncing',
          data: {},
          timestamp: Date.now(),
          retries: 0,
          maxRetries: 3,
          priority: 'normal',
          endpoint: '/api',
          method: 'POST',
        },
        {
          id: '3',
          type: 'music',
          status: 'failed',
          data: {},
          timestamp: Date.now(),
          retries: 3,
          maxRetries: 3,
          priority: 'normal',
          endpoint: '/api',
          method: 'POST',
        },
        {
          id: '4',
          type: 'assessment',
          status: 'synced',
          data: {},
          timestamp: Date.now(),
          retries: 0,
          maxRetries: 3,
          priority: 'normal',
          endpoint: '/api',
          method: 'POST',
        },
        {
          id: '5',
          type: 'preference',
          status: 'conflict',
          data: {},
          timestamp: Date.now(),
          retries: 1,
          maxRetries: 3,
          priority: 'normal',
          endpoint: '/api',
          method: 'POST',
        },
      ];

      const mockGetAllRequest = {
        onsuccess: null,
        onerror: null,
        result: mockItems,
      };

      mockObjectStore.getAll.mockReturnValue(mockGetAllRequest);

      const statsPromise = manager.getStats();

      setTimeout(() => {
        if (mockGetAllRequest.onsuccess) mockGetAllRequest.onsuccess();
      }, 0);

      const stats = await statsPromise;

      expect(stats.total).toBe(5);
      expect(stats.pending).toBe(1);
      expect(stats.syncing).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.synced).toBe(1);
      expect(stats.conflicts).toBe(1);
    });
  });

  describe('deleteItem', () => {
    it('should delete item from queue', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const mockDeleteRequest = {
        onsuccess: null,
        onerror: null,
      };

      mockObjectStore.delete.mockReturnValue(mockDeleteRequest);

      const deletePromise = manager.deleteItem('item-123');

      setTimeout(() => {
        if (mockDeleteRequest.onsuccess) mockDeleteRequest.onsuccess();
      }, 0);

      await deletePromise;

      expect(mockObjectStore.delete).toHaveBeenCalledWith('item-123');
    });

    it('should handle delete errors', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const error = new Error('Delete failed');
      const mockDeleteRequest = {
        onsuccess: null,
        onerror: null,
        error,
      };

      mockObjectStore.delete.mockReturnValue(mockDeleteRequest);

      const deletePromise = manager.deleteItem('item-123');

      setTimeout(() => {
        if (mockDeleteRequest.onerror) mockDeleteRequest.onerror();
      }, 0);

      await expect(deletePromise).rejects.toThrow();
    });
  });

  describe('updateItem', () => {
    it('should update item status', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const existingItem: QueueItem = {
        id: 'item-update',
        type: 'journal',
        status: 'pending',
        data: {},
        timestamp: Date.now(),
        retries: 0,
        maxRetries: 3,
        priority: 'normal',
        endpoint: '/api',
        method: 'POST',
      };

      const mockGetRequest = {
        onsuccess: null,
        onerror: null,
        result: existingItem,
      };

      const mockPutRequest = {
        onsuccess: null,
        onerror: null,
      };

      mockObjectStore.get.mockReturnValue(mockGetRequest);
      mockObjectStore.put.mockReturnValue(mockPutRequest);

      const updatePromise = manager.updateItem('item-update', {
        status: 'synced',
      });

      setTimeout(() => {
        if (mockGetRequest.onsuccess) mockGetRequest.onsuccess();
        if (mockPutRequest.onsuccess) mockPutRequest.onsuccess();
      }, 0);

      const updated = await updatePromise;

      expect(updated.status).toBe('synced');
      expect(mockObjectStore.put).toHaveBeenCalled();
    });
  });

  describe('listeners', () => {
    it('should notify listeners on queue changes', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const listener = vi.fn();
      manager.addListener(listener);

      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
      };

      mockObjectStore.add.mockReturnValue(mockAddRequest);

      const addPromise = manager.addToQueue('journal', {}, '/api', 'POST');

      setTimeout(() => {
        if (mockAddRequest.onsuccess) mockAddRequest.onsuccess();
      }, 0);

      await addPromise;

      expect(listener).toHaveBeenCalled();
    });

    it('should remove listeners', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      const listener = vi.fn();
      manager.addListener(listener);
      manager.removeListener(listener);

      // Listener should not be called after removal
      listener.mockClear();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('offline-first behavior', () => {
    it('should work when offline', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');
      const manager = new (OfflineQueueManager as any)();

      // Mock offline state
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        configurable: true,
      });

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager.initialize();

      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
      };

      mockObjectStore.add.mockReturnValue(mockAddRequest);

      const addPromise = manager.addToQueue('journal', {}, '/api', 'POST');

      setTimeout(() => {
        if (mockAddRequest.onsuccess) mockAddRequest.onsuccess();
      }, 0);

      const item = await addPromise;

      expect(item).toBeDefined();
      expect(item.status).toBe('pending');
    });

    it('should persist data across sessions', async () => {
      const { OfflineQueueManager } = await import('../offlineQueue');

      // First session: add item
      const manager1 = new (OfflineQueueManager as any)();

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager1.initialize();

      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
      };

      mockObjectStore.add.mockReturnValue(mockAddRequest);

      const addPromise = manager1.addToQueue('journal', {}, '/api', 'POST');

      setTimeout(() => {
        if (mockAddRequest.onsuccess) mockAddRequest.onsuccess();
      }, 0);

      await addPromise;

      // Second session: retrieve item
      const manager2 = new (OfflineQueueManager as any)();

      const mockGetAllRequest = {
        onsuccess: null,
        onerror: null,
        result: [
          {
            id: 'item-persisted',
            type: 'journal',
            status: 'pending',
            data: {},
            timestamp: Date.now(),
            retries: 0,
            maxRetries: 3,
            priority: 'normal',
            endpoint: '/api',
            method: 'POST',
          },
        ],
      };

      mockObjectStore.getAll.mockReturnValue(mockGetAllRequest);

      setTimeout(() => {
        if (mockRequest.onsuccess) mockRequest.onsuccess();
      }, 0);

      await manager2.initialize();

      const getAllPromise = manager2.getAll();

      setTimeout(() => {
        if (mockGetAllRequest.onsuccess) mockGetAllRequest.onsuccess();
      }, 0);

      const items = await getAllPromise;

      expect(items.length).toBeGreaterThan(0);
    });
  });
});
