
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchPosts, fetchUserById } from '@/lib/communityService';
import type { User } from '@/types';
import type { Post } from '@/types/community';
import PostForm from '@/components/community/PostForm';
import PostItem from '@/components/community/PostItem';
import LoadingAnimation from '@/components/ui/loading-animation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Share2, UserRound } from 'lucide-react';

const CommunityFeed: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userCache, setUserCache] = useState<Record<string, User | null>>({});
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Function to load posts and user details
  const loadPosts = async () => {
    try {
      setLoadingPosts(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts as Post[]);
      
      // Load user details for each post
      const userIds = fetchedPosts.map(post => post.user_id);
      const uniqueIds = [...new Set(userIds)];
      
      const userDetailsPromises = uniqueIds.map(async id => {
        const userData = await fetchUserById(id);
        return { id, user: userData };
      });
      
      const userDetails = await Promise.all(userDetailsPromises);
      const newUserCache: Record<string, User | null> = { ...userCache };
      
      userDetails.forEach(({ id, user }) => {
        newUserCache[id] = user;
      });
      
      setUserCache(newUserCache);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les posts",
        variant: "destructive"
      });
    } finally {
      setLoadingPosts(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  // Listen for new post events
  useEffect(() => {
    const handleNewPost = (event: CustomEvent) => {
      setPosts(prevPosts => [event.detail, ...prevPosts]);
    };

    window.addEventListener('post-created', handleNewPost as EventListener);

    return () => {
      window.removeEventListener('post-created', handleNewPost as EventListener);
    };
  }, []);

  const getUserName = (userId: string): string => {
    const cachedUser = userCache[userId];
    if (!cachedUser) return "Utilisateur";
    return cachedUser.name || "Utilisateur";
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-semibold mb-6">🌿 Social Cocoon</h1>
      
      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/community">
          <Card className="h-full bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <MessageSquare className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-lg font-medium">Publications</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Partagez votre expérience et restez connecté
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/community/groups">
          <Card className="h-full bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium">Groupes</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Rejoignez des discussions thématiques
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/community/buddies">
          <Card className="h-full bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <UserRound className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-medium">Buddies</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Trouvez votre partenaire de bien-être
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PostForm />

          {/* Loading State */}
          {loadingPosts && (
            <Card className="mb-6 p-6 text-center">
              <LoadingAnimation text="Chargement des publications..." />
            </Card>
          )}

          {/* Empty State */}
          {!loadingPosts && posts.length === 0 && (
            <Card className="mb-6 p-6 text-center">
              <p className="text-muted-foreground">Aucune publication pour le moment. Soyez le premier à partager quelque chose !</p>
            </Card>
          )}

          {/* Posts List */}
          {posts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
              getUserName={getUserName} 
              onPostUpdated={loadPosts} 
            />
          ))}
        </div>
        
        <div>
          <Card className="mb-6 sticky top-20">
            <CardHeader>
              <h3 className="text-xl font-medium">Communauté Cocoon</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Connectez-vous avec d'autres professionnels de santé et partagez vos expériences dans un espace bienveillant.
              </p>
              
              <div className="space-y-2">
                <Link to="/community/groups">
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <span>Explorer les groupes</span>
                    <Users size={16} />
                  </Button>
                </Link>
                
                <Link to="/community/buddies">
                  <Button variant="outline" className="w-full flex justify-between items-center">
                    <span>Trouver un buddy</span>
                    <Share2 size={16} />
                  </Button>
                </Link>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Règles de la communauté</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Respectez la confidentialité des patients</li>
                  <li>Soyez bienveillant et constructif</li>
                  <li>Partagez votre expertise et vos conseils</li>
                  <li>Ne pas partager de contenu médical sensible</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;
