
export type SortableField = 'id' | 'name' | 'email' | 'role' | 'location' | 'department' | 'createdAt' | 'lastActivity' | 'status' | string;

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

export interface UserTableRow {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  status: string;
  createdAt: string;
  lastActivity?: string;
  [key: string]: any;
}
