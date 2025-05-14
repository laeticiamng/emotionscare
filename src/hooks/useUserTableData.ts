
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

export interface UseUserTableDataParams {
  initialPageSize?: number;
  fetchLimit?: number;
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
  handleLoadMore: () => Promise<void>;
  handleRetry: () => Promise<void>;
  filterUsers: (filter: string) => void;
}

export const useUserTableData = (params?: UseUserTableDataParams): UseUserTableDataReturn => {
  const defaultPageSize = params?.initialPageSize || 10;
  const fetchLimit = params?.fetchLimit || 100;
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filter, setFilter] = useState<string>('');
  
  // Mock user data
  const mockUsers: User[] = Array.from({ length: 35 }).map((_, index) => ({
    id: `user-${index + 1}`,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: ((index % 3 === 0) ? 'b2b_admin' : (index % 2 === 0) ? 'b2b_user' : 'b2c') as UserRole,
    emotional_score: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    position: ['Manager', 'Développeur', 'Designer', 'RH', 'Marketing', 'Support'][Math.floor(Math.random() * 6)]
  }));

  const fetchUsers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set mock users and total
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setTotalItems(mockUsers.length);
      
    } catch (err: any) {
      setError(new Error(err.message || 'Failed to fetch users'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterUsers = (filterValue: string): void => {
    setFilter(filterValue);
    if (!filterValue) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(
      user => 
        user.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
        (user.position && user.position.toLowerCase().includes(filterValue.toLowerCase()))
    );
    
    setFilteredUsers(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };
  
  const handlePageSizeChange = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };
  
  const handleLoadMore = async (): Promise<void> => {
    if (users.length >= fetchLimit) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // No need to load more, we have all the mock data already
      // In a real implementation, you'd load more data from the API
      
    } catch (err: any) {
      setError(new Error(err.message || 'Failed to load more users'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRetry = async (): Promise<void> => {
    return fetchUsers();
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Calculate pagination values
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasMore = currentPage < totalPages;
  
  return {
    users: filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize),
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
    filterUsers
  };
};

export default useUserTableData;
