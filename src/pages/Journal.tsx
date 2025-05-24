
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Heart,
  Brain,
  Lightbulb,
  TrendingUp,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  moodScore: number;
  date: Date;
  tags: string[];
  aiInsight?: string;
}

const Journal: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '',
    moodScore: 5
  });

  const isDemo = user?.email?.endsWith('@exemple.fr');

  // Données de démonstration
  const demoEntries: JournalEntry[] = [
    {
      id: '1',
      title: 'Une belle journée de travail',
      content: 'Aujourd\'hui j\'ai eu une présentation importante et tout s\'est très bien passé. Je me sens confiant et fier du travail accompli. L\'équipe était très réceptive à mes idées.',
      mood: 'Confiant',
      moodScore: 8,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tags: ['travail', 'confiance', 'réussite'],
      aiInsight: 'Excellente progression ! Votre confiance au travail se renforce. Continuez à capitaliser sur ces succès pour maintenir cette dynamique positive.'
    },
    {
      id: '2',
      title: 'Moment de stress',
      content: 'La deadline approche et je sens la pression monter. J\'ai du mal à me concentrer et je me sens submergé par toutes les tâches à accomplir.',
      mood: 'Stressé',
      moodScore: 3,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      tags: ['stress', 'travail', 'deadline'],
      aiInsight: 'Le stress est temporaire. Essayez de diviser vos tâches en petites étapes et prenez des pauses régulières. La respiration profonde peut vous aider.'
    },
    {
      id: '3',
      title: 'Week-end ressourçant',
      content: 'Passé un excellent week-end en famille. Nous avons fait une randonnée et j\'ai vraiment déconnecté. Je me sens rechargé pour la semaine à venir.',
      mood: 'Apaisé',
      moodScore: 9,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tags: ['famille', 'nature', 'ressourcement'],
      aiInsight: 'Les activités en nature sont excellentes pour votre bien-être. Essayez d\'intégrer plus souvent ce type d\'activités dans votre routine.'
    }
  ];

  useEffect(() => {
    if (isDemo) {
      setEntries(demoEntries);
    } else {
      // Charger les vraies entrées depuis la base de données
      loadEntries();
    }
  }, [isDemo]);

  const loadEntries = async () => {
    // Fonction pour charger les entrées depuis Supabase
    try {
      // Code de chargement depuis la DB
    } catch (error) {
      toast.error('Erreur lors du chargement des entrées');
    }
  };

  const saveEntry = async () => {
    if (!newEntry.title || !newEntry.content) {
      toast.error('Veuillez remplir le titre et le contenu');
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood || 'Neutre',
      moodScore: newEntry.moodScore,
      date: new Date(),
      tags: extractTags(newEntry.content),
      aiInsight: generateAIInsight(newEntry.content, newEntry.mood)
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: '', content: '', mood: '', moodScore: 5 });
    setIsWriting(false);
    toast.success('Entrée sauvegardée !');
  };

  const extractTags = (content: string): string[] => {
    // Extraction simple de mots-clés
    const keywords = ['travail', 'famille', 'stress', 'bonheur', 'confiance', 'peur', 'amour', 'fatigue', 'énergie'];
    return keywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).slice(0, 3);
  };

  const generateAIInsight = (content: string, mood: string): string => {
    const insights = [
      'Votre expression émotionnelle montre une belle introspection. Continuez ce travail de conscience de soi.',
      'Cette réflexion révèle votre capacité d\'adaptation. C\'est une force précieuse.',
      'Votre journal montre une évolution positive de votre bien-être émotionnel.',
      'Ces émotions sont valides et importantes. Prenez le temps de les accueillir pleinement.',
      'Votre capacité à verbaliser vos ressentis est un excellent outil de développement personnel.'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success('Entrée supprimée');
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const moodColors = {
    'Joyeux': 'bg-yellow-100 text-yellow-800',
    'Triste': 'bg-blue-100 text-blue-800',
    'Confiant': 'bg-green-100 text-green-800',
    'Stressé': 'bg-red-100 text-red-800',
    'Apaisé': 'bg-purple-100 text-purple-800',
    'Neutre': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="mx-auto p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit mb-4">
            <BookOpen className="h-12 w-12 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Journal Personnel</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Exprimez vos émotions, réflexions et recevez des insights personnalisés par l'IA
          </p>
          {isDemo && (
            <Badge variant="secondary" className="mt-4">
              Mode démo - Entrées d'exemple
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Barre d'actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher dans vos entrées..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Badge variant="outline">{filteredEntries.length} entrées</Badge>
              </div>
              <Button onClick={() => setIsWriting(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle entrée
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Formulaire de nouvelle entrée */}
      {isWriting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle entrée de journal</CardTitle>
              <CardDescription>
                Exprimez vos pensées et émotions du moment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Titre de votre entrée..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Que ressentez-vous aujourd'hui ? Quelles sont vos réflexions ?"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Humeur actuelle</label>
                  <Input
                    placeholder="ex: Joyeux, Confiant, Stressé..."
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, mood: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Score d'humeur (1-10): {newEntry.moodScore}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.moodScore}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, moodScore: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={saveEntry}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setIsWriting(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Liste des entrées */}
      <div className="space-y-4">
        {filteredEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{entry.date.toLocaleDateString()}</span>
                      </div>
                      <Badge className={moodColors[entry.mood as keyof typeof moodColors] || moodColors.Neutre}>
                        {entry.mood}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{entry.moodScore}/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {entry.content}
                </p>
                
                {entry.tags.length > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm font-medium">Tags:</span>
                    {entry.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {entry.aiInsight && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Insight IA</h4>
                        <p className="text-sm text-muted-foreground">{entry.aiInsight}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredEntries.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune entrée trouvée pour "{searchTerm}"</p>
          </CardContent>
        </Card>
      )}

      {/* Conseils et motivation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Conseil du jour</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              📝 <strong>Bénéfices du journal :</strong> Tenir un journal émotionnel améliore la conscience de soi, 
              réduit le stress et aide à identifier les schémas émotionnels. Même 5 minutes par jour suffisent !
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>+23% de bien-être</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Meilleure gestion émotionnelle</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Journal;
