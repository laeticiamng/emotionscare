import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mic, 
  MicOff, 
  Send, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  MessageCircle,
  Brain,
  Waves
} from 'lucide-react';
import { useRealtimeChat, RealtimeChatMessage } from '@/hooks/api/useRealtimeChat';
import { motion, AnimatePresence } from 'framer-motion';

interface RealtimeChatInterfaceProps {
  className?: string;
}

const RealtimeChatInterface: React.FC<RealtimeChatInterfaceProps> = ({ className }) => {
  const [textMessage, setTextMessage] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isConnected,
    isRecording,
    isSpeaking,
    connectionStatus,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    sendTextMessage
  } = useRealtimeChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendText = () => {
    if (textMessage.trim() && isConnected) {
      sendTextMessage(textMessage.trim());
      setTextMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connecté';
      case 'connecting': return 'Connexion...';
      case 'error': return 'Erreur';
      default: return 'Déconnecté';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Coach IA Vocal
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Connectez-vous pour commencer une conversation vocale</p>
                <p className="text-sm mt-1">Vous pouvez parler directement ou écrire</p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <div className="text-sm mb-1">
                      {message.type === 'user' ? 'Vous' : 'Coach IA'}
                    </div>
                    <div className="break-words">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Recording indicator */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-4"
              >
                <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">En cours d'enregistrement...</span>
                </div>
              </motion.div>
            )}

            {/* Speaking indicator */}
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-4"
              >
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-full">
                  <Waves className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">Coach IA parle...</span>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Connection error */}
        {connectionStatus === 'error' && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription>
              Erreur de connexion. Vérifiez votre connexion internet et réessayez.
            </AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="mt-4 space-y-3">
          {/* Connection button */}
          <div className="flex justify-center">
            {!isConnected ? (
              <Button 
                onClick={connect}
                disabled={connectionStatus === 'connecting'}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                {connectionStatus === 'connecting' ? 'Connexion...' : 'Se connecter'}
              </Button>
            ) : (
              <Button 
                onClick={disconnect}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <PhoneOff className="h-4 w-4" />
                Déconnecter
              </Button>
            )}
          </div>

          {/* Voice controls */}
          {isConnected && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isRecording ? "destructive" : "secondary"}
                size="sm"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className="flex items-center gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Relâcher pour arrêter
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Maintenir pour parler
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className="flex items-center gap-2"
              >
                {isAudioEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          {/* Text input */}
          {isConnected && (
            <div className="flex gap-2">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                disabled={!isConnected}
                className="flex-1"
              />
              <Button 
                onClick={handleSendText}
                disabled={!textMessage.trim() || !isConnected}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default RealtimeChatInterface;