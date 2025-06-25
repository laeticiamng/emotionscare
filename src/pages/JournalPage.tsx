
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, ArrowLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [entry, setEntry] = React.useState('');
  const [entries, setEntries] = React.useState([
    {
      id: 1,
      date: '2024-12-25',
      content: 'Première entrée dans mon journal émotionnel...',
      mood: '😊'
    }
  ]);

  const handleSaveEntry = () => {
    if (entry.trim()) {
      const newEntry = {
        id: entries.length + 1,
        date: new Date().toISOString().split('T')[0],
        content: entry,
        mood: '😊'
      };
      setEntries(prev => [newEntry, ...prev]);
      setEntry('');
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/b2c/dashboard')}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-500" />
              Journal Émotionnel
            </h1>
            <p className="text-gray-600 mt-2">Suivez votre évolution quotidienne</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle Entrée
              </CardTitle>
              <CardDescription>
                Exprimez vos pensées et émotions du jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="Comment vous sentez-vous aujourd'hui ? Que s'est-il passé dans votre journée ?"
                  className="min-h-32"
                />
                <Button onClick={handleSaveEntry} className="w-full">
                  Sauvegarder l'entrée
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Entrées Précédentes
              </CardTitle>
              <CardDescription>
                Relisez vos réflexions passées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries.map((journalEntry) => (
                  <Card key={journalEntry.id} className="border-l-4 border-l-green-400">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{journalEntry.date}</span>
                        <span className="text-lg">{journalEntry.mood}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{journalEntry.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
