
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, Calendar, Smile, Meh, Frown, PenTool, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/common/PageLayout';

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2024-01-15',
      mood: 'Joyeux',
      title: 'Belle journée au travail',
      content: 'Aujourd\'hui a été une journée particulièrement productive. J\'ai terminé mon projet et l\'équipe était très satisfaite.',
      moodScore: 8
    },
    {
      id: 2,
      date: '2024-01-14',
      mood: 'Calme',
      title: 'Méditation matinale',
      content: 'Session de méditation de 20 minutes ce matin. Je me sens plus centré et prêt pour la journée.',
      moodScore: 7
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '',
    moodScore: 5
  });

  const handleSaveEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry = {
        id: entries.length + 1,
        date: new Date().toISOString().split('T')[0],
        mood: newEntry.moodScore >= 7 ? 'Joyeux' : newEntry.moodScore >= 4 ? 'Calme' : 'Triste',
        title: newEntry.title,
        content: newEntry.content,
        moodScore: newEntry.moodScore
      };
      setEntries([entry, ...entries]);
      setNewEntry({ title: '', content: '', mood: '', moodScore: 5 });
    }
  };

  return (
    <PageLayout
      header={{
        title: 'Journal Émotionnel',
        subtitle: 'Suivez votre parcours de bien-être',
        description: 'Documentez vos émotions, réflexions et progrès quotidiens. Développez votre intelligence émotionnelle grâce à l\'introspection guidée.',
        icon: BookOpen,
        gradient: 'from-green-500/20 to-blue-500/5',
        badge: 'Développement Personnel',
        stats: [
          {
            label: 'Entrées',
            value: entries.length.toString(),
            icon: PenTool,
            color: 'text-green-500'
          },
          {
            label: 'Humeur moy.',
            value: `${Math.round(entries.reduce((acc, e) => acc + e.moodScore, 0) / entries.length)}/10`,
            icon: Target,
            color: 'text-blue-500'
          },
          {
            label: 'Progression',
            value: '+12%',
            icon: TrendingUp,
            color: 'text-purple-500'
          },
          {
            label: 'Régularité',
            value: '85%',
            icon: BarChart3,
            color: 'text-orange-500'
          }
        ],
        actions: [
          {
            label: 'Nouvelle Entrée',
            onClick: () => console.log('New entry'),
            variant: 'default',
            icon: Plus
          },
          {
            label: 'Statistiques',
            onClick: () => console.log('Statistics'),
            variant: 'outline',
            icon: BarChart3
          }
        ]
      }}
      tips={{
        title: 'Conseils pour un journal efficace',
        items: [
          {
            title: 'Régularité',
            content: 'Écrivez quotidiennement, même quelques lignes suffisent',
            icon: Calendar
          },
          {
            title: 'Honnêteté',
            content: 'Soyez authentique dans vos ressentis et émotions',
            icon: BookOpen
          },
          {
            title: 'Gratitude',
            content: 'Notez au moins une chose positive chaque jour',
            icon: Smile
          }
        ],
        cta: {
          label: 'Guide du journal émotionnel',
          onClick: () => console.log('Journal guide')
        }
      }}
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Nouvelle entrée */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Nouvelle Entrée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Titre de l'entrée"
                value={newEntry.title}
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
              />
              
              <Textarea
                placeholder="Comment vous sentez-vous aujourd'hui ?"
                rows={4}
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Humeur (1-10)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.moodScore}
                    onChange={(e) => setNewEntry({...newEntry, moodScore: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-primary">{newEntry.moodScore}</span>
                </div>
              </div>

              <Button 
                onClick={handleSaveEntry}
                className="w-full"
                disabled={!newEntry.title || !newEntry.content}
              >
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Historique des entrées */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Mes Entrées ({entries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-border rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{entry.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(entry.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{entry.moodScore}/10</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.moodScore >= 7 ? 'bg-green-100 dark:bg-green-900' : 
                          entry.moodScore >= 4 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'
                        }`}>
                          {entry.moodScore >= 7 ? (
                            <Smile className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : entry.moodScore >= 4 ? (
                            <Meh className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          ) : (
                            <Frown className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{entry.content}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu de la Semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{day}</div>
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium ${
                      Math.random() > 0.3 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 7 : '-'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default JournalPage;
