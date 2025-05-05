
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import CoachAssistant from '@/components/dashboard/CoachAssistant';
import CoachRecommendations from '@/components/dashboard/CoachRecommendations';
import { useAuth } from '@/contexts/AuthContext';
import { triggerCoachEvent } from '@/lib/coachService';

const CoachPage: React.FC = () => {
  const { user } = useAuth();

  // Trigger a daily reminder when the coach page is loaded
  React.useEffect(() => {
    if (user?.id) {
      // Nous utilisons setTimeout pour éviter de bloquer le rendu
      setTimeout(() => {
        triggerCoachEvent('daily_reminder', user.id);
      }, 1000);
    }
  }, [user?.id]);

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Coach IA</h1>
      
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
