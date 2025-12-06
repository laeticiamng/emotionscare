// @ts-nocheck
export type Segment = 'public' | 'b2c' | 'b2b';
export type Role = 'user' | 'admin' | 'manager' | 'org';
export type Guard =
  | { type: 'auth'; required: boolean }
  | { type: 'role'; roles: Role[] }
  | { type: 'flag'; key: string }
  | { type: 'consent'; scope: 'coach' };

export interface RouteDef {
  name: string;
  path: string;
  segment: Segment;
  guards?: Guard[];
  sitemap?: boolean;
}
