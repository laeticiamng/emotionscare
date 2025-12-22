import { useState, useCallback } from 'react';

export const useSelectedUsers = (userIds: string[]) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Toggle selection for a single user
  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  // Toggle selection for all users
  const toggleSelectAll = useCallback(() => {
    setSelectedUsers(prev => 
      prev.length === userIds.length ? [] : [...userIds]
    );
  }, [userIds]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  // Check if all visible users are selected
  const allSelected = userIds.length > 0 && selectedUsers.length === userIds.length;
  
  // Check if at least one user is selected
  const hasSelectedUsers = selectedUsers.length > 0;

  return {
    selectedUsers,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
    allSelected,
    hasSelectedUsers
  };
};

export default useSelectedUsers;
