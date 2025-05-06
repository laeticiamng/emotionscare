
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { mockUsers } from '@/data/mockUsers';
import { SortDirection } from '@/components/ui/data-table/SortableTableHead';
import { sortData } from '@/utils/sortUtils';
import { SortableField, UserData } from '@/components/dashboard/admin/types/tableTypes';
import { User } from '@/types';

export type UserTableOptions = {
  defaultPageSize?: number;
  defaultPage?: number;
  defaultSortField?: SortableField | null;
  defaultSortDirection?: SortDirection;
};

// Helper function to convert User to UserData
const mapUserToUserData = (user: User): UserData => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.role === 'admin' ? 'Administration' : 'General',
    location: 'Headquarters',
    status: user.onboarded ? 'Active' : 'Pending',
    avatar: user.avatar || user.image,
    createdAt: user.joined_at || new Date().toISOString(),
    lastActivity: undefined,
    emotional_score: user.emotional_score,
    anonymity_code: user.anonymity_code
  };
};

// Generate more mock users for testing (reusing the logic)
const generateMockUsers = (count: number): UserData[] => {
  const users = [...mockUsers];
  const baseLength = users.length;
  
  const mappedUsers: UserData[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = i < baseLength ? i : i % mockUsers.length;
    const id = i < baseLength ? users[index].id : `generated-${i-baseLength+1}`;
    const baseUser = users[index];
    
    mappedUsers.push({
      ...mapUserToUserData(baseUser),
      id,
      name: i >= baseLength ? `${baseUser.name} ${Math.floor((i - baseLength) / mockUsers.length) + 1}` : baseUser.name,
      email: i >= baseLength ? `user${i+1}@example.com` : baseUser.email,
      anonymity_code: i >= baseLength ? `AC${100000 + i}` : baseUser.anonymity_code,
      emotional_score: i >= baseLength ? Math.floor(Math.random() * 100) : baseUser.emotional_score,
    });
  }
  
  return mappedUsers;
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
  const [users, setUsers] = useState<UserData[]>([]);
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
