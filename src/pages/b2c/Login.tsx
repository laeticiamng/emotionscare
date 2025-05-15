
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Shell from '@/Shell';
import { TimeBasedBackground } from '@/components/home/TimeBasedBackground';
import { WelcomeMessage } from '@/components/home/WelcomeMessage';
import { VoiceCommandButton } from '@/components/home/voice/VoiceCommandButton';
import { AudioController } from '@/components/home/audio/AudioController';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function B2CLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Preload dashboard in the background
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/b2c/dashboard';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate login process for the demo with a simple test account
      if (email === 'utilisateur@exemple.fr' && password === 'admin') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace EmotionsCare",
        });
        
        // Store session
        localStorage.setItem('auth_session', 'mock_token');
        localStorage.setItem('user_role', 'b2c');
        localStorage.setItem('userMode', 'b2c');
        
        // Play haptic feedback on mobile devices
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
        
        navigate('/b2c/dashboard');
      } else {
        throw new Error("Identifiants incorrects");
      }
    } catch (error) {
      toast({
        title: "Une petite erreur",
        description: "On va y arriver ensemble. Utilisez utilisateur@exemple.fr / admin pour tester.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice command for login
  const handleVoiceLogin = (transcript: string) => {
    const loginPhrases = [
      'connexion à mon espace',
      'connecte-moi',
      'ouvrir mon compte'
    ];
    
    if (loginPhrases.some(phrase => transcript.toLowerCase().includes(phrase))) {
      if (email && password) {
        handleLogin(new Event('submit') as any);
      } else {
        toast({
          title: "Information",
          description: "Veuillez d'abord saisir vos identifiants",
        });
      }
    }
  };

  return (
    <Shell>
      <TimeBasedBackground>
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <VoiceCommandButton 
            onTranscript={handleVoiceLogin} 
            commands={{
              'connexion vocale': () => {
                if (email && password) handleLogin(new Event('submit') as any);
                else toast({ title: "Veuillez entrer vos identifiants" });
              }
            }}
            variant="ghost"
          />
          <AudioController minimal autoplay={true} initialVolume={0.2} />
        </div>
        
        <motion.div 
          className="flex items-center justify-center min-h-[80vh] p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="w-full max-w-md backdrop-blur-md bg-background/80 shadow-xl">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <CardTitle className="text-2xl">Connexion Particulier</CardTitle>
                <CardDescription>
                  <WelcomeMessage className="mt-2" />
                </CardDescription>
              </motion.div>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/60"
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Mot de passe oublié?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-background/60"
                    />
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                      </span>
                    </Button>
                  </div>
                </motion.div>
                <div className="text-sm text-muted-foreground">
                  <p>Pour tester la connexion:</p>
                  <p>utilisateur@exemple.fr / admin</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <motion.div 
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </motion.div>
                <motion.div 
                  className="text-sm text-center mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                >
                  Pas encore de compte?{' '}
                  <Link to="/b2c/register" className="text-primary hover:underline">
                    S'inscrire
                  </Link>
                </motion.div>
                <motion.div 
                  className="text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                >
                  <Link to="/" className="text-muted-foreground hover:underline">
                    Retour à l'accueil
                  </Link>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </TimeBasedBackground>
    </Shell>
  );
}
