/**
 * LOGIN PAGE PREMIUM - EMOTIONSCARE
 * Page de connexion moderne, accessible et sécurisée
 */

import React, { useState } from 'react';
import { Link, useSearchParams, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  Shield, 
  Zap,
  Chrome,
  Apple,
  Github
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import ForgotPasswordDialog from '@/pages/b2c/login/ForgotPasswordDialog';

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment') as 'b2c' | 'b2b' | null;
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const { signIn, isLoading, isAuthenticated, user } = useAuth();

  // Rediriger si déjà connecté - mais permettre l'accès à la homepage
  if (isAuthenticated && user && location.pathname === '/login') {
    return <Navigate to="/app/home" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitted || isLoading) return;
    
    setSubmitted(true);
    setLoginError(null);
    
    try {
      await signIn(formData.email.trim(), formData.password);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur EmotionsCare !",
      });
      
    } catch (error: unknown) {
      logger.error('Erreur de connexion', error as Error, 'AUTH');
      
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': 'Email ou mot de passe incorrect',
        'Email not confirmed': 'Veuillez confirmer votre email',
        'Too many requests': 'Trop de tentatives, réessayez plus tard',
        'User not found': 'Aucun compte trouvé avec cet email'
      };
      
      const errMsg = error instanceof Error ? error.message : 'Une erreur est survenue';
      const message = errorMessages[errMsg] || errMsg;
      
      setLoginError(message);
      
      toast({
        title: "Erreur de connexion",
        description: message,
        variant: "destructive",
      });
      
      setSubmitted(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    toast({
      title: "Bientôt disponible",
      description: `Connexion via ${provider} sera disponible prochainement`,
    });
  };

  const getTitle = () => {
    switch (segment) {
      case 'b2c': return 'Connexion Particulier';
      case 'b2b': return 'Connexion Entreprise';
      default: return 'Connexion';
    }
  };

  const getDescription = () => {
    switch (segment) {
      case 'b2c': return 'Accédez à votre espace personnel de bien-être émotionnel';
      case 'b2b': return 'Accédez à votre espace professionnel EmotionsCare';
      default: return 'Accédez à votre compte EmotionsCare';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Navigation Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'accueil</span>
          </Link>
          
          {/* Logo Premium */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            <Badge variant="secondary" className="text-xs">Premium</Badge>
          </div>
          
          {segment && (
            <Badge variant="outline" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Mode {segment === 'b2c' ? 'Particulier' : 'Entreprise'}
            </Badge>
          )}
        </div>

        {/* Segment Selection */}
        {!segment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="mb-6 border-2 border-muted hover:border-primary/20 transition-colors">
              <CardHeader className="pb-4">
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Choisissez votre espace
                </CardTitle>
                <CardDescription className="text-center">
                  Sélectionnez le type de compte adapté à vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/login?segment=b2c" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-primary/5 hover:border-primary/30">
                    <Heart className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Particulier</div>
                      <div className="text-xs text-muted-foreground">Usage personnel</div>
                    </div>
                  </Button>
                </Link>
                <Link to="/login?segment=b2b" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-primary/5 hover:border-primary/30">
                    <Shield className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Entreprise</div>
                      <div className="text-xs text-muted-foreground">Usage professionnel</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: segment ? 0 : 0.4 }}
        >
          <Card className="shadow-xl border-2 border-muted hover:border-primary/20 transition-colors">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center">
                {getTitle()}
              </CardTitle>
              <CardDescription className="text-center">
                {getDescription()}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  disabled
                  className="h-11 opacity-50 cursor-not-allowed relative"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                  <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0">
                    Bientôt
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  disabled
                  className="h-11 opacity-50 cursor-not-allowed relative"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                  <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0">
                    Bientôt
                  </Badge>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    OU CONTINUER AVEC EMAIL
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 h-11 border-2 focus:border-primary"
                      placeholder="votre@email.com"
                      required
                      disabled={isLoading || submitted}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label 
                    htmlFor="password" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 h-11 border-2 focus:border-primary"
                      placeholder="••••••••"
                      required
                      disabled={isLoading || submitted}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Inline error message */}
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20"
                    role="alert"
                  >
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm font-medium">{loginError}</p>
                  </motion.div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, remember: Boolean(checked) }))
                      }
                      disabled={isLoading || submitted}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground cursor-pointer select-none"
                    >
                      Se souvenir de moi
                    </label>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-sm text-primary hover:underline focus:underline bg-transparent border-none cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className={cn(
                    "w-full h-12 text-base font-semibold transition-all",
                    "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl",
                    (isLoading || submitted) && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isLoading || submitted}
                >
                  {isLoading || submitted ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Connexion en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Se connecter
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="space-y-4 pt-4">
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Pas encore de compte ?{' '}
                    <Link 
                      to={segment ? `/signup?segment=${segment}` : '/signup'} 
                      className="text-primary hover:underline font-medium focus:underline"
                    >
                      Créer un compte
                    </Link>
                  </p>
                </div>

                {segment && (
                  <div className="text-center">
                    <Link 
                      to="/login" 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Changer de type de compte
                    </Link>
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                <Shield className="w-3 h-3" />
                <span>Connexion sécurisée • Chiffrement SSL • RGPD conforme</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Info */}
        {import.meta.env.MODE === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="mt-6"
          >
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <Badge variant="outline" className="text-xs">
                    Mode Développement
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Créez un compte ou utilisez test@example.com / password123
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        email={formData.email}
      />
    </div>
  );
};

export default LoginPage;