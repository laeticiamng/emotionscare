import './test/setupTests';
import { loadEnv } from 'vite';

// Charge les variables d'environnement de `.env.test`
const env = loadEnv('test', process.cwd(), '');
(globalThis as any).importMetaEnv = env;
(globalThis as any).process = {
  ...process,
  env: { ...process.env, ...env },
};

// Framer-motion injects DOM-specific styles that JSDOM can't handle.
// Provide minimal mocks so components render in tests without crashing.
vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', section: 'section' }
}));

