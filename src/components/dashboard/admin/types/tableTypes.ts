
export type SortableField = 'id' | 'name' | 'email' | 'role' | 'location' | 'department' | 'createdAt' | 'lastActivity' | 'status' | 'emotional_score' | 'anonymity_code' | string;

export interface SortableColumn {
  key: SortableField;
  label: string;
}

export interface SortableFieldConfig {
  field: SortableField;
  storageKey?: string;
  label: string;
}

export interface TableFilter {
  id: string;
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  placeholder?: string;
}

// Define the UserData interface which replaces UserTableRow
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  status: string;
  avatar?: string;
  createdAt: string;
  lastActivity?: string;
  emotional_score?: number;
  anonymity_code?: string;
  [key: string]: any;
}

// For backward compatibility
export type UserTableRow = UserData;

// Define BulkActionProps interface
export interface BulkActionProps {
  selectedUsers: string[];
  onClearSelection: () => void;
}

// Additional interface for useSortableTable options
export interface SortableTableOptions<T extends string> {
  storageKey?: string;
  persistInUrl?: boolean;
  defaultField?: T;
  defaultDirection?: 'asc' | 'desc' | null;
}

// Interface for Activity Log
export interface ActivityLog {
  id: string;
  timestamp: string;
  activity_type: string;
  activity_details: Record<string, any>;
  user_ip?: string;
  context?: string;
  category?: string;
}
