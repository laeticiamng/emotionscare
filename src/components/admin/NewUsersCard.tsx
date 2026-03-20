import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NewUser {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string | null;
  department: string | null;
}

const NewUsersCard: React.FC = () => {
  const { data: newUsers = [], isLoading } = useQuery({
    queryKey: ['admin-new-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, created_at, department')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data || []) as NewUser[];
    },
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-1">
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
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`} alt={user.name || ''} />
            <AvatarFallback>{(user.name || user.email || '?').substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user.name || user.email || 'Utilisateur'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.department || 'Non assigné'}</p>
          </div>

          <div className="text-xs text-right text-muted-foreground">
            {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            }) : ''}
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
