
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import InfiniteScroll from '@/components/ui/data-table/InfiniteScroll';
import LoadingAnimation from '@/components/ui/loading-animation';
import { mockUsers } from '@/data/mockUsers';

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
  
  // State for the table data
  const [users, setUsers] = useState<typeof DEMO_USERS>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems] = useState(DEMO_USERS.length);
  
  // Fetch a page of users
  const fetchUsers = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate pagination calculation
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = DEMO_USERS.slice(startIndex, endIndex);
      
      // Update hasMore flag
      if (endIndex >= DEMO_USERS.length) {
        setHasMore(false);
      }
      
      // Update the URL with the current page
      searchParams.set('page', page.toString());
      searchParams.set('limit', pageSize.toString());
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
  }, [pageSize, searchParams, setSearchParams]);
  
  // Initial data loading
  useEffect(() => {
    const initialPage = Number(searchParams.get('page')) || 1;
    setCurrentPage(initialPage);
    fetchUsers(initialPage);
  }, [fetchUsers, searchParams]);
  
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
