
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Wind, Heart, Timer, Zap } from 'lucide-react';

const BreathHome: React.FC = () => {
  const navigate = useNavigate();

  const exercises = [
    {
      id: 'flowwalk',
      title: 'Flow Walk',
      description: 'Marche méditative avec respiration rythmée',
      icon: Wind,
      duration: '10-15 min',
      difficulty: 'Débutant',
      color: 'bg-blue-500'
    },
    {
      id: 'glowmug',
      title: 'Glow Mug',
      description: 'Exercice de respiration avec visualisation',
      icon: Heart,
      duration: '5-10 min',
      difficulty: 'Facile',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Exercices de Respiration
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Découvrez des techniques de respiration pour améliorer votre bien-être
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${exercise.color} text-white`}>
                  <exercise.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{exercise.title}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Timer className="h-4 w-4" />
                  {exercise.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="h-4 w-4" />
                  {exercise.difficulty}
                </div>
              </div>
              <Button 
                onClick={() => navigate(`/breath/${exercise.id}`)}
                className="w-full"
              >
                Commencer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BreathHome;
