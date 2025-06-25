
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, ArrowLeft, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoachPage: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([
    {
      type: 'bot',
      content: 'Bonjour ! Je suis votre coach virtuel. Comment puis-je vous aider aujourd\'hui ?'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, 
        { type: 'user', content: message },
        { type: 'bot', content: 'Merci pour votre message. Je comprends vos préoccupations et je suis là pour vous accompagner.' }
      ]);
      setMessage('');
    }
  };

  const quickQuestions = [
    "Comment gérer le stress ?",
    "Techniques de respiration",
    "Améliorer mon sommeil",
    "Gérer mes émotions"
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/b2c/dashboard')}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              Coach Virtuel
            </h1>
            <p className="text-gray-600 mt-2">Assistance personnalisée disponible 24h/24</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions Rapides</CardTitle>
              <CardDescription>
                Cliquez sur une question pour commencer la conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    onClick={() => setMessage(question)}
                    className="text-left justify-start"
                  >
                    {question}
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

export default CoachPage;
