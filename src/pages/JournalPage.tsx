import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, List, Plus, Search } from 'lucide-react';
import { JournalEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { deleteJournalEntry } from '@/lib/journalService';
import JournalListView from '@/components/journal/JournalListView';
import JournalCalendarView from '@/components/journal/JournalCalendarView';
import JournalMoodView from '@/components/journal/JournalMoodView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/layout/PageHeader';
import Container from '@/components/layout/Container';

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMoodView, setShowMoodView] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Mock data for demonstration
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'Aujourd\'hui',
        content: 'Je me suis senti bien aujourd\'hui...',
        mood: 'happy',
        date: new Date().toISOString(),
        tags: ['positif', 'reconnaissance'],
        ai_feedback: 'Votre journée semble avoir été positive. Continuez à cultiver ces moments.'
      },
      {
        id: '2',
        title: 'Hier',
        content: 'J\'étais un peu stressé à cause du travail...',
        mood: 'anxious',
        date: new Date(Date.now() - 86400000).toISOString(),
        tags: ['travail', 'stress'],
        ai_feedback: 'Il est important de gérer le stress. Essayez des techniques de relaxation.'
      },
      {
        id: '3',
        title: 'Avant-hier',
        content: 'Je me suis promené dans la nature...',
        mood: 'calm',
        date: new Date(Date.now() - 172800000).toISOString(),
        tags: ['nature', 'relaxation'],
        ai_feedback: 'La nature a un effet apaisant. Continuez à profiter de ces moments.'
      }
    ];
    setEntries(mockEntries);
  }, []);
  
  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.content && entry.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDeleteEntry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteJournalEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
      toast({
        title: "Succès",
        description: "L'entrée a été supprimée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'entrée.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Container>
      <PageHeader 
        title="Journal émotionnel" 
        description="Suivez et analysez vos émotions quotidiennes"
        icon={<BookOpen className="h-6 w-6" />}
      />
      
      <div className="grid gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4 mr-2" /> Liste
            </Button>
            <Button 
              variant={view === 'calendar' ? 'default' : 'outline'}
              onClick={() => setView('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" /> Calendrier
            </Button>
          </div>
          <Button onClick={() => navigate('/journal/new')}>
            <Plus className="h-4 w-4 mr-2" /> Ajouter une entrée
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="search">Rechercher:</Label>
          <Input
            type="search"
            id="search"
            placeholder="Rechercher une entrée..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vue d'ensemble</CardTitle>
        </CardHeader>
        <div className="p-4 flex items-center justify-between">
          <p>Afficher l'analyse des émotions</p>
          <Switch checked={showMoodView} onCheckedChange={setShowMoodView} />
        </div>
      </Card>
      
      {showMoodView && (
        <JournalMoodView entries={filteredEntries} />
      )}
      
      {view === 'list' ? (
        <JournalListView entries={filteredEntries} onDeleteEntry={handleDeleteEntry} />
      ) : (
        <JournalCalendarView entries={filteredEntries} />
      )}
    </Container>
  );
};

export default JournalPage;
