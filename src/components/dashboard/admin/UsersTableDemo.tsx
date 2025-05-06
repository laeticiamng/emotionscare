import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PaginationControls from '@/components/ui/data-table/Pagination';
import LoadingAnimation from '@/components/ui/loading-animation';
import { toast } from 'sonner';
import { mockUsers } from '@/data/mockUsers';
import SortableTableHead, { SortDirection } from '@/components/ui/data-table/SortableTableHead';

// Generate more mock users for testing
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

export type SortableField = "name" | "email" | "role" | "emotional_score" | "anonymity_code";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialLimit = Number(searchParams.get('limit')) || defaultPageSize;
  const initialSortField = (searchParams.get('sortField') as SortableField) || null;
  const initialSortDirection = (searchParams.get('sortDirection') as SortDirection) || null;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<typeof DEMO_USERS>([]);
  const [totalItems, setTotalItems] = useState(0);
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
    
    setSortField(newDirection === null ? null : field);
    setSortDirection(newDirection);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Check if a column is currently sorted
  const isSorted = (field: SortableField): SortDirection => {
    if (field !== sortField) return null;
    return sortDirection;
  };

  // Simulate server-side pagination and sorting
  const fetchUsers = async (page: number, limit: number, field: SortableField | null, direction: SortDirection) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a sorted copy of the data if sorting is applied
      let sortedUsers = [...DEMO_USERS];
      
      if (field && direction) {
        sortedUsers.sort((a, b) => {
          // Handle different field types
          let valueA: any = a[field];
          let valueB: any = b[field];
          
          // Special case for nested name field
          if (field === 'name') {
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
            
          return direction === 'asc' ? compareResult : -compareResult;
        });
      }
      
      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
      
      // Update URL parameters
      searchParams.set('page', page.toString());
      searchParams.set('limit', limit.toString());
      
      if (field && direction) {
        searchParams.set('sortField', field);
        searchParams.set('sortDirection', direction);
      } else {
        searchParams.delete('sortField');
        searchParams.delete('sortDirection');
      }
      
      setSearchParams(searchParams, { replace: true });
      
      // Update state with "fetched" data
      setUsers(paginatedUsers);
      setTotalItems(sortedUsers.length);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Impossible de charger la page. Veuillez réessayer.');
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users when page, page size, or sorting changes
  useEffect(() => {
    fetchUsers(currentPage, pageSize, sortField, sortDirection);
  }, [currentPage, pageSize, sortField, sortDirection]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  // Handle "Load More" button click (for infinite scroll mode)
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    fetchUsers(currentPage, pageSize, sortField, sortDirection);
  };

  return (
    <Card className="w-full">
      <div className="px-4 py-2 flex items-center justify-between border-b">
        <h3 className="font-medium">Utilisateurs ({totalItems})</h3>
      </div>
      
      <div className="overflow-x-auto">
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
            ) : error ? (
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
            {isLoading && users.length > 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-12 text-center border-t">
                  <div className="inline-flex items-center">
                    <div className="h-4 w-4 border-2 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 rounded-full animate-spin mr-2"></div>
                    Chargement...
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      {!showLoadMoreButton ? (
        <div className="px-4">
          <PaginationControls
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
