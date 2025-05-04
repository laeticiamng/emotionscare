
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchGroups, joinGroup } from '@/lib/communityService';
import type { Group } from '@/types';
import GroupForm from '@/components/community/GroupForm';
import GroupListComponent from '@/components/community/GroupList';

const GroupListPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    async function loadGroups() {
      try {
        setLoading(true);
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups);
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
      <h1 className="text-3xl font-semibold mb-6">👥 Groupes de parole</h1>

      <GroupForm onGroupCreated={handleGroupCreated} />

      <GroupListComponent 
        groups={groups}
        userHasJoined={userHasJoined}
        handleJoin={handleJoin}
        joining={joining}
        loading={loading}
      />
    </div>
  );
};

export default GroupListPage;
