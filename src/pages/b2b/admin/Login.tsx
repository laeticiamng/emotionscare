
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const loginSchema = z.object({
  companyId: z.string().min(3, { message: 'L\'ID d\'entreprise est requis' }),
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const B2BAdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Si déjà authentifié, rediriger vers dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/b2b/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      companyId: '',
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Simuler une demande d'API avec un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await login(values.email, values.password);
      setUserMode('b2b_admin');
      
      toast.success('Connexion réussie');
      navigate('/b2b/admin/dashboard');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast.error(error.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Administration</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour gérer votre espace entreprise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="ID de votre organisation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email administrateur</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@entreprise.com" {...field} />
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label htmlFor="remember" className="text-sm">
                        Se souvenir de moi
                      </label>
                    </FormItem>
                  )}
                />
                
                <Button 
                  variant="link" 
                  className="p-0" 
                  onClick={() => toast.info("Contactez le support pour réinitialiser votre mot de passe")}
                >
                  Mot de passe oublié?
                </Button>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Besoin d'un compte administrateur? </span>
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={() => toast.info("Contactez notre équipe commerciale pour créer un compte administrateur")}
            >
              Contacter le service commercial
            </Button>
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/b2b/selection')}
              className="mr-2"
            >
              Retour
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
            >
              Accueil
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default B2BAdminLogin;
