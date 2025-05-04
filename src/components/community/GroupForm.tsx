
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createGroup } from '@/lib/communityService';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface GroupFormProps {
  onGroupCreated: (newGroup: any) => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onGroupCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newName, setNewName] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour créer un groupe",
        variant: "destructive"
      });
      return;
    }
    
    if (!newName.trim() || !newTopic.trim()) {
      toast({
        title: "Informations manquantes",
        description: "Le nom et la thématique sont requis",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setCreating(true);
      const group = await createGroup(newName, newTopic, newDescription || undefined);
      onGroupCreated(group);
      setNewName('');
      setNewTopic('');
      setNewDescription('');
      toast({
        title: "Groupe créé",
        description: "Votre groupe a été créé avec succès"
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le groupe",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-xl font-medium">Créer un nouveau groupe</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Nom du groupe"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Input
          placeholder="Thématique"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
        />
        <Textarea
          placeholder="Description (optionnel)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          rows={3}
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreate} 
          disabled={creating}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {creating ? 'Création...' : 'Créer un groupe'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroupForm;
