
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchPosts, fetchUserById } from '@/lib/communityService';
import type { Post, User } from '@/types';
import PostForm from '@/components/community/PostForm';
import PostItem from '@/components/community/PostItem';
import LoadingAnimation from '@/components/ui/loading-animation';
import { Card } from '@/components/ui/card';

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
      setPosts(fetchedPosts);
      
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
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6">🌿 Social Cocoon</h1>

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
  );
};

export default CommunityFeed;
