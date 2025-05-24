
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2CSocialPage: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Marie L.',
      content: 'Aujourd\'hui j\'ai essayé la méditation guidée, quelle découverte ! Je me sens beaucoup plus sereine.',
      likes: 12,
      comments: 3,
      timestamp: '2h'
    },
    {
      id: 2,
      author: 'Thomas D.',
      content: 'Merci à la communauté pour vos encouragements. Cette semaine a été difficile mais je me sens soutenu.',
      likes: 8,
      comments: 7,
      timestamp: '4h'
    },
    {
      id: 3,
      author: 'Sophie M.',
      content: 'Partage de ma playlist zen du jour. La musique aide vraiment à gérer le stress !',
      likes: 15,
      comments: 4,
      timestamp: '6h'
    }
  ]);
  
  const { toast } = useToast();

  const handlePostSubmit = () => {
    if (!newPost.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir du contenu pour votre post",
        variant: "destructive"
      });
      return;
    }

    const post = {
      id: posts.length + 1,
      author: 'Vous',
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: 'maintenant'
    };

    setPosts([post, ...posts]);
    setNewPost('');
    
    toast({
      title: "Post publié",
      description: "Votre message a été partagé avec la communauté",
    });
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <>
      <Helmet>
        <title>Communauté - EmotionsCare</title>
        <meta name="description" content="Partagez et connectez-vous avec la communauté EmotionsCare" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Communauté EmotionsCare</h1>
          <p className="text-gray-600">
            Partagez vos expériences et soutenez-vous mutuellement
          </p>
        </div>

        {/* Create Post */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Partager avec la communauté
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Partagez vos pensées, vos progrès ou vos questions..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
            />
            <Button onClick={handlePostSubmit} className="w-full">
              Publier
            </Button>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{post.author}</h3>
                        <span className="text-sm text-gray-500">{post.timestamp}</span>
                      </div>
                      <p className="mt-2 text-gray-700">{post.content}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className="flex items-center space-x-1"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Share className="h-4 w-4" />
                        <span>Partager</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default B2CSocialPage;
