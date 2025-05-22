
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, ThumbsUp, ThumbsDown, Calendar, Clock, Smile, Music, MessagesSquare, Sparkles } from 'lucide-react';

const Coach: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'coach',
      content: "Bonjour ! Je suis votre coach bien-être personnel. Comment puis-je vous aider aujourd'hui ?",
      time: '09:30'
    }
  ]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Ajouter le message de l'utilisateur
    setChatHistory([
      ...chatHistory,
      {
        sender: 'user',
        content: message,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    ]);
    
    // Simuler une réponse du coach après un délai
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'coach',
          content: "Merci pour votre message. Je comprends ce que vous ressentez. Avez-vous essayé les techniques de respiration que nous avons discutées lors de notre dernière session ?",
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
      ]);
    }, 1000);
    
    setMessage('');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Coach Personnel</h1>
            <Button variant="outline">Prendre rendez-vous</Button>
          </div>
          
          <Card className="h-[calc(100vh-220px)] flex flex-col">
            <CardHeader className="px-4 py-3 border-b flex flex-row items-center space-y-0">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/coach-avatar.png" />
                  <AvatarFallback className="bg-primary/20 text-primary">CP</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">Coach Patricia</p>
                  <p className="text-xs text-muted-foreground">En ligne maintenant</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-auto p-4 space-y-4">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            
            <CardFooter className="p-3 border-t">
              <div className="relative w-full flex items-center">
                <Input
                  placeholder="Écrivez votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-14"
                />
                <Button 
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prochaines Sessions</CardTitle>
              <CardDescription>Sessions planifiées avec votre coach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 border-b pb-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Session de bien-être</p>
                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Demain</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-1 mt-0.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>15:00 - 16:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir toutes les sessions
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
              <CardDescription>Suggestions personnalisées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>Humeur</Badge>
                    <Badge variant="outline">Méditation</Badge>
                  </div>
                  <p className="text-sm font-medium">Journal des émotions</p>
                  <p className="text-xs text-muted-foreground mt-1">Suivre vos émotions peut aider à gérer l'anxiété</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Smile className="h-3.5 w-3.5" /> Essayer
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground flex items-center">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground flex items-center">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>Relaxation</Badge>
                    <Badge variant="outline">Musique</Badge>
                  </div>
                  <p className="text-sm font-medium">Playlist "Calme intérieur"</p>
                  <p className="text-xs text-muted-foreground mt-1">Sons apaisants pour réduire le stress</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Music className="h-3.5 w-3.5" /> Écouter
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground flex items-center">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground flex items-center">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle>Réflexion du jour</CardTitle>
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="italic text-muted-foreground">
                "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il découle de vos propres actions."
              </p>
              <p className="text-sm mt-2">Dalai Lama</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="text-primary w-full">
                <MessagesSquare className="h-4 w-4 mr-2" /> Discuter avec le coach
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Coach;
