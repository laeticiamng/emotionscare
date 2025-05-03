import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchPosts, createPost, reactToPost, createComment, fetchUserById } from '@/lib/communityService';
import type { Post, User } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ThumbsUp, MessageSquare, User as UserIcon } from 'lucide-react';

const CommunityFeed: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState('');
  const [newMedia, setNewMedia] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [userCache, setUserCache] = useState<Record<string, User | null>>({});
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function loadPosts() {
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
        const newUserCache: Record<string, User | null> = {};
        
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
    }
    
    loadPosts();
  }, [toast]);

  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour publier",
        variant: "destructive"
      });
      return;
    }
    
    if (!newContent.trim()) {
      toast({
        title: "Contenu vide",
        description: "Veuillez écrire quelque chose avant de publier",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const post = await createPost(user.id, newContent, newMedia || undefined);
      setPosts([post, ...posts]);
      setNewContent('');
      setNewMedia('');
      toast({
        title: "Succès",
        description: "Votre message a été publié"
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReact = async (postId: string) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour réagir",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await reactToPost(postId);
      setPosts(
        posts.map((p) => (p.id === postId ? { ...p, reactions: p.reactions + 1 } : p))
      );
    } catch (error) {
      console.error('Error reacting to post:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre réaction",
        variant: "destructive"
      });
    }
  };

  const handleComment = async (postId: string) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive"
      });
      return;
    }
    
    const text = commentText[postId];
    if (!text?.trim()) {
      toast({
        title: "Commentaire vide",
        description: "Veuillez écrire quelque chose avant de commenter",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createComment(postId, user.id, text);
      setCommentText({ ...commentText, [postId]: '' });
      const updated = await fetchPosts();
      setPosts(updated);
      toast({
        title: "Succès",
        description: "Votre commentaire a été publié"
      });
    } catch (error) {
      console.error('Error commenting on post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre commentaire",
        variant: "destructive"
      });
    }
  };

  const getUserName = (userId: string): string => {
    const cachedUser = userCache[userId];
    if (!cachedUser) return "Utilisateur";
    return cachedUser.name || "Utilisateur";
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6">🌿 Social Cocoon</h1>

      {/* Compose Post */}
      <Card className="mb-8 hover:shadow-md transition-shadow duration-300">
        <CardContent className="pt-6">
          <Textarea
            rows={3}
            placeholder="Partagez un message inspirant…"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="mb-4"
          />
          <Input
            type="text"
            placeholder="URL d'une image (optionnel)"
            value={newMedia}
            onChange={(e) => setNewMedia(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={handlePublish}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? 'Publication en cours...' : 'Publier'}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loadingPosts && (
        <Card className="mb-6 p-6 text-center">
          <p>Chargement des publications...</p>
        </Card>
      )}

      {/* Posts List */}
      {posts.map((post) => (
        <Card key={post.id} className="mb-6 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span className="font-medium">{getUserName(post.user_id)}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(post.date).toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="mb-4 leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>
            {(post.media_url || post.image_url) && (
              <img
                src={post.media_url || post.image_url}
                className="w-full rounded-lg mb-4 max-h-80 object-cover"
                alt="Media"
              />
            )}
          </CardContent>

          <CardFooter className="flex flex-col border-t pt-4">
            <div className="flex items-center space-x-4 w-full mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReact(post.id)}
                className="flex items-center space-x-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{post.reactions}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments?.length || 0}</span>
              </Button>
            </div>

            {/* Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="w-full mb-4 space-y-2 border-t pt-4">
                <h4 className="text-sm font-medium">Commentaires</h4>
                {post.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{getUserName(comment.user_id)}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <div className="w-full flex space-x-2">
              <Textarea
                rows={1}
                placeholder="Écrivez un commentaire positif…"
                value={commentText[post.id] || ''}
                onChange={(e) =>
                  setCommentText({ ...commentText, [post.id]: e.target.value })
                }
                className="text-sm resize-none"
              />
              <Button
                onClick={() => handleComment(post.id)}
                size="sm"
              >
                Commenter
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CommunityFeed;
