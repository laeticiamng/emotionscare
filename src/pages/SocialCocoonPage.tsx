
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Post, Group } from '@/types/community';
import { getPosts, getUsers, getGroups } from '@/lib/communityService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostForm from '@/components/community/PostForm';
import PostItem from '@/components/community/PostItem';
import GroupList from '@/components/community/GroupList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, TrendingUp } from 'lucide-react';

const SocialCocoonPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [joiningGroup, setJoiningGroup] = useState<string | null>(null);
  
  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedPosts, userMap, fetchedGroups] = await Promise.all([
          getPosts(),
          getUsers(),
          getGroups()
        ]);
        
        setPosts(fetchedPosts);
        setUserNames(userMap);
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const handlePostCreated = async () => {
    // Refresh posts after a new one is created
    const freshPosts = await getPosts();
    setPosts(freshPosts);
  };
  
  const handleJoinGroup = async (groupId: string) => {
    setJoiningGroup(groupId);
    try {
      // Implementation would be added here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Succès",
        description: "Vous avez rejoint ce groupe",
      });
      
      // Refresh groups after joining
      const freshGroups = await getGroups();
      setGroups(freshGroups);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre ce groupe",
        variant: "destructive"
      });
    } finally {
      setJoiningGroup(null);
    }
  };
  
  const getUserName = (userId: string): string => {
    return userNames[userId] || 'Utilisateur Anonyme';
  };
  
  const userHasJoined = (group: Group) => {
    // Implementation would check if user is a member of the group
    return Math.random() > 0.5; // Randomly return true/false for demo
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Social Cocoon</h1>
          <p className="text-muted-foreground italic">Partagez, encouragez et inspirez</p>
        </div>
        
        <div className="bg-secondary/20 px-4 py-2 rounded-full text-sm flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-secondary" />
          <span>Posts ce mois : 5/10</span>
        </div>
      </div>
      
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="mb-4 w-full max-w-md">
          <TabsTrigger value="feed" className="flex-1">Fil d'actualité</TabsTrigger>
          <TabsTrigger value="groups" className="flex-1">Groupes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-6">
          <PostForm onPostCreated={handlePostCreated} />
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted rounded-md"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostItem 
                    key={post.id} 
                    post={post}
                    getUserName={getUserName}
                    onPostUpdated={handlePostCreated}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">Aucune publication pour le moment</p>
                    <Button>Créer votre première publication</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="groups">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Groupes & Communautés</h2>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500">
              <Plus className="h-4 w-4" />
              <span>Créer un groupe</span>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded-md"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <GroupList 
              groups={groups}
              userHasJoined={userHasJoined}
              handleJoin={handleJoinGroup}
              joining={joiningGroup}
              loading={loading}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialCocoonPage;
