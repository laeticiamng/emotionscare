import { useState, useCallback } from 'react';
import { UserData } from '@/components/dashboard/admin/types/tableTypes';

export const useSelectedUsers = (users: UserData[]) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Toggle selection for a single user
  const toggleUserSelection = useCallback((userId: string, isSelected: boolean) => {
    setSelectedUsers(prev => {
      if (isSelected) {
        return [...prev, userId];
      } else {
        return prev.filter(id => id !== userId);
      }
    });
  }, []);
  
  // Toggle selection for all users
  const toggleSelectAll = useCallback(() => {
    setSelectedUsers(prev => {
      // If all users are currently selected, clear the selection
      if (users.length > 0 && prev.length === users.length) {
        return [];
      }
      // Otherwise, select all users
      return users.map(user => user.id);
    });
  }, [users]);
  
  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);
  
  // Check if all users are selected
  const allSelected = users.length > 0 && selectedUsers.length === users.length;
  
  // Check if some users are selected (for indeterminate state)
  const someSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;
  
  return {
    selectedUsers,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
    allSelected,
    someSelected,
    hasSelectedUsers: selectedUsers.length > 0
  };
};
