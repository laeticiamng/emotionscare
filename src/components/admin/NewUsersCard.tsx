// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NewUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  department: string;
}

const NewUsersCard: React.FC = () => {
  const [newUsers, setNewUsers] = useState<NewUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNewUsers = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');

        // Get users created in the last 7 days
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, first_name, last_name, email, created_at, department')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(5);

        if (profilesData && profilesData.length > 0) {
          const formattedUsers: NewUser[] = profilesData.map(p => ({
            id: p.id,
            name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Utilisateur',
            email: p.email || '',
            joinedDate: p.created_at,
            department: p.department || 'Non spécifié'
          }));
          setNewUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Error loading new users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newUsers.map(user => (
        <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.department}</p>
          </div>

          <div className="text-xs text-right text-muted-foreground">
            {new Date(user.joinedDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            })}
          </div>
        </div>
      ))}

      {newUsers.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <p>Aucun nouvel utilisateur récemment</p>
        </div>
      )}
    </div>
  );
};

export { NewUsersCard };
export default NewUsersCard;
