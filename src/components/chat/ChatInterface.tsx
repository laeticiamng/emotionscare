
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, Play, PlayCircle, Music, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/hooks/useChat';

type CommandButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
};

const CommandButton = ({ label, icon, onClick, variant = 'outline' }: CommandButtonProps) => (
  <Button 
    variant={variant} 
    className="flex items-center gap-2" 
    onClick={onClick}
  >
    {icon}
    {label}
  </Button>
);

interface ChatInterfaceProps {
  className?: string;
  standalone?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className, standalone = true }) => {
  const { messages, isLoading, addUserMessage, addBotMessage, processMessage, sessionId } = useChat();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const { loadPlaylistForEmotion, openDrawer } = useMusic();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Effet pour l'animation de typing
  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => {
        setTyping(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [typing]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    // Add user message
    addUserMessage(input);
    const userInput = input;
    setInput('');

    // Afficher l'animation de typing
    setTyping(true);

    try {
      // Process the message with OpenAI GPT-4
      const { response, intent } = await processMessage(userInput);
      addBotMessage(response);

      // Handle specific intents
      if (intent === 'vr_session') {
        // We don't trigger navigation automatically, buttons will appear
      } else if (intent === 'music_playlist') {
        // We don't load music automatically, buttons will appear
      }
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors du traitement de votre message.",
        variant: "destructive"
      });
    }
  };

  const handleStartVRSession = () => {
    toast({
      title: "Session VR",
      description: "Redirection vers l'espace VR...",
    });
    navigate('/vr-session');
  };

  const handleLoadMusic = (emotion: string) => {
    loadPlaylistForEmotion(emotion);
    openDrawer();
    addBotMessage(`J'ai lancé la playlist "${emotion}" pour vous. Bonne écoute !`);
    toast({
      title: "Musique",
      description: `Playlist d'ambiance "${emotion}" chargée`,
    });
  };

  const renderContent = () => (
    <>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className={standalone ? "h-[350px] p-4" : "h-[400px] p-4"}>
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                </div>
              </div>
            ))}
            
            {/* Indicateur "en train d'écrire..." */}
            {typing && (
              <div className="flex gap-2 justify-start">
                <div className="rounded-lg p-3 bg-muted text-foreground max-w-[80%]">
                  <div className="loading-dots">
                    <div className="bg-foreground/70"></div>
                    <div className="bg-foreground/70"></div>
                    <div className="bg-foreground/70"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />

            {/* Command buttons that appear after certain bot responses */}
            {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && 
             messages[messages.length - 1].text.toLowerCase().includes("session vr") && (
              <div className="flex gap-2 mt-2 justify-center">
                <CommandButton 
                  label="Lancer une session VR" 
                  icon={<PlayCircle className="h-4 w-4" />} 
                  onClick={handleStartVRSession}
                  variant="default"
                />
              </div>
            )}

            {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && 
             messages[messages.length - 1].text.toLowerCase().includes("playlist") && (
              <div className="flex gap-2 mt-2 flex-wrap justify-center">
                <CommandButton 
                  label="Calme" 
                  icon={<Music className="h-4 w-4" />} 
                  onClick={() => handleLoadMusic('calm')}
                />
                <CommandButton 
                  label="Énergique" 
                  icon={<Music className="h-4 w-4" />} 
                  onClick={() => handleLoadMusic('energetic')}
                />
                <CommandButton 
                  label="Joyeuse" 
                  icon={<Music className="h-4 w-4" />} 
                  onClick={() => handleLoadMusic('happy')}
                />
                <CommandButton 
                  label="Focalisée" 
                  icon={<Music className="h-4 w-4" />} 
                  onClick={() => handleLoadMusic('focus')}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-3">
        <form 
          className="flex gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            placeholder="Écrivez un message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isLoading || typing}
          />
          <Button type="submit" size="icon" variant="default" disabled={isLoading || typing}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </>
  );

  // For standalone use (in its own card)
  if (standalone) {
    return (
      <Card className={`w-full flex flex-col ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Assistant EmotionsCare
            <span className="text-xs text-muted-foreground ml-auto">
              Session: {sessionId.substring(0, 8)}
            </span>
          </CardTitle>
        </CardHeader>
        {renderContent()}
      </Card>
    );
  }
  
  // For embedded use (inside another component)
  return <div className={`flex flex-col h-full ${className}`}>{renderContent()}</div>;
};
