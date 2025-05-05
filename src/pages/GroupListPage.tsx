
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Group } from '@/types/community';
import { fetchGroups } from '@/lib/communityService';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import GroupList from '@/components/community/GroupList';
import GroupForm from '@/components/community/GroupForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GroupListPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  // Fetch groups on component mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoading(true);
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups);
        setFilteredGroups(fetchedGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les groupes",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, [toast]);

  // Filter groups based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.tags && group.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredGroups(filtered);
    }
  }, [searchTerm, groups]);

  // Filter based on tab
  useEffect(() => {
    if (activeTab === 'all') {
      // Apply only search filter
      if (searchTerm === '') {
        setFilteredGroups(groups);
      } else {
        const filtered = groups.filter(group => 
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (group.tags && group.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        );
        setFilteredGroups(filtered);
      }
    } else if (activeTab === 'my') {
      // Show only joined groups
      const myGroups = groups.filter(group => {
        // Check if the user is a member
        // This is a placeholder - implement proper membership check
        return group.members_count > 0;
      });
      setFilteredGroups(myGroups);
    } else if (activeTab === 'popular') {
      // Sort by member count
      const popularGroups = [...groups].sort((a, b) => b.members_count - a.members_count);
      setFilteredGroups(popularGroups);
    }
  }, [activeTab, groups, searchTerm]);

  const handleGroupCreated = (newGroup: Group) => {
    setGroups(prevGroups => [...prevGroups, newGroup]);
    setFilteredGroups(prevGroups => [...prevGroups, newGroup]);
    toast({
      title: "Groupe créé avec succès",
      description: `Vous avez créé le groupe "${newGroup.name}"`,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Groupes</h1>
          <p className="text-muted-foreground">
            Rejoignez des groupes pour discuter de sujets qui vous intéressent
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un groupe
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Créer un nouveau groupe</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <GroupForm 
                onGroupCreated={handleGroupCreated} 
                joinAfterCreation={true}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Rechercher un groupe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="my">Mes groupes</TabsTrigger>
          <TabsTrigger value="popular">Populaires</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="py-4">
          <GroupList groups={filteredGroups} loading={isLoading} />
        </TabsContent>
        
        <TabsContent value="my" className="py-4">
          <GroupList groups={filteredGroups} loading={isLoading} />
        </TabsContent>
        
        <TabsContent value="popular" className="py-4">
          <GroupList groups={filteredGroups} loading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupListPage;
