import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  UserPlus,
  AlertCircle,
  Chrome,
  Github
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  const { signUp, isLoading, isAuthenticated } = useAuth();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/app/home', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoading) return;

    // Validation CGU/Privacy (RGPD obligatoire)
    if (!acceptTerms) {
      setError('Vous devez accepter les Conditions Générales d\'Utilisation');
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      return;
    }

    if (!acceptPrivacy) {
      setError('Vous devez accepter la Politique de Confidentialité');
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      return;
    }

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre');
      return;
    }

    try {
      await signUp(email.trim(), password, {
        full_name: fullName.trim()
      });
      toast({ title: 'Bienvenue !', description: 'Votre compte a été créé avec succès.' });
      navigate('/app/home', { replace: true });
    } catch (err: unknown) {
      logger.error('Erreur d\'inscription', err as Error, 'AUTH');
      // Use authErrorService for user-friendly messages
      const { getFriendlyAuthError } = await import('@/lib/auth/authErrorService');
      const friendly = getFriendlyAuthError(err);
      setError(friendly.action ? `${friendly.message} ${friendly.action}` : friendly.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 pb-28">
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
              <Heart className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Créer votre compte
            </CardTitle>
            <p className="text-muted-foreground">
              Rejoignez EmotionsCare pour commencer votre parcours bien-être
            </p>
          </CardHeader>
          
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom complet */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Nom complet
                </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 border-2 focus:border-primary"
                    placeholder="Votre nom complet"
                    required
                    disabled={isLoading}
                    autoComplete="name"
                  />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                   <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-2 focus:border-primary"
                    placeholder="votre@email.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-2 focus:border-primary"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                 </div>
               </div>
               {/* Password strength hints */}
               {password.length > 0 && (
                 <div className="space-y-1 text-xs">
                   <p className={password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}>
                     {password.length >= 8 ? '✓' : '○'} Au moins 8 caractères
                   </p>
                   <p className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                     {/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✓' : '○'} Majuscule et minuscule
                   </p>
                   <p className={/\d/.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                     {/\d/.test(password) ? '✓' : '○'} Au moins un chiffre
                   </p>
                 </div>
               )}
              {/* Confirmation mot de passe */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                   <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-2 focus:border-primary"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Messages d'erreur/succès */}
              {error && (
                <motion.div
                  ref={errorRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-success/10 text-success rounded-lg border border-success/20"
                >
                  <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                    <div className="w-2 h-2 bg-background rounded-full"></div>
                  </div>
                  <p className="text-sm">{success}</p>
                </motion.div>
              )}

              {/* Checkboxes CGU/Privacy - RGPD */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    disabled={isLoading}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    J'accepte les{' '}
                    <Link to="/legal/terms" className="text-primary hover:underline font-medium" target="_blank">
                      Conditions Générales d'Utilisation
                    </Link>
                    {' '}*
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={acceptPrivacy}
                    onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                    disabled={isLoading}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="privacy"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    J'accepte la{' '}
                    <Link to="/legal/privacy" className="text-primary hover:underline font-medium" target="_blank">
                      Politique de Confidentialité
                    </Link>
                    {' '}et le traitement de mes données personnelles *
                  </Label>
                </div>

                <p className="text-xs text-muted-foreground">
                  * Champs obligatoires conformément au RGPD
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Création du compte...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Créer mon compte
                  </div>
                )}
              </Button>

              {/* Social Login Options */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">
                      OU CONTINUER AVEC
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
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
                    type="button"
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
              </div>

              {/* Lien vers connexion */}
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Vous avez déjà un compte ?{' '}
                  <Link 
                    to="/login" 
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;