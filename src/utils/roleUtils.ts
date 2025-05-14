
import { UserRole } from '@/types/types';

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'manager':
      return 'Manager';
    case 'wellbeing_manager':
      return 'Responsable bien-être';
    case 'coach':
      return 'Coach';
    case 'b2b_admin':
    case 'b2b-admin':
      return 'Admin B2B';
    case 'b2b_user':
    case 'b2b-user':
      return 'Utilisateur B2B';
    case 'team':
      return 'Équipe';
    case 'employee':
      return 'Employé';
    case 'personal':
      return 'Personnel';
    case 'b2c':
    case 'user':
    default:
      return 'Utilisateur';
  }
};

export const isAdminRole = (role: UserRole): boolean => {
  return role === 'admin' || role === 'b2b_admin' || role === 'b2b-admin';
};

export const isManagerRole = (role: UserRole): boolean => {
  return role === 'manager' || role === 'wellbeing_manager';
};

export const canManageUsers = (role: UserRole): boolean => {
  return isAdminRole(role) || isManagerRole(role);
};

export const canViewReports = (role: UserRole): boolean => {
  return isAdminRole(role) || isManagerRole(role) || role === 'coach';
};

export default {
  getRoleName,
  isAdminRole,
  isManagerRole,
  canManageUsers,
  canViewReports
};
