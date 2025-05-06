
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Schéma de validation du formulaire d'inscription
const registrationSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom est obligatoire" }),
  lastName: z.string().min(2, { message: "Le nom est obligatoire" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions d'utilisation" })
  })
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const InvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationData, setInvitationData] = useState<{
    email: string;
    role: string;
    valid: boolean;
  } | null>(null);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      acceptTerms: false,
    },
  });

  // Vérifier la validité du token d'invitation
  useEffect(() => {
    const verifyInvitationToken = async () => {
      if (!token) {
        toast.error("Token d'invitation manquant");
        navigate('/');
        return;
      }

      try {
        // Vérifier le token auprès de l'API
        const { data, error } = await supabase
          .rpc('verify_invitation_token', { token_param: token });

        if (error || !data || !data.valid) {
          toast.error("Ce lien d'invitation est invalide ou a expiré");
          navigate('/');
          return;
        }

        setInvitationData(data);
      } catch (error) {
        console.error('Error verifying invitation:', error);
        toast.error("Erreur lors de la vérification de l'invitation");
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    verifyInvitationToken();
  }, [token, navigate]);

  const handleSubmit = async (data: RegistrationFormData) => {
    if (!invitationData?.email) {
      toast.error("Données d'invitation manquantes");
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer le compte utilisateur
      const { error: signUpError } = await supabase.auth.signUp({
        email: invitationData.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: invitationData.role,
          }
        }
      });

      if (signUpError) throw signUpError;

      // Marquer l'invitation comme acceptée
      const { error: updateError } = await supabase
        .rpc('accept_invitation', { token_param: token });

      if (updateError) throw updateError;

      // Connecter l'utilisateur
      await login(invitationData.email, data.password);

      toast.success("Compte activé avec succès !");
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error registering user:', error);
      toast.error(error.message || "Erreur lors de l'activation du compte");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invitationData?.valid) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Invitation invalide</CardTitle>
            <CardDescription className="text-center">
              Ce lien d'invitation est invalide ou a expiré.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-[#E8F1FA] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold mb-1 text-[#1B365D]">
            EmotionsCare<span className="text-xs align-super">™</span>
          </h1>
          <p className="text-slate-600">Activez votre compte</p>
        </div>

        <Card className="shadow-lg border-[#E8F1FA]">
          <CardHeader>
            <CardTitle>Bienvenue chez EmotionsCare</CardTitle>
            <CardDescription>
              Veuillez compléter votre inscription pour activer votre compte
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground rounded-md bg-muted/50 p-3">
                  <p>Compte à activer : <strong>{invitationData?.email}</strong></p>
                </div>

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
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
                        <Input type="password" placeholder="Créez un mot de passe sécurisé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          J'accepte les conditions d'utilisation et la politique de confidentialité
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Vos données personnelles seront anonymisées et protégées conformément au RGPD.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Activation en cours...
                    </>
                  ) : (
                    'Activer mon compte'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Cette invitation expirera sous 48 heures pour des raisons de sécurité.
        </p>
      </div>
    </div>
  );
};

export default InvitePage;
