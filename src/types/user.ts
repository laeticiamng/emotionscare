
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
  avatar_url?: string; // For backward compatibility
  avatarUrl?: string; // Additional backward compatibility
  role?: UserRole;
  name?: string; // Added for backward compatibility
  position?: string; // Added for backward compatibility
  department?: string; // Added for backward compatibility
  joined_at?: Date | string; // Added for backward compatibility
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserWithStatus extends AuthUser {
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

// Add User interface for older components
export interface User extends AuthUser {
  // Additional fields that might be used in older components
}
