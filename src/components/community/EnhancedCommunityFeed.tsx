import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, 
  Image, Video, Mic, MapPin, Smile, TrendingUp, Users, 
  Flame, Award, Eye, ThumbsUp, Zap, Camera, Paperclip
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { triggerConfetti } from '@/lib/confetti';

interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    badge?: string;
  };
  timestamp: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
  }[];
  location?: string;
  tags: string[];
  reactions: {
    type: 'like' | 'love' | 'laugh' | 'wow' | 'care';
    count: number;
    userReacted: boolean;
  }[];
  comments: number;
  shares: number;
  bookmarks: number;
  views: number;
  trending: boolean;
  featured: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  replies: Comment[];
  reactions: { type: string; count: number }[];
}

const reactions = [
  { type: 'like', icon: '👍', label: 'J\'aime' },
  { type: 'love', icon: '❤️', label: 'Adore' },
  { type: 'laugh', icon: '😂', label: 'Rigole' },
  { type: 'wow', icon: '😮', label: 'Wow' },
  { type: 'care', icon: '🤗', label: 'Soutien' }
];

export default function EnhancedCommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<'all' | 'trending' | 'following' | 'featured'>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const loadPosts = async () => {
    try {
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            id,
            name,
            avatar_url
          ),
          comments (count),
          post_reactions (
            reaction_type,
            count
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsData) {
        const formattedPosts = postsData.map(post => ({
          id: post.id,
          content: post.content,
          author: {
            id: post.profiles.id,
            name: post.profiles.name || 'Utilisateur',
            avatar: post.profiles.avatar_url || '/placeholder-avatar.jpg',
            verified: false,
            badge: undefined
          },
          timestamp: formatTimestamp(post.created_at),
          media: post.media_urls ? post.media_urls.map((url: string) => ({
            type: 'image' as const,
            url
          })) : [],
          location: post.location,
          tags: post.tags || [],
          reactions: reactions.map(reaction => ({
            type: reaction.type as 'like' | 'love' | 'laugh' | 'wow' | 'care',
            count: Math.floor(Math.random() * 50),
            userReacted: false
          })),
          comments: Math.floor(Math.random() * 25),
          shares: Math.floor(Math.random() * 10),
          bookmarks: Math.floor(Math.random() * 15),
          views: Math.floor(Math.random() * 200) + 50,
          trending: Math.random() > 0.8,
          featured: Math.random() > 0.9
        }));
        
        setPosts(formattedPosts);
      }
    } catch (error) {
      // Posts loading error
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          media_urls: selectedMedia.length > 0 ? ['placeholder-media-url'] : null,
          tags: extractTags(newPost),
          location: null
        })
        .select()
        .single();

      if (error) throw error;

      setNewPost('');
      setSelectedMedia([]);
      await loadPosts();
      
      toast({
        title: "📝 Post publié!",
        description: "Votre message a été partagé avec la communauté",
      });

      // Animation de célébration pour les posts spéciaux
      if (newPost.length > 200) {
        triggerConfetti();
      }
    } catch (error) {
      // Post creation error
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      await supabase.functions.invoke('handle-post-reaction', {
        body: {
          post_id: postId,
          reaction_type: reactionType
        }
      });

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: post.reactions.map(reaction => {
              if (reaction.type === reactionType) {
                return {
                  ...reaction,
                  count: reaction.userReacted ? reaction.count - 1 : reaction.count + 1,
                  userReacted: !reaction.userReacted
                };
              }
              return { ...reaction, userReacted: false };
            })
          };
        }
        return post;
      }));

      setSelectedReaction(null);
    } catch (error) {
      // Reaction handling error
    }
  };

  const handleShare = async (postId: string) => {
    try {
      await navigator.share({
        title: 'Post EmotionsCare',
        text: 'Découvrez ce post intéressant sur EmotionsCare',
        url: `${window.location.origin}/community/post/${postId}`
      });
    } catch (error) {
      // Fallback pour copier le lien
      navigator.clipboard.writeText(`${window.location.origin}/community/post/${postId}`);
      toast({
        title: "🔗 Lien copié",
        description: "Le lien du post a été copié dans le presse-papiers",
      });
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    try {
      await supabase
        .from('comments')
        .insert({
          content: commentText,
          post_id: postId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      setNewComment(prev => ({ ...prev, [postId]: '' }));
      
      toast({
        title: "💬 Commentaire ajouté",
        description: "Votre commentaire a été publié",
      });
    } catch (error) {
      // Comment adding error
    }
  };

  const handleMediaUpload = (type: 'image' | 'video') => {
    if (type === 'image') {
      fileInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
  };

  const extractTags = (content: string): string[] => {
    const tags = content.match(/#\w+/g);
    return tags ? tags.map(tag => tag.slice(1)) : [];
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}j`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Communauté EmotionsCare
        </h1>
        <p className="text-muted-foreground">Partagez, échangez et soutenez-vous mutuellement</p>
        
        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { key: 'all', label: 'Tout', icon: Users },
            { key: 'trending', label: 'Tendances', icon: TrendingUp },
            { key: 'following', label: 'Abonnements', icon: Heart },
            { key: 'featured', label: 'À la une', icon: Award }
          ].map(filterOption => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
              className="flex items-center gap-2"
            >
              <filterOption.icon className="h-4 w-4" />
              {filterOption.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Créer un post */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>👤</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Quoi de neuf ?</h3>
              <p className="text-sm text-muted-foreground">Partagez votre expérience avec la communauté</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Partagez vos pensées, conseils ou questions..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          
          {/* Média sélectionné */}
          {selectedMedia.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {selectedMedia.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Aperçu"
                    className="w-full h-20 object-cover rounded"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => setSelectedMedia(prev => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleMediaUpload('image')}>
                <Camera className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleMediaUpload('video')}>
                <Video className="h-4 w-4 mr-2" />
                Vidéo
              </Button>
              <Button variant="ghost" size="sm" aria-label="Ajouter un audio">
                <Mic className="h-4 w-4 mr-2" />
                Audio
              </Button>
              <Button variant="ghost" size="sm" aria-label="Ajouter un lieu">
                <MapPin className="h-4 w-4 mr-2" />
                Lieu
              </Button>
              <Button variant="ghost" size="sm" aria-label="Ajouter une humeur">
                <Smile className="h-4 w-4 mr-2" />
                Humeur
              </Button>
            </div>
            
            <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inputs cachés pour les médias */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          setSelectedMedia(prev => [...prev, ...files]);
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          setSelectedMedia(prev => [...prev, ...files]);
        }}
      />

      {/* Feed des posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <Card key={post.id} className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{post.author.name}</h4>
                      {post.author.verified && <Badge variant="secondary">✓</Badge>}
                      {post.author.badge && <Badge variant="outline">{post.author.badge}</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.timestamp}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {post.location}
                          </span>
                        </>
                      )}
                      {post.trending && (
                        <>
                          <span>•</span>
                          <Badge variant="destructive" className="text-xs">
                            <Flame className="h-3 w-3 mr-1" />
                            Tendance
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" aria-label="Plus d'options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{post.content}</p>
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Médias */}
              {post.media && post.media.length > 0 && (
                <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                  {post.media.slice(0, 4).map((media, index) => (
                    <div key={index} className="relative aspect-video">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="Post media"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={media.url}
                          poster={media.thumbnail}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                      {post.media && post.media.length > 4 && index === 3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                          +{post.media.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views}
                  </span>
                  <span>{post.reactions.reduce((sum, r) => sum + r.count, 0)} réactions</span>
                  <span>{post.comments} commentaires</span>
                </div>
                <span>{post.shares} partages</span>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {/* Réactions */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative"
                      onMouseEnter={() => setSelectedReaction(post.id)}
                      onMouseLeave={() => setSelectedReaction(null)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Réagir
                    </Button>
                    
                    {selectedReaction === post.id && (
                      <div className="absolute bottom-full left-0 mb-2 flex gap-1 p-2 bg-background border rounded-lg shadow-lg">
                        {reactions.map(reaction => (
                          <Button
                            key={reaction.type}
                            variant="ghost"
                            size="sm"
                            className="text-lg hover:scale-125 transition-transform"
                            onClick={() => handleReaction(post.id, reaction.type)}
                          >
                            {reaction.icon}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComments(prev => ({
                      ...prev,
                      [post.id]: !prev[post.id]
                    }))}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Commenter
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleShare(post.id)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                  <Button variant="ghost" size="sm" aria-label="Sauvegarder">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Sauver
                  </Button>
                </div>
              </div>

              {/* Section commentaires */}
              {showComments[post.id] && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Écrivez un commentaire..."
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                      />
                      <Button size="sm" onClick={() => handleAddComment(post.id)}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Commentaires existants */}
                  <div className="space-y-3">
                    {comments[post.id]?.map(comment => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="font-medium text-sm">{comment.author.name}</div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{comment.timestamp}</span>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" aria-label="Répondre au commentaire">
                              Répondre
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}