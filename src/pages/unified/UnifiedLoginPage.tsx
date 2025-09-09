/**
 * UNIFIED LOGIN PAGE - Fusion de LoginPage + SimpleLogin
 * Préserve EXACTEMENT la même fonctionnalité des deux composants
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Github,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

interface UnifiedLoginPageProps {
  variant?: 'premium' | 'simple';
}

export default function UnifiedLoginPage({ variant = 'premium' }: UnifiedLoginPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment') as 'b2c' | 'b2b' | null;
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, isLoading, isAuthenticated, user } = useAuth();

  // Détection automatique du variant depuis les params
  const detectedVariant = searchParams.get('variant') === 'simple' ? 'simple' : variant;

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('✅ Utilisateur déjà connecté, redirection...');
      navigate('/app/home', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (submitted || isLoading) return;
    
    setSubmitted(true);
    
    try {
      await signIn(formData.email.trim(), formData.password);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur EmotionsCare !",
      });
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': 'Email ou mot de passe incorrect',
        'Email not confirmed': 'Veuillez confirmer votre email',
        'Too many requests': 'Trop de tentatives, réessayez plus tard',
        'User not found': 'Aucun compte trouvé avec cet email'
      };
      
      const message = errorMessages[error.message] || error.message || 'Une erreur est survenue';
      
      toast({
        title: "Erreur de connexion",
        description: message,
        variant: "destructive",
      });

      setError(message);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="page-root">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Version Simple (comme SimpleLogin original)
  if (detectedVariant === 'simple') {
    return (
      <div 
        data-testid="page-root"
        className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4"
        >
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur">
            <CardHeader className="text-center pb-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Bienvenue
              </CardTitle>
              <p className="text-muted-foreground">
                Connectez-vous à votre espace EmotionsCare
              </p>
            </CardHeader>
            
            <CardContent className="pt-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 h-11 border-2 focus:border-primary"
                      placeholder="votre@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 h-11 border-2 focus:border-primary"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connexion...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Se connecter
                    </div>
                  )}
                </Button>

                {/* Lien vers inscription */}
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Vous n'avez pas encore de compte ?{' '}
                    <Link 
                      to="/signup" 
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Créer un compte
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Version Premium (comme LoginPage original)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4" data-testid="page-root">
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
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
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
                  onClick={() => handleSocialLogin('google')}
                  className="h-11 hover:bg-muted/50"
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('github')}
                  className="h-11 hover:bg-muted/50"
                  disabled={isLoading}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
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
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="rounded border-2 border-muted"
                      disabled={isLoading || submitted}
                    />
                    <span className="text-muted-foreground">Se souvenir de moi</span>
                  </label>
                  
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline focus:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
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
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        {process.env.NODE_ENV === 'development' && (
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
    </div>
  );
}