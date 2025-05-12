
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import PageHeader from '@/components/layout/PageHeader';
import JournalListView from '@/components/journal/JournalListView';
import JournalTabNavigation from '@/components/journal/JournalTabNavigation';
import { Button } from '@/components/ui/button';
import { FileEdit, Calendar, PlusCircle, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { JournalEntry } from '@/types/journal';
import { getJournalEntries, deleteJournalEntry } from '@/lib/journalService';
import { useMusic } from '@/contexts/MusicContext';

const JournalPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'mood'>('list');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setOpenDrawer } = useMusic();

  useEffect(() => {
    const loadJournalEntries = async () => {
      setIsLoading(true);
      try {
        // Assuming the user is authenticated with ID 'user-1'
        const fetchedEntries = await getJournalEntries('user-1');
        setEntries(fetchedEntries);
      } catch (error) {
        console.error('Error loading journal entries:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les entrées de journal",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadJournalEntries();
  }, [toast]);

  const handleCreateEntry = () => {
    navigate('/journal/new');
  };

  const handleDeleteEntry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteJournalEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
      toast({
        title: "Entrée supprimée",
        description: "L'entrée de journal a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée de journal",
        variant: "destructive"
      });
    }
  };

  const handleEnableMusic = () => {
    setOpenDrawer(true);
    toast({
      title: "Musique d'ambiance",
      description: "Profitez d'une musique relaxante pendant que vous parcourez votre journal"
    });
  };

  return (
    <Shell>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <PageHeader
            title="Journal personnel"
            description="Exprimez vos pensées et suivez vos émotions au fil du temps"
            icon={<FileEdit className="h-6 w-6" />}
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center" 
              onClick={handleEnableMusic}
            >
              <Music className="h-4 w-4 mr-2" />
              Musique
            </Button>
            <Button 
              onClick={handleCreateEntry}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouvelle entrée
            </Button>
          </div>
        </div>

        <JournalTabNavigation 
          viewMode={viewMode} 
          onViewChange={(value) => setViewMode(value)}
        >
          <TabContent
            viewMode={viewMode}
            entries={entries}
            isLoading={isLoading}
            onDeleteEntry={handleDeleteEntry}
          />
        </JournalTabNavigation>
      </div>
    </Shell>
  );
};

// Contenu des onglets selon le mode sélectionné
const TabContent: React.FC<{
  viewMode: 'list' | 'calendar' | 'mood';
  entries: JournalEntry[];
  isLoading: boolean;
  onDeleteEntry: (id: string, e: React.MouseEvent) => void;
}> = ({ viewMode, entries, isLoading, onDeleteEntry }) => {
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (isLoading) {
    return <div className="py-12 text-center">Chargement en cours...</div>;
  }

  if (viewMode === 'list') {
    return <JournalListView entries={sortedEntries} onDeleteEntry={onDeleteEntry} />;
  }

  if (viewMode === 'calendar') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-60">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Vue calendrier</h3>
              <p className="text-muted-foreground">
                La vue calendrier sera bientôt disponible. Elle vous permettra de visualiser vos entrées par date.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'mood') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-60">
            <div className="text-center">
              <FileEdit className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Tendances émotionnelles</h3>
              <p className="text-muted-foreground">
                Cette section affichera bientôt un graphique de l'évolution de vos émotions au fil du temps.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default JournalPage;
