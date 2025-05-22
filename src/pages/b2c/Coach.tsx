
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, User, Bot } from 'lucide-react';

const B2CCoachPage: React.FC = () => {
  const [message, setMessage] = useState('');
  
  // Exemple de conversation préchargée
  const [conversation, setConversation] = useState([
    { 
      id: 1, 
      text: "Bonjour! Je suis votre coach IA personnel. Comment puis-je vous aider aujourd'hui?", 
      sender: 'bot' 
    },
    { 
      id: 2, 
      text: "J'ai eu une journée difficile et je me sens un peu stressé.", 
      sender: 'user' 
    },
    { 
      id: 3, 
      text: "Je suis désolé d'entendre que vous avez eu une journée difficile. Parlez-moi un peu plus de ce qui vous a stressé aujourd'hui.", 
      sender: 'bot' 
    }
  ]);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      // Ajouter le message de l'utilisateur
      setConversation([...conversation, { 
        id: conversation.length + 1, 
        text: message, 
        sender: 'user' 
      }]);
      
      // Simuler une réponse du coach IA
      setTimeout(() => {
        setConversation(prev => [...prev, { 
          id: prev.length + 1, 
          text: "Je comprends comment vous vous sentez. Respirons profondément ensemble et essayons d'analyser la situation étape par étape.", 
          sender: 'bot' 
        }]);
      }, 1000);
      
      setMessage('');
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Votre Coach Émotionnel</h1>
        <p className="text-muted-foreground mt-2">
          Discutez avec votre coach IA personnalisé pour vous aider à gérer vos émotions.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle>Conversation avec votre Coach</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {conversation.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {msg.sender === 'user' ? 
                          <User className="h-4 w-4" /> : 
                          <Bot className="h-4 w-4" />
                        }
                      </div>
                      <div className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="border-t p-4">
              <div className="flex w-full gap-2">
                <Input 
                  value={message} 
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Envoyer</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Séances précédentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  { date: '20 mai 2025', title: 'Gestion du stress' },
                  { date: '15 mai 2025', title: 'Confiance en soi' },
                  { date: '10 mai 2025', title: 'Communication efficace' }
                ].map((session, index) => (
                  <li key={index} className="p-2 border-b last:border-0">
                    <p className="font-medium">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{session.date}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sujets recommandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  'Anxiété', 'Dépression', 'Sommeil', 'Stress au travail', 
                  'Relations', 'Confiance en soi', 'Habitudes saines'
                ].map((topic, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CCoachPage;
