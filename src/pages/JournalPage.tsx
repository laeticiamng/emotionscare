
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Calendar, Heart, Smile, Meh, Frown, Search, Filter } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  title: string;
  content: string;
  tags: string[];
  moodScore: number;
}

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      mood: 'happy',
      title: 'Journée productive au travail',
      content: 'Aujourd'hui j'ai terminé mon projet important. Je me sens vraiment accompli et fier du travail accompli. L'équipe était très collaborative.',
      tags: ['travail', 'accomplissement', 'équipe'],
      moodScore: 8
    },
    {
      id: '2',
      date: '2024-01-14',
      mood: 'neutral',
      title: 'Week-end tranquille',
      content: 'Weekend calme à la maison. J'ai lu un bon livre et pris du temps pour moi. Parfois il faut savoir ralentir.',
      tags: ['détente', 'lecture', 'introspection'],
      moodScore: 6
    }
  ]);

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    moodScore: 5,
    tags: ''
  });

  const handleSaveEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: newEntry.moodScore >= 7 ? 'happy' : newEntry.moodScore >= 4 ? 'neutral' : 'sad',
      title: newEntry.title,
      content: newEntry.content,
      tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      moodScore: newEntry.moodScore
    };

    setEntries([entry, ...entries]);
    setNewEntry({ title: '', content: '', moodScore: 5, tags: '' });
    setShowNewEntry(false);
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="h-5 w-5 text-green-500" />;
      case 'neutral': return <Meh className="h-5 w-5 text-yellow-500" />;
      case 'sad': return <Frown className="h-5 w-5 text-red-500" />;
      default: return <Meh className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMoodColor = (score: number) => {
    if (score >= 7) return 'bg-green-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <BookOpen className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Journal Émotionnel</h1>
              <p className="text-gray-600">Exprimez vos pensées et suivez votre bien-être</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => setShowNewEntry(true)}
              className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle entrée
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>
          </div>
        </div>

        {/* New Entry Form */}
        {showNewEntry && (
          <Card className="mb-8 border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle entrée
              </CardTitle>
              <CardDescription>
                Prenez quelques minutes pour noter vos pensées et émotions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'entrée</Label>
                <Input
                  id="title"
                  placeholder="Donnez un titre à votre journée..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="content">Vos pensées</Label>
                <Textarea
                  id="content"
                  placeholder="Décrivez votre journée, vos émotions, vos réflexions..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="mood">Humeur générale (1-10)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    id="mood"
                    min="1"
                    max="10"
                    value={newEntry.moodScore}
                    onChange={(e) => setNewEntry({...newEntry, moodScore: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-8 text-center">{newEntry.moodScore}</span>
                  <div className={`w-4 h-4 rounded-full ${getMoodColor(newEntry.moodScore)}`}></div>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  placeholder="travail, famille, sport, détente..."
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEntry} className="bg-amber-600 hover:bg-amber-700">
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-600">Entrées totales</p>
                  <p className="text-2xl font-bold">{entries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Humeur moyenne</p>
                  <p className="text-2xl font-bold">
                    {entries.length > 0 
                      ? (entries.reduce((sum, entry) => sum + entry.moodScore, 0) / entries.length).toFixed(1)
                      : '0'
                    }/10
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Série actuelle</p>
                  <p className="text-2xl font-bold">7 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Mes entrées récentes</h2>
          
          {entries.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entrée pour le moment</h3>
                <p className="text-gray-600 mb-4">Commencez à tenir votre journal émotionnel dès aujourd'hui</p>
                <Button onClick={() => setShowNewEntry(true)} className="bg-amber-600 hover:bg-amber-700">
                  Créer ma première entrée
                </Button>
              </CardContent>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getMoodIcon(entry.mood)}
                      <div>
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(entry.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.moodScore)}`}></div>
                      <span className="text-sm font-medium">{entry.moodScore}/10</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 leading-relaxed">{entry.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
