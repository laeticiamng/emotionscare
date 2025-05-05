import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createPost } from '@/lib/communityService';
import TagSelector from './TagSelector';

interface PostFormProps {
  onPostCreated?: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    try {
      setIsLoading(true);
      // Correction ici: transformons la chaîne en tableau
      const tagsArray = selectedTags.length > 0 ? selectedTags : [];
      await createPost(user?.id || '1', content, isAnonymous, tagsArray);
      
      // Reset form
      setContent('');
      setIsAnonymous(false);
      setSelectedTags([]);
      onPostCreated?.();
      
      toast({
        title: "Publication créée",
        description: "Votre message a été partagé avec la communauté",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la publication",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez vos pensées avec la communauté..."
              className="w-full"
            />
          </div>
          
          <TagSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(checked)} />
              <Label htmlFor="anonymous">Publier anonymement</Label>
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Publication..." : "Publier"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
