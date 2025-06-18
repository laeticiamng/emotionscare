
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search, Filter, Heart, Brain, Calendar, Mic, Edit, Trash2 } from 'lucide-react';

const JournalPage: React.FC = () => {
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const journalEntries = [
    {
      id: 1,
      date: '2024-12-15',
      time: '14:30',
      content: 'Aujourd\'hui a été une journée productive. J\'ai terminé mes projets en cours et je me sens satisfait du travail accompli. La méditation du matin m\'a vraiment aidé à rester concentré.',
      mood: 'Satisfait',
      emotion: 'Calme',
      tags: ['productivité', 'méditation', 'travail'],
      aiInsight: 'Votre pratique de méditation semble avoir un impact positif sur votre productivité.'
    },
    {
      id: 2,
      date: '2024-12-14',
      time: '19:45',
      content: 'Journée un peu stressante au bureau. Beaucoup de réunions et de deadlines. Heureusement, la séance de sport ce soir m\'a permis de décompresser.',
      mood: 'Stressé puis Détendu',
      emotion: 'Mixte',
      tags: ['stress', 'travail', 'sport'],
      aiInsight: 'L\'exercice physique est un excellent moyen de gérer votre stress.'
    },
    {
      id: 3,
      date: '2024-12-13',
      time: '21:15',
      content: 'Excellent dîner avec des amis. Ces moments de connexion sociale me font toujours du bien. Je réalise à quel point c\'est important pour mon équilibre.',
      mood: 'Joyeux',
      emotion: 'Bonheur',
      tags: ['amis', 'social', 'bonheur'],
      aiInsight: 'Les interactions sociales positives sont essentielles pour votre bien-être.'
    }
  ];

  const saveEntry = () => {
    if (newEntry.trim()) {
      // Ici on sauvegarderait l'entrée
      console.log('Nouvelle entrée:', newEntry);
      setNewEntry('');
      setIsWriting(false);
    }
  };

  const getMoodColor = (mood: string) => {
    if (mood.toLowerCase().includes('joyeux') || mood.toLowerCase().includes('satisfait')) {
      return 'bg-green-100 text-green-800';
    }
    if (mood.toLowerCase().includes('stressé')) {
      return 'bg-red-100 text-red-800';
    }
    if (mood.toLowerCase().includes('calme')) {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon Journal Émotionnel</h1>
          <p className="text-muted-foreground">
            Suivez votre parcours émotionnel et découvrez vos patterns
          </p>
        </div>
        <Button onClick={() => setIsWriting(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle entrée
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entrées ce mois</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Humeur moyenne</p>
                <p className="text-2xl font-bold">7.2/10</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Série actuelle</p>
                <p className="text-2xl font-bold">7 jours</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Entry Form */}
      {isWriting && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Nouvelle entrée de journal
            </CardTitle>
            <CardDescription>
              Exprimez vos pensées et émotions du moment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Comment vous sentez-vous aujourd'hui ? Que s'est-il passé dans votre journée ?"
              className="w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={6}
            />
            
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mic className="h-4 w-4 mr-2" />
                  Dicter
                </Button>
                <Button variant="outline" size="sm">
                  Ajouter tags
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsWriting(false)}>
                  Annuler
                </Button>
                <Button onClick={saveEntry}>
                  Sauvegarder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher dans vos entrées..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {journalEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {new Date(entry.date).getDate()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {entry.time}
                      </span>
                      <Badge className={getMoodColor(entry.mood)}>
                        {entry.mood}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-700 mb-4">{entry.content}</p>
              
              {entry.aiInsight && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex items-start gap-2">
                    <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Insight IA</p>
                      <p className="text-blue-800 text-sm">{entry.aiInsight}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {journalEntries.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Votre journal est vide</h3>
            <p className="text-muted-foreground mb-6">
              Commencez à écrire vos pensées et émotions pour suivre votre parcours
            </p>
            <Button onClick={() => setIsWriting(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Écrire ma première entrée
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JournalPage;
