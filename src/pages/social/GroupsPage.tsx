// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Plus, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PageRoot from '@/components/common/PageRoot';

interface CommunityGroup {
  id: string;
  name: string;
  category: string;
  member_count: number;
  description?: string;
}

export default function GroupsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery<CommunityGroup[]>({
    queryKey: ['community_groups', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_groups')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name ?? row.title ?? 'Groupe',
        category: row.category ?? 'Général',
        member_count: row.member_count ?? 0,
        description: row.description,
      }));
    },
    enabled: !!user,
  });

  const handleCreateGroup = () => {
    navigate('/social/groups/create');
  };

  const handleJoinGroup = (groupId: string) => {
    navigate(`/social/groups/${groupId}`);
  };

  if (error) {
    return (
      <PageRoot>
        <div className="container mx-auto p-6" role="alert" aria-label="Erreur de chargement des groupes">
          <Card className="p-6 text-center border-red-500/50">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-3" aria-hidden="true" />
            <p className="text-red-500 font-medium">Erreur lors du chargement des groupes</p>
            <p className="text-sm text-muted-foreground mt-1">
              Veuillez réessayer ultérieurement.
            </p>
          </Card>
        </div>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <main className="container mx-auto p-6 space-y-6" aria-label="Page des groupes communautaires">
        <header className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Mes Groupes</h1>
            <p className="text-muted-foreground">Rejoignez et créez des communautés</p>
          </div>
          <Button onClick={handleCreateGroup} aria-label="Créer un nouveau groupe">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Créer un groupe
          </Button>
        </header>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6" aria-label="Chargement des groupes">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </Card>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <Card className="p-8 text-center" aria-label="Aucun groupe disponible">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
            <p className="text-lg font-medium text-foreground">Aucun groupe disponible</p>
            <p className="text-sm text-muted-foreground mt-1">
              Soyez le premier à créer un groupe communautaire.
            </p>
            <Button onClick={handleCreateGroup} className="mt-4" aria-label="Créer le premier groupe">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Créer un groupe
            </Button>
          </Card>
        ) : (
          <section className="grid md:grid-cols-2 gap-6" aria-label="Liste des groupes">
            {groups.map((group) => (
              <Card key={group.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <Badge variant="secondary">{group.category}</Badge>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                </div>
                {group.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {group.member_count} membres actifs
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleJoinGroup(group.id)}
                  aria-label={`Rejoindre le groupe ${group.name}`}
                >
                  Rejoindre le groupe
                </Button>
              </Card>
            ))}
          </section>
        )}
      </main>
    </PageRoot>
  );
}
