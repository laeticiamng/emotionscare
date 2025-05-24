
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries] = useState([
    {
      id: 1,
      date: '2024-01-15',
      mood: 'Heureux',
      content: 'Excellente journée au travail, j\'ai terminé mon projet important.',
      emotion: '😊'
    },
    {
      id: 2,
      date: '2024-01-14',
      mood: 'Calme',
      content: 'Séance de méditation matinale très bénéfique.',
      emotion: '😌'
    },
    {
      id: 3,
      date: '2024-01-13',
      mood: 'Stressé',
      content: 'Journée chargée avec plusieurs réunions importantes.',
      emotion: '😰'
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/b2c/dashboard')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Book className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Journal Émotionnel
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Suivez votre parcours émotionnel au quotidien
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Mes entrées</h2>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle entrée
            </Button>
          </div>

          <div className="grid gap-6">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{entry.emotion}</span>
                        <div>
                          <CardTitle className="text-lg">{entry.mood}</CardTitle>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="mr-1 h-3 w-3" />
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {entries.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <CardTitle className="mb-2">Aucune entrée pour le moment</CardTitle>
                <CardDescription className="mb-4">
                  Commencez votre journal émotionnel dès aujourd'hui
                </CardDescription>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer ma première entrée
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JournalPage;
