
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JournalTabNavigation from '@/components/journal/JournalTabNavigation';
import JournalListView from '@/components/journal/JournalListView';
import JournalCalendarView from '@/components/journal/JournalCalendarView';
import JournalMoodView from '@/components/journal/JournalMoodView';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { JournalEntry } from '@/types';
import { deleteJournalEntry, getJournalEntries } from '@/lib/journalService';

interface JournalTabProps {
  className?: string;
}

const mockEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Une bonne journée',
    content: "Aujourd'hui était une excellente journée. J'ai accompli beaucoup de choses et je me sens bien.",
    mood: 'happy',
    mood_score: 85,
    emotion: 'joy',
    date: new Date().toISOString(),
    user_id: 'user1',
    tags: ['productif', 'heureux']
  },
  {
    id: '2',
    title: 'Journée stressante',
    content: 'Beaucoup de pression au travail aujourd\'hui. Je me sens un peu dépassé mais je gère.',
    mood: 'stressed',
    mood_score: 40,
    emotion: 'stressed',
    date: new Date(Date.now() - 86400000).toISOString(),
    user_id: 'user1',
    tags: ['travail', 'stress']
  },
  {
    id: '3',
    title: 'Réflexion du soir',
    content: 'Je me suis accordé un moment de méditation ce soir. Je me sens plus calme et recentré.',
    mood: 'calm',
    mood_score: 70,
    emotion: 'relaxed',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    user_id: 'user1',
    tags: ['méditation', 'calme']
  }
];

const JournalTab: React.FC<JournalTabProps> = ({ className }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'mood'>('list');
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);

  // Charger les entrées de journal
  React.useEffect(() => {
    const loadEntries = async () => {
      try {
        const userEntries = await getJournalEntries('user1');
        if (userEntries && userEntries.length > 0) {
          setEntries(userEntries);
        } else {
          // Utiliser les entrées mock si aucune entrée n'est récupérée
          setEntries(mockEntries);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des entrées de journal:', error);
        setEntries(mockEntries);
      }
    };
    
    loadEntries();
  }, []);
  
  const handleDeleteEntry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      try {
        await deleteJournalEntry(id);
        setEntries(entries.filter(entry => entry.id !== id));
        toast.success('Entrée supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };
  
  const handleNewEntry = () => {
    navigate('/journal/new');
    toast.success("Création d'une nouvelle entrée", {
      description: 'Exprimez vos émotions et réflexions'
    });
  };
  
  const handleViewEntry = (entry: JournalEntry) => {
    navigate(`/journal/${entry.id}`);
  };
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Journal d'émotions</h2>
        <Button onClick={handleNewEntry} className="flex items-center gap-2">
          <Plus size={16} />
          Nouvelle entrée
        </Button>
      </div>
      
      <JournalTabNavigation viewMode={viewMode} onViewChange={setViewMode}>
        <TabsContent value="list" className="py-4">
          <JournalListView entries={entries} onDeleteEntry={handleDeleteEntry} />
        </TabsContent>
        
        <TabsContent value="calendar" className="py-4">
          <JournalCalendarView entries={entries} onEntryClick={handleViewEntry} />
        </TabsContent>
        
        <TabsContent value="mood" className="py-4">
          <JournalMoodView entries={entries} />
        </TabsContent>
      </JournalTabNavigation>
    </div>
  );
};

export default JournalTab;
