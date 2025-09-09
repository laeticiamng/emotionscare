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
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="flex w-full max-w-6xl mx-auto relative z-10">
        {/* Left Side - Value Proposition */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white"
        >
          <div className="space-y-8">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
              >
                Transformez votre bien-être émotionnel
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-blue-100 leading-relaxed"
              >
                Découvrez une plateforme révolutionnaire qui combine IA, VR et thérapie personnalisée pour votre épanouissement.
              </motion.p>
            </div>

            {/* Features Showcase */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {[
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: "Scanner d'émotions IA",
                  description: "Analyse faciale temps réel de vos émotions avec recommandations personnalisées"
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: "Expériences VR immersives",
                  description: "Méditation en réalité virtuelle dans des environnements apaisants"
                },
                {
                  icon: <UserPlus className="w-6 h-6" />,  
                  title: "Coach personnel IA",
                  description: "Accompagnement 24/7 avec des conseils adaptés à votre profil"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4 group"
                >
                  <div className="p-3 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex space-x-8 pt-6 border-t border-white/20"
            >
              {[
                { number: "15+", label: "Modules thérapeutiques" },
                { number: "98%", label: "Utilisateurs satisfaits" },
                { number: "24/7", label: "Support disponible" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md">
            {/* Navigation Header */}
            <div className="text-center mb-8">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group lg:hidden"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Retour à l'accueil</span>
              </Link>
              
              {/* Logo Premium */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-white via-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Heart className="h-7 w-7 text-pink-500" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    EmotionsCare
                  </h1>
                  <Badge className="text-xs mt-1 bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Premium IA
                  </Badge>
                </div>
              </div>
              
              {segment && (
                <Badge className="mb-2 bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Mode {segment === 'b2c' ? 'Particulier' : 'Entreprise'}
                </Badge>
              )}

              {/* Mobile Value Prop */}
              <div className="lg:hidden mt-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Votre bien-être mental, révolutionné
                </h2>
                <p className="text-blue-200 text-sm">
                  IA • VR • Thérapie personnalisée • 15+ modules
                </p>
              </div>
            </div>

            {/* Main Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="shadow-2xl border border-white/20 backdrop-blur-xl bg-white/95">
                <CardHeader className="space-y-2 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {isSignUp ? (
                        <UserPlus className="h-6 w-6 text-primary" />
                      ) : (
                        <LogIn className="h-6 w-6 text-primary" />
                      )}
                      <CardTitle className="text-2xl font-bold">
                        {getTitle()}
                      </CardTitle>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Gratuit
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {getDescription()}
                  </p>
                  
                  {/* Quick benefits */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>15+ modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>IA personnalisée</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>VR incluse</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Social Login Options */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button
                      variant="outline"
                      className="h-11 hover:bg-muted/50 border-2"
                      disabled
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      </svg>
                      Google
                    </Button>
                    <Button
                      variant="outline"  
                      className="h-11 hover:bg-muted/50 border-2"
                      disabled
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      Apple
                    </Button>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">
                        OU PAR EMAIL
                      </span>
                    </div>
                  </div>

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
                      className="w-full border-2 hover:bg-primary/5 hover:border-primary/30"
                      disabled={loading}
                    >
                      {isSignUp ? 'Se connecter' : 'Créer un compte gratuitement'}
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>SSL sécurisé</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>RGPD conforme</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>0€ / mois</span>
                    </div>
                  </div>

                  {/* Development Info */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center mt-4">
                      <Badge variant="outline" className="text-xs mb-2 bg-blue-100 text-blue-800">
                        Mode Développement
                      </Badge>
                      <p className="text-xs text-blue-600">
                        Test: test@example.com / password123
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleLogin;