// @ts-nocheck
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { logger } from '@/lib/logger';

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
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        // Check if current user is admin
        if (user) {
          const { data: currentProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          // Only admins can see user table
          if (currentProfile?.role === 'admin' || currentProfile?.role === 'b2b_admin') {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(100);

            if (profilesError) throw profilesError;

            if (profilesData && profilesData.length > 0) {
              const formattedUsers: UserWithStatus[] = profilesData.map(p => ({
                id: p.id,
                name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Utilisateur',
                email: p.email || '',
                firstName: p.first_name || '',
                lastName: p.last_name || '',
                role: p.role || 'user',
                created_at: p.created_at,
                avatar_url: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'U')}`,
                status: p.is_active === false ? 'inactive' : p.email_confirmed ? 'active' : 'pending'
              }));
              setUsers(formattedUsers);
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch users');
        logger.error('Failed to fetch users', err as Error, 'SYSTEM');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useUserTableData;
