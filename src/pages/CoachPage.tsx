
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot } from 'lucide-react';

const CoachPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'bot',
      message: 'Bonjour ! Je suis votre coach virtuel. Comment puis-je vous aider aujourd\'hui ?',
      time: '10:30'
    }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: message,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: 'Je comprends votre situation. Voici quelques conseils personnalisés...',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
    
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Coach Virtuel</h1>
          </div>
          <p className="text-muted-foreground">
            Votre accompagnateur personnel pour le bien-être émotionnel
          </p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Conversation avec votre coach
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    chat.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p>{chat.message}</p>
                    <p className="text-xs opacity-70 mt-1">{chat.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Tapez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachPage;
