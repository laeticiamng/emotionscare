/**
 * LOGIN PAGE - EMOTIONSCARE
 * Page de connexion simple, accessible et fonctionnelle
 */

import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
  Shield,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import ForgotPasswordDialog from '@/pages/b2c/login/ForgotPasswordDialog';
import { usePageSEO } from '@/hooks/usePageSEO';
import SharedHeader from '@/components/layout/SharedHeader';

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  usePageSEO({
    title: 'Connexion | EmotionsCare',
    description: 'Connectez-vous à EmotionsCare, la plateforme de bien-être émotionnel pour soignants et étudiants en santé.',
    keywords: 'connexion, login, emotionscare, soignants, bien-etre',
    canonical: 'https://emotionscare.com/login',
  });

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { signIn, isLoading, isAuthenticated, user } = useAuth();

  // Rediriger si deja connecte
  if (isAuthenticated && user && location.pathname === '/login') {
    return <Navigate to="/app/home" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Effacer l'erreur quand l'utilisateur modifie un champ
    if (loginError) setLoginError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isLoading) return;

    setIsSubmitting(true);
    setLoginError(null);

    try {
      await signIn(formData.email.trim(), formData.password);

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur EmotionsCare !",
      });

      // Navigation explicite apres connexion reussie
      navigate('/app/home', { replace: true });

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
    } finally {
      // Toujours reinitialiser le flag de soumission
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <SharedHeader />
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-2 border-muted hover:border-primary/20 transition-colors">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              Connexion
            </CardTitle>
            <CardDescription className="text-center">
              Accédez à votre espace EmotionsCare
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
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
                    disabled={isLoading || isSubmitting}
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
                    placeholder="Votre mot de passe"
                    required
                    disabled={isLoading || isSubmitting}
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
                    disabled={isLoading || isSubmitting}
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
                  (isLoading || isSubmitting) && "opacity-50 cursor-not-allowed"
                )}
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
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
                    to="/signup"
                    className="text-primary hover:underline font-medium focus:underline"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <Shield className="w-3 h-3" />
              <span>Connexion sécurisée — RGPD conforme</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        email={formData.email}
      />
      </div>
    </div>
  );
};

export default LoginPage;
