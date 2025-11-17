import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Loader2, LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { b2cAuthService } from '@/services/auth';
import { toast } from '@/hooks/use-toast';
import { routes } from '@/lib/routes';

import ForgotPasswordDialog from './ForgotPasswordDialog';

const B2CLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setFormError(null);

    try {
      await b2cAuthService.login(values);
      toast({
        title: 'Connexion réussie',
        description: 'Ravi de vous revoir !',
        variant: 'success',
      });
      navigate(routes.consumer.dashboard());
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleForgotPassword = () => {
    setEmailForReset(form.getValues('email'));
    setForgotPasswordOpen(true);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <B2CAuthLayout
      title="Espace Particulier"
      subtitle="Reprenez votre parcours émotionnel en toute sérénité."
    >
      <Card className="shadow-xl border border-border/60">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            Connexion sécurisée
          </CardTitle>
          <CardDescription>
            Identifiez-vous avec votre email et votre mot de passe pour accéder à votre tableau de bord.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              data-testid="b2c-login-form"
              noValidate
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="vous@example.com"
                          autoComplete="email"
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="pl-10 pr-10"
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                          disabled={isSubmitting}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="remember-me" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isSubmitting}
                  />
                  Se souvenir de moi
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-primary hover:underline"
                  disabled={isSubmitting}
                  data-testid="forgot-password-trigger"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {formError && (
                <Alert
                  variant="destructive"
                  className="border-destructive/70"
                  data-testid="auth-error"
                >
                  <AlertTitle>Connexion impossible</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Connexion sécurisée via Supabase et cryptage SSL.
              </p>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                data-testid="submit-login"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Connexion en cours
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Se connecter
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-center text-sm">
          <p className="text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link
              to={routes.auth.b2cRegister()}
              className="font-medium text-primary hover:underline"
            >
              Créer un compte gratuit
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            Besoin d'aide ? Contactez{' '}
            <Link to="/contact" className="font-medium text-primary hover:underline">
              notre support
            </Link>
            .
          </p>
        </CardFooter>
      </Card>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        email={emailForReset}
      />
    </B2CAuthLayout>
  );
};

export default B2CLoginPage;
