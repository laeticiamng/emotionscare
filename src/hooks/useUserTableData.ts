
import { useState, useCallback } from 'react';
import { User } from '@/types/user';

export type SortDirection = 'asc' | 'desc';
export type SortField = string;

export interface UseUserTableDataProps {
  defaultPageSize?: number;
  defaultSortField?: string;
  defaultSortDirection?: SortDirection;
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
  fetchUsers: (page: number, size: number, sort?: string, dir?: SortDirection) => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleLoadMore: () => void;
  handleRetry: () => void;
}

// Mock data for demonstration
const mockUsers: User[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 5 === 0 ? 'admin' : 'user',
  avatar_url: '',
  department: i % 3 === 0 ? 'Marketing' : i % 3 === 1 ? 'Engineering' : 'HR',
  emotional_score: Math.floor(Math.random() * 100),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  onboarded: i % 7 !== 0,
}));

export const useUserTableData = ({
  defaultPageSize = 10,
  defaultSortField = 'name',
  defaultSortDirection = 'asc',
}: UseUserTableDataProps = {}): UseUserTableDataReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = useCallback(async (
    page: number, 
    size: number, 
    sort: string = sortField, 
    dir: SortDirection = sortDirection
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sort and filter mock data
      const sorted = [...mockUsers].sort((a, b) => {
        const fieldA = a[sort as keyof User] || '';
        const fieldB = b[sort as keyof User] || '';
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return dir === 'asc' 
            ? fieldA.localeCompare(fieldB) 
            : fieldB.localeCompare(fieldA);
        }
        
        return dir === 'asc'
          ? Number(fieldA) - Number(fieldB)
          : Number(fieldB) - Number(fieldA);
      });
      
      // Paginate
      const start = (page - 1) * size;
      const end = start + size;
      const paginatedUsers = sorted.slice(start, end);
      
      setUsers(paginatedUsers);
      setTotalItems(mockUsers.length);
      setSortField(sort);
      setSortDirection(dir);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching users'));
    } finally {
      setIsLoading(false);
    }
  }, [sortField, sortDirection]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchUsers(page, pageSize);
  }, [fetchUsers, pageSize]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchUsers(1, size);
  }, [fetchUsers]);

  const handleLoadMore = useCallback(() => {
    if (isLoading || users.length >= totalItems) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    fetchUsers(nextPage, pageSize)
      .then(() => {
        // Append new users to existing ones for "load more" functionality
        setUsers(prev => {
          const start = (nextPage - 1) * pageSize;
          const end = start + pageSize;
          const newUsers = mockUsers
            .sort((a, b) => {
              const fieldA = a[sortField as keyof User] || '';
              const fieldB = b[sortField as keyof User] || '';
              
              if (typeof fieldA === 'string' && typeof fieldB === 'string') {
                return sortDirection === 'asc' 
                  ? fieldA.localeCompare(fieldB) 
                  : fieldB.localeCompare(fieldA);
              }
              
              return sortDirection === 'asc'
                ? Number(fieldA) - Number(fieldB)
                : Number(fieldB) - Number(fieldA);
            })
            .slice(start, end);
            
          return [...prev, ...newUsers];
        });
      });
  }, [currentPage, fetchUsers, isLoading, pageSize, sortDirection, sortField, totalItems, users.length]);

  const handleRetry = useCallback(() => {
    fetchUsers(currentPage, pageSize, sortField, sortDirection);
  }, [currentPage, fetchUsers, pageSize, sortDirection, sortField]);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Determine if there are more items to load
  const hasMore = currentPage < totalPages;

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
  };
};

export default useUserTableData;
