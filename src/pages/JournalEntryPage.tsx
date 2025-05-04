
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchJournalEntry, deleteJournalEntry } from '@/lib/journalService';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';
import type { JournalEntry } from '@/types';

const JournalEntryPage = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const { user } = useAuth();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && entryId) {
      loadEntry();
    }
  }, [user, entryId]);

  const loadEntry = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJournalEntry(entryId || '');
      if (!data) {
        toast({
          title: "Entrée introuvable",
          description: "Cette entrée de journal n'existe pas ou n'est pas accessible.",
          variant: "destructive"
        });
        navigate('/journal');
        return;
      }
      setEntry(data);
    } catch (error) {
      console.error('Failed to load journal entry:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger l'entrée de journal.",
        variant: "destructive"
      });
      navigate('/journal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de journal?')) {
      try {
        await deleteJournalEntry(entryId || '');
        toast({
          title: "Suppression réussie",
          description: "L'entrée de journal a été supprimée avec succès."
        });
        navigate('/journal');
      } catch (error) {
        console.error('Failed to delete journal entry:', error);
        toast({
          title: "Erreur de suppression",
          description: "Impossible de supprimer l'entrée de journal.",
          variant: "destructive"
        });
      }
    }
  };

  if (isLoading) {
    return <LoadingAnimation text="Chargement de l'entrée de journal..." />;
  }

  if (!entry) {
    return null; // Should never reach here due to navigation in loadEntry
  }

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate('/journal')}
      >
        <ArrowLeft size={18} /> Retour au journal
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Entrée de journal</h1>
          <div className="flex items-center text-muted-foreground mt-2">
            <Clock size={16} className="mr-2" />
            {format(new Date(entry.date), 'dd MMMM yyyy à HH:mm')}
          </div>
        </div>
        <Button 
          variant="destructive" 
          className="flex items-center gap-2"
          onClick={handleDelete}
        >
          <Trash2 size={18} />
          <span className="hidden sm:inline">Supprimer</span>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Votre texte</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="whitespace-pre-line">{entry.content || entry.text}</p>
        </CardContent>
      </Card>
      
      {entry.ai_feedback && (
        <Card className="bg-muted/50 border-primary/20">
          <CardHeader>
            <CardTitle>Feedback personnalisé</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>{entry.ai_feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JournalEntryPage;
