import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Supabase client
const createDefaultQueryResult = () => Promise.resolve({ data: [], error: null });

const createDefaultTable = () => {
  const defaultResult = createDefaultQueryResult();
  const table: any = {
    select: vi.fn(() => table),
    eq: vi.fn(() => table),
    is: vi.fn(() => table),
    order: vi.fn(() => table),
    limit: vi.fn(() => table),
    single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
    then: (onFulfilled: any, onRejected?: any) => defaultResult.then(onFulfilled, onRejected),
    catch: (onRejected: any) => defaultResult.catch(onRejected),
    finally: (onFinally: any) => defaultResult.finally(onFinally),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: {}, error: null }))
        }))
      }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null }))
    }))
  };
  return table;
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
      signIn: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    },
    from: vi.fn(() => createDefaultTable()),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { generatedText: 'test response' }, error: null }))
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ data: { path: 'test-path' }, error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'test-url' } }))
      }))
    }
  }
}));

// Mock router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({ pathname: '/' })),
  Link: ({ children, to }: any) => React.createElement('a', { href: to }, children),
  BrowserRouter: ({ children }: any) => React.createElement('div', null, children),
  Navigate: ({ to, children }: any) => React.createElement('a', { href: to }, children),
  createBrowserRouter: vi.fn(() => ({ routes: [] })),
}));
