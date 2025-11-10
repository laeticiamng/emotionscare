import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { sanitizeInput } from '@/lib/validation/validator';

export default function UnifiedLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

      navigate('/app');
    } catch (error: any) {
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle id="login-title">Connexion</CardTitle>
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
                      <Input
                        {...field}
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.password}
                        aria-describedby={form.formState.errors.password ? "login-password-error" : undefined}
                      />
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

              <div className="text-center text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link to="/signup" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                  S'inscrire
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
