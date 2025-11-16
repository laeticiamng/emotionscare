// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar, Loader2 } from 'lucide-react';
import { journalService, type JournalEntry } from '@/modules/journal/journalService';
import { useNavigate } from 'react-router-dom';

interface JournalTabProps {
  className?: string;
}

interface JournalDisplay {
  date: string;
  title: string;
  preview: string;
  mood: string;
}

const JournalTab: React.FC<JournalTabProps> = ({ className }) => {
  const navigate = useNavigate();
  const [journalEntries, setJournalEntries] = useState<JournalDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      setIsLoading(true);
      try {
        const entries = await journalService.getAllNotes();

        const displayEntries = entries.slice(0, 5).map((entry: JournalEntry) => {
          const text = entry.text || '';
          const preview = text.length > 100 ? text.substring(0, 100) + '...' : text;
          const title = entry.summary || text.split('.')[0] || 'Entrée de journal';

          return {
            date: new Date(entry.created_at || Date.now()).toLocaleDateString('fr-FR'),
            title: title.substring(0, 50),
            preview,
            mood: entry.tags?.[0] || 'Neutre'
          };
        });

        setJournalEntries(displayEntries);
      } catch (error) {
        console.error('Error fetching journal entries:', error);
        setJournalEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournalEntries();
  }, []);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Nouvelle entrée
              <Button size="sm" onClick={() => navigate('/journal')}>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : journalEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune entrée de journal</p>
                <p className="text-sm mt-2">Commencez à écrire votre première entrée !</p>
              </div>
            ) : (
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
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {entry.mood}
                    </span>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalTab;
