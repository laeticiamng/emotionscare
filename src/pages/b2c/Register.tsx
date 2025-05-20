
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
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';
import PostLoginTransition from '@/components/auth/PostLoginTransition';
import { Mail, User, Lock, Smile, ArrowRight } from 'lucide-react';

const B2CRegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});
  
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const { toast } = useToast();
  
  // Animation sequence for fields
  const staggerDelay = 0.1;
  
  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;
    
    if (!name) {
      newErrors.name = 'Le nom est requis';
      isValid = false;
    }
    
    if (!email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }
    
    if (!agreeTerms) {
      newErrors.agreeTerms = 'Vous devez accepter les conditions';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Simulate haptic feedback on mobile for error
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      return;
    }
    
    setLoading(true);
    
    try {
      await register(name, email, password);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      // Trigger transition animation
      setShowTransition(true);
      
      // The navigation will happen after the transition completes
    } catch (error: any) {
      console.error('Registration error:', error);
      
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
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
  
  return (
    <>
      <B2CAuthLayout
        title="Rejoignez-nous"
        subtitle="Créez votre compte et commencez votre parcours de bien-être"
        backgroundImage="/lovable-uploads/033892e2-fdd7-440d-8a6f-7adfc4957c78.png"
      >
        <Card className="border-none shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5 pt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: staggerDelay, duration: 0.3 }}
                >
                  <AnimatedFormField
                    id="name"
                    label="Nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    icon={<User className="h-4 w-4" />}
                    error={errors.name}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: staggerDelay * 2, duration: 0.3 }}
                >
                  <AnimatedFormField
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.email}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: staggerDelay * 3, duration: 0.3 }}
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
                  transition={{ delay: staggerDelay * 4, duration: 0.3 }}
                >
                  <AnimatedFormField
                    id="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    icon={<Lock className="h-4 w-4" />}
                    error={errors.confirmPassword}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: staggerDelay * 5, duration: 0.3 }}
                  className="flex items-start space-x-2"
                >
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms} 
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label 
                      htmlFor="terms" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      J'accepte les conditions d'utilisation et la politique de confidentialité
                    </Label>
                    {errors.agreeTerms && (
                      <p className="text-xs text-destructive">{errors.agreeTerms}</p>
                    )}
                  </div>
                </motion.div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: staggerDelay * 6, duration: 0.3 }}
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
                        Création du compte...
                      </span>
                    )}
                    <span className={loading ? "opacity-0" : "opacity-100 flex items-center justify-center"}>
                      Créer mon compte
                      <Smile className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: staggerDelay * 7, duration: 0.5 }}
                  className="text-sm text-center mt-2 text-muted-foreground"
                >
                  Vous avez déjà un compte ?{" "}
                  <Link 
                    to="/b2c/login"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Se connecter
                  </Link>
                </motion.div>
              </CardFooter>
            </form>
          </motion.div>
        </Card>
      </B2CAuthLayout>
      
      <PostLoginTransition 
        show={showTransition} 
        onComplete={handleTransitionComplete}
        userName={user?.name}
      />
    </>
  );
};

export default B2CRegisterPage;
