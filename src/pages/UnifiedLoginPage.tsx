import React, { useState } from 'react';
import { Heart, ArrowLeft, Eye, EyeOff, Shield, Users, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { sanitizeInput } from '@/lib/validation/validator';
import { getFriendlyAuthError } from '@/lib/auth/authErrorService';
import ForgotPasswordDialog from '@/pages/b2c/login/ForgotPasswordDialog';
import { usePageSEO } from '@/hooks/usePageSEO';
import { motion } from 'framer-motion';

interface LocationState {
  from?: string;
}

const SOCIAL_PROOF = [
  { icon: Users, text: 'Utilisé par des soignants & étudiants en santé' },
  { icon: Shield, text: 'Données chiffrées et conformes RGPD' },
  { icon: Sparkles, text: 'Exercices validés en 3 minutes chrono' },
] as const;

export default function UnifiedLoginPage() {
  usePageSEO({
    title: 'Connexion',
    description: 'Connectez-vous à votre espace EmotionsCare pour accéder à vos outils de régulation émotionnelle.',
    canonical: 'https://emotionscare.com/login',
    noIndex: true,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormData) => {
    try {
      const sanitizedEmail = sanitizeInput(values.email);

      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté',
      });

      const from = (location.state as LocationState)?.from || '/app';
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const friendly = getFriendlyAuthError(error);
      toast({
        title: 'Erreur de connexion',
        description: friendly.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - Branding & social proof (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary-glow)/0.3),transparent_60%)]" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
              <Heart className="h-8 w-8" aria-hidden="true" />
              <span className="font-display text-2xl font-bold">EmotionsCare</span>
            </Link>

            <h1 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight mb-6">
              Prenez soin de<br />vos émotions.
            </h1>

            <p className="text-lg text-primary-foreground/80 mb-10 max-w-md">
              La plateforme de régulation émotionnelle conçue pour les professionnels de santé et les étudiants.
            </p>

            <div className="space-y-4">
              {SOCIAL_PROOF.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-primary-foreground/90">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Mobile back button */}
        <div className="absolute top-4 left-4 lg:hidden">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-3">
            <Heart className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">EmotionsCare</span>
        </div>

        <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <CardTitle id="login-title" className="font-display text-2xl font-bold">
              Bon retour parmi nous
            </CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4" noValidate aria-labelledby="login-title">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="login-email">
                        Email <span className="text-destructive" aria-label="requis">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="login-email"
                          type="email"
                          placeholder="votre@email.fr"
                          autoComplete="email"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.email}
                          aria-describedby={form.formState.errors.email ? 'login-email-error' : undefined}
                        />
                      </FormControl>
                      <FormMessage id="login-email-error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="login-password">
                        Mot de passe <span className="text-destructive" aria-label="requis">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            aria-required="true"
                            aria-invalid={!!form.formState.errors.password}
                            aria-describedby={form.formState.errors.password ? 'login-password-error' : undefined}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage id="login-password-error" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                  aria-busy={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Connexion...' : 'Se connecter'}
                </Button>

                <div className="text-center text-sm text-muted-foreground space-y-2">
                  <div>
                    <button
                      type="button"
                      onClick={() => setForgotOpen(true)}
                      className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div>
                    Pas encore de compte ?{' '}
                    <Link
                      to="/signup"
                      className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      S'inscrire gratuitement
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Mobile social proof */}
        <div className="lg:hidden mt-8 space-y-3 px-4 max-w-md w-full">
          {SOCIAL_PROOF.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-muted-foreground">
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="text-xs">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <ForgotPasswordDialog
        open={forgotOpen}
        onOpenChange={setForgotOpen}
        email={form.getValues('email')}
      />
    </div>
  );
}
