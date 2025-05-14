
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

// Simulated API call to get users
const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  // Mock user data
  const users: User[] = [
    {
      id: '1',
      name: 'Alex Dubois',
      email: 'alex@company.com',
      role: 'user' as UserRole,
      department: 'Marketing',
      emotional_score: 78,
      createdAt: '2023-05-10T10:30:00Z'
    },
    {
      id: '2',
      name: 'Marie Laurent',
      email: 'marie@company.com',
      role: 'manager' as UserRole,
      department: 'Finance',
      emotional_score: 65,
      createdAt: '2023-04-15T09:20:00Z'
    },
    {
      id: '3',
      name: 'Thomas Petit',
      email: 'thomas@company.com',
      role: 'employee' as UserRole,
      department: 'IT',
      emotional_score: 82,
      createdAt: '2023-06-01T14:45:00Z'
    },
    {
      id: '4',
      name: 'Sophie Martin',
      email: 'sophie@company.com',
      role: 'employee' as UserRole,
      department: 'HR',
      emotional_score: 73,
      createdAt: '2023-05-22T11:15:00Z'
    },
    {
      id: '5',
      name: 'Lucas Bernard',
      email: 'lucas@company.com',
      role: 'employee' as UserRole,
      department: 'Sales',
      emotional_score: 45,
      createdAt: '2023-03-10T08:30:00Z'
    }
  ];
  
  return users;
};

export function useUserTableData() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Departments list derived from users
  const [departments, setDepartments] = useState<string[]>([]);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        
        // Extract unique departments
        const uniqueDepartments = Array.from(
          new Set(data.map(user => user.department).filter(Boolean))
        ) as string[];
        setDepartments(uniqueDepartments);
        
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users data');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  return {
    users,
    departments,
    loading,
    error
  };
}
