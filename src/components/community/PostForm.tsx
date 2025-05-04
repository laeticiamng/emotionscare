
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createPost } from '@/lib/communityService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import LoadingAnimation from '@/components/ui/loading-animation';

const PostForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newContent, setNewContent] = useState('');
  const [newMedia, setNewMedia] = useState('');
  const [loading, setLoading] = useState(false);

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
      setNewContent('');
      setNewMedia('');
      toast({
        title: "Succès",
        description: "Votre message a été publié"
      });
      return post; // Return the created post for parent component to add to list
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre message",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
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
          onClick={async () => {
            const newPost = await handlePublish();
            if (newPost) {
              // Use a custom event to notify parent component
              window.dispatchEvent(new CustomEvent('post-created', { detail: newPost }));
            }
          }}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? <LoadingAnimation text="Publication en cours..." iconClassName="h-4 w-4" className="p-0" /> : 'Publier'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostForm;
