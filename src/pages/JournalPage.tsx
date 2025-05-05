
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchJournalEntries, deleteJournalEntry } from '@/lib/journalService';
import type { JournalEntry } from '@/types';
import { TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import LoadingAnimation from '@/components/ui/loading-animation';
import JournalHeader from '@/components/journal/JournalHeader';
import JournalTabNavigation from '@/components/journal/JournalTabNavigation';
import JournalListView from '@/components/journal/JournalListView';
import JournalCalendarView from '@/components/journal/JournalCalendarView';
import JournalMoodView from '@/components/journal/JournalMoodView';

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

  if (isLoading) {
    return <LoadingAnimation text="Chargement des entrées de journal..." />;
  }

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <JournalHeader 
        selectedPeriod={selectedPeriod} 
        setSelectedPeriod={setSelectedPeriod} 
      />
      
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
    </div>
  );
};

export default JournalPage;
