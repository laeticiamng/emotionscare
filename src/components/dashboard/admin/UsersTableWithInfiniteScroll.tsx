
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import InfiniteScroll from '@/components/ui/data-table/InfiniteScroll';
import { useSortableTable } from '@/hooks/useSortableTable';
import { useUserTableData } from '@/hooks/useUserTableData';
import { SortableField } from './types/tableTypes';
import UserTableHeader from './table-components/UserTableHeader';
import UserTableBody from './table-components/UserTableBody';

interface UsersTableWithInfiniteScrollProps {
  pageSize?: number;
}

const UsersTableWithInfiniteScroll: React.FC<UsersTableWithInfiniteScrollProps> = ({
  pageSize = 25,
}) => {
  // Sorting state management
  const { sortField, sortDirection, handleSort, isSorted } = useSortableTable<SortableField>({
    storageKey: 'user-table-infinite-sort',
    persistInUrl: true
  });
  
  // Table data management
  const {
    users,
    isLoading,
    error,
    currentPage,
    hasMore,
    totalItems,
    fetchUsers,
    handleLoadMore,
    handleRetry
  } = useUserTableData({
    defaultPageSize: pageSize,
    defaultSortField: sortField,
    defaultSortDirection: sortDirection
  });
  
  // Fetch users when sorting changes
  React.useEffect(() => {
    fetchUsers(1, pageSize, sortField, sortDirection);
  }, [fetchUsers, pageSize, sortField, sortDirection]);
  
  return (
    <Card className="w-full">
      <div className="px-4 py-2 flex items-center justify-between border-b">
        <h3 className="font-medium">Utilisateurs avec défilement infini ({totalItems})</h3>
      </div>
      
      <div className="overflow-x-auto">
        <InfiniteScroll
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={isLoading}
          threshold={0.8}
        >
          <Table>
            <UserTableHeader onSort={handleSort} isSorted={isSorted} />
            <UserTableBody 
              users={users} 
              isLoading={isLoading} 
              error={error} 
              hasData={users.length > 0}
              onRetry={handleRetry}
              isLoadingMore={false} 
            />
          </Table>
        </InfiniteScroll>
      </div>
      
      {/* Error display when loading more fails */}
      {error && users.length > 0 && (
        <div className="p-4 border-t flex justify-center">
          <div className="flex flex-col items-center">
            <p className="text-destructive mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UsersTableWithInfiniteScroll;
