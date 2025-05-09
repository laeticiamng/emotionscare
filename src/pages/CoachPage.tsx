
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCoach } from '@/hooks/coach/useCoach';
import { ArrowRight, MessageSquare, ScrollText, Zap } from 'lucide-react';

const CoachPage = () => {
  const navigate = useNavigate();
  const [isAILoading, setIsAILoading] = useState(true);
  const { recommendations, generateRecommendation } = useCoach();
  
  useEffect(() => {
    // Initialize coach AI on component mount
    const initializeCoach = async () => {
      setIsAILoading(true);
      try {
        // Generate initial recommendation
        await generateRecommendation();
      } catch (error) {
        console.error('Error initializing coach:', error);
      } finally {
        setIsAILoading(false);
      }
    };
    
    initializeCoach();
  }, [generateRecommendation]);
  
  const handleStartChat = () => {
    navigate('/coach/chat');
  };
  
  const handleAskQuestion = (question: string) => {
    navigate('/coach/chat', { state: { initialQuestion: question } });
  };
  
  // Predefined questions for quick access
  const quickQuestions = [
    "Comment puis-je gérer mon stress au travail ?",
    "Donnez-moi un exercice rapide de respiration.",
    "Quelles activités pourraient m'aider à me détendre ?",
    "Comment améliorer ma concentration ?"
  ];
  
  return (
    <ProtectedLayoutWrapper>
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Coach IA</h1>
          <p className="text-muted-foreground">Votre assistant personnel pour votre bien-être émotionnel</p>
        </header>
        
        {/* Main coach interface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Chat access */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Assistant Personnel</h2>
                    <p className="mb-6 text-muted-foreground">
                      Posez des questions, obtenez des conseils personnalisés et des recommandations pour améliorer votre bien-être au quotidien.
                    </p>
                    
                    {/* Quick question buttons */}
                    <div className="space-y-3 my-6">
                      <h3 className="text-sm font-medium text-muted-foreground">Questions rapides</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quickQuestions.map((question, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            className="justify-start text-left h-auto py-3"
                            onClick={() => handleAskQuestion(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button className="mt-4" onClick={handleStartChat}>
                    Démarrer une conversation <MessageSquare className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Recommendations and modules */}
          <div className="space-y-6">
            {/* Recommendation card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recommandation du jour</h3>
                {isAILoading ? (
                  <p>Chargement des recommandations...</p>
                ) : (
                  <>
                    <p className="text-sm mb-4">
                      {recommendations[0] || "Prenez quelques minutes pour vous aujourd'hui et pratiquez la respiration profonde."}
                    </p>
                    <Button variant="link" className="p-0" onClick={() => navigate('/coach/recommendations')}>
                      Voir toutes les recommandations <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Quick access modules */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Modules Coach</h3>
                
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/journal/new')}
                  >
                    <ScrollText className="mr-2 h-4 w-4" />
                    Journal émotionnel
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/vr/sessions')}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Sessions de relaxation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayoutWrapper>
  );
};

export default CoachPage;
