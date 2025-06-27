
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, Calendar, Smile, Meh, Frown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

  const moodIcons = {
    'Joyeux': Smile,
    'Calme': Meh,
    'Triste': Frown
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Journal Émotionnel
            </h1>
            <p className="text-xl text-gray-600">
              Suivez votre bien-être quotidien et vos progrès
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Nouvelle entrée */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-500" />
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
                      <span className="text-lg font-bold text-blue-600">{newEntry.moodScore}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                    Enregistrer
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Historique des entrées */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Mes Entrées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-800">{entry.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              {new Date(entry.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{entry.moodScore}/10</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              entry.moodScore >= 7 ? 'bg-green-100' : 
                              entry.moodScore >= 4 ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              {entry.moodScore >= 7 ? (
                                <Smile className="h-4 w-4 text-green-600" />
                              ) : entry.moodScore >= 4 ? (
                                <Meh className="h-4 w-4 text-yellow-600" />
                              ) : (
                                <Frown className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{entry.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 mt-6">
                <CardHeader>
                  <CardTitle>Aperçu de la Semaine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">{day}</div>
                        <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium ${
                          Math.random() > 0.3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
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
        </motion.div>
      </div>
    </div>
  );
};

export default JournalPage;
