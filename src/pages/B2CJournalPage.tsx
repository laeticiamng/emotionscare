import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, BookOpen, Calendar, Search, Filter, 
         Heart, Smile, Meh, Frown, Zap, Cloud } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'calm';
  date: string;
  tags: string[];
}

const B2CJournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: 'neutral' as const, tags: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  const [entries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'Ma journée parfaite',
      content: 'Aujourd\'hui a été une journée exceptionnelle. J\'ai commencé par une méditation matinale qui m\'a donné beaucoup d\'énergie positive...',
      mood: 'happy',
      date: '2024-01-15T10:30:00',
      tags: ['méditation', 'énergie', 'positivité']
    },
    {
      id: '2',
      title: 'Réflexions sur le stress au travail',
      content: 'Cette semaine a été intense au bureau. J\'ai remarqué que je me sens plus stressé quand les deadlines s\'accumulent...',
      mood: 'neutral',
      date: '2024-01-14T18:45:00',
      tags: ['travail', 'stress', 'réflexion']
    },
    {
      id: '3',
      title: 'Moment de gratitude',
      content: 'Je voulais prendre un moment pour noter tout ce pour quoi je suis reconnaissant aujourd\'hui...',
      mood: 'happy',
      date: '2024-01-13T20:15:00',
      tags: ['gratitude', 'famille', 'bonheur']
    }
  ]);

  const moodConfig = {
    happy: { icon: Smile, color: 'bg-green-500', label: 'Heureux' },
    excited: { icon: Zap, color: 'bg-yellow-500', label: 'Excité' },
    neutral: { icon: Meh, color: 'bg-blue-500', label: 'Neutre' },
    calm: { icon: Cloud, color: 'bg-purple-500', label: 'Calme' },
    sad: { icon: Frown, color: 'bg-gray-500', label: 'Triste' }
  };

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      // Ici on sauvegarderait en base de données
      console.log('Nouvelle entrée:', {
        ...newEntry,
        tags: newEntry.tags.split(',').map(tag => tag.trim()),
        date: new Date().toISOString()
      });
      
      setNewEntry({ title: '', content: '', mood: 'neutral', tags: '' });
      setIsWriting(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
    
    return matchesSearch && matchesMood;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isWriting) {
    return (
      <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsWriting(false)}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouvelle Entrée</h1>
              <p className="text-gray-600">Exprimez vos pensées et émotions</p>
            </div>
          </div>

          {/* Formulaire de création */}
          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle entrée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Titre */}
              <div>
                <label className="text-sm font-medium mb-2 block">Titre de l'entrée</label>
                <Input
                  placeholder="Donnez un titre à votre entrée..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Humeur */}
              <div>
                <label className="text-sm font-medium mb-3 block">Comment vous sentez-vous ?</label>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(moodConfig).map(([mood, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <Button
                        key={mood}
                        variant={newEntry.mood === mood ? "default" : "outline"}
                        onClick={() => setNewEntry(prev => ({ ...prev, mood: mood as any }))}
                        className="flex items-center gap-2"
                      >
                        <IconComponent className="w-4 h-4" />
                        {config.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Contenu */}
              <div>
                <label className="text-sm font-medium mb-2 block">Vos pensées</label>
                <Textarea
                  placeholder="Que s'est-il passé aujourd'hui ? Comment vous sentez-vous ? Quelles sont vos réflexions..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium mb-2 block">Mots-clés (séparés par des virgules)</label>
                <Input
                  placeholder="travail, stress, famille, bonheur..."
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSaveEntry} className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Enregistrer l'entrée
                </Button>
                <Button variant="outline" onClick={() => setIsWriting(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/b2c/dashboard')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Journal</h1>
              <p className="text-gray-600">Vos pensées et émotions au fil du temps</p>
            </div>
          </div>
          <Button onClick={() => setIsWriting(true)} className="bg-gradient-to-r from-green-500 to-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Entrée
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{entries.length}</div>
              <div className="text-sm text-gray-600">Entrées totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-sm text-gray-600">Jours consécutifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div className="text-sm text-gray-600">Mots-clés uniques</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">😊</div>
              <div className="text-sm text-gray-600">Humeur dominante</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Rechercher dans vos entrées..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 items-center">
                <Filter className="w-4 h-4 text-gray-500" />
                <select 
                  value={selectedMoodFilter}
                  onChange={(e) => setSelectedMoodFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">Toutes les humeurs</option>
                  {Object.entries(moodConfig).map(([mood, config]) => (
                    <option key={mood} value={mood}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des entrées */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Aucune entrée trouvée</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedMoodFilter !== 'all' 
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Commencez à écrire votre premier journal'
                  }
                </p>
                <Button onClick={() => setIsWriting(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer ma première entrée
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => {
              const moodInfo = moodConfig[entry.mood];
              const MoodIcon = moodInfo.icon;
              
              return (
                <Card key={entry.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg ${moodInfo.color} text-white`}>
                              <MoodIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm text-gray-600">{moodInfo.label}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(entry.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {entry.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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

export default B2CJournalPage;