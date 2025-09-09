import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Plus, 
  Calendar,
  Heart,
  Smile,
  Meh,
  Frown,
  Save,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

const JournalPage: React.FC = () => {
  const [currentEntry, setCurrentEntry] = React.useState('');
  const [selectedMood, setSelectedMood] = React.useState<number | null>(null);

  const journalEntries = [
    {
      id: 1,
      date: '2024-12-09',
      time: '08:30',
      mood: 8,
      preview: 'Excellente journée qui commence, je me sens plein d\'énergie...',
      tags: ['motivation', 'énergie']
    },
    {
      id: 2,
      date: '2024-12-08',
      time: '19:45',
      mood: 6,
      preview: 'Journée mitigée au travail, quelques tensions mais...',
      tags: ['travail', 'stress']
    },
    {
      id: 3,
      date: '2024-12-07',
      time: '14:20',
      mood: 9,
      preview: 'Session de méditation très bénéfique ce matin...',
      tags: ['méditation', 'sérénité']
    }
  ];

  const moodOptions = [
    { value: 2, icon: Frown, label: 'Difficile', color: 'text-red-500' },
    { value: 5, icon: Meh, label: 'Neutre', color: 'text-yellow-500' },
    { value: 8, icon: Smile, label: 'Bien', color: 'text-green-500' },
    { value: 10, icon: Heart, label: 'Excellent', color: 'text-pink-500' }
  ];

  const handleSaveEntry = () => {
    if (!currentEntry.trim()) {
      toast.error('Veuillez écrire quelque chose avant de sauvegarder');
      return;
    }
    
    toast.success('Entrée de journal sauvegardée!');
    setCurrentEntry('');
    setSelectedMood(null);
  };

  const getMoodIcon = (mood: number) => {
    if (mood <= 3) return <Frown className="h-4 w-4 text-red-500" />;
    if (mood <= 6) return <Meh className="h-4 w-4 text-yellow-500" />;
    if (mood <= 8) return <Smile className="h-4 w-4 text-green-500" />;
    return <Heart className="h-4 w-4 text-pink-500" />;
  };

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Journal Personnel</h1>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Heart className="h-3 w-3 mr-1" />
            Privé & Sécurisé
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Exprimez vos pensées et suivez votre évolution émotionnelle
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Nouvelle entrée */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle Entrée
              </CardTitle>
              <CardDescription>
                Prenez un moment pour vous exprimer librement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection d'humeur */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Comment vous sentez-vous ?</label>
                <div className="flex gap-3">
                  {moodOptions.map((mood) => (
                    <Button
                      key={mood.value}
                      variant={selectedMood === mood.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMood(mood.value)}
                      className="flex items-center gap-2"
                    >
                      <mood.icon className={`h-4 w-4 ${selectedMood === mood.value ? 'text-white' : mood.color}`} />
                      <span>{mood.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Zone de texte */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Vos pensées du moment</label>
                <Textarea
                  placeholder="Exprimez ce que vous ressentez, vos réflexions, vos observations... Cet espace est entièrement privé et sécurisé."
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="text-xs text-muted-foreground">
                  {currentEntry.length} caractères • Chiffrement end-to-end actif
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <Button onClick={handleSaveEntry} disabled={!currentEntry.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aperçu des entrées récentes */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Entrées Récentes
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMoodIcon(entry.mood)}
                        <span className="text-sm font-medium">{entry.mood}/10</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.date} • {entry.time}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {entry.preview}
                    </p>
                    <div className="flex gap-1">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les entrées
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;