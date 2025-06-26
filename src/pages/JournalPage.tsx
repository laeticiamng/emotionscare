
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Filter, BookOpen, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JournalHeader from '@/components/journal/JournalHeader';
import JournalListView from '@/components/journal/JournalListView';
import JournalTabNavigation from '@/components/journal/JournalTabNavigation';
import JournalStatsCards from '@/components/journal/JournalStatsCards';
import { JournalEntry } from '@/types';
import { getJournalEntries, deleteJournalEntry } from '@/lib/journalService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'mood'>('list');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Données mockées pour la démonstration
  const mockEntries: JournalEntry[] = [
    {
      id: '1',
      user_id: user?.id || 'demo-user',
      date: new Date(Date.now() - 86400000),
      mood: 'happy',
      title: 'Journée productive au travail',
      content: "Aujourd'hui j'ai terminé mon projet important. Je me sens vraiment accompli et fier du travail accompli. L'équipe était très collaborative.",
      tags: ['travail', 'accomplissement', 'équipe'],
      mood_score: 8
    },
    {
      id: '2',
      user_id: user?.id || 'demo-user',
      date: new Date(Date.now() - 2 * 86400000),
      mood: 'calm',
      title: 'Moment de détente',
      content: "J'ai pris du temps pour moi ce soir. Lecture, thé et méditation. Ces moments de calme sont précieux.",
      tags: ['détente', 'méditation', 'lecture'],
      mood_score: 7
    },
    {
      id: '3',
      user_id: user?.id || 'demo-user',
      date: new Date(Date.now() - 3 * 86400000),
      mood: 'anxious',
      title: 'Préparation présentation',
      content: "Demain j'ai une présentation importante. Je ressens un peu de stress mais je me prépare bien.",
      tags: ['travail', 'stress', 'préparation'],
      mood_score: 5
    }
  ];

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user?.id) {
      setEntries(mockEntries);
      setLoading(false);
      return;
    }

    try {
      const userEntries = await getJournalEntries(user.id);
      if (userEntries.length === 0) {
        setEntries(mockEntries);
      } else {
        setEntries(userEntries);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des entrées:', error);
      setEntries(mockEntries);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deleteJournalEntry(entryId);
      setEntries(entries.filter(entry => entry.id !== entryId));
      toast.success('Entrée supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleViewEntry = (entryId: string) => {
    navigate(`/journal/${entryId}`);
  };

  const filterEntriesByPeriod = (entries: JournalEntry[]) => {
    const now = new Date();
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      switch (selectedPeriod) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return entryDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return entryDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredEntries = filterEntriesByPeriod(entries);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <JournalHeader 
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <JournalStatsCards />
      </div>

      <JournalTabNavigation 
        viewMode={viewMode}
        onViewChange={setViewMode}
      >
        {viewMode === 'list' && (
          <JournalListView 
            entries={filteredEntries}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
        
        {viewMode === 'calendar' && (
          <Card className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vue Calendrier</h3>
            <p className="text-muted-foreground mb-4">
              La vue calendrier sera bientôt disponible pour visualiser vos entrées par date.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setViewMode('list')}
            >
              Retour à la liste
            </Button>
          </Card>
        )}
        
        {viewMode === 'mood' && (
          <Card className="p-8 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analyse des Tendances</h3>
            <p className="text-muted-foreground mb-4">
              L'analyse des tendances émotionnelles sera bientôt disponible.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setViewMode('list')}
            >
              Retour à la liste
            </Button>
          </Card>
        )}
      </JournalTabNavigation>
    </div>
  );
};

export default JournalPage;
