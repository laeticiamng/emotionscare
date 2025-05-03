
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchJournalEntries, deleteJournalEntry } from '@/lib/journalService';
import type { JournalEntry } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, FileEdit, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';

const JournalPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJournalEntries(user?.id || '');
      setEntries(data);
    } catch (error) {
      console.error('Failed to load journal entries:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos entrées de journal.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de journal?')) {
      try {
        await deleteJournalEntry(id);
        setEntries(entries.filter(entry => entry.id !== id));
        toast({
          title: "Suppression réussie",
          description: "L'entrée de journal a été supprimée avec succès."
        });
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

  const truncateContent = (content: string, maxLength = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return <LoadingAnimation text="Chargement des entrées de journal..." />;
  }

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Journal guidé</h1>
        <Button onClick={() => navigate('/journal/new')} className="flex items-center gap-2">
          <Plus size={18} /> Nouvelle entrée
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-6">
            Vous n'avez pas encore d'entrées dans votre journal.
          </p>
          <Button onClick={() => navigate('/journal/new')} variant="outline" className="flex items-center gap-2">
            <FileEdit size={18} /> Créer votre première entrée
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-1">
          {entries.map(entry => (
            <Card 
              key={entry.id} 
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => navigate(`/journal/${entry.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {format(new Date(entry.date), 'dd MMMM yyyy')}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleDelete(entry.id, e)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {entry.mood && <div className="text-2xl mb-2">{entry.mood}</div>}
                <p className="text-muted-foreground">
                  {truncateContent(entry.content || entry.text || '')}
                </p>
                {entry.keywords && entry.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {entry.keywords.map((keyword, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <div className="text-sm text-primary flex items-center gap-1">
                  <FileEdit size={16} /> Voir le détail
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalPage;
