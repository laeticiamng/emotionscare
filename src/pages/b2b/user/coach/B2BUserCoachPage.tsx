
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Mic } from 'lucide-react';
import CoachChatInterface from '@/components/coach/CoachChatInterface';
import VoiceTranscriptionInterface from '@/components/voice/VoiceTranscriptionInterface';

const B2BUserCoachPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assistant Coach IA</h1>
          <p className="text-muted-foreground">
            Votre accompagnateur personnel pour le bien-être au travail
          </p>
        </div>
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Chat avec le coach */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat avec votre coach
            </CardTitle>
            <CardDescription>
              Posez vos questions et recevez des conseils personnalisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CoachChatInterface />
          </CardContent>
        </Card>

        {/* Assistant vocal */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Assistant vocal
            </CardTitle>
            <CardDescription>
              Exprimez-vous oralement et obtenez une transcription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceTranscriptionInterface />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserCoachPage;
