/**
 * Test setup for API tests
 * Mocks browser-specific globals for Node environment
 */

// Set environment variables for tests BEFORE any imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRETS = 'abcdefghijklmnopqrstuvwxyz123456789012345678901234567890';
process.env.ALLOWED_ORIGINS = 'http://localhost:5173,http://localhost:3000';
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

// Mock localStorage for Node environment
if (typeof globalThis.localStorage === 'undefined') {
  const storage = new Map<string, string>();

  globalThis.localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    get length() {
      return storage.size;
    },
  };
}

// Mock sessionStorage for Node environment
if (typeof globalThis.sessionStorage === 'undefined') {
  const storage = new Map<string, string>();

  globalThis.sessionStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    get length() {
      return storage.size;
    },
  };
}

// Mock window for Node environment
if (typeof globalThis.window === 'undefined') {
  (globalThis as any).window = {
    location: {
      origin: 'http://localhost:5173',
      href: 'http://localhost:5173',
      hostname: 'localhost',
      protocol: 'http:',
      port: '5173',
    },
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

export {};
