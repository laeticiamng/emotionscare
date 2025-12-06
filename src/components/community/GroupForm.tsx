
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createGroup } from '@/lib/communityService';
import TagSelector from './TagSelector';

interface GroupFormProps {
  onSuccess?: (group: any) => void;
  onCancel?: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour créer un groupe',
        variant: 'destructive'
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez donner un nom au groupe',
        variant: 'destructive'
      });
      return;
    }
    
    if (!topic.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez définir un sujet pour le groupe',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newGroup = await createGroup({
        name: name.trim(),
        topic: topic.trim(),
        members: [user.id]
      });
      
      toast({
        title: 'Groupe créé',
        description: `Le groupe "${name}" a été créé avec succès`
      });
      
      if (onSuccess) {
        onSuccess(newGroup);
      }
      
      // Reset form
      setName('');
      setTopic('');
      setSelectedTags([]);
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Erreur',
        description: 'Un problème est survenu lors de la création du groupe',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">Créer un nouveau groupe</h3>
        <p className="text-sm text-muted-foreground">
          Les groupes permettent d'échanger sur des thématiques spécifiques
        </p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom du groupe*
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Méditation en groupe"
              maxLength={50}
              required
            />
          </div>
          
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-1">
              Sujet de discussion*
            </label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Décrivez le but de ce groupe..."
              maxLength={200}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags (facultatif)
            </label>
            <TagSelector 
              selectedTags={selectedTags} 
              onTagsChange={setSelectedTags}
              maxTags={5}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Choisissez jusqu'à 5 tags pour catégoriser votre groupe
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          )}
          
          <Button 
            type="submit"
            disabled={isSubmitting || !name.trim() || !topic.trim()}
          >
            {isSubmitting ? 'Création...' : 'Créer le groupe'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GroupForm;
