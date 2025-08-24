
import React from 'react';
import EnhancedCoachPage from '@/pages/enhanced/EnhancedCoachPage';

const CoachPage: React.FC = () => {
  return <EnhancedCoachPage />;
};
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'coach',
      content: 'Bonjour ! Je suis votre coach IA personnel. Comment vous sentez-vous aujourd\'hui ?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const suggestions = [
    "Je me sens stressé au travail",
    "Comment améliorer mon sommeil ?",
    "J'ai besoin de motivation",
    "Exercices de respiration"
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simuler une réponse du coach
    setTimeout(() => {
      const coachResponse = {
        id: messages.length + 2,
        sender: 'coach' as const,
        content: 'Je comprends votre situation. Basé sur votre état émotionnel actuel, je vous recommande de prendre quelques minutes pour respirer profondément. Voulez-vous que je vous guide dans un exercice de relaxation ?',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, coachResponse]);
    }, 1000);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Coach IA Personnel
            </h1>
            <p className="text-xl text-gray-600">
              Votre accompagnateur bien-être disponible 24/7
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Chat principal */}
            <div className="lg:col-span-3">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 h-[600px] flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-blue-500" />
                    Conversation avec votre Coach
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-3 max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'user' 
                              ? 'bg-blue-500' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className={`p-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Input de message */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Écrivez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Suggestions rapides */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start text-sm h-auto py-3 px-3 hover:bg-blue-50"
                        onClick={() => setNewMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* État émotionnel */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Votre État</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800">Humeur</div>
                      <div className="text-xs text-green-600">Positive (85%)</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Énergie</div>
                      <div className="text-xs text-blue-600">Élevée (78%)</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm font-medium text-purple-800">Stress</div>
                      <div className="text-xs text-purple-600">Faible (22%)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/music')}
                  >
                    🎵 Musique relaxante
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/scan')}
                  >
                    🧠 Scanner émotions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/journal')}
                  >
                    📝 Écrire dans le journal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CoachPage;
