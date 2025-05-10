
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import Pagination from '@/components/ui/data-table/Pagination';
import { useSortableTable } from '@/hooks/useSortableTable';
import { useUserTableData } from '@/hooks/useUserTableData';
import { SortableField } from './types/tableTypes';
import UserTableHeader from './table-components/UserTableHeader';
import UserTableBody from './table-components/UserTableBody';
import { useSelectedUsers } from '@/hooks/useSelectedUsers';
import BulkActionsBar from './table-components/BulkActionsBar';

interface UsersTableDemoProps {
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  showLoadMoreButton?: boolean; 
}

const UsersTableDemo: React.FC<UsersTableDemoProps> = ({
  defaultPageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  showLoadMoreButton = false,
}) => {
  // Sorting state management
  const { sortField, sortDirection, handleSort, isSorted } = useSortableTable<SortableField>({
    storageKey: 'user-table-sort',
    persistInUrl: true,
    defaultField: 'name',
    defaultDirection: 'asc'
  });
  
  // Table data management
  const {
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
    handleRetry
  } = useUserTableData({
    defaultPageSize,
    defaultSortField: sortField,
    defaultSortDirection: sortDirection
  });
  
  // Selected users management
  const {
    selectedUsers,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
    allSelected,
    hasSelectedUsers
  } = useSelectedUsers(users.map(u => u.id));
  
  // Fetch users when sort, page or page size changes
  React.useEffect(() => {
    fetchUsers(currentPage, pageSize, sortField, sortDirection);
  }, [fetchUsers, currentPage, pageSize, sortField, sortDirection]);
  
  return (
    <Card className="w-full">
      <div className="px-4 py-2 flex items-center justify-between border-b">
        <h3 className="font-medium">Utilisateurs ({totalItems})</h3>
      </div>
      
      {/* Show bulk actions bar only when users are selected */}
      {hasSelectedUsers && (
        <div className="px-4 py-2">
          <BulkActionsBar 
            selectedUsers={selectedUsers} 
            onClearSelection={clearSelection}
          />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <UserTableHeader 
            onSort={handleSort} 
            isSorted={isSorted} 
            onSelectAll={toggleSelectAll}
            allSelected={allSelected}
            hasSelectionEnabled={true}
          />
          <UserTableBody 
            users={users} 
            isLoading={isLoading} 
            error={error || ''} 
            hasData={users.length > 0}
            onRetry={handleRetry}
            isLoadingMore={isLoading && users.length > 0}
            selectedUsers={selectedUsers}
            onSelectUser={toggleUserSelection}
            hasSelectionEnabled={true}
          />
        </Table>
      </div>
      
      {/* Pagination or Load More Button */}
      {!showLoadMoreButton ? (
        <div className="px-4 py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      ) : (
        <div className="px-4 py-4 flex justify-center">
          {currentPage < totalPages && (
            <button
              onClick={handleLoadMore}
              disabled={isLoading || currentPage >= totalPages}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-secondary-foreground border-r-secondary-foreground border-b-secondary-foreground/30 border-l-secondary-foreground/30 rounded-full animate-spin"></div>
                  Chargement...
                </>
              ) : (
                'Charger plus'
              )}
            </button>
          )}
        </div>
      )}
    </Card>
  );
};

export default UsersTableDemo;
