
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/utils';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserNotesTabProps {
  userId: string;
  userName: string;
}

const UserNotesTab: React.FC<UserNotesTabProps> = ({ userId, userName }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
    // Simuler le chargement des notes
    setTimeout(() => {
      setNotes([
        { id: '1', content: 'Première rencontre avec l\'utilisateur. Semble motivé.', createdAt: new Date(Date.now() - 604800000).toISOString() }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [userId]);
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // Dans une application réelle, vous sauvegarderiez la note via une API
    const note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString()
    };
    
    setNotes([note, ...notes]);
    setNewNote('');
    setIsAdding(false);
    
    toast({
      title: "Note ajoutée",
      description: "La note a été ajoutée avec succès"
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notes</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter une note
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="space-y-2">
            <Textarea
              placeholder={`Ajouter une note concernant ${userName}...`}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                Annuler
              </Button>
              <Button size="sm" onClick={handleAddNote}>
                Enregistrer
              </Button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">
                  {formatDate(note.createdAt)}
                </div>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-muted-foreground">Aucune note ajoutée</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserNotesTab;
