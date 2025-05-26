
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar } from 'lucide-react';

interface JournalTabProps {
  className?: string;
}

const JournalTab: React.FC<JournalTabProps> = ({ className }) => {
  const journalEntries = [
    {
      date: '2024-01-15',
      title: 'Excellente journée',
      preview: 'Aujourd\'hui s\'est très bien passé, j\'ai eu une réunion productive...',
      mood: 'Positif'
    },
    {
      date: '2024-01-14',
      title: 'Réflexions du weekend',
      preview: 'Le weekend a été relaxant, j\'ai pris du temps pour moi...',
      mood: 'Calme'
    }
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Nouvelle entrée
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Créer
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Comment vous sentez-vous ?</label>
              <Textarea 
                placeholder="Décrivez votre journée, vos émotions, vos pensées..."
                rows={6}
              />
            </div>
            <Button className="w-full">Sauvegarder l'entrée</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entrées récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journalEntries.map((entry, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{entry.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {entry.date}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.preview}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {entry.mood}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalTab;
