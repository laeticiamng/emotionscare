// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface UserNotesTabProps {
  userId: string;
  userName?: string;
}

const UserNotesTab: React.FC<UserNotesTabProps> = ({ userId, userName }) => {
  const [notes, setNotes] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSaveNote = () => {
    if (notes.trim()) {
      setSavedNotes([...savedNotes, notes]);
      setNotes('');
      toast({
        title: "Note sauvegardée",
        description: "La note a été ajoutée au dossier de l'utilisateur"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes {userName ? `sur ${userName}` : ''}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedNotes.length > 0 ? (
          <div className="space-y-4">
            {savedNotes.map((note, index) => (
              <div key={index} className="p-3 bg-muted rounded-md">
                <p>{note}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Aucune note disponible pour cet utilisateur
          </p>
        )}

        <div className="space-y-2 pt-4 border-t">
          <Textarea 
            placeholder={`Ajouter une note${userName ? ` sur ${userName}` : ''}...`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSaveNote} disabled={!notes.trim()}>
            Sauvegarder la note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserNotesTab;
