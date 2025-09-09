import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSimpleAuth } from '@/contexts/SimpleAuth';
import { validateData, SignInSchema } from '@/lib/data-validation';
import { useObservability } from '@/lib/observability';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const SimpleLogin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment') as 'b2c' | 'b2b' | null;
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, signUp, loading } = useSimpleAuth();
  const { logPageView, logUserAction, logError } = useObservability();

  // Log page view
  React.useEffect(() => {
    logPageView('login_page');
  }, [logPageView]);

  // Fonction de connexion avec validation
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    // Validation des données
    const validation = validateData(SignInSchema, { email: email.trim(), password: password.trim() });
    
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.errors?.forEach(error => {
        fieldErrors[error.field] = error.message;
      });
      setErrors(fieldErrors);
      logUserAction('login_validation_failed', { errorCount: validation.errors?.length });
      return;
    }

    setErrors({});
    setStatus('Connexion en cours...');
    logUserAction('login_attempt', { email });
    
    try {
      await signIn(email.trim(), password.trim());
      setStatus('✅ Connexion réussie! Redirection...');
      logUserAction('login_success', { email });
    } catch (error: any) {
      logError(error, 'Erreur lors de la connexion', { email });
      setStatus(`❌ ${error.message || 'Connexion échouée'}`);
    }
  };

  // Fonction d'inscription
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (password.length < 6) {
      setErrors({ password: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setErrors({});
    setStatus('Création du compte...');
    logUserAction('signup_attempt', { email });
    
    try {
      await signUp(email.trim(), password, {
        full_name: fullName.trim(),
        segment: segment || 'b2c'
      });
      setStatus('✅ Compte créé! Vérifiez votre email.');
      logUserAction('signup_success', { email });
    } catch (error: any) {
      logError(error, 'Erreur lors de l\'inscription', { email });
      setStatus(`❌ ${error.message || 'Inscription échouée'}`);
    }
  };

  const getTitle = () => {
    if (isSignUp) {
      return segment === 'b2b' ? 'Créer un compte Entreprise' : 'Créer un compte';
    }
    return segment === 'b2b' ? 'Connexion Entreprise' : 'Connexion';
  };

  const getDescription = () => {
    if (isSignUp) {
      return 'Rejoignez EmotionsCare pour commencer votre parcours bien-être';
    }
    return 'Accédez à votre espace personnel EmotionsCare';
  };

  return (
    <div 
      data-testid="page-root"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4"
    >
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                EmotionsCare
              </h1>
              <Badge variant="secondary" className="text-xs mt-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
          
          {segment && (
            <Badge variant="outline" className="mb-2">
              Mode {segment === 'b2c' ? 'Particulier' : 'Entreprise'}
            </Badge>
          )}
        </div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="shadow-2xl border-2 border-muted/50 backdrop-blur-sm bg-white/80">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {isSignUp ? (
                  <UserPlus className="h-6 w-6 text-primary" />
                ) : (
                  <LogIn className="h-6 w-6 text-primary" />
                )}
                <CardTitle className="text-2xl font-bold text-center">
                  {getTitle()}
                </CardTitle>
              </div>
              <p className="text-center text-muted-foreground text-sm">
                {getDescription()}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Status Message */}
              {status && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2 ${
                    status.includes('❌') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  {status.includes('❌') ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {status}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                {/* Full Name for Sign Up */}
                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">
                      Nom complet
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11 border-2 focus:border-primary"
                      placeholder="Votre nom complet"
                      required={isSignUp}
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-2 focus:border-primary"
                      placeholder="votre@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-2 focus:border-primary"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password for Sign Up */}
                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 border-2 focus:border-primary"
                        placeholder="••••••••"
                        required={isSignUp}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isSignUp ? 'Création...' : 'Connexion...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isSignUp ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Créer mon compte
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Se connecter
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle between Login/SignUp */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  {isSignUp ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?'}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setStatus('');
                    setErrors({});
                  }}
                  className="w-full"
                  disabled={loading}
                >
                  {isSignUp ? 'Se connecter' : 'Créer un compte'}
                </Button>
              </div>

              {/* Development Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <Badge variant="outline" className="text-xs mb-2">
                    Mode Développement
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Test: test@example.com / password123
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SimpleLogin;