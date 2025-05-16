
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageSquare, HeartPulse, Brain, Lightbulb, Music } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import CoachCharacter from '@/components/coach/CoachCharacter';
import { useCoach } from '@/contexts/CoachContext';

const B2CCoach: React.FC = () => {
  const navigate = useNavigate();
  const { sendMessage } = useCoach();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'talk', label: 'Parler', icon: <MessageSquare className="h-5 w-5" />, description: 'Discuter avec votre coach IA de vos préoccupations' },
    { id: 'emotion', label: 'Emotions', icon: <HeartPulse className="h-5 w-5" />, description: 'Explorer et comprendre vos émotions' },
    { id: 'focus', label: 'Concentration', icon: <Brain className="h-5 w-5" />, description: 'Améliorer votre focus et votre productivité' },
    { id: 'inspire', label: 'Inspiration', icon: <Lightbulb className="h-5 w-5" />, description: 'Trouver de nouvelles idées et perspectives' },
    { id: 'relax', label: 'Relaxation', icon: <Music className="h-5 w-5" />, description: 'Des exercices pour vous aider à vous détendre' },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleStartChat = () => {
    if (selectedCategory) {
      const categoryObj = categories.find(cat => cat.id === selectedCategory);
      if (categoryObj) {
        navigate('/coach-chat', { state: { initialTopic: categoryObj.label } });
      } else {
        navigate('/coach-chat');
      }
    } else {
      navigate('/coach-chat');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Coach IA Personnel</h1>
        <p className="text-muted-foreground mb-6">
          Votre compagnon émotionnel intelligent qui vous aide à mieux comprendre et gérer vos émotions
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <AspectRatio ratio={4/3} className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <CoachCharacter mood="neutral" size="xl" className="mb-6 animate-float" />
                <h2 className="text-2xl font-bold mb-2">Je suis là pour vous aider</h2>
                <p className="text-muted-foreground mb-6">
                  Comment puis-je vous accompagner aujourd'hui?
                </p>
                <Button 
                  size="lg" 
                  onClick={handleStartChat}
                  className="animate-pulse-subtle"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Commencer une discussion
                </Button>
              </div>
            </AspectRatio>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Explorez des sujets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className="h-auto flex-col py-3 px-2"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      {category.icon}
                      <span className="mt-2 text-xs">{category.label}</span>
                    </Button>
                  ))}
                </div>
                {selectedCategory && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      {categories.find(c => c.id === selectedCategory)?.description}
                    </p>
                    <Button 
                      onClick={handleStartChat}
                      className="w-full"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Discuter de ce sujet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Suggestions pour vous</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-3"
                  onClick={() => {
                    sendMessage("Je me sens stressé aujourd'hui, que puis-je faire?");
                    navigate('/coach-chat');
                  }}
                >
                  <HeartPulse className="mr-2 h-4 w-4 text-rose-500" />
                  Je me sens stressé aujourd'hui, que puis-je faire?
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-3"
                  onClick={() => {
                    sendMessage("Comment améliorer ma concentration au travail?");
                    navigate('/coach-chat');
                  }}
                >
                  <Brain className="mr-2 h-4 w-4 text-blue-500" />
                  Comment améliorer ma concentration au travail?
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-3"
                  onClick={() => {
                    sendMessage("J'ai besoin d'un exercice de respiration rapide");
                    navigate('/coach-chat');
                  }}
                >
                  <Music className="mr-2 h-4 w-4 text-emerald-500" />
                  J'ai besoin d'un exercice de respiration rapide
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CCoach;
