/**
 * Polyfill cross-fetch pour les tests Node.js
 * Utilise le fetch natif disponible dans Node 18+
 */
const fetchFn = globalThis.fetch;

export const fetch = fetchFn;
export const { Headers, Request, Response } = globalThis;
export default fetch;
