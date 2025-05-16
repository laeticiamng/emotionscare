
export type UserRole = 'admin' | 'user' | 'coach' | 'manager';

export const isAdminRole = (role?: string): boolean => {
  return role === 'admin';
};

export const normalizeUserRole = (role?: string): UserRole => {
  if (role === 'admin' || role === 'manager' || role === 'coach') {
    return role as UserRole;
  }
  return 'user';
};
