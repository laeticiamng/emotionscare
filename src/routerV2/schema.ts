/**
 * RouterV2 Schema - Source de vérité unique pour le routing
 * TICKET: FE/BE-Router-Cleanup-01
 */

export type Segment = 'public' | 'consumer' | 'employee' | 'manager';
export type Role = 'consumer' | 'employee' | 'manager';
export type LayoutType = 'marketing' | 'app' | 'simple';

export interface RouteMeta {
  name: string;              // ex: 'home', 'music'
  path: string;              // ex: '/app/home'
  segment: Segment;          // 'public' | 'consumer' | 'employee' | 'manager'
  role?: Role;               // si protégé (accès exclusif)
  allowedRoles?: Role[];     // rôles autorisés (accès multiple)
  layout?: LayoutType;       // layout à utiliser
  component: string;         // chemin vers le composant
  aliases?: string[];        // ex: ['/music', '/b2c/login']
  deprecated?: boolean;      // pour audit/CI
  guard?: boolean;           // nécessite une protection
  requireAuth?: boolean;     // nécessite authentification
}

export interface RouteRegistry {
  routes: RouteMeta[];
}