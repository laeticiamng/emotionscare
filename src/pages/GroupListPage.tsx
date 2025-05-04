
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchGroups, joinGroup } from '@/lib/communityService';
import type { Group } from '@/types/community';
import GroupForm from '@/components/community/GroupForm';
import GroupListComponent from '@/components/community/GroupList';
import { Loader2, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GroupListPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    async function loadGroups() {
      try {
        setLoading(true);
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups as unknown as Group[]);
      } catch (error) {
        console.error('Error loading groups:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les groupes",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadGroups();
  }, [toast]);

  const handleGroupCreated = (newGroup: Group) => {
    setGroups([newGroup, ...groups]);
    setShowCreateForm(false);
    toast({
      title: "Groupe créé",
      description: "Votre groupe a été créé avec succès"
    });
  };

  const handleJoin = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour rejoindre un groupe",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setJoining(groupId);
      await joinGroup(groupId, user.id);
      
      // Update the local state
      const updatedGroups = groups.map(g => {
        if (g.id === groupId && g.members && !g.members.includes(user.id)) {
          return { ...g, members: [...g.members, user.id] };
        }
        return g;
      });
      
      setGroups(updatedGroups);
      
      toast({
        title: "Groupe rejoint",
        description: "Vous avez rejoint le groupe avec succès"
      });
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre le groupe",
        variant: "destructive"
      });
    } finally {
      setJoining(null);
    }
  };

  const userHasJoined = (group: Group): boolean => {
    return user ? group.members?.includes(user.id) || false : false;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6 flex items-center">
        <Link to="/community" className="mr-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>
        <h1 className="text-3xl font-semibold flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Groupes de parole
        </h1>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Rejoignez un groupe existant ou créez le vôtre pour partager vos expériences avec d'autres professionnels de santé.
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-medium">Groupes disponibles</h2>
          <p className="text-muted-foreground mt-1">
            Explorez les groupes thématiques et engagez la discussion
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="mt-4 sm:mt-0"
        >
          {showCreateForm ? "Annuler" : "Créer un groupe"}
        </Button>
      </div>

      {showCreateForm && (
        <GroupForm onGroupCreated={handleGroupCreated} />
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <GroupListComponent 
          groups={groups}
          userHasJoined={userHasJoined}
          handleJoin={handleJoin}
          joining={joining}
          loading={loading}
        />
      )}
    </div>
  );
};

export default GroupListPage;
