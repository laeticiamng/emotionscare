
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Filter, BookOpen } from 'lucide-react';
import JournalEntryList from '@/components/journal/JournalEntryList';
import JournalStatsCards from '@/components/journal/JournalStatsCards';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

// Mock journal entries data
const mockJournalEntries = [
  {
    id: '1',
    title: 'Journée productive',
    date: new Date('2023-05-10T14:00:00'),
    mood: 'happy',
    content: 'Aujourd\'hui était une journée très productive. J\'ai terminé plusieurs tâches importantes et je me sens satisfait de mes accomplissements.',
    tags: ['travail', 'productivité', 'satisfaction']
  },
  {
    id: '2',
    title: 'Promenade au parc',
    date: new Date('2023-05-08T18:30:00'),
    mood: 'calm',
    content: 'J\'ai fait une longue promenade au parc ce soir. Le temps était parfait et j\'ai pu me détendre et réfléchir tranquillement.',
    tags: ['nature', 'détente', 'réflexion']
  },
  {
    id: '3',
    title: 'Discussion difficile',
    date: new Date('2023-05-05T10:15:00'),
    mood: 'anxious',
    content: 'J\'ai dû avoir une conversation difficile aujourd\'hui. Bien que stressant, je pense que c\'était nécessaire et finalement bénéfique.',
    tags: ['communication', 'défi', 'croissance']
  },
];

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [entries, setEntries] = useState(mockJournalEntries);
  const { toast } = useToast();
  
  useEffect(() => {
    // Dans une application réelle, nous chargerions les entrées depuis une API ici
    console.log('Journal entries would be loaded here');
  }, []);
  
  // Fonction pour filtrer les entrées par humeur
  const filterEntries = (mood: string) => {
    setFilter(mood);
    if (mood === 'all') {
      setEntries(mockJournalEntries);
    } else {
      setEntries(mockJournalEntries.filter(entry => entry.mood === mood));
    }
    
    toast({
      title: "Filtre appliqué",
      description: `Affichage des entrées avec l'humeur: ${mood === 'all' ? 'toutes' : mood}`
    });
  };
  
  const handleNewEntry = () => {
    navigate('/journal/new');
  };
  
  const handleViewEntry = (id: string) => {
    navigate(`/journal/${id}`);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Journal émotionnel" 
          description="Suivez et analysez vos émotions au fil du temps"
          icon={<BookOpen className="h-5 w-5" />}
        >
          <Button onClick={handleNewEntry} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle entrée
          </Button>
        </PageHeader>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <JournalStatsCards />
        </div>
        
        {entries.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <Alert>
                <AlertDescription>
                  Vous n'avez pas encore d'entrées de journal. Commencez à noter vos émotions pour voir des entrées apparaître ici.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-4 py-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filter === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => filterEntries('all')}
                >
                  Toutes
                </Button>
                <Button 
                  variant={filter === 'happy' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => filterEntries('happy')}
                >
                  Joie
                </Button>
                <Button 
                  variant={filter === 'calm' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => filterEntries('calm')}
                >
                  Calme
                </Button>
                <Button 
                  variant={filter === 'anxious' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => filterEntries('anxious')}
                >
                  Anxiété
                </Button>
              </div>
            </div>
            
            <JournalEntryList entries={entries} onViewEntry={handleViewEntry} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default JournalPage;
