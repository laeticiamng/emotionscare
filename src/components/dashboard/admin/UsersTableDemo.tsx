
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PaginationControls from '@/components/ui/data-table/Pagination';
import LoadingAnimation from '@/components/ui/loading-animation';
import { toast } from 'sonner';
import { mockUsers } from '@/data/mockUsers';

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
  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialLimit = Number(searchParams.get('limit')) || defaultPageSize;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<typeof DEMO_USERS>([]);
  const [totalItems, setTotalItems] = useState(0);

  // Simulate server-side pagination
  const fetchUsers = async (page: number, limit: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate pagination calculation
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = DEMO_USERS.slice(startIndex, endIndex);
      
      // Update state with "fetched" data
      setUsers(paginatedUsers);
      setTotalItems(DEMO_USERS.length);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Impossible de charger la page. Veuillez réessayer.');
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users when page or page size changes
  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize]);

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
    fetchUsers(currentPage, pageSize);
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
              <TableHead className="w-[250px]">Utilisateur</TableHead>
              <TableHead>Score émotionnel</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Code d'anonymisation</TableHead>
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
