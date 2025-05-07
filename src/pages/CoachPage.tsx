
import React, { useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CoachPage = () => {
  const [userQuestion, setUserQuestion] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleStartCoaching = () => {
    if (userQuestion.trim()) {
      // Naviguer vers la page de chat avec la question initiale
      navigate('/coach-chat', { state: { initialQuestion: userQuestion } });
    } else {
      // Naviguer simplement vers la page de chat
      navigate('/coach-chat');
    }
  };
  
  const handleQuickQuestion = (question: string) => {
    navigate('/coach-chat', { state: { initialQuestion: question } });
  };
  
  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Coach IA Personnel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Posez une question à votre coach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Votre coach personnel est là pour vous aider à améliorer votre bien-être et votre équilibre émotionnel.</p>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Comment puis-je réduire mon stress au travail ?"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleStartCoaching}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Demander
                  </Button>
                </div>
                
                <Button variant="outline" className="w-full" onClick={handleStartCoaching}>
                  Démarrer une conversation
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Questions populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Comment gérer mon anxiété ?", "Techniques de respiration", "Améliorer mon sommeil"].map((question) => (
                  <Button 
                    key={question}
                    variant="ghost" 
                    className="w-full justify-start text-left" 
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations personnalisées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Recommandations basées sur votre profil émotionnel récent.</p>
              <Button onClick={() => toast({ title: "Fonctionnalité à venir", description: "Les recommandations personnalisées seront bientôt disponibles." })}>
                Voir mes recommandations
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Retrouvez l'historique de vos échanges avec le coach IA.</p>
              <Button onClick={() => navigate('/coach-chat')} variant="outline">
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
