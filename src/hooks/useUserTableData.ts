
import { useState, useEffect } from 'react';
import { User } from '@/types/user';

interface UserWithStatus extends User {
  status?: 'active' | 'inactive' | 'pending';
}

export const useUserTableData = () => {
  const [users, setUsers] = useState<UserWithStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be a fetch call to an API
        // We'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock data
        const mockUsers: UserWithStatus[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            created_at: '2023-05-01T10:00:00Z',
            avatar_url: 'https://ui-avatars.com/api/?name=John+Doe',
            status: 'active'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'admin',
            created_at: '2023-05-02T09:30:00Z',
            avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith',
            status: 'active'
          },
          {
            id: '3',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            firstName: 'Alice',
            lastName: 'Johnson',
            role: 'user',
            created_at: '2023-05-03T14:15:00Z',
            avatar_url: 'https://ui-avatars.com/api/?name=Alice+Johnson',
            status: 'inactive'
          }
        ];
        
        setUsers(mockUsers);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useUserTableData;
