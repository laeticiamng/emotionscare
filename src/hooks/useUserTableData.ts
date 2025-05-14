
import { useState, useEffect } from 'react';
import { User } from '@/types/user';

interface UseUserTableDataReturn {
  users: User[];
  departments: string[];
  loading: boolean;
  error: string;
}

export const useUserTableData = (): UseUserTableDataReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const mockUsers: User[] = Array.from({ length: 10 }).map((_, index) => ({
          id: `user-${index + 1}`,
          name: `Utilisateur ${index + 1}`,
          email: `user${index + 1}@example.com`,
          role: index === 0 ? 'b2b_admin' : 'b2b_user',
          department: ['Marketing', 'Développement', 'RH', 'Finance', 'Support'][index % 5],
          position: ['Manager', 'Senior Developer', 'Junior Developer', 'Analyst', 'Designer'][index % 5], 
          emotional_score: Math.floor(Math.random() * 100),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          avatar_url: `https://i.pravatar.cc/150?u=${index}`,
          joined_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          preferences: {
            theme: 'light',
            fontSize: 'medium',
            fontFamily: 'system',
            language: 'fr',
            dashboardLayout: 'default',
            onboardingCompleted: true,
            soundEnabled: true,
            animations: true,
            notifications: {
              enabled: true,
              emailEnabled: true,
              pushEnabled: false,
              frequency: 'daily'
            },
            privacy: {
              shareData: true,
              anonymizeReports: true,
              publicProfile: false
            },
            accessibility: {
              highContrast: false,
              reduceMotion: false,
              largeText: false
            },
            emotionalCamouflage: false,
            aiSuggestions: true,
            fullAnonymity: false,
            notifications_enabled: true
          }
        }));

        setUsers(mockUsers);
        
        // Extract unique departments
        const uniqueDepartments = Array.from(new Set(mockUsers.map(user => user.department || ''))).filter(Boolean);
        setDepartments(uniqueDepartments);
        
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Une erreur est survenue lors du chargement des données utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, departments, loading, error };
};

export default useUserTableData;
