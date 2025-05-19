
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  name?: string; // Added for backward compatibility
  avatar?: string;
  avatar_url?: string; // For backward compatibility
  avatarUrl?: string; // Additional backward compatibility
  role?: UserRole;
  position?: string; // Added for backward compatibility
  department?: string; // Added for backward compatibility
  joined_at?: Date | string; // Added for backward compatibility
}

export type UserRole = 'admin' | 'user' | 'guest' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface UserWithStatus extends AuthUser {
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

// Add User interface for older components
export interface User extends AuthUser {
  // Additional fields that might be used in older components
  position?: string;
  department?: string;
  joined_at?: Date | string;
}
