import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Plus, 
  Search,
  Calendar,
  Heart,
  TrendingUp,
  Filter,
  Edit,
  Eye
} from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function JournalHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const navAction = useNavAction();

  const journalEntries = [
    {
      id: '1',
      date: '2024-01-20',
      title: 'Journée productive au travail',
      excerpt: 'Aujourd\'hui j\'ai réussi à finir tous mes projets en cours...',
      mood: 'happy',
      moodLabel: 'Heureux',
      tags: ['travail', 'productivité', 'accomplissement'],
      wordCount: 324
    },
    {
      id: '2',
      date: '2024-01-19',
      title: 'Méditation matinale',
      excerpt: 'Ma séance de méditation ce matin m\'a vraiment aidé à...',
      mood: 'calm',
      moodLabel: 'Calme',
      tags: ['méditation', 'matin', 'bien-être'],
      wordCount: 156
    },
    {
      id: '3',
      date: '2024-01-18',
      title: 'Réflexions sur mes objectifs',
      excerpt: 'Il est temps de faire le point sur mes objectifs pour cette année...',
      mood: 'thoughtful',
      moodLabel: 'Pensif',
      tags: ['objectifs', 'réflexion', 'croissance'],
      wordCount: 287
    }
  ];

  const moodColors = {
    happy: 'bg-yellow-500',
    calm: 'bg-blue-500',
    thoughtful: 'bg-purple-500',
    sad: 'bg-gray-500',
    excited: 'bg-orange-500',
    anxious: 'bg-red-500'
  };

  const stats = {
    totalEntries: 45,
    wordsWritten: 12453,
    streakDays: 12,
    favoriteTime: 'Matin'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Journal Émotionnel
          </h1>
          <p className="text-muted-foreground">
            Suivez votre évolution émotionnelle au quotidien
          </p>
        </div>
        <Button 
          onClick={() => navAction({ type: 'modal', id: 'new-journal-entry' })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle entrée
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
            <div className="text-sm text-muted-foreground">Entrées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Edit className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{stats.wordsWritten.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Mots écrits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.streakDays}</div>
            <div className="text-sm text-muted-foreground">Jours consécutifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{stats.favoriteTime}</div>
            <div className="text-sm text-muted-foreground">Moment favori</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans vos entrées..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Période
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-4">
        {journalEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${moodColors[entry.mood as keyof typeof moodColors]}`} />
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </div>
                <Badge variant="outline">{entry.moodLabel}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{entry.excerpt}</p>
              
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {entry.wordCount} mots
                </span>
                <div className="space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navAction({ 
                      type: 'modal', 
                      id: 'view-journal-entry', 
                      payload: { entryId: entry.id } 
                    })}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Lire
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navAction({ 
                      type: 'modal', 
                      id: 'edit-journal-entry', 
                      payload: { entryId: entry.id } 
                    })}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Éditer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => navAction({ type: 'modal', id: 'journal-analytics' })}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Analyse des émotions
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'journal-export' })}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Exporter le journal
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'journal-reminders' })}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Rappels d'écriture
        </Button>
      </div>

      {/* Writing Prompt */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Inspiration du jour</CardTitle>
          <CardDescription>
            "Qu'est-ce qui vous a apporté de la joie aujourd'hui, même dans les petits moments ?"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navAction({ 
              type: 'modal', 
              id: 'new-journal-entry', 
              payload: { prompt: "Qu'est-ce qui vous a apporté de la joie aujourd'hui ?" } 
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Écrire à partir de cette inspiration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}