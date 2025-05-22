
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, ArrowRight, PlusCircle } from 'lucide-react';

const Coach: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coach personnel</h1>
          <p className="text-muted-foreground">
            Votre guide pour le bien-être émotionnel au quotidien
          </p>
        </div>
        <Button>
          <MessageCircle className="h-4 w-4 mr-2" /> Nouvelle conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre coach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/coach-avatar.jpg" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg">Sophie</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Coach en bien-être émotionnel
                </p>
                <Button variant="outline" className="w-full">
                  Modifier les préférences
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conversations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Gérer mon stress au travail",
                  "Routine pour mieux dormir",
                  "Exercices de méditation"
                ].map((title, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{title}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                
                <Button variant="ghost" className="w-full mt-2">
                  <PlusCircle className="h-4 w-4 mr-2" /> Nouvelle discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="flex-grow space-y-4 mb-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="/coach-avatar.jpg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/50 p-3 rounded-lg max-w-[80%]">
                    <p>Bonjour ! Comment puis-je vous aider aujourd'hui avec votre bien-être émotionnel ?</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary/20 p-3 rounded-lg max-w-[80%]">
                    <p>J'aimerais des conseils pour gérer mon stress au travail.</p>
                  </div>
                  <Avatar>
                    <AvatarImage src="/avatar-placeholder.jpg" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="/coach-avatar.jpg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/50 p-3 rounded-lg max-w-[80%]">
                    <p>
                      Je comprends, le stress au travail peut être difficile à gérer. Voici quelques suggestions :
                    </p>
                    <ul className="list-disc pl-4 mt-2">
                      <li>Pratiquez des exercices de respiration profonde pendant 5 minutes</li>
                      <li>Planifiez des pauses régulières dans votre journée</li>
                      <li>Identifiez vos déclencheurs de stress pour mieux les anticiper</li>
                    </ul>
                    <p className="mt-2">
                      Souhaitez-vous que je vous guide à travers un exercice de respiration maintenant ?
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tapez votre message..."
                  className="flex-grow rounded-md border p-2"
                />
                <Button>Envoyer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Coach;
