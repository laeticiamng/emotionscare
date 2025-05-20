
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import B2BPremiumAuthLayout from '@/components/auth/B2BPremiumAuthLayout';
import PostLoginTransition from '@/components/auth/PostLoginTransition';
import { Mail, Lock, Building, ArrowRight } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';

const B2BUserPremiumLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { toast } = useToast();
  
  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    let isValid = true;
    
    if (!email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format d'email professionnel invalide";
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
      await login(email, password, rememberMe);
      
      // Track login event
      trackEvent('B2B User Login', { 
        properties: { 
          method: 'password',
          userType: 'b2b_user'
        } 
      });
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace collaborateur",
      });
      
      // Trigger the transition animation
      setShowTransition(true);
    } catch (error: any) {
      console.error('Login error:', error);
      
      trackEvent('Login Failed', { 
        properties: { 
          method: 'password',
          userType: 'b2b_user',
          reason: error.message || 'Unknown error'
        } 
      });
      
      toast({
        title: "Erreur de connexion",
        description: error.message || "Vérifiez vos identifiants et réessayez",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleTransitionComplete = () => {
    setShowTransition(false);
    navigate('/b2b/user/dashboard');
  };
  
  return (
    <>
      <B2BPremiumAuthLayout
        title="Espace Collaborateur"
        subtitle="Connectez-vous à votre espace collaborateur"
        isAdmin={false}
      >
        <Card className="border-none shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                <AnimatedFormField
                  id="email"
                  label="Email professionnel"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email}
                />
                
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe} 
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm font-medium leading-none"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>
                  
                  <Link
                    to="/b2b/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full group relative overflow-hidden bg-blue-600 hover:bg-blue-700" 
                  disabled={loading}
                >
                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-blue-600/10">
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </span>
                  )}
                  <span className={loading ? "opacity-0" : "opacity-100 flex items-center justify-center"}>
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
                
                <div className="text-sm text-center mt-2 text-muted-foreground">
                  Vous n'avez pas de compte ?{" "}
                  <Link 
                    to="/b2b/user/register"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
                  >
                    Créer un compte
                  </Link>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2"
                  onClick={() => navigate('/b2b/selection')}
                >
                  Retour à la sélection
                </Button>
              </CardFooter>
            </form>
          </motion.div>
        </Card>
      </B2BPremiumAuthLayout>
      
      <PostLoginTransition 
        show={showTransition} 
        onComplete={handleTransitionComplete}
        userName={user?.name}
      />
    </>
  );
};

export default B2BUserPremiumLogin;
