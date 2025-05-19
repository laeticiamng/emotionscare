
export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string; // For compatibility
  lastName?: string;
  avatar?: string;
  avatar_url?: string; // For backward compatibility
  avatarUrl?: string; // For backward compatibility
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // For backward compatibility
  updated_at?: string; // For backward compatibility
  joined_at?: string; // For backward compatibility
  position?: string; // Add position field
  department?: string; // Add department field
  preferences?: Record<string, any>; // Add preferences field
  emotional_score?: number; // For backward compatibility
}

export type UserRole = 'admin' | 'manager' | 'user' | 'guest' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface AuthUser extends User {
  token?: string;
  isAuthenticated?: boolean;
  name: string; // Make name required in AuthUser
}

export interface UserWithStatus extends User {
  status: 'online' | 'offline' | 'away' | 'busy';
  lastActive?: string;
  firstName?: string; // For compatibility
}
