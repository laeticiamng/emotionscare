
import { UserRole } from "@/types/types";

export const hasRoleAccess = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const roleHierarchy = {
    'admin': 3,
    'manager': 2,
    'user': 1,
    'guest': 0
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const getRoleLoginPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'user':
      return '/dashboard';
    default:
      return '/';
  }
};

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'manager':
      return 'Manager';
    case 'user':
      return 'Utilisateur';
    default:
      return 'Invité';
  }
};

export const compareRoles = (roleA: UserRole, roleB: UserRole): number => {
  const roleHierarchy = {
    'admin': 3,
    'manager': 2,
    'user': 1,
    'guest': 0
  };
  
  return roleHierarchy[roleA] - roleHierarchy[roleB];
};
