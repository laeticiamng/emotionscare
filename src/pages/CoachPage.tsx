
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, AlertCircle } from 'lucide-react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import CoachAssistant from '@/components/dashboard/CoachAssistant';
import CoachRecommendations from '@/components/dashboard/CoachRecommendations';
import { useAuth } from '@/contexts/AuthContext';
import { triggerCoachEvent } from '@/lib/coachService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const CoachPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiReady, setApiReady] = useState(true);

  // Vérifier la connexion API lors du chargement
  useEffect(() => {
    if (user?.id) {
      // Vérifier la connexion à l'API OpenAI
      const checkAPIConnection = async () => {
        try {
          // Appel à la fonction Edge Supabase pour tester la connexion
          const { data, error } = await fetch('/api/check-api-connection').then(res => res.json());
          
          if (error || !data?.connected) {
            setApiReady(false);
            toast({
              title: "Problème de connexion API",
              description: "La connexion à l'API OpenAI n'est pas disponible actuellement.",
              variant: "destructive"
            });
          } else {
            setApiReady(true);
          }
        } catch (error) {
          console.error('Error checking API connection:', error);
          setApiReady(false);
        }
      };
      
      // Nous utilisons setTimeout pour éviter de bloquer le rendu
      setTimeout(() => {
        triggerCoachEvent('daily_reminder', user.id);
      }, 1000);
    }
  }, [user?.id, toast]);

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Coach IA</h1>
      
      {!apiReady && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            La connexion à l'API OpenAI rencontre des difficultés. Certaines fonctionnalités peuvent être limitées.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chat Area */}
        <div className="col-span-1 lg:col-span-8">
          <Card className="flex flex-col bg-gradient-to-br from-cocoon-50 to-white border-cocoon-100 h-[600px]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-cocoon-600" />
                Votre Coach Personnel
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pb-6 flex-grow">
              <ChatInterface standalone={true} />
            </CardContent>
          </Card>
        </div>
        
        {/* Side Panel */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          <CoachRecommendations />
          
          <Card className="bg-white p-4 border border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Comment puis-je vous aider ?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="p-2 bg-muted/30 rounded-md hover:bg-muted/50 cursor-pointer">
                  "Comment gérer mon stress au travail ?"
                </li>
                <li className="p-2 bg-muted/30 rounded-md hover:bg-muted/50 cursor-pointer">
                  "Techniques pour améliorer ma concentration"
                </li>
                <li className="p-2 bg-muted/30 rounded-md hover:bg-muted/50 cursor-pointer">
                  "Conseils pour mieux dormir"
                </li>
                <li className="p-2 bg-muted/30 rounded-md hover:bg-muted/50 cursor-pointer">
                  "Comment communiquer efficacement avec mon équipe ?"
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
