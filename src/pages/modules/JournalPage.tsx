import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, TrendingUp, Heart, Star } from 'lucide-react';

const JournalPage = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [mood, setMood] = useState<number | null>(null);

  const moods = [
    { emoji: '😢', label: 'Triste', value: 1 },
    { emoji: '😐', label: 'Neutre', value: 2 },
    { emoji: '😊', label: 'Content', value: 3 },
    { emoji: '😄', label: 'Joyeux', value: 4 },
    { emoji: '🤩', label: 'Excellent', value: 5 }
  ];

  const recentEntries = [
    { date: '2024-01-15', mood: 4, preview: 'Journée productive au travail...' },
    { date: '2024-01-14', mood: 3, preview: 'Session de méditation apaisante...' },
    { date: '2024-01-13', mood: 2, preview: 'Réflexions sur mes objectifs...' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 p-6">
      {/* Skip Links pour l'accessibilité */}
      <div className="sr-only focus:not-sr-only">
        <a 
          href="#main-content" 
          className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Aller au contenu principal
        </a>
        <a 
          href="#new-entry" 
          className="absolute top-4 left-32 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Nouvelle entrée
        </a>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-violet-600" aria-hidden="true" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Journal Émotionnel
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez vos émotions, suivez votre bien-être et développez votre intelligence émotionnelle
          </p>
        </header>

        <main id="main-content" className="grid lg:grid-cols-3 gap-6">
          {/* Nouvelle entrée */}
          <section id="new-entry" className="lg:col-span-2 space-y-6" aria-labelledby="new-entry-title">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle id="new-entry-title" className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" aria-hidden="true" />
                  Nouvelle Entrée
                </CardTitle>
                <CardDescription>
                  Comment vous sentez-vous aujourd'hui ? Partagez vos pensées et émotions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sélection de l'humeur */}
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium">Votre humeur aujourd'hui :</legend>
                  <div className="flex gap-3 justify-center">
                    {moods.map((moodOption) => (
                      <button
                        key={moodOption.value}
                        onClick={() => setMood(moodOption.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                          mood === moodOption.value
                            ? 'border-violet-500 bg-violet-50 shadow-md'
                            : 'border-gray-200 hover:border-violet-300'
                        }`}
                        aria-label={`Humeur ${moodOption.label}`}
                        aria-pressed={mood === moodOption.value}
                      >
                        <div className="text-3xl">{moodOption.emoji}</div>
                        <div className="text-xs font-medium mt-1">{moodOption.label}</div>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Zone de texte */}
                <div className="space-y-2">
                  <label htmlFor="journal-text" className="text-sm font-medium">
                    Vos pensées et émotions :
                  </label>
                  <Textarea
                    id="journal-text"
                    placeholder="Décrivez vos émotions, ce qui s'est passé aujourd'hui, vos réflexions..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    rows={6}
                    className="resize-none focus:ring-violet-500 focus:border-violet-500"
                    aria-describedby="journal-help"
                  />
                  <p id="journal-help" className="text-xs text-muted-foreground">
                    Prenez le temps d'explorer vos émotions en profondeur. Aucun jugement, juste de l'authenticité.
                  </p>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  disabled={!journalEntry.trim() || mood === null}
                  aria-describedby="save-help"
                >
                  <Star className="h-4 w-4 mr-2" aria-hidden="true" />
                  Sauvegarder l'entrée
                </Button>
                <p id="save-help" className="text-xs text-muted-foreground text-center">
                  Votre entrée sera chiffrée et stockée en sécurité
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Sidebar - Statistiques et historique */}
          <aside className="space-y-6" aria-labelledby="sidebar-title">
            <h2 id="sidebar-title" className="sr-only">Informations complémentaires</h2>
            
            {/* Statistiques */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" aria-hidden="true" />
                  Progression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Entrées ce mois</span>
                    <span className="font-medium">12/31</span>
                  </div>
                  <Progress value={39} className="h-2" aria-label="Progression: 12 entrées sur 31 jours" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">4.2</div>
                    <div className="text-xs text-green-700">Humeur moyenne</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">7</div>
                    <div className="text-xs text-blue-700">Jours consécutifs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique récent */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  Entrées récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentEntries.map((entry, index) => (
                  <div 
                    key={entry.date}
                    className="p-3 rounded-lg border border-gray-100 hover:border-violet-200 transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        // Action pour ouvrir l'entrée
                      }
                    }}
                    aria-label={`Entrée du ${entry.date}, humeur ${entry.mood}/5`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{entry.date}</span>
                      <Badge 
                        variant={entry.mood >= 4 ? 'default' : entry.mood >= 3 ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {moods.find(m => m.value === entry.mood)?.emoji} {entry.mood}/5
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.preview}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default JournalPage;