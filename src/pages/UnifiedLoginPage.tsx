import React, { useState } from 'react';
import { Heart, ArrowLeft, Eye, EyeOff } from 'lucide-react';
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

interface LocationState {
  from?: string;
}

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
      password: ''
    }
  });

  const handleLogin = async (values: LoginFormData) => {
    try {
      // Sanitize email before sending
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

      // Rediriger vers la page initialement demandée ou vers /app par défaut
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-start p-4 pt-20 pb-40">
      {/* Back button */}
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle id="login-title" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte EmotionsCare
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
                        aria-describedby={form.formState.errors.email ? "login-email-error" : undefined}
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
                          aria-describedby={form.formState.errors.password ? "login-password-error" : undefined}
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
                  <Link to="/signup" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                    S'inscrire
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ForgotPasswordDialog
        open={forgotOpen}
        onOpenChange={setForgotOpen}
        email={form.getValues('email')}
      />
    </div>
  );
}
