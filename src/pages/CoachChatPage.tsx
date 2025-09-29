import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ChatMessage {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

const CoachChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'coach',
      content: 'Bonjour ! Je suis votre coach IA personnel. Comment vous sentez-vous aujourd\'hui ?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulation de la réponse du coach
    setTimeout(() => {
      const coachResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: generateCoachResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, coachResponse]);
    }, 1500);
  };

  const generateCoachResponse = (userInput: string): string => {
    const responses = [
      "Je comprends ce que vous ressentez. Avez-vous essayé les exercices de respiration que nous avons vus ensemble ?",
      "C'est tout à fait naturel de ressentir cela. Parlons de stratégies pour gérer ces émotions.",
      "Merci de partager cela avec moi. Comment puis-je vous accompagner aujourd'hui ?",
      "Vos progrès sont remarquables. Continuons à explorer ces sentiments ensemble.",
      "Je suggère d'essayer une session de méditation guidée. Voulez-vous que je vous propose quelque chose ?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Ici, intégrer la reconnaissance vocale
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
    // Ici, intégrer la synthèse vocale
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Coach IA</h1>
              <p className="text-sm text-muted-foreground">Votre accompagnateur personnel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSpeech}
              className={isSpeaking ? 'bg-green-100 text-green-700' : ''}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4 mb-20">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-[80%] p-4 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border-2'
                }`}>
                  <div className="flex items-start gap-3">
                    {message.type === 'coach' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        🧠
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 opacity-70 ${
                        message.type === 'user' ? 'text-white' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRecording}
              className={isRecording ? 'bg-red-100 text-red-700 animate-pulse' : ''}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1 flex items-center gap-2">
              <Input
                placeholder="Tapez votre message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachChatPage;