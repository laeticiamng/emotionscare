
import { useState, useCallback } from 'react';
import { User } from '@/types/user';
import { SortDirection, SortableField } from '@/components/dashboard/admin/types/tableTypes';

export interface UseUserTableDataParams {
  defaultPageSize?: number;
  defaultSortField?: SortableField;
  defaultSortDirection?: SortDirection;
}

export interface UseUserTableDataReturn {
  users: User[];
  error: Error | null;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
  fetchUsers: (page: number, size: number, sortField: SortableField, sortDir: SortDirection) => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleLoadMore: () => Promise<void>;
  handleRetry: () => Promise<void>;
}

// Mock Users for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'johndoe@example.com',
    name: 'John Doe',
    role: 'b2b_user',
    createdAt: '2023-01-15T08:30:00Z',
    avatar_url: '/avatars/john.jpg',
    status: 'active',
    department: 'Engineering',
    position: 'Senior Developer',
    onboarded: true,
    emotional_score: 85,
    anonymity_code: 'JD-001'
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'b2b_admin',
    createdAt: '2023-02-10T10:15:00Z',
    avatar_url: '/avatars/jane.jpg',
    status: 'active',
    department: 'Human Resources',
    position: 'HR Manager',
    onboarded: true,
    emotional_score: 78,
    anonymity_code: 'JS-002'
  },
  {
    id: '3',
    email: 'robert.johnson@example.com',
    name: 'Robert Johnson',
    role: 'b2b_user',
    createdAt: '2023-03-05T14:45:00Z',
    status: 'inactive',
    department: 'Marketing',
    onboarded: false,
    emotional_score: 62,
    anonymity_code: 'RJ-003'
  }
];

export const useUserTableData = ({
  defaultPageSize = 10,
  defaultSortField = 'name',
  defaultSortDirection = 'asc'
}: UseUserTableDataParams): UseUserTableDataReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState<SortableField>(defaultSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasMore = currentPage < totalPages;

  const fetchUsers = useCallback(async (
    page: number,
    size: number,
    sortField: SortableField,
    sortDir: SortDirection
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // For now, we'll simulate with a delay and mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sort and paginate mock data
      let filteredUsers = [...MOCK_USERS];
      
      // Sort users
      if (sortField && sortDir) {
        filteredUsers.sort((a, b) => {
          const aValue = a[sortField as keyof User];
          const bValue = b[sortField as keyof User];
          
          if (aValue === undefined || bValue === undefined) return 0;
          
          const comparison = String(aValue).localeCompare(String(bValue));
          return sortDir === 'asc' ? comparison : -comparison;
        });
      }
      
      // Paginate users
      const start = (page - 1) * size;
      const paginatedUsers = filteredUsers.slice(start, start + size);
      
      setUsers(page === 1 ? paginatedUsers : [...users, ...paginatedUsers]);
      setTotalItems(MOCK_USERS.length);
      setSortField(sortField);
      setSortDirection(sortDir);
      setCurrentPage(page);
      setPageSize(size);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setIsLoading(false);
    }
  }, [users]);

  const handlePageChange = useCallback((page: number) => {
    fetchUsers(page, pageSize, sortField, sortDirection);
  }, [fetchUsers, pageSize, sortField, sortDirection]);

  const handlePageSizeChange = useCallback((size: number) => {
    fetchUsers(1, size, sortField, sortDirection);
  }, [fetchUsers, sortField, sortDirection]);

  const handleLoadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await fetchUsers(currentPage + 1, pageSize, sortField, sortDirection);
    }
  }, [currentPage, fetchUsers, hasMore, isLoading, pageSize, sortField, sortDirection]);

  const handleRetry = useCallback(async () => {
    await fetchUsers(currentPage, pageSize, sortField, sortDirection);
  }, [currentPage, fetchUsers, pageSize, sortField, sortDirection]);

  return {
    users,
    error,
    isLoading,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasMore,
    fetchUsers,
    handlePageChange,
    handlePageSizeChange,
    handleLoadMore,
    handleRetry
  };
};
