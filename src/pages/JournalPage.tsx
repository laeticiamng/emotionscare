
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '@/types';
import { getJournalEntries, deleteJournalEntry } from '@/lib/journalService';
import JournalPageHeader from '@/components/journal/JournalPageHeader';
import JournalHeader from '@/components/journal/JournalHeader';
import JournalTabNavigation from '@/components/journal/JournalTabNavigation';
import JournalListView from '@/components/journal/JournalListView';
import JournalStatsCards from '@/components/journal/JournalStatsCards';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const JournalPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'mood'>('list');

  useEffect(() => {
    loadJournalEntries();
  }, [user]);

  const loadJournalEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userEntries = await getJournalEntries(user.id);
      setEntries(userEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast.error('Erreur lors du chargement des entrées');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deleteJournalEntry(entryId);
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Entrée supprimée avec succès');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filterEntriesByPeriod = (entries: JournalEntry[]) => {
    if (selectedPeriod === 'all') return entries;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (selectedPeriod === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (selectedPeriod === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return entries.filter(entry => new Date(entry.date) >= filterDate);
  };

  const filteredEntries = filterEntriesByPeriod(entries);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <JournalPageHeader 
          title="Mon Journal"
          description="Suivez l'évolution de vos émotions et pensées"
          icon={<BookOpen className="h-5 w-5" />}
        />
        
        <JournalHeader 
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-2" />
                    <p>Vue calendrier en cours de développement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {viewMode === 'mood' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-2" />
                    <p>Analyse des tendances émotionnelles en cours de développement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </JournalTabNavigation>
      </div>
    </div>
  );
};

export default JournalPage;
