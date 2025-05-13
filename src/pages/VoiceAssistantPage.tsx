
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, MessageCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { useVoiceAssistant } from '@/hooks/ai/useVoiceAssistant';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Array<{
    text: string;
    type: 'user' | 'assistant';
    action?: string;
  }>>([
    { text: "Bonjour ! Je suis votre assistant vocal. Comment puis-je vous aider aujourd'hui ?", type: 'assistant' }
  ]);
  
  const { 
    isListening,
    isProcessing,
    transcript,
    lastAction,
    startListening,
    stopListening 
  } = useVoiceAssistant({
    onActionDetected: (action, params) => {
      // Ajouter la commande à l'historique
      setHistory(prev => [
        ...prev, 
        { text: transcript, type: 'user' },
        { text: lastAction?.responseMessage || "J'ai bien compris.", type: 'assistant', action }
      ]);
    }
  });
  
  const exampleCommands = [
    { text: "Ouvre mon journal", action: "open_journal" },
    { text: "Lance une méditation", action: "start_meditation" },
    { text: "Joue de la musique relaxante", action: "play_music" },
    { text: "Démarre un scan émotionnel", action: "scan_emotion" },
    { text: "Je veux parler au coach", action: "coach_chat" },
    { text: "Montre mon tableau de bord", action: "show_dashboard" }
  ];
  
  const handleExampleCommand = (command: string) => {
    setHistory(prev => [
      ...prev,
      { text: command, type: 'user' },
      { text: "Commande exemple activée.", type: 'assistant' }
    ]);
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Assistant Vocal</h1>
        <p className="text-muted-foreground mt-2">
          Naviguez dans l'application par commandes vocales
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Vos échanges avec l'assistant</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <ScrollArea className="h-[300px]">
                {history.map((item, i) => (
                  <div 
                    key={i}
                    className={`mb-4 flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`px-3 py-2 rounded-lg max-w-[80%] ${
                        item.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p>{item.text}</p>
                      {item.action && (
                        <Badge variant="outline" className="mt-1">
                          {item.action}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="px-3 py-2 rounded-lg bg-muted">
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              <Button
                className={`w-full ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                size="lg"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <span className="mr-2">Analyse en cours...</span>
                    <span className="animate-spin">⟳</span>
                  </span>
                ) : isListening ? (
                  <span className="flex items-center">
                    <Mic className="mr-2 h-4 w-4" />
                    J'écoute... Cliquez pour arrêter
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Mic className="mr-2 h-4 w-4" />
                    Cliquez pour parler
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Commandes disponibles</CardTitle>
              <CardDescription>Exemples de ce que vous pouvez dire</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                {exampleCommands.map((command, idx) => (
                  <Button 
                    key={idx}
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => handleExampleCommand(command.text)}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    {command.text}
                  </Button>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex-col items-start">
              <p className="text-sm text-muted-foreground mb-2">
                Vous pouvez également:
              </p>
              <div className="space-y-1 w-full">
                <div className="flex items-center">
                  <MessageCircle className="mr-2 h-3 w-3" />
                  <span className="text-xs">Demander de l'aide au coach</span>
                </div>
                <div className="flex items-center">
                  <HelpCircle className="mr-2 h-3 w-3" />
                  <span className="text-xs">Demander des conseils spécifiques</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;
