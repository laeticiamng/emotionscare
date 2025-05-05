
import { useState } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockUsers';

// Hook to provide user filtering functionality for the scan page
export function useScanPage() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Filter users by role or all
  const filterUsers = (filter: string) => {
    setSelectedFilter(filter);
    
    if (filter === 'all') {
      setFilteredUsers(mockUsers);
      return;
    }
    
    if (filter === 'high-risk') {
      const highRiskUsers = mockUsers.filter(user => 
        (user.emotional_score !== undefined && user.emotional_score < 40)
      );
      setFilteredUsers(highRiskUsers);
      return;
    }
    
    if (filter === 'user') {
      const userRoleUsers = mockUsers.filter(user => 
        user.role === UserRole.USER
      );
      setFilteredUsers(userRoleUsers);
      return;
    }
    
    if (filter === 'manager') {
      const managerRoleUsers = mockUsers.filter(user => 
        user.role === UserRole.MANAGER
      );
      setFilteredUsers(managerRoleUsers);
      return;
    }
    
    if (filter === 'admin') {
      const adminRoleUsers = mockUsers.filter(user => 
        user.role === UserRole.ADMIN
      );
      setFilteredUsers(adminRoleUsers);
      return;
    }
  };

  return { 
    filteredUsers,
    selectedFilter,
    filterUsers
  };
}
