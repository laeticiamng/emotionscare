
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchGroups, createGroup, joinGroup } from '@/lib/communityService';
import type { Group } from '@/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus } from 'lucide-react';

const GroupList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [newName, setNewName] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
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

  const handleCreate = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour créer un groupe",
        variant: "destructive"
      });
      return;
    }
    
    if (!newName.trim() || !newTopic.trim()) {
      toast({
        title: "Informations manquantes",
        description: "Le nom et la thématique sont requis",
        variant: "warning"
      });
      return;
    }
    
    try {
      setCreating(true);
      const group = await createGroup(newName, newTopic, newDescription || undefined);
      setGroups([group, ...groups]);
      setNewName('');
      setNewTopic('');
      setNewDescription('');
      toast({
        title: "Groupe créé",
        description: "Votre groupe a été créé avec succès"
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le groupe",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
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

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-medium">Créer un nouveau groupe</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nom du groupe"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            placeholder="Thématique"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <Textarea
            placeholder="Description (optionnel)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
          />
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreate} 
            disabled={creating}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {creating ? 'Création...' : 'Créer un groupe'}
          </Button>
        </CardFooter>
      </Card>

      {loading ? (
        <Card className="p-6 text-center">
          <p>Chargement des groupes...</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <Card className="p-6 text-center">
              <p>Aucun groupe disponible. Créez le premier!</p>
            </Card>
          ) : (
            groups.map((group) => (
              <Card
                key={group.id}
                className="hover:shadow-md transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">{group.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{group.members?.length || 0} membres</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-medium">Thème: {group.topic}</p>
                  {group.description && (
                    <p className="mt-2 text-gray-500">{group.description}</p>
                  )}
                </CardContent>
                <CardFooter>
                  {userHasJoined(group) ? (
                    <Button variant="outline" disabled className="w-full sm:w-auto">
                      Membre
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => handleJoin(group.id)}
                      disabled={joining === group.id}
                      className="w-full sm:w-auto"
                    >
                      {joining === group.id ? 'En cours...' : 'Rejoindre'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GroupList;
