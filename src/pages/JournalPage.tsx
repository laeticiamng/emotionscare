
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchJournalEntries, deleteJournalEntry } from '@/lib/journalService';
import type { JournalEntry } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, FileEdit, Plus, Calendar, LineChart, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';
import JournalMoodChart from '@/components/journal/JournalMoodChart';
import JournalCalendarView from '@/components/journal/JournalCalendarView';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const JournalPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'mood'>('list');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user, selectedPeriod]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJournalEntries(user?.id || '');
      
      // Filtrer les entrées si nécessaire selon la période sélectionnée
      let filteredData = [...data];
      const now = new Date();
      
      if (selectedPeriod === 'month') {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filteredData = data.filter(entry => new Date(entry.date) >= oneMonthAgo);
      } else if (selectedPeriod === 'week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        filteredData = data.filter(entry => new Date(entry.date) >= oneWeekAgo);
      }
      
      setEntries(filteredData);
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

  const truncateContent = (content: string, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return <LoadingAnimation text="Chargement des entrées de journal..." />;
  }

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Journal guidé</h1>
          <p className="text-muted-foreground">Suivez l'évolution de vos émotions et pensées</p>
        </div>
        
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                {selectedPeriod === 'all' ? 'Toutes les entrées' : 
                 selectedPeriod === 'month' ? 'Dernier mois' : 'Dernière semaine'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedPeriod('all')}>
                Toutes les entrées
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod('month')}>
                Dernier mois
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod('week')}>
                Dernière semaine
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => navigate('/journal/new')} className="flex items-center gap-2">
            <Plus size={18} /> Nouvelle entrée
          </Button>
        </div>
      </div>
      
      <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as any)} className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <FileEdit size={16} /> Liste
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar size={16} /> Calendrier
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <LineChart size={16} /> Tendances
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          {entries.length === 0 ? (
            <EmptyJournal navigate={navigate} />
          ) : (
            <div className="grid gap-4 md:grid-cols-1">
              {entries.map(entry => (
                <Card 
                  key={entry.id} 
                  className="cursor-pointer transition-all hover:shadow-md overflow-hidden"
                  onClick={() => navigate(`/journal/${entry.id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium">
                        {format(new Date(entry.date), 'EEEE d MMMM yyyy', { locale: fr })}
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
                    <p className="text-muted-foreground">
                      {truncateContent(entry.content || entry.text || '')}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="text-sm text-primary flex items-center gap-1">
                      <FileEdit size={16} /> Voir le détail
                    </div>
                    {entry.ai_feedback && (
                      <div className="ml-auto px-2 py-1 bg-cocoon-100 text-cocoon-800 rounded-full text-xs">
                        Analysé par Coach IA
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <JournalCalendarView entries={entries} onEntryClick={(entryId) => navigate(`/journal/${entryId}`)} />
        </TabsContent>
        
        <TabsContent value="mood" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de vos émotions</CardTitle>
            </CardHeader>
            <CardContent>
              <JournalMoodChart entries={entries} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyJournal = ({ navigate }: { navigate: (path: string) => void }) => {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-xl">
      <div className="max-w-md mx-auto">
        <FileEdit className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Votre journal est vide</h3>
        <p className="text-muted-foreground mb-6">
          Le journal est un excellent moyen de suivre vos émotions et réflexions. Commencez dès aujourd'hui pour améliorer votre bien-être mental.
        </p>
        <Button onClick={() => navigate('/journal/new')} className="flex items-center gap-2 mx-auto">
          <FileEdit size={18} /> Créer votre première entrée
        </Button>
      </div>
    </div>
  );
};

export default JournalPage;
