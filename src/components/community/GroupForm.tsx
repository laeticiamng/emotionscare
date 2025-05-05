
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Group } from '@/types/community';
import { createGroup } from '@/lib/communityService';
import TagSelector from './TagSelector';
import { useToast } from '@/hooks/use-toast';

export interface GroupFormProps {
  onGroupCreated: (newGroup: Group) => void;
  joinAfterCreation?: boolean;
}

const GroupForm: React.FC<GroupFormProps> = ({ 
  onGroupCreated,
  joinAfterCreation = false 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du groupe ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new group with the form data
      const groupData = {
        name,
        description,
        tags: selectedTags
      };
      
      const newGroup = await createGroup(groupData);
      
      toast({
        title: "Groupe créé !",
        description: `Le groupe "${name}" a été créé avec succès.`
      });
      
      // Reset the form
      setName('');
      setDescription('');
      setSelectedTags([]);
      
      // Notify parent component
      onGroupCreated(newGroup);
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du groupe.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom du groupe
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Donnez un nom à votre groupe"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez l'objectif du groupe"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Tags (jusqu'à 5)
        </label>
        <TagSelector 
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          maxTags={5}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Création en cours...' : 'Créer le groupe'}
      </Button>
    </form>
  );
};

export default GroupForm;
