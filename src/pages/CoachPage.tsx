
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedLayoutWrapper from '@/components/ProtectedLayoutWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCoach } from '@/hooks/coach/useCoach';
import { ArrowRight, MessageSquare, ScrollText, Zap, Book, Music, Calendar } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CoachPresence from '@/components/coach/CoachPresence';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

// Create a client specifically for this page to ensure it's available
const pageQueryClient = new QueryClient();

const CoachPageContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Extract first name from user display name or email
  const firstName = React.useMemo(() => {
    if (!user) return '';
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return '';
  }, [user]);
  
  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Radial blur at the top of the page */}
      <div className="relative">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] opacity-50 pointer-events-none" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="my-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Coach IA Personnel</h1>
          <p className="text-muted-foreground">
            Votre compagnon pour une expérience émotionnelle enrichie et guidée
          </p>
        </div>
        
        {/* Enhanced Coach Presence */}
        <Card className="border shadow-lg mb-12">
          <CardContent className="p-0 overflow-hidden">
            <CoachPresence className="min-h-[400px]" />
          </CardContent>
        </Card>
        
        {/* Main grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Activity module cards */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Conversations récentes
                </h2>
                <div className="space-y-4">
                  <div className="bg-muted/40 p-4 rounded-lg">
                    <p className="italic text-sm text-muted-foreground">
                      "Vos conversations avec votre Coach IA apparaîtront ici."
                    </p>
                  </div>
                  <Button onClick={() => navigate('/coach-chat')} className="w-full">
                    Commencer une nouvelle conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Book className="mr-2 h-5 w-5 text-primary" />
                  Journal émotionnel
                </h2>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Exprimez vos émotions, réflexions et expériences pour favoriser la conscience de soi.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/journal/new')}>
                    Créer une nouvelle entrée
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Music className="mr-2 h-5 w-5 text-primary" />
                  Musique thérapeutique
                </h2>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Découvrez des compositions musicales adaptées à votre état émotionnel.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => navigate('/music')}>
                      Explorer les playlists
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => navigate('/music/create')}>
                      Créer une musique
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Recommendation card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-primary" />
                  Recommandation du jour
                </h3>
                <div>
                  {isAILoading ? (
                    <p className="text-sm text-muted-foreground">Chargement des recommandations...</p>
                  ) : (
                    <>
                      <div className="bg-muted/30 p-4 rounded-lg mb-4">
                        <p className="text-sm">
                          {recommendations[0] || "Prenez quelques minutes pour vous aujourd'hui et pratiquez la respiration profonde."}
                        </p>
                      </div>
                      <Button variant="link" className="p-0" onClick={() => navigate('/coach/recommendations')}>
                        Voir toutes les recommandations <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick questions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Questions rapides
                </h3>
                <div className="space-y-3">
                  {quickQuestions.map((question, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleAskQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming events reminder */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Prochain rendez-vous
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm font-medium">Bilan émotionnel hebdomadaire</p>
                  <p className="text-xs text-muted-foreground">Dans 3 jours</p>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Voir votre calendrier
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CoachPage = () => {
  return (
    <QueryClientProvider client={pageQueryClient}>
      <ProtectedLayoutWrapper>
        <CoachPageContent />
      </ProtectedLayoutWrapper>
    </QueryClientProvider>
  );
};

export default CoachPage;
