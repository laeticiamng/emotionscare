
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getJournalEntries, deleteJournalEntry } from '@/lib/journalService';
import type { JournalEntry } from '@/types';
import { TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { CalendarHeart, Edit, Plus, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingAnimation from '@/components/ui/loading-animation';
import JournalHeader from '@/components/journal/JournalHeader';
import JournalTabNavigation from '@/components/journal/JournalTabNavigation';
import JournalListView from '@/components/journal/JournalListView';
import JournalCalendarView from '@/components/journal/JournalCalendarView';
import JournalMoodView from '@/components/journal/JournalMoodView';
import { useMusic } from '@/contexts/MusicContext';

const JournalPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'mood'>('list');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const [animateBg, setAnimateBg] = useState(false);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
    
    // Start subtle background animation
    setAnimateBg(true);
  }, [user, selectedPeriod]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await getJournalEntries(user?.id || '');
      
      // Filter entries if necessary based on selected period
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

  const playWritingMusic = () => {
    loadPlaylistForEmotion('calm');
    setOpenDrawer(true);
    toast({
      title: "Musique d'écriture activée",
      description: "Profitez d'une ambiance musicale apaisante pour votre session d'écriture.",
    });
  };

  if (isLoading) {
    return <LoadingAnimation text="Chargement des entrées de journal..." />;
  }

  return (
    <div className="relative min-h-[80vh]">
      {/* Animated background */}
      {animateBg && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-40 dark:opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(148,187,233,0.3) 0%, rgba(238,174,202,0.1) 100%)',
              backgroundSize: '400% 400%',
            }}
          />
        </div>
      )}

      <div className="container max-w-5xl mx-auto py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <JournalHeader 
              selectedPeriod={selectedPeriod} 
              setSelectedPeriod={setSelectedPeriod} 
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={playWritingMusic}
                className="gap-1 hidden sm:flex"
                size="sm"
              >
                <CalendarHeart size={16} />
                <span>Musique d'écriture</span>
              </Button>

              <Button onClick={() => navigate('/journal/new')} className="gap-1">
                <Plus size={16} />
                <span>Nouvelle entrée</span>
              </Button>
            </div>
          </div>
        </motion.div>
        
        {entries.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Edit className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Aucune entrée de journal</h3>
            <p className="text-muted-foreground mb-6">
              Commencez à enregistrer vos pensées et émotions
            </p>
            <Button onClick={() => navigate('/journal/new')}>
              Créer ma première entrée
            </Button>
          </motion.div>
        ) : (
          <JournalTabNavigation viewMode={viewMode} onViewChange={setViewMode}>
            <TabsContent value="list" className="mt-0">
              <JournalListView 
                entries={entries} 
                onDeleteEntry={handleDelete} 
              />
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <JournalCalendarView 
                entries={entries} 
                onEntryClick={(entryId) => navigate(`/journal/${entryId}`)} 
              />
            </TabsContent>
            
            <TabsContent value="mood" className="mt-0">
              <JournalMoodView entries={entries} />
            </TabsContent>
          </JournalTabNavigation>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
