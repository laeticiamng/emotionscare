
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { mockUsers } from '@/data/mockUsers';
import { SortDirection } from '@/components/ui/data-table/SortableTableHead';
import { sortData } from '@/utils/sortUtils';
import { SortableField } from '@/components/dashboard/admin/types/tableTypes';

export type UserTableOptions = {
  defaultPageSize?: number;
  defaultPage?: number;
  defaultSortField?: SortableField | null;
  defaultSortDirection?: SortDirection;
};

// Generate more mock users for testing (reusing the logic)
const generateMockUsers = (count: number) => {
  const users = [...mockUsers];
  const baseLength = users.length;
  
  for (let i = 0; i < count - baseLength; i++) {
    const id = `generated-${i+1}`;
    const index = i % mockUsers.length; // Cycle through the original users for data
    const baseUser = mockUsers[index];
    
    users.push({
      ...baseUser,
      id,
      name: `${baseUser.name} ${Math.floor(i / mockUsers.length) + 1}`,
      email: `user${i+baseLength+1}@example.com`,
      anonymity_code: `AC${100000 + i}`,
      emotional_score: Math.floor(Math.random() * 100),
    });
  }
  
  return users;
};

// Generate 100 users for demo
const DEMO_USERS = generateMockUsers(100);

export function useUserTableData({
  defaultPageSize = 25,
  defaultPage = 1,
  defaultSortField = null,
  defaultSortDirection = null
}: UserTableOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from search params or defaults
  const initialPage = Number(searchParams.get('page')) || defaultPage;
  const initialLimit = Number(searchParams.get('limit')) || defaultPageSize;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<typeof DEMO_USERS>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Fetch users with sorting and pagination
  const fetchUsers = useCallback(async (
    page: number, 
    limit: number, 
    field: SortableField | null, 
    direction: SortDirection
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Apply sorting
      let sortedUsers = [...DEMO_USERS];
      if (field && direction) {
        sortedUsers = sortData(sortedUsers, field, direction);
      }
      
      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
      
      // Update hasMore flag
      setHasMore(endIndex < sortedUsers.length);
      
      // Update URL parameters
      searchParams.set('page', page.toString());
      searchParams.set('limit', limit.toString());
      setSearchParams(searchParams, { replace: true });
      
      // For page 1, replace the list; for other pages, append
      if (page === 1) {
        setUsers(paginatedUsers);
      } else {
        setUsers(prevUsers => [...prevUsers, ...paginatedUsers]);
      }
      
      setTotalItems(sortedUsers.length);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Impossible de charger les utilisateurs. Veuillez réessayer.');
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, searchParams, setSearchParams]);
  
  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  // Handle page size change
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  }, []);
  
  // Handle "Load More" button click
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  }, [currentPage, hasMore, isLoading]);
  
  // Handle retry on error
  const handleRetry = useCallback(() => {
    fetchUsers(currentPage, pageSize, defaultSortField, defaultSortDirection);
  }, [currentPage, pageSize, defaultSortField, defaultSortDirection, fetchUsers]);
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  
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
    setUsers
  };
}
