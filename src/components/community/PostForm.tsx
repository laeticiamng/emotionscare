// @ts-nocheck

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import TagSelector from "./TagSelector";
import { createPost } from "@/lib/communityService";

const PostForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Champs requis",
        description: "Le titre et le contenu sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createPost({
        title,
        content,
        tags: selectedTags,
        userId: user?.id || "",
      });
      
      toast({
        title: "Publication créée",
        description: "Votre publication a été partagée avec succès",
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setSelectedTags([]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la publication",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setSelectedTags(newTags);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Créer une publication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input 
              id="title" 
              placeholder="Titre de votre publication" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea 
              id="content" 
              placeholder="Partagez votre pensée ou question..." 
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tags (max 5)</Label>
            <TagSelector 
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              maxTags={5}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publication en cours..." : "Publier"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostForm;
