
import { User, UserWithStatus } from '@/types/user';

export function getUserInitials(user: UserWithStatus | User | null): string {
  if (!user || !user.name) return '??';
  
  const parts = user.name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function getUserAvatarUrl(user: UserWithStatus | User | null): string {
  if (!user) return '';
  return user.avatar_url || user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email || 'User')}`;
}

// Make sure User type is compatible across different parts of the app
export function harmonizeUserType(user: any): User {
  if (!user) return {} as User;
  
  return {
    id: user.id || '',
    name: user.name || user.displayName || '',
    email: user.email || '',
    role: user.role || 'b2c',
    avatar_url: user.avatar_url || user.avatarUrl || '',
    avatarUrl: user.avatar_url || user.avatarUrl || '',
    department: user.department || '',
    job_title: user.jobTitle || user.job_title || '',
    preferences: user.preferences || {},
    emotional_score: user.emotionalScore || user.emotional_score || 0
  };
}
