
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

const CoachPage: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'coach',
      content: 'Bonjour ! Je suis votre coach IA personnel. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulation d'une réponse du coach
    setTimeout(() => {
      const coachResponse = {
        id: messages.length + 2,
        sender: 'coach',
        content: 'Je comprends ce que vous ressentez. Voici quelques suggestions personnalisées pour vous aider...',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, coachResponse]);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Coach IA Personnel</h1>
        <p className="text-muted-foreground">
          Votre accompagnateur virtuel pour le bien-être émotionnel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversation avec votre coach
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className="flex-shrink-0">
                        {message.sender === 'coach' ? (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 p-2 border rounded-md"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggestions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setInputMessage("Je me sens stressé aujourd'hui")}
              >
                "Je me sens stressé aujourd'hui"
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setInputMessage("Comment améliorer mon sommeil ?")}
              >
                "Comment améliorer mon sommeil ?"
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setInputMessage("J'ai du mal à me concentrer")}
              >
                "J'ai du mal à me concentrer"
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Votre progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Sessions cette semaine</span>
                  <span className="font-semibold">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Objectifs atteints</span>
                  <span className="font-semibold">3/4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Humeur moyenne</span>
                  <span className="font-semibold">8/10</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
