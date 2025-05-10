
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import Layout from '@/components/Layout';
import { InvitationVerificationResult } from '@/types';

const signupSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type SignupFormData = z.infer<typeof signupSchema>;

const InvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [invitationStatus, setInvitationStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [invitationData, setInvitationData] = useState<InvitationVerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  useEffect(() => {
    const verifyInvitation = async () => {
      if (!token) {
        setInvitationStatus('invalid');
        return;
      }

      try {
        const { data, error } = await supabase.rpc('verify_invitation_token', { token_param: token });
        
        if (error || !data || !data.valid) {
          setInvitationStatus('invalid');
          setInvitationData(data || { valid: false, message: error?.message || "Invitation invalide" });
        } else {
          setInvitationStatus('valid');
          setInvitationData(data);
        }
      } catch (error) {
        console.error("Error verifying invitation:", error);
        setInvitationStatus('invalid');
      }
    };

    verifyInvitation();
  }, [token]);

  const onSubmit = async (data: SignupFormData) => {
    if (!invitationData?.data?.email) {
      toast({
        title: "Erreur",
        description: "Données d'invitation invalides",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Register the user with Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email: invitationData.data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: invitationData.data.role,
            anonymity_code: Math.random().toString(36).substring(2, 10)
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // Accept the invitation
      const { data: acceptResult, error: acceptError } = await supabase.rpc('accept_invitation', { token_param: token });
      
      if (acceptError || !acceptResult) {
        throw new Error(acceptError?.message || "Impossible d'accepter l'invitation");
      }

      toast({
        title: "Compte créé avec succès !",
        description: "Bienvenue sur EmotionsCare. Vous pouvez maintenant vous connecter.",
      });
      
      // Redirect to login page
      navigate("/login");
      
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création du compte",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (invitationStatus === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Vérification de l'invitation</CardTitle>
              <CardDescription>Nous vérifions votre invitation...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (invitationStatus === 'invalid') {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invitation invalide</CardTitle>
              <CardDescription>
                {invitationData?.message || "Cette invitation n'est plus valide ou a expiré."}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate("/")}>
                Retourner à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Créez votre compte EmotionsCare</CardTitle>
            <CardDescription>
              Complétez votre inscription pour accéder à votre espace bien-être.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  value={invitationData?.data?.email || ''} 
                  disabled 
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Votre nom complet</Label>
                <Input
                  id="name"
                  placeholder="Prénom et Nom"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Choisissez un mot de passe sécurisé"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm font-medium text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                En créant votre compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default InvitePage;
