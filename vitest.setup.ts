/**
 * Force l’implémentation native Node.js de TextEncoder / TextDecoder
 * avant qu’esbuild ne soit importé.
 */
import { TextEncoder, TextDecoder } from 'util';

(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
