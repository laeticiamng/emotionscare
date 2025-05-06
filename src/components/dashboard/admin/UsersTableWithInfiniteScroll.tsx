import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import InfiniteScroll from '@/components/ui/data-table/InfiniteScroll';
import LoadingAnimation from '@/components/ui/loading-animation';
import { mockUsers } from '@/data/mockUsers';
import SortableTableHead, { SortDirection } from '@/components/ui/data-table/SortableTableHead';
import { SortableField } from './UsersTableDemo';

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

interface UsersTableWithInfiniteScrollProps {
  pageSize?: number;
}

const UsersTableWithInfiniteScroll: React.FC<UsersTableWithInfiniteScrollProps> = ({
  pageSize = 25,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSortField = (searchParams.get('sortField') as SortableField) || null;
  const initialSortDirection = (searchParams.get('sortDirection') as SortDirection) || null;
  
  // State for the table data
  const [users, setUsers] = useState<typeof DEMO_USERS>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems] = useState(DEMO_USERS.length);
  const [sortField, setSortField] = useState<SortableField | null>(initialSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  
  // Handle sorting
  const handleSort = (field: SortableField) => {
    let newDirection: SortDirection = 'asc';
    
    // If already sorting by this field, cycle through sort directions
    if (field === sortField) {
      if (sortDirection === 'asc') newDirection = 'desc';
      else if (sortDirection === 'desc') newDirection = null;
      else newDirection = 'asc';
    }
    
    // Update sort state
    setSortField(newDirection === null ? null : field);
    setSortDirection(newDirection);
    
    // Reset data and restart from page 1
    setUsers([]);
    setCurrentPage(1);
    setHasMore(true);
  };
  
  // Check if a column is currently sorted
  const isSorted = (field: SortableField): SortDirection => {
    if (field !== sortField) return null;
    return sortDirection;
  };
  
  // Fetch a page of users
  const fetchUsers = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Apply sorting if needed
      let sortedUsers = [...DEMO_USERS];
      
      if (sortField && sortDirection) {
        sortedUsers.sort((a, b) => {
          // Handle different field types
          let valueA: any = a[sortField];
          let valueB: any = b[sortField];
          
          // Special case for nested name field
          if (sortField === 'name') {
            valueA = a.name?.toLowerCase() || '';
            valueB = b.name?.toLowerCase() || '';
          }
          
          // Handle null/undefined values
          if (valueA === null || valueA === undefined) valueA = '';
          if (valueB === null || valueB === undefined) valueB = '';
          
          // Compare based on direction
          const compareResult = typeof valueA === 'string' 
            ? valueA.localeCompare(valueB) 
            : valueA - valueB;
            
          return sortDirection === 'asc' ? compareResult : -compareResult;
        });
      }
      
      // Simulate pagination calculation
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
      
      // Update hasMore flag
      if (endIndex >= sortedUsers.length) {
        setHasMore(false);
      }
      
      // Update the URL with the current page and sort parameters
      searchParams.set('page', page.toString());
      searchParams.set('limit', pageSize.toString());
      
      if (sortField && sortDirection) {
        searchParams.set('sortField', sortField);
        searchParams.set('sortDirection', sortDirection);
      } else {
        searchParams.delete('sortField');
        searchParams.delete('sortDirection');
      }
      
      setSearchParams(searchParams, { replace: true });
      
      // For page 1, replace the list; for other pages, append
      if (page === 1) {
        setUsers(paginatedUsers);
      } else {
        setUsers(prevUsers => [...prevUsers, ...paginatedUsers]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Impossible de charger plus d\'utilisateurs. Veuillez réessayer.');
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, searchParams, setSearchParams, sortField, sortDirection]);
  
  // Initial data loading or when sorting changes
  useEffect(() => {
    const initialPage = Number(searchParams.get('page')) || 1;
    setCurrentPage(initialPage);
    fetchUsers(initialPage);
  }, [fetchUsers, searchParams, sortField, sortDirection]);
  
  // Handle load more
  const handleLoadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchUsers(nextPage);
  }, [currentPage, fetchUsers]);
  
  // Handle retry on error
  const handleRetry = () => {
    fetchUsers(currentPage);
  };
  
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
            <TableHeader>
              <TableRow>
                <SortableTableHead 
                  isSorted={isSorted('name')}
                  onSort={() => handleSort('name')}
                  className="w-[250px]"
                  ariaLabel="Nom d'utilisateur"
                >
                  Utilisateur
                </SortableTableHead>
                
                <SortableTableHead 
                  isSorted={isSorted('emotional_score')}
                  onSort={() => handleSort('emotional_score')}
                  ariaLabel="Score émotionnel"
                >
                  Score émotionnel
                </SortableTableHead>
                
                <SortableTableHead 
                  isSorted={isSorted('role')}
                  onSort={() => handleSort('role')}
                  ariaLabel="Rôle"
                >
                  Rôle
                </SortableTableHead>
                
                <SortableTableHead 
                  isSorted={isSorted('anonymity_code')}
                  onSort={() => handleSort('anonymity_code')}
                  className="text-right"
                  ariaLabel="Code d'anonymisation"
                >
                  Code d'anonymisation
                </SortableTableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <LoadingAnimation text="Chargement des utilisateurs..." />
                  </TableCell>
                </TableRow>
              ) : error && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-destructive mb-2">{error}</p>
                      <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                      >
                        Réessayer
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.emotional_score ?? 'N/A'}
                        {user.emotional_score && (
                          <span 
                            className={`h-2 w-2 rounded-full ${
                              user.emotional_score >= 70 ? 'bg-green-500' : 
                              user.emotional_score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {user.anonymity_code || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
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
