
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Brain, Clock, CalendarCheck, Lightbulb } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import CoachCharacter from '@/components/coach/CoachCharacter';
import { useCoach } from '@/contexts/CoachContext';

const B2BUserCoach: React.FC = () => {
  const navigate = useNavigate();
  const { sendMessage } = useCoach();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'productivity', label: 'Productivité', icon: <Brain className="h-5 w-5" />, description: 'Conseils pour améliorer votre efficacité et votre focus' },
    { id: 'balance', label: 'Équilibre', icon: <Clock className="h-5 w-5" />, description: 'Mieux équilibrer vie professionnelle et personnelle' },
    { id: 'goals', label: 'Objectifs', icon: <CalendarCheck className="h-5 w-5" />, description: 'Définir et atteindre vos objectifs professionnels' },
    { id: 'creativity', label: 'Créativité', icon: <Lightbulb className="h-5 w-5" />, description: 'Stimuler votre créativité et innovation' },
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleStartChat = () => {
    if (selectedCategory) {
      const categoryObj = categories.find(cat => cat.id === selectedCategory);
      if (categoryObj) {
        navigate('/b2b/user/coach-chat', { state: { initialTopic: categoryObj.label } });
      } else {
        navigate('/b2b/user/coach-chat');
      }
    } else {
      navigate('/b2b/user/coach-chat');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Coach Professionnel</h1>
        <p className="text-muted-foreground mb-6">
          Votre assistant intelligent pour vous accompagner dans votre bien-être au travail
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <AspectRatio ratio={4/3} className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <CoachCharacter mood="neutral" size="xl" className="mb-6" />
                <h2 className="text-2xl font-bold mb-2">Besoin de conseils professionnels ?</h2>
                <p className="text-muted-foreground mb-6">
                  Je peux vous aider à gérer votre environnement de travail
                </p>
                <Button 
                  size="lg" 
                  onClick={handleStartChat}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Démarrer une discussion
                </Button>
              </div>
            </AspectRatio>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Thématiques professionnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
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
                <CardTitle className="text-lg">Suggestions et ressources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-3"
                  onClick={() => {
                    sendMessage("Comment gérer efficacement mon temps au travail ?");
                    navigate('/b2b/user/coach-chat');
                  }}
                >
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  Comment gérer efficacement mon temps au travail ?
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-3"
                  onClick={() => {
                    sendMessage("Je sens de la pression au travail, comment gérer cela ?");
                    navigate('/b2b/user/coach-chat');
                  }}
                >
                  <Brain className="mr-2 h-4 w-4 text-purple-500" />
                  Je sens de la pression au travail, comment gérer cela ?
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto py-3"
                  onClick={() => {
                    sendMessage("Comment mieux communiquer avec mes collègues ?");
                    navigate('/b2b/user/coach-chat');
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4 text-emerald-500" />
                  Comment mieux communiquer avec mes collègues ?
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BUserCoach;
