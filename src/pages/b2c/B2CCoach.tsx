
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bot } from 'lucide-react';

const B2CCoach: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coach IA</h1>
        <p className="text-muted-foreground">
          Votre accompagnateur personnel pour le bien-être émotionnel
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle>Conversation avec le coach</CardTitle>
            </div>
            <CardDescription>
              Discutez avec votre coach IA personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Bot className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="text-lg font-semibold mb-4">Bonjour !</h3>
              <p className="text-muted-foreground mb-6">
                Je suis votre coach IA. Comment puis-je vous aider aujourd'hui ?
              </p>
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Commencer la conversation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CCoach;
