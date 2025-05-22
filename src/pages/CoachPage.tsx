
import React from 'react';
import Shell from '@/Shell';
import { useCoach } from '@/contexts/coach';
import CoachChat from '@/components/coach/CoachChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoachPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Coach IA</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Coach Conversationnel</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <CoachChat 
                  initialMessage="Bonjour, je suis votre coach émotionnel. Comment puis-je vous aider aujourd'hui ?"
                  showHeader={true}
                  showControls={true}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Basées sur vos récentes conversations et émotions :
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary/10 p-1 rounded">🎵</span>
                    <span>Écoutez de la musique apaisante pour réduire le stress</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary/10 p-1 rounded">📝</span>
                    <span>Prenez 5 minutes pour noter vos pensées dans le journal</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary/10 p-1 rounded">🧘</span>
                    <span>Essayez une session VR de méditation guidée</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progression Émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Suivez votre évolution émotionnelle au fil du temps.
                </p>
                <div className="h-40 flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    Le graphique de progression s'affichera ici après quelques sessions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default CoachPage;
