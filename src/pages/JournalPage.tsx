
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Save, Calendar, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  emotion: string;
  date: Date;
}

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Belle journée',
      content: 'Aujourd\'hui était une journée merveilleuse. J\'ai réussi à terminer tous mes projets et j\'ai passé du temps de qualité avec ma famille.',
      emotion: 'heureux',
      date: new Date(Date.now() - 86400000)
    },
    {
      id: '2', 
      title: 'Réflexions du soir',
      content: 'Je me sens un peu fatigué mais satisfait de ma productivité. Il est important de prendre le temps de réfléchir à ma journée.',
      emotion: 'calme',
      date: new Date(Date.now() - 2 * 86400000)
    }
  ]);
  
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    emotion: 'neutre'
  });

  const emotions = [
    { value: 'heureux', label: 'Heureux 😊', color: 'text-yellow-600' },
    { value: 'calme', label: 'Calme 😌', color: 'text-blue-600' },
    { value: 'excite', label: 'Excité 🤩', color: 'text-orange-600' },
    { value: 'triste', label: 'Triste 😢', color: 'text-gray-600' },
    { value: 'anxieux', label: 'Anxieux 😰', color: 'text-red-600' },
    { value: 'neutre', label: 'Neutre 😐', color: 'text-gray-400' }
  ];

  const saveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Veuillez remplir le titre et le contenu');
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      emotion: newEntry.emotion,
      date: new Date()
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: '', content: '', emotion: 'neutre' });
    setIsWriting(false);
    toast.success('Entrée sauvegardée avec succès !');
  };

  const getEmotionInfo = (emotion: string) => {
    return emotions.find(e => e.value === emotion) || emotions[5];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Journal Émotionnel</h1>
          <p className="text-muted-foreground">Exprimez vos pensées et émotions</p>
        </div>
        <Button 
          onClick={() => setIsWriting(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvelle Entrée
        </Button>
      </div>

      <div className="space-y-6">
        {/* Formulaire de nouvelle entrée */}
        {isWriting && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Nouvelle Entrée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Titre</label>
                <Input
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Donnez un titre à votre entrée..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Émotion actuelle</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {emotions.map((emotion) => (
                    <Button
                      key={emotion.value}
                      variant={newEntry.emotion === emotion.value ? "default" : "outline"}
                      onClick={() => setNewEntry(prev => ({ ...prev, emotion: emotion.value }))}
                      className="justify-start h-auto p-3"
                    >
                      <span className={emotion.color}>{emotion.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Contenu</label>
                <Textarea
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Décrivez votre journée, vos pensées, vos émotions..."
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={saveEntry} className="gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsWriting(false);
                    setNewEntry({ title: '', content: '', emotion: 'neutre' });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des entrées */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mes Entrées</h2>
          
          {entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune entrée pour le moment. Commencez à écrire !
                </p>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => {
              const emotionInfo = getEmotionInfo(entry.emotion);
              return (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(entry.date)}
                          </span>
                          <span className={emotionInfo.color}>
                            {emotionInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
