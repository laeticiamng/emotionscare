
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createPost } from '@/lib/communityService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingAnimation from '@/components/ui/loading-animation';
import { ImageIcon, Upload } from 'lucide-react';

const PostForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newContent, setNewContent] = useState('');
  const [newMedia, setNewMedia] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For now, we're just storing the image URL. In a real app, 
    // you would upload to storage and get back a URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setImage(file.name); // In real app, this would be the uploaded file URL
    };
    reader.readAsDataURL(file);
  };
  
  const clearForm = () => {
    setNewContent('');
    setNewMedia('');
    setImage(null);
    setPreviewUrl(null);
  };

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
      const post = await createPost(
        user.id, 
        newContent, 
        newMedia || undefined, 
        image || undefined
      );
      
      clearForm();
      
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
        
        <div className="flex flex-col space-y-4 mb-4">
          <div>
            <Label htmlFor="media-url" className="text-sm text-gray-500">Image URL (optionnel)</Label>
            <Input
              id="media-url"
              type="text"
              placeholder="URL d'une image"
              value={newMedia}
              onChange={(e) => setNewMedia(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Label htmlFor="image-upload" className="text-sm text-gray-500">
              Ou téléchargez une image
            </Label>
            <div className="flex items-center mt-1">
              <Label 
                htmlFor="image-upload" 
                className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <Upload size={16} />
                <span>Choisir un fichier</span>
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {image && <span className="ml-2 text-sm text-gray-500">{image}</span>}
            </div>
          </div>
          
          {/* Image preview */}
          {previewUrl && (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full max-h-48 object-cover rounded"
              />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => {
                  setPreviewUrl(null);
                  setImage(null);
                }}
              >
                ✕
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              const newPost = await handlePublish();
              if (newPost) {
                // Use a custom event to notify parent component
                window.dispatchEvent(new CustomEvent('post-created', { detail: newPost }));
              }
            }}
            disabled={loading}
          >
            {loading ? 
              <LoadingAnimation text="Publication en cours..." iconClassName="h-4 w-4" className="p-0" /> : 
              'Publier'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostForm;
