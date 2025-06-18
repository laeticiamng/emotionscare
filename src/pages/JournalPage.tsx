import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  PlusCircle, 
  Calendar, 
  Search,
  Heart,
  Smile,
  Frown,
  Meh,
  Filter,
  Download,
  Share,
  Edit,
  Trash2
} from 'lucide-react';

const JournalPage: React.FC = () => {
  const [newEntry, setNewEntry] = useState('');
  const [entryTitle, setEntryTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('');

  const moods = [
    { name: 'Excellent', icon: <Smile className="h-5 w-5" />, color: 'bg-green-500', value: 'excellent' },
    { name: 'Bien', icon: <Smile className="h-5 w-5" />, color: 'bg-blue-500', value: 'bien' },
    { name: 'Neutre', icon: <Meh className="h-5 w-5" />, color: 'bg-gray-500', value: 'neutre' },
    { name: 'Difficile', icon: <Frown className="h-5 w-5" />, color: 'bg-orange-500', value: 'difficile' },
    { name: 'Très difficile', icon: <Frown className="h-5 w-5" />, color: 'bg-red-500', value: 'tres-difficile' },
  ];

  const mockEntries = [
    {
      id: 1,
      title: 'Une journée productive',
      content: 'Aujourd\'hui j\'ai accompli beaucoup de choses au travail. Je me sens satisfait et reconnaissant pour cette énergie positive.',
      mood: 'excellent',
      date: '2024-01-15',
      tags: ['travail', 'productivité', 'gratitude']
    },
    {
      id: 2,
      title: 'Réflexions du soir',
      content: 'Soirée calme à la maison. J\'ai pris le temps de méditer et de réfléchir à mes objectifs.',
      mood: 'bien',
      date: '2024-01-14',
      tags: ['méditation', 'objectifs', 'calme']
    },
    {
      id: 3,
      title: 'Stress au bureau',
      content: 'Journée chargée avec beaucoup de pression. J\'ai réussi à gérer mais je me sens épuisé.',
      mood: 'difficile',
      date: '2024-01-13',
      tags: ['stress', 'travail', 'épuisement']
    }
  ];

  const getMoodColor = (moodValue: string) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood?.color || 'bg-gray-500';
  };

  const getMoodIcon = (moodValue: string) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood?.icon || <Meh className="h-5 w-5" />;
  };

  const handleSaveEntry = () => {
    if (newEntry.trim() && selectedMood) {
      // Ici on sauvegarderait l'entrée
      console.log('Nouvelle entrée:', { title: entryTitle, content: newEntry, mood: selectedMood });
      setNewEntry('');
      setEntryTitle('');
      setSelectedMood('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Journal Personnel
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Exprimez vos pensées, suivez vos émotions et observez votre évolution personnelle au fil du temps.
        </p>
      </div>

      <Tabs defaultValue="write" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="write" className="flex items-center space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>Nouvelle entrée</span>
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Mes entrées</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Analyse</span>
          </TabsTrigger>
        </TabsList>

        {/* Nouvelle entrée */}
        <TabsContent value="write" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PlusCircle className="h-6 w-6" />
                <span>Créer une nouvelle entrée</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre (optionnel)</label>
                <Input
                  placeholder="Donnez un titre à votre entrée..."
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                />
              </div>

              {/* Sélection d'humeur */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Comment vous sentez-vous aujourd'hui ?</label>
                <div className="flex flex-wrap gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedMood === mood.value
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${mood.color} flex items-center justify-center text-white`}>
                        {mood.icon}
                      </div>
                      <span className="text-sm">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenu */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Votre expression</label>
                <Textarea
                  placeholder="Écrivez vos pensées, vos sentiments, vos expériences d'aujourd'hui..."
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  className="min-h-40"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{newEntry.length} caractères</span>
                  <span>Entrée du {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  Sauvegarder en brouillon
                </Button>
                <Button 
                  onClick={handleSaveEntry}
                  disabled={!newEntry.trim() || !selectedMood}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Publier l'entrée
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Liste des entrées */}
        <TabsContent value="entries" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Mes entrées</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {mockEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{new Date(entry.date).toLocaleDateString('fr-FR')}</span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-4 h-4 rounded-full ${getMoodColor(entry.mood)} flex items-center justify-center text-white text-xs`}>
                            {getMoodIcon(entry.mood)}
                          </div>
                          <span className="capitalize">{entry.mood.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{entry.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total des entrées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">Ce mois-ci</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Humeur moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Smile className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-semibold">Bien</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Régularité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18</div>
                <p className="text-sm text-muted-foreground">Jours consécutifs</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution de votre humeur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Graphique d'évolution de l'humeur (à implémenter)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { JournalPage };
export default JournalPage;