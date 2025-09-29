
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const mockEntries = [
  {
    id: '1',
    title: 'Journée productive',
    date: '2025-05-12',
    snippet: 'Aujourd\'hui j\'ai pu accomplir beaucoup de choses importantes...'
  },
  {
    id: '2',
    title: 'Réunion d\'équipe',
    date: '2025-05-10',
    snippet: 'La réunion s\'est bien passée, j\'ai pu partager mes idées...'
  },
  {
    id: '3',
    title: 'Moment de détente',
    date: '2025-05-08',
    snippet: 'J\'ai pris du temps pour me relaxer et faire une pause...'
  }
];

const RecentJournalEntries: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Journal récent</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/journal')}
        >
          Tout voir
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockEntries.map(entry => (
            <div key={entry.id} className="border-b pb-3 last:border-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium text-base">{entry.title}</h4>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {new Date(entry.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{entry.snippet}</p>
            </div>
          ))}
          
          {mockEntries.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>Aucune entrée de journal pour le moment</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => navigate('/journal/new')}
              >
                Créer une entrée
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentJournalEntries;
