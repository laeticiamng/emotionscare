
import { UserRole } from "@/types";

export const isAdminRole = (role?: string): boolean => {
  return role === UserRole.ADMIN;
};

export const isUserRole = (role?: string): boolean => {
  return role === UserRole.USER;
};

export const getAccessLevelByRole = (role?: string): number => {
  switch (role) {
    case UserRole.ADMIN:
      return 100;
    case UserRole.USER:
      return 10;
    default:
      return 0;
  }
};
