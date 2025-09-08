/**
 * SIGNUP PAGE PREMIUM - EMOTIONSCARE
 * Page d'inscription moderne, accessible et sécurisée
 */

import React, { useState } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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
  Github,
  User,
  CheckCircle,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  agreeMarketing?: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment') as 'b2c' | 'b2b' | null;
  
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreeMarketing: true
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { register, isLoading, isAuthenticated, user } = useAuth();

  // Rediriger si déjà connecté
  if (isAuthenticated && user) {
    return <Navigate to="/app/home" replace />;
  }

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    const strengthMap = {
      0: { label: 'Très faible', color: 'bg-red-500' },
      1: { label: 'Faible', color: 'bg-red-400' },
      2: { label: 'Moyen', color: 'bg-orange-400' },
      3: { label: 'Bon', color: 'bg-yellow-400' },
      4: { label: 'Fort', color: 'bg-green-400' },
      5: { label: 'Très fort', color: 'bg-green-500' }
    };
    
    return {
      score: (score / 5) * 100,
      label: strengthMap[score as keyof typeof strengthMap].label,
      color: strengthMap[score as keyof typeof strengthMap].color,
      checks
    };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer votre nom complet",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Conditions d'utilisation",
        description: "Vous devez accepter les conditions d'utilisation",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitted || isLoading) return;
    
    if (!validateForm()) return;
    
    setSubmitted(true);
    
    try {
      await register(formData.email.trim(), formData.password, {
        full_name: formData.name.trim(),
        segment: segment || 'b2c',
        marketing_consent: formData.agreeMarketing
      });
      
      toast({
        title: "Inscription réussie !",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });
      
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      
      const errorMessages: Record<string, string> = {
        'User already registered': 'Un compte existe déjà avec cet email',
        'Email rate limit exceeded': 'Trop de tentatives, réessayez plus tard',
        'Signup disabled': 'Les inscriptions sont temporairement désactivées',
        'Invalid email': 'Adresse email invalide'
      };
      
      const message = errorMessages[error.message] || error.message || 'Une erreur est survenue lors de l\'inscription';
      
      toast({
        title: "Erreur d'inscription",
        description: message,
        variant: "destructive",
      });
      
      setSubmitted(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'github') => {
    toast({
      title: "Bientôt disponible",
      description: `Inscription via ${provider} sera disponible prochainement`,
    });
  };

  const getTitle = () => {
    switch (segment) {
      case 'b2c': return 'Créer votre compte personnel';
      case 'b2b': return 'Créer votre compte entreprise';
      default: return 'Créer votre compte';
    }
  };

  const getDescription = () => {
    switch (segment) {
      case 'b2c': return 'Rejoignez EmotionsCare et transformez votre bien-être émotionnel';
      case 'b2b': return 'Découvrez EmotionsCare pour votre équipe et votre entreprise';
      default: return 'Commencez votre parcours avec EmotionsCare';
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
                  Choisissez votre profil
                </CardTitle>
                <CardDescription className="text-center">
                  Sélectionnez le type de compte adapté à vos besoins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/signup?segment=b2c" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-primary/5 hover:border-primary/30">
                    <Heart className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Particulier</div>
                      <div className="text-xs text-muted-foreground">Pour votre bien-être personnel</div>
                    </div>
                  </Button>
                </Link>
                <Link to="/signup?segment=b2b" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 hover:bg-primary/5 hover:border-primary/30">
                    <Building2 className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Entreprise</div>
                      <div className="text-xs text-muted-foreground">Pour votre équipe</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Signup Form */}
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
              {/* Social Signup Options */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignup('google')}
                  className="h-11 hover:bg-muted/50"
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignup('github')}
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
                    OU S'INSCRIRE AVEC EMAIL
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label 
                    htmlFor="name" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 h-11 border-2 focus:border-primary"
                      placeholder="Votre nom complet"
                      required
                      disabled={isLoading || submitted}
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
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

                {/* Password */}
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
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Force du mot de passe</span>
                        <span className={cn(
                          "font-medium",
                          passwordStrength.score < 40 ? "text-red-500" :
                          passwordStrength.score < 70 ? "text-orange-500" :
                          "text-green-500"
                        )}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <Progress 
                        value={passwordStrength.score} 
                        className="h-2"
                      />
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className={cn("flex items-center gap-1", passwordStrength.checks.length ? "text-green-600" : "text-muted-foreground")}>
                          <CheckCircle className="w-3 h-3" />
                          8+ caractères
                        </div>
                        <div className={cn("flex items-center gap-1", passwordStrength.checks.uppercase ? "text-green-600" : "text-muted-foreground")}>
                          <CheckCircle className="w-3 h-3" />
                          Majuscule
                        </div>
                        <div className={cn("flex items-center gap-1", passwordStrength.checks.lowercase ? "text-green-600" : "text-muted-foreground")}>
                          <CheckCircle className="w-3 h-3" />
                          Minuscule
                        </div>
                        <div className={cn("flex items-center gap-1", passwordStrength.checks.number ? "text-green-600" : "text-muted-foreground")}>
                          <CheckCircle className="w-3 h-3" />
                          Chiffre
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label 
                    htmlFor="confirmPassword" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={cn(
                        "pl-10 pr-10 h-11 border-2 focus:border-primary",
                        formData.confirmPassword && formData.password !== formData.confirmPassword && "border-red-500 focus:border-red-500"
                      )}
                      placeholder="••••••••"
                      required
                      disabled={isLoading || submitted}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div className="flex items-center gap-1 text-xs text-red-500">
                      <AlertTriangle className="w-3 h-3" />
                      Les mots de passe ne correspondent pas
                    </div>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-0.5 rounded border-2 border-muted"
                      required
                      disabled={isLoading || submitted}
                    />
                    <span className="text-muted-foreground leading-relaxed">
                      J'accepte les{' '}
                      <Link to="/legal/terms" className="text-primary hover:underline focus:underline">
                        conditions d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link to="/legal/privacy" className="text-primary hover:underline focus:underline">
                        politique de confidentialité
                      </Link>
                    </span>
                  </label>
                  
                  <label className="flex items-start space-x-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onChange={handleChange}
                      className="mt-0.5 rounded border-2 border-muted"
                      disabled={isLoading || submitted}
                    />
                    <span className="text-muted-foreground leading-relaxed">
                      J'accepte de recevoir des emails sur les nouveautés et conseils bien-être (optionnel)
                    </span>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className={cn(
                    "w-full h-12 text-base font-semibold transition-all",
                    "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl",
                    (isLoading || submitted) && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={isLoading || submitted || !formData.agreeTerms}
                >
                  {isLoading || submitted ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Création en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Créer mon compte
                    </div>
                  )}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="space-y-4 pt-4">
                <Separator />
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Déjà un compte ?{' '}
                    <Link 
                      to={segment ? `/login?segment=${segment}` : '/login'} 
                      className="text-primary hover:underline font-medium focus:underline"
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>

                {segment && (
                  <div className="text-center">
                    <Link 
                      to="/signup" 
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
                <span>Données chiffrées • RGPD conforme • Aucun spam</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="mt-6"
        >
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="pt-4">
              <div className="text-center space-y-3">
                <Badge variant="outline" className="text-xs">
                  Ce qui vous attend
                </Badge>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Analyse IA emotions
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Musique thérapeutique
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Coach IA personnel
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Support 24/7
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;