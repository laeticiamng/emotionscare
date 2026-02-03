/**
 * Unified Login Page - Page de connexion unifiée B2C/B2B
 */
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  loginSchema,
  type LoginFormData,
  unifiedRegisterSchema,
  type UnifiedRegisterFormData
} from '@/lib/validations/auth';
import { B2CLoginPage } from '@/pages/b2c/login';

/** Inner component for B2B login – all hooks called unconditionally */
const B2BLoginForm: React.FC<{ segment: string }> = ({ segment }) => {
  const navigate = useNavigate();

  // État pour les formulaires
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const signupForm = useForm<UnifiedRegisterFormData>({
    resolver: zodResolver(unifiedRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    }
  });

  const onLoginSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    setFormError(null);
    setSuccess(null);

    try {
      const { email, password } = values;
      const sanitizedEmail = email.trim();

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });

      if (authError) {
        setFormError(authError.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect'
          : authError.message
        );
      } else {
        loginForm.reset({ email: sanitizedEmail, password: '' });
        setSuccess('Connexion réussie ! Redirection...');
        setTimeout(() => navigate('/app/home'), 1000);
      }
    } catch (err) {
      setFormError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (values: UnifiedRegisterFormData) => {
    setIsLoading(true);
    setFormError(null);
    setSuccess(null);

    try {
      const sanitizedEmail = values.email.trim();
      const sanitizedFullName = values.fullName.trim();
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;

      const { error: signupError } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: values.password,
        options: {
          ...(redirectUrl ? { emailRedirectTo: redirectUrl } : {}),
          data: {
            full_name: sanitizedFullName,
            segment
          }
        }
      });

      if (signupError) {
        if (signupError.message === 'User already registered') {
          setFormError('Cet email est déjà utilisé. Essayez de vous connecter.');
        } else {
          setFormError(signupError.message);
        }
      } else {
        signupForm.reset();
        loginForm.reset({ email: sanitizedEmail, password: '' });
        setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
        setActiveTab('login');
      }
    } catch (err) {
      setFormError('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: 'login' | 'signup') => {
    setActiveTab(value);
    setFormError(null);
    setSuccess(null);
    setShowPassword(false);
    if (value === 'login') {
      signupForm.clearErrors();
    } else {
      loginForm.clearErrors();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-primary transition-colors">
            <Heart className="h-8 w-8 text-primary" />
            <span>EmotionsCare</span>
          </Link>
          <p className="text-gray-600 mt-2">
            {segment === 'b2b' ? 'Espace Entreprise' : 'Votre bien-être, notre priorité'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {segment === 'b2b' ? 'Accès Entreprise' : 'Bienvenue'}
            </CardTitle>
            <CardDescription className="text-center">
              Gérez votre bien-être émotionnel en toute simplicité
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>

              {/* Onglet Connexion */}
              <TabsContent value="login">
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        autoComplete="email"
                        disabled={isLoading}
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-red-600">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        autoComplete="current-password"
                        disabled={isLoading}
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-red-600">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Onglet Inscription */}
              <TabsContent value="signup">
                <form
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom complet</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Jean Dupont"
                      autoComplete="name"
                      disabled={isLoading}
                      {...signupForm.register('fullName')}
                    />
                    {signupForm.formState.errors.fullName && (
                      <p className="text-xs text-red-600">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        autoComplete="email"
                        disabled={isLoading}
                        {...signupForm.register('email')}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-xs text-red-600">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...signupForm.register('password')}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-xs text-red-600">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        autoComplete="new-password"
                        disabled={isLoading}
                        {...signupForm.register('confirmPassword')}
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-600">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      'Créer mon compte'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Messages d'erreur et de succès */}
            {formError && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{formError}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-600 text-center">
              En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </CardFooter>
        </Card>

        {/* Lien de retour */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

const UnifiedLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const segment = (searchParams.get('segment') as 'b2c' | 'b2b' | null) ?? 'b2c';

  if (segment === 'b2c') {
    return <B2CLoginPage />;
  }

  return <B2BLoginForm segment={segment} />;
};

export default UnifiedLoginPage;