import React, { memo, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, Mail, Lock, Loader2, Eye, EyeOff, 
  ArrowLeft, Shield, Zap, Star, CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { EnhancedLoading } from '@/components/ui/enhanced-performance';
import { announce } from '@/components/ui/enhanced-accessibility';

// Form validation hook
const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email requis';
    if (!emailRegex.test(email)) return 'Format d\'email invalide';
    return '';
  }, []);
  
  const validatePassword = useCallback((password: string) => {
    if (!password) return 'Mot de passe requis';
    if (password.length < 6) return 'Au moins 6 caractères requis';
    return '';
  }, []);
  
  const validate = useCallback((email: string, password: string) => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateEmail, validatePassword]);
  
  return { errors, validate, setErrors };
};

// Memoized components
const MemoizedFeatureItem = memo<{ 
  icon: React.ComponentType<any>; 
  text: string; 
  index: number;
  shouldReduceMotion: boolean;
}>(({ icon: Icon, text, index, shouldReduceMotion }) => (
  <motion.div
    className="flex items-center space-x-3 text-sm text-muted-foreground"
    initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ 
      delay: shouldReduceMotion ? 0 : 0.8 + index * 0.1,
      duration: shouldReduceMotion ? 0.01 : 0.4
    }}
  >
    <Icon className="h-4 w-4 text-primary flex-shrink-0" />
    <span>{text}</span>
  </motion.div>
));

MemoizedFeatureItem.displayName = 'MemoizedFeatureItem';

const B2CLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { errors, validate, setErrors } = useFormValidation();
  const shouldReduceMotion = useReducedMotion();

  // Memoized features list
  const features = useMemo(() => [
    { icon: Zap, text: 'Analyse émotionnelle IA en temps réel' },
    { icon: Heart, text: 'Musique thérapeutique personnalisée' },
    { icon: Shield, text: 'Données 100% sécurisées et privées' },
    { icon: Star, text: 'Coach IA disponible 24/7' },
  ], []);

  // Memoized demo credentials
  const demoCredentials = useMemo(() => ({
    email: 'demo@emotionscare.com',
    password: 'demo123'
  }), []);

  const handleDemoLogin = useCallback(() => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    announce('Identifiants de démonstration remplis automatiquement');
  }, [demoCredentials]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate(email, password)) {
      announce('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setErrors({});

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        const errorMessage = authError.message === 'Invalid login credentials' 
          ? 'Email ou mot de passe incorrect'
          : authError.message;
        
        setError(errorMessage);
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive"
        });
        announce(`Erreur de connexion: ${errorMessage}`);
        return;
      }

      if (data.user) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('emotionscare_remember', 'true');
        }
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur EmotionsCare !",
        });
        announce('Connexion réussie, redirection vers le tableau de bord');
        navigate('/b2c/dashboard');
      }
    } catch (err) {
      const errorMessage = 'Une erreur inattendue s\'est produite';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      announce(`Erreur inattendue: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, rememberMe, validate, toast, navigate, setErrors]);

  // Animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20,
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  }), [shouldReduceMotion]);

  return (
    <div 
      data-testid="page-root" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float animation-delay-2000" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Left Column - Features & Branding */}
        <motion.div variants={itemVariants} className="space-y-8 text-center lg:text-left">
          {/* Logo & Header */}
          <div className="space-y-4">
            <div className="flex justify-center lg:justify-start">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-primary via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={shouldReduceMotion ? {} : { 
                  scale: 1.1, 
                  rotate: [0, -10, 10, 0] 
                }}
                transition={{ duration: 0.6 }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">
                EmotionsCare
              </h1>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Espace Personnel
              </h2>
              <p className="text-lg text-muted-foreground">
                Votre compagnon IA pour le bien-être émotionnel
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Découvrez nos fonctionnalités premium :
            </h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <MemoizedFeatureItem
                  key={index}
                  icon={feature.icon}
                  text={feature.text}
                  index={index}
                  shouldReduceMotion={!!shouldReduceMotion}
                />
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 1.2 }}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>10,000+ utilisateurs actifs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Certifié RGPD</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Login Form */}
        <motion.div variants={itemVariants} className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="shadow-premium-lg border-0 bg-background/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/choose-mode')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDemoLogin}
                  className="text-xs"
                >
                  Demo
                </Button>
              </div>
              
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <p className="text-sm text-muted-foreground">
                Accédez à votre espace bien-être personnel
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={cn(
                        "pl-10 transition-all duration-200",
                        errors.email && "border-destructive focus:border-destructive"
                      )}
                      autoComplete="email"
                      required
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      className={cn(
                        "pl-10 pr-10 transition-all duration-200",
                        errors.password && "border-destructive focus:border-destructive"
                      )}
                      autoComplete="current-password"
                      required
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-sm text-destructive" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Se souvenir de moi
                  </Label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className={cn(
                    "w-full bg-gradient-to-r from-primary via-blue-600 to-purple-600",
                    "hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90",
                    "text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-xl",
                    "transition-all duration-300 hover:scale-[1.02]"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connexion...
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="text-center">
                  <Link 
                    to="/auth/forgot-password" 
                    className="text-sm text-primary hover:underline transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{' '}
                  <Link 
                    to="/b2c/register" 
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Créer un compte gratuitement
                  </Link>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  En vous connectant, vous acceptez nos{' '}
                  <Link to="/terms" className="underline hover:text-foreground">
                    conditions d'utilisation
                  </Link>
                  {' '}et notre{' '}
                  <Link to="/privacy" className="underline hover:text-foreground">
                    politique de confidentialité
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(B2CLoginPage);