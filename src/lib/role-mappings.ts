/**
 * Mappings centralisés Role <-> UserMode
 * Source unique de vérité pour éviter incohérences
 */

export type Role = 'consumer' | 'employee' | 'manager' | 'admin';
export type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | null;

/**
 * Mapping Role (DB/Auth) -> UserMode (Frontend)
 */
export const ROLE_TO_MODE: Record<Role, UserMode> = {
  consumer: 'b2c',
  employee: 'b2b_user',
  manager: 'b2b_admin',
  admin: 'admin',
} as const;

/**
 * Mapping UserMode (Frontend) -> Role (DB/Auth)
 */
export const MODE_TO_ROLE: Record<NonNullable<UserMode>, Role> = {
  b2c: 'consumer',
  b2b_user: 'employee',
  b2b_admin: 'manager',
  admin: 'admin',
} as const;

/**
 * Convertit un role en mode utilisateur
 */
export function roleToMode(role: string | null | undefined): UserMode {
  if (!role) return null;
  return ROLE_TO_MODE[role as Role] || null;
}

/**
 * Convertit un mode utilisateur en role
 */
export function modeToRole(mode: UserMode): Role | null {
  if (!mode) return null;
  return MODE_TO_ROLE[mode] || null;
}

/**
 * Normalise un role (gère les variantes)
 */
export function normalizeRole(role?: string | null): Role {
  if (!role) return 'consumer';
  
  const normalized = role.toLowerCase();
  
  // Mapping des variantes
  if (normalized === 'b2c' || normalized === 'user') return 'consumer';
  if (normalized === 'b2b_user' || normalized === 'collab') return 'employee';
  if (normalized === 'b2b_admin' || normalized === 'rh' || normalized === 'org_admin') return 'manager';
  if (normalized === 'admin' || normalized === 'super_admin') return 'admin';
  
  return 'consumer'; // Fallback sécurisé
}

/**
 * Vérifie si un role a les permissions d'un autre
 */
export function hasRolePermission(userRole: Role, requiredRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    consumer: 1,
    employee: 2,
    manager: 3,
    admin: 4,
  };
  
  return hierarchy[userRole] >= hierarchy[requiredRole];
}
