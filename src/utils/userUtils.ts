
import { User } from '@/types/types';

export const getUserAvatarUrl = (user?: User | null): string => {
  if (!user) return '';
  return user.avatar_url || user.avatar || `/avatars/${user.id}.png` || '';
};

export const getUserInitials = (user?: User | null): string => {
  if (!user || !user.name) return '';
  
  const names = user.name.split(' ');
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
};

export const isAdminRole = (role?: string): boolean => {
  return role === 'b2b_admin';
};
