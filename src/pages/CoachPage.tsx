
import React, { useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Brain, Music, RefreshCw, History, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useActivity } from '@/hooks/useActivity';
import { useAuth } from '@/contexts/AuthContext';
import CoachNavigation from '@/components/coach/CoachNavigation';
import StatusIndicator from '@/components/ui/status/StatusIndicator';

const CoachPage = () => {
  const [userQuestion, setUserQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logActivity } = useActivity();
  const { user, isAuthenticated } = useAuth();
  
  const handleStartCoaching = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (!isAuthenticated) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour utiliser le coach IA.",
          variant: "destructive"
        });
        navigate('/login', { state: { from: '/coach' } });
        return;
      }
      
      if (userQuestion.trim()) {
        // Log d'activité 
        logActivity('coach_start', { withQuestion: true, question: userQuestion });
        // Naviguer vers la page de chat avec la question initiale
        navigate('/coach-chat', { state: { initialQuestion: userQuestion } });
      } else {
        // Log d'activité
        logActivity('coach_start', { withQuestion: false });
        // Naviguer simplement vers la page de chat
        navigate('/coach-chat');
      }
    } catch (error) {
      console.error('Erreur lors du démarrage du coaching:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la session de coaching",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleQuickQuestion = (question: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (!isAuthenticated) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour utiliser le coach IA.",
          variant: "destructive"
        });
        navigate('/login', { state: { from: '/coach' } });
        return;
      }
      
      // Log d'activité
      logActivity('coach_quick_question', { question });
      navigate('/coach-chat', { state: { initialQuestion: question } });
    } catch (error) {
      console.error('Erreur lors du traitement de la question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Navigation */}
        <CoachNavigation showBackButton={false} />
        
        {/* Loading indicator if needed */}
        {isSubmitting && (
          <StatusIndicator 
            type="loading" 
            position="fixed" 
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Posez une question à votre coach
              </CardTitle>
              <CardDescription>
                Votre coach personnel est là pour vous aider à améliorer votre bien-être et votre équilibre émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Comment puis-je réduire mon stress au travail ?"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    className="flex-1"
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSubmitting) handleStartCoaching();
                    }}
                  />
                  <Button 
                    onClick={handleStartCoaching}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <MessageCircle className="mr-2 h-4 w-4" />
                    )}
                    Demander
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 hover:bg-primary/10" 
                  onClick={handleStartCoaching}
                  disabled={isSubmitting}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Démarrer une conversation</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Questions populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Comment gérer mon anxiété ?", 
                  "Techniques de respiration", 
                  "Améliorer mon sommeil", 
                  "Exercices anti-stress"
                ].map((question) => (
                  <Button 
                    key={question}
                    variant="ghost" 
                    className="w-full justify-start text-left hover:bg-primary/10 transition-colors" 
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isSubmitting}
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-70" />
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Recommandations personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Recommandations basées sur votre profil émotionnel récent.</p>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    logActivity('view_recommendations');
                    navigate('/dashboard');
                  }}
                  className="flex-1"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Voir mes recommandations
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    logActivity('view_music');
                    navigate('/music');
                  }}
                >
                  <Music className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Historique des conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Retrouvez l'historique de vos échanges avec le coach IA.</p>
              <Button 
                onClick={() => {
                  logActivity('view_chat_history');
                  navigate('/coach/history');
                }} 
                variant="outline"
                className="w-full"
              >
                <History className="mr-2 h-4 w-4" />
                Voir l'historique
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default CoachPage;
