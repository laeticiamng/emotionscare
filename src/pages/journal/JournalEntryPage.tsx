
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getJournalEntryById, deleteJournalEntry } from '@/lib/journalService';
import { JournalEntry } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { getEmotionIcon } from '@/lib/emotionUtils';

const JournalEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntry = async () => {
      if (!id) return;
      
      try {
        const journalEntry = await getJournalEntryById(id);
        setEntry(journalEntry);
      } catch (error) {
        console.error('Error loading journal entry:', error);
        toast.error('Erreur lors du chargement de l\'entrée');
      } finally {
        setLoading(false);
      }
    };
    
    loadEntry();
  }, [id]);
  
  const handleDelete = async () => {
    if (!entry) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      try {
        await deleteJournalEntry(entry.id);
        toast.success('Entrée supprimée avec succès');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting entry:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4 flex justify-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }
  
  if (!entry) {
    return (
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-8 text-center">
            <h2 className="text-xl font-medium mb-2">Entrée non trouvée</h2>
            <p className="text-muted-foreground mb-4">
              L'entrée de journal que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{entry.title}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {format(new Date(entry.date), 'EEEE d MMMM yyyy, HH:mm', { locale: fr })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Edit className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center">
            <Badge className="mr-2" variant="outline">
              {getEmotionIcon(entry.mood)} {entry.mood}
            </Badge>
            {entry.mood_score !== undefined && (
              <div className="text-sm text-muted-foreground">
                Intensité: {entry.mood_score}/100
              </div>
            )}
          </div>
          
          <div className="whitespace-pre-line">{entry.content}</div>
          
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-4">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {entry.ai_feedback && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-sm font-medium mb-2">Réflexion IA</h3>
              <p className="text-sm text-muted-foreground">{entry.ai_feedback}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalEntryPage;
