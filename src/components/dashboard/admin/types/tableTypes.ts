
import { User } from '@/types/user';

export type SortDirection = 'asc' | 'desc' | null;
export type SortableField = 'name' | 'email' | 'role' | 'status' | 'location' | 'createdAt' | 'lastActivity' | 'department' | 'emotional_score' | 'anonymity_code';

export interface UserData extends User {
  location: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  createdAt: string;
  lastActivity?: string;
}

// Add BulkActionProps interface
export interface BulkActionProps {
  selectedUsers: string[];
  onClearSelection: () => void;
}
