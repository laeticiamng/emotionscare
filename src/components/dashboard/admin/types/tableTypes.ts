// @ts-nocheck

import { User } from '@/types/user';

export type SortDirection = 'asc' | 'desc' | null;
export type SortableField = 'name' | 'email' | 'role' | 'status' | 'location' | 'createdAt' | 'lastActivity' | 'department' | 'emotional_score' | 'anonymity_code';

// Define UserData separately instead of extending User
export interface UserData {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  avatar_url?: string;
  avatar?: string;
  department?: string;
  position?: string;
  location?: string;
  status?: 'active' | 'inactive' | 'pending' | 'blocked';
  lastActivity?: string;
  emotional_score?: number;
  anonymity_code?: string;
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
