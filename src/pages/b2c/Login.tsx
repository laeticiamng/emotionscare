
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
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function B2CLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Preload dashboard in the background for faster transition
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-900/20">
        <motion.div 
          className="flex items-center justify-center min-h-[80vh] w-full max-w-md p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="w-full backdrop-blur-md bg-white/80 shadow-xl border-blue-100 dark:border-blue-900/30 dark:bg-slate-900/70">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">Connexion Particulier</CardTitle>
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
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/60 dark:bg-slate-800/60 border-blue-100 dark:border-blue-900/30 focus:border-blue-300"
                      required
                    />
                  </div>
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Mot de passe oublié?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-white/60 dark:bg-slate-800/60 border-blue-100 dark:border-blue-900/30 focus:border-blue-300"
                      required
                    />
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-blue-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                      </span>
                    </Button>
                  </div>
                </motion.div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70 bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-md">
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
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700"
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
                  <Link to="/b2c/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                    S'inscrire
                  </Link>
                </motion.div>
                <motion.div 
                  className="text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                >
                  <Link to="/" className="text-blue-500/70 dark:text-blue-400/70 hover:underline">
                    Retour à l'accueil
                  </Link>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
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
      </div>
    </Shell>
  );
}
