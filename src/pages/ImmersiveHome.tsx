
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/hooks/use-theme';
// Import as a named export instead of default export
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [backgroundTrack, setBackgroundTrack] = useState<HTMLAudioElement | null>(null);

  // Use the voice commands hook with named export
  const { 
    isListening, 
    startListening, 
    stopListening, 
    transcript,
    supported 
  } = useVoiceCommands({
    commands: {
      'je suis un particulier': () => navigate('/b2c/login'),
      'je suis une entreprise': () => navigate('/b2b/selection'),
    },
    onError: (error) => {
      toast({
        title: 'Erreur de reconnaissance vocale',
        description: error,
        variant: 'destructive'
      });
    }
  });

  // Toggle audio playback
  const toggleAudio = () => {
    if (!backgroundTrack) {
      const audio = new Audio('/sounds/ambient-calm.mp3');
      audio.loop = true;
      setBackgroundTrack(audio);
      audio.play().catch(() => {
        toast({
          title: "Impossible de lire l'audio",
          description: "Veuillez activer l'autoplay dans votre navigateur ou cliquer à nouveau pour réessayer.",
          variant: "destructive"
        });
      });
      setAudioEnabled(true);
    } else {
      if (audioEnabled) {
        backgroundTrack.pause();
      } else {
        backgroundTrack.play().catch(console.error);
      }
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      backgroundTrack?.pause();
      backgroundTrack?.remove();
    };
  }, [backgroundTrack]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/20 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 -top-1/4 -left-1/4 blur-3xl animate-blob"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 -bottom-1/4 -right-1/4 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-accent/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-xl px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter mb-6 animate-fade-in">
          EmotionsCare
        </h1>
        <p className="text-xl text-muted-foreground mb-12 animate-fade-in animation-delay-300">
          Bienvenue dans votre espace de bien-être émotionnel
        </p>

        <div className="grid gap-6 animate-fade-in animation-delay-500">
          <Button 
            size="lg" 
            className="h-16 text-lg font-medium transition-all hover:scale-105"
            onClick={() => navigate('/b2c/login')}
          >
            Je suis un particulier
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="h-16 text-lg font-medium transition-all hover:scale-105"
            onClick={() => navigate('/b2b/selection')}
          >
            Je suis une entreprise
          </Button>
        </div>

        <div className="mt-16 flex justify-center space-x-4 animate-fade-in animation-delay-800">
          {supported && (
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isListening ? 'bg-primary text-primary-foreground animate-pulse' : ''}`}
              onClick={isListening ? stopListening : startListening}
              title="Commandes vocales"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleAudio}
            title={audioEnabled ? "Désactiver la musique" : "Activer la musique"}
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={toggleTheme}
            title={theme === 'dark' ? "Mode clair" : "Mode sombre"}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {transcript && (
          <div className="mt-8 text-sm text-muted-foreground animate-fade-in">
            Vous avez dit : "{transcript}"
          </div>
        )}

        <p className="mt-12 text-sm text-muted-foreground animate-fade-in animation-delay-1000">
          Vous êtes au bon endroit pour prendre soin de vos émotions
        </p>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 30s infinite alternate;
        }
        .animation-delay-2000 {
          animation-delay: -2s;
        }
        .animation-delay-4000 {
          animation-delay: -4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default ImmersiveHome;
