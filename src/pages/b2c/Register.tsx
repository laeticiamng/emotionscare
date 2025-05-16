
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Shell from '@/Shell';
import { TimeBasedBackground } from '@/components/home/TimeBasedBackground';
import { WelcomeMessage } from '@/components/home/WelcomeMessage';
import { VoiceCommandButton } from '@/components/home/voice/VoiceCommandButton';
import { AudioController } from '@/components/home/audio/AudioController';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function B2CRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Les mots de passe ne correspondent pas",
        description: "Vérifions ensemble que les mots de passe sont identiques",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Conditions d'utilisation",
        description: "Merci d'accepter les conditions d'utilisation pour continuer",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store session
      localStorage.setItem('auth_session', 'mock_token');
      localStorage.setItem('user_role', 'b2c');
      localStorage.setItem('userMode', 'b2c');
      
      // Play haptic feedback on mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      toast({
        title: "Bienvenue dans votre cocon",
        description: "Vous venez de rejoindre une plateforme pensée pour vous",
      });
      
      navigate('/b2c/dashboard');
    } catch (error) {
      toast({
        title: "Une petite difficulté",
        description: "Nous n'avons pas pu finaliser votre inscription. Réessayons ensemble.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <TimeBasedBackground>
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <VoiceCommandButton 
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
                <CardTitle className="text-2xl">Inscription Particulier</CardTitle>
                <CardDescription>
                  <WelcomeMessage className="mt-2" customMessage="Bienvenue dans votre nouveau cocon émotionnel. Quelques informations et vous pourrez commencer l'expérience." />
                </CardDescription>
              </motion.div>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      placeholder="Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-background/60"
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
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/60"
                      required
                    />
                  </div>
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                >
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-background/60"
                      required
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
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                >
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="confirmPassword" 
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-background/60"
                      required
                    />
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                >
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms} 
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} 
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    J'accepte les conditions d'utilisation et la politique de confidentialité
                  </label>
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <motion.div 
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                  </Button>
                </motion.div>
                <motion.div 
                  className="text-sm text-center mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.7 }}
                >
                  Déjà un compte?{' '}
                  <Link to="/b2c/login" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </motion.div>
                <motion.div 
                  className="text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.7 }}
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
