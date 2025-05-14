
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';

export interface UseUserTableDataParams {
  initialPageSize?: number;
  defaultPageSize?: number; // For UsersTableDemo & UsersTableWithInfiniteScroll
  initialPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface UseUserTableDataReturn {
  users: User[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
  fetchUsers: () => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleLoadMore: () => void;
  handleRetry: () => void;
  handleSort: (field: string) => void;
}

// Mock user data
const generateMockUsers = (count: number): User[] => {
  const roles: UserRole[] = ['b2c', 'b2b_user', 'b2b_admin'];
  const departments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Product', 'Design', 'Sales'];
  const statuses = ['active', 'inactive', 'pending'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `user${i + 1}@example.com`,
    name: `User ${i + 1}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    avatar_url: `https://i.pravatar.cc/150?u=user${i + 1}`,
    department: departments[Math.floor(Math.random() * departments.length)],
    position: ['Manager', 'Associate', 'Director', 'VP', 'Specialist'][Math.floor(Math.random() * 5)],
    team_id: `team-${Math.floor(Math.random() * 5) + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)] as 'active' | 'inactive' | 'pending',
    last_active: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString()
  }));
};

// Total mock user count
const TOTAL_MOCK_USERS = 256;
const mockUsers = generateMockUsers(TOTAL_MOCK_USERS);

export const useUserTableData = (params: UseUserTableDataParams = {}): UseUserTableDataReturn => {
  const {
    initialPageSize = 10,
    initialPage = 1,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filters = {}
  } = params;

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(sortOrder);
  const [filterCriteria, setFilterCriteria] = useState(filters);

  const totalPages = Math.ceil(totalItems / pageSize);
  const hasMore = currentPage < totalPages;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Apply filters if any
      let filteredUsers = [...mockUsers];
      
      Object.entries(filterCriteria).forEach(([key, value]) => {
        if (value) {
          filteredUsers = filteredUsers.filter(user => {
            if (typeof value === 'string') {
              return String(user[key as keyof User]).toLowerCase().includes(value.toLowerCase());
            }
            return user[key as keyof User] === value;
          });
        }
      });
      
      // Apply sorting
      filteredUsers.sort((a, b) => {
        const aValue = a[sortField as keyof User];
        const bValue = b[sortField as keyof User];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        // For dates
        if (aValue && bValue && (aValue instanceof Date || typeof aValue === 'string') && 
            (bValue instanceof Date || typeof bValue === 'string')) {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        }
        
        return 0;
      });
      
      setTotalItems(filteredUsers.length);
      
      // Paginate
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
      
      setUsers(paginatedUsers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortDirection, filterCriteria]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleRetry = () => {
    fetchUsers();
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new sort field
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return {
    users,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasMore,
    fetchUsers,
    handlePageChange,
    handlePageSizeChange,
    handleLoadMore,
    handleRetry,
    handleSort
  };
};

export default useUserTableData;
