
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { mockUsers, generateMockUsers } from '@/data/mockUsers';
import { formatDistanceToNow } from 'date-fns';

export function useUserTableData() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Function to format dates consistently
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  // Function to load users data
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, we'd fetch from an API here
      const initialUsers = [...mockUsers];
      
      // Generate some additional random users if needed
      if (initialUsers.length < 15) {
        const additionalUsers = generateMockUsers(15 - initialUsers.length);
        initialUsers.push(...additionalUsers);
      }
      
      setUsers(initialUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setError(error instanceof Error ? error : new Error('Failed to load users'));
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  return {
    users,
    isLoading,
    error,
    formatDate,
    reload: loadUsers
  };
}

export default useUserTableData;
