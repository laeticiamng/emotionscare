
import { useState, useCallback, useEffect } from 'react';
import { User } from '@/types/user';
import { UserData } from '@/components/dashboard/admin/types/tableTypes';

interface UserTableDataOptions {
  defaultPageSize?: number;
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc' | null;
}

// Helper to convert User to UserData
const convertUserToUserData = (user: User): UserData => {
  return {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    department: user.department || '',
    location: '', // Default value since User doesn't have location
    status: 'active', // Default value
    avatar: user.avatar || user.avatar_url || user.image,
    createdAt: user.created_at ? String(user.created_at) : '',
    lastActivity: '', // Default value
    emotional_score: user.emotional_score,
    anonymity_code: user.anonymity_code
  };
};

export function useUserTableData({
  defaultPageSize = 10,
  defaultSortField = 'name',
  defaultSortDirection = 'asc'
}: UserTableDataOptions = {}) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const hasMore = currentPage < totalPages;

  // Fetch users function
  const fetchUsers = useCallback(async (
    page: number = 1,
    size: number = pageSize,
    field: string = sortField,
    direction: string | null = sortDirection
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data - in a real app, this would be fetched from an API
      const mockUsers: User[] = Array.from({ length: 50 }).map((_, i) => ({
        id: `user-${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? 'admin' : 'user',
        department: i % 4 === 0 ? 'HR' : 'Engineering',
        emotional_score: Math.floor(Math.random() * 100)
      }));

      // Convert User to UserData
      const userData = mockUsers.map(convertUserToUserData);

      // Sort users
      if (field && direction) {
        userData.sort((a, b) => {
          const aValue = a[field as keyof UserData] || '';
          const bValue = b[field as keyof UserData] || '';
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === 'asc' 
              ? aValue.localeCompare(bValue) 
              : bValue.localeCompare(aValue);
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
          }
          
          return 0;
        });
      }

      // Calculate pagination
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedUsers = userData.slice(startIndex, endIndex);

      setUsers(paginatedUsers);
      setTotalItems(userData.length);
      setCurrentPage(page);
      setPageSize(size);
      setSortField(field);
      setSortDirection(direction);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, sortField, sortDirection]);

  // Format date helper
  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString();
    } catch (err) {
      return String(date);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, pageSize, sortField, sortDirection);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchUsers(1, size, sortField, sortDirection);
  };

  // Handle load more for infinite scroll
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      fetchUsers(nextPage, pageSize, sortField, sortDirection);
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    fetchUsers(currentPage, pageSize, sortField, sortDirection);
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
    formatDate,
    handlePageChange,
    handlePageSizeChange,
    handleLoadMore,
    handleRetry
  };
}
