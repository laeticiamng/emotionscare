import './test/setupTests';
import { loadEnv } from 'vite';

// Charge les variables d'environnement de `.env.test`
const env = loadEnv('test', process.cwd(), '');
(globalThis as any).importMetaEnv = env;
(globalThis as any).process = {
  ...process,
  env: { ...process.env, ...env },
};

