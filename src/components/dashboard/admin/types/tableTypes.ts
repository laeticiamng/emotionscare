
import { User } from '@/types/user';

export type SortDirection = 'asc' | 'desc' | null;
export type SortableField = 'name' | 'email' | 'role' | 'status' | 'location' | 'createdAt' | 'lastActivity' | 'department' | 'emotional_score' | 'anonymity_code';

// Modify UserData to correctly extend User
export interface UserData extends Omit<User, 'createdAt'> {
  createdAt?: string; // Make it optional in UserData
  location?: string;
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  lastActivity?: string;
}

// Add BulkActionProps interface
export interface BulkActionProps {
  selectedUsers: string[];
  onClearSelection: () => void;
}

export interface SortableTableOptions<T> {
  storageKey?: string;
  persistInUrl?: boolean;
  defaultField: T;
  defaultDirection: SortDirection;
}
