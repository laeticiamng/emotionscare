
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';
import MagicLinkAuth from '@/components/auth/MagicLinkAuth';
import PostLoginTransition from '@/components/auth/PostLoginTransition';
import { Mail, Lock, ArrowRight, Fingerprint } from 'lucide-react';

const B2CLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { toast } = useToast();
  
  // Animation sequence for fields
  const staggerDelay = 0.1;
  
  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    let isValid = true;
    
    if (!email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const loggedIn = await login(email, password, rememberMe);

      if (loggedIn && normalizeUserMode(loggedIn.role) === 'b2c') {
        // Trigger the transition animation
        setShowTransition(true);

        // Store a flag in sessionStorage to show transition on page reload if needed
        sessionStorage.setItem('just_logged_in', 'true');
      } else {
        toast({
          title: 'Accès non autorisé',
          description: "Ce compte n'est pas de type particulier",
          variant: 'destructive'
        });
        return;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast({
        title: "Erreur de connexion",
        description: error.message || "Vérifiez vos identifiants et réessayez",
        variant: "destructive",
      });
      
      // Simulate haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(150);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleTransitionComplete = () => {
    setShowTransition(false);
    navigate('/b2c/dashboard');
  };
  
  const biometricMock = async () => {
    setLoading(true);
    
    try {
      // Mock biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock successful login
      toast({
        title: "Authentification biométrique réussie",
        description: "Bienvenue dans votre espace personnel",
      });
      
      setShowTransition(true);
    } catch (error) {
      toast({
        title: "Erreur d'authentification",
        description: "L'authentification biométrique a échoué",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <B2CAuthLayout
        title="Bienvenue"
        subtitle="Connectez-vous à votre espace personnel"
        backgroundImage="/lovable-uploads/033892e2-fdd7-440d-8a6f-7adfc4957c78.png"
      >
        {showMagicLink ? (
          <MagicLinkAuth onCancel={() => setShowMagicLink(false)} />
        ) : (
          <Card className="border-none shadow-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: staggerDelay, duration: 0.3 }}
                  >
                    <AnimatedFormField
                      id="email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      icon={<Mail className="h-4 w-4" />}
                      error={errors.email}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: staggerDelay * 2, duration: 0.3 }}
                  >
                    <AnimatedFormField
                      id="password"
                      label="Mot de passe"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      icon={<Lock className="h-4 w-4" />}
                      error={errors.password}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: staggerDelay * 3, duration: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe} 
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label 
                        htmlFor="remember" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Se souvenir de moi
                      </Label>
                    </div>
                    
                    <Link
                      to="/b2c/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </motion.div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: staggerDelay * 4, duration: 0.3 }}
                    className="w-full"
                  >
                    <Button 
                      type="submit" 
                      className="w-full relative overflow-hidden" 
                      disabled={loading}
                    >
                      {loading && (
                        <span className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-primary/10">
                          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connexion en cours...
                        </span>
                      )}
                      <span className={loading ? "opacity-0" : "opacity-100 flex items-center justify-center"}>
                        Se connecter
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: staggerDelay * 5, duration: 0.3 }}
                    className="w-full"
                  >
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowMagicLink(true)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Se connecter avec un lien magique
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: staggerDelay * 6, duration: 0.3 }}
                    className="w-full"
                  >
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full"
                      onClick={biometricMock}
                    >
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Se connecter avec biométrie
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: staggerDelay * 7, duration: 0.5 }}
                    className="text-sm text-center mt-2 text-muted-foreground"
                  >
                    Pas encore inscrit ?{" "}
                    <Link 
                      to="/b2c/register"
                      className="text-primary hover:underline font-medium transition-colors"
                    >
                      Créer un compte
                    </Link>
                  </motion.div>
                </CardFooter>
              </form>
            </motion.div>
          </Card>
        )}
      </B2CAuthLayout>
      
      <PostLoginTransition 
        show={showTransition} 
        onComplete={handleTransitionComplete}
        userName={user?.name}
      />
    </>
  );
};

export default B2CLoginPage;
