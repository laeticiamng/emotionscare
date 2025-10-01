// @ts-nocheck

import React from 'react';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import LoadingAnimation from '@/components/ui/loading-animation';
import UserTableRow from './UserTableRow';
import { UserData } from '../types/tableTypes';

interface UserTableBodyProps {
  users: UserData[];
  isLoading: boolean;
  error: string | null;
  hasData: boolean;
  onRetry?: () => void;
  isLoadingMore?: boolean;
  selectedUsers?: string[];
  onSelectUser?: (userId: string, isSelected: boolean) => void;
  hasSelectionEnabled?: boolean;
}

const UserTableBody: React.FC<UserTableBodyProps> = ({ 
  users, 
  isLoading, 
  error, 
  hasData,
  onRetry,
  isLoadingMore = false,
  selectedUsers = [],
  onSelectUser,
  hasSelectionEnabled = false
}) => {
  // Loading state with no data
  if (isLoading && users.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={hasSelectionEnabled ? 5 : 4} className="h-24 text-center">
            <LoadingAnimation text="Chargement des utilisateurs..." />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // Error state with no data
  if (error && users.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={hasSelectionEnabled ? 5 : 4} className="h-24">
            <div className="flex flex-col items-center justify-center">
              <p className="text-destructive mb-2">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Réessayer
                </button>
              )}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // Empty state
  if (!hasData) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={hasSelectionEnabled ? 5 : 4} className="h-24 text-center">
            Aucun utilisateur trouvé.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  // Data rows
  return (
    <TableBody>
      {users.map((user) => (
        <UserTableRow 
          key={user.id} 
          user={user} 
          isSelected={selectedUsers.includes(user.id)}
          onSelect={onSelectUser}
          hasSelectionEnabled={hasSelectionEnabled}
        />
      ))}
      {isLoadingMore && (
        <TableRow>
          <TableCell colSpan={hasSelectionEnabled ? 5 : 4} className="h-12 text-center border-t">
            <div className="inline-flex items-center">
              <div className="h-4 w-4 border-2 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 rounded-full animate-spin mr-2"></div>
              Chargement...
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default UserTableBody;
