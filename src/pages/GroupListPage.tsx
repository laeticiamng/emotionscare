
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Users, BarChart, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchGroups } from '@/lib/communityService';
import GroupForm from '@/components/community/GroupForm';

// Mock data for now
interface Group {
  id: string;
  name: string;
  topic: string;
  members: string[];
}

interface GroupListComponentProps {
  groups: Group[];
  loading?: boolean;
}

const GroupListComponent: React.FC<GroupListComponentProps> = ({ groups, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-10">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Aucun groupe trouvé</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Soyez le premier à créer un groupe pour échanger !
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map(group => (
        <div
          key={group.id}
          className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-all"
        >
          <h3 className="font-medium">{group.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {group.topic}
          </p>
          <div className="flex items-center mt-3 text-xs text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.members.length} membres</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const GroupListPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadGroups = async () => {
      setIsLoading(true);
      try {
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups || []);
        setFilteredGroups(fetchedGroups || []);
      } catch (error) {
        console.error('Error loading groups:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les groupes',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, [toast]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredGroups(groups);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = groups.filter(
      group =>
        group.name.toLowerCase().includes(lowerCaseQuery) ||
        group.topic.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredGroups(filtered);
  }, [searchQuery, groups]);

  const handleCreateGroupSuccess = (newGroup: Group) => {
    setGroups(prev => [newGroup, ...prev]);
    setShowCreateForm(false);
    toast({
      title: 'Groupe créé',
      description: `Le groupe "${newGroup.name}" a été créé avec succès`,
    });
  };

  const myGroups = groups.filter(
    group => user && group.members.includes(user.id)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Groupes de discussion</h1>
          <p className="text-muted-foreground mt-1">
            Rejoignez des groupes pour échanger sur des thèmes qui vous intéressent
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="self-end md:self-auto">
          <Plus className="mr-2 h-4 w-4" />
          {showCreateForm ? 'Annuler' : 'Créer un groupe'}
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <GroupForm
            onSuccess={handleCreateGroupSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un groupe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            <span>Tous les groupes</span>
          </TabsTrigger>
          <TabsTrigger value="my" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>Mes groupes</span>
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Recommandés</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <GroupListComponent groups={filteredGroups} loading={isLoading} />
        </TabsContent>
        <TabsContent value="my">
          <GroupListComponent groups={myGroups} loading={isLoading} />
        </TabsContent>
        <TabsContent value="recommended">
          <GroupListComponent groups={filteredGroups.slice(0, 6)} loading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupListPage;
