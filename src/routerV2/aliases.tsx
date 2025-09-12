/**
 * RouterV2 Aliases - Redirections pour compatibilité
 * TICKET: FE/BE-Router-Cleanup-01
 */

export const ROUTE_ALIASES = [
  // Redirections de compatibilité
  { from: '/home', to: '/' },
  { from: '/app/dashboard', to: '/app/home' },
];

export function findRedirectFor(path: string): string | null {
  const alias = ROUTE_ALIASES.find(a => a.from === path);
  return alias?.to || null;
}