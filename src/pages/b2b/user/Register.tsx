
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const registerSchema = z.object({
  companyCode: z.string().min(3, { message: 'Le code entreprise est requis' }),
  name: z.string().min(2, { message: 'Le nom complet est requis' }),
  email: z.string().email({ message: 'Adresse e-mail professionnelle invalide' })
    .refine((email) => /@.+\..+$/.test(email), {
      message: "Veuillez utiliser une adresse e-mail professionnelle valide",
    }),
  position: z.string().min(2, { message: 'Votre poste est requis' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const B2BUserRegister: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const { setUserMode } = useUserMode();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Si déjà authentifié, rediriger vers dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/b2b/user/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyCode: '',
      name: '',
      email: '',
      position: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simuler une demande d'API avec un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await register(values.email, values.password, values.name, 'b2b_user', {
        companyCode: values.companyCode,
        position: values.position
      });
      setUserMode('b2b_user');
      
      toast.success('Inscription réussie');
      navigate('/b2b/user/dashboard');
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      setError(error.message || 'Échec de l\'inscription. Veuillez réessayer.');
      toast.error('Échec de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Créer un compte collaborateur</CardTitle>
          <CardDescription className="text-center">
            Remplissez le formulaire ci-dessous pour accéder à la plateforme d'entreprise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Obtenu auprès de votre administrateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} />
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
                    <FormLabel>Email professionnel</FormLabel>
                    <FormControl>
                      <Input placeholder="jean.dupont@entreprise.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste / Fonction</FormLabel>
                    <FormControl>
                      <Input placeholder="Responsable marketing" {...field} />
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
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        J'accepte les{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          conditions d'utilisation
                        </Link>{' '}
                        et la{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          politique de confidentialité
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inscription...
                  </>
                ) : (
                  'S\'inscrire'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Vous avez déjà un compte? </span>
            <Link to="/b2b/user/login" className="text-primary hover:underline">
              Se connecter
            </Link>
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

export default B2BUserRegister;
