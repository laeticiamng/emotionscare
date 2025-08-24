
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Email change form schema
const emailFormSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
});

// Password change form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères" }),
  newPassword: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères" }),
  confirmPassword: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });
  
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const handleEmailChange = async (values: z.infer<typeof emailFormSchema>) => {
    if (!user) return;
    
    setIsEmailSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        email: values.email 
      });
      
      if (error) throw error;
      
      toast({
        title: "E-mail mis à jour",
        description: "Un e-mail de confirmation a été envoyé à votre nouvelle adresse.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour l'e-mail.",
        variant: "destructive",
      });
    } finally {
      setIsEmailSubmitting(false);
    }
  };
  
  const handlePasswordChange = async (values: z.infer<typeof passwordFormSchema>) => {
    if (!user) return;
    
    setIsPasswordSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: values.newPassword 
      });
      
      if (error) throw error;
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });
      
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le mot de passe.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-semibold mb-8">Paramètres du compte</h1>
      
      {/* Email Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Modifier l'adresse e-mail</CardTitle>
          <CardDescription>
            Mettez à jour l'adresse e-mail associée à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailChange)}>
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse e-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Un e-mail de confirmation sera envoyé à cette adresse.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="mt-4" 
                disabled={isEmailSubmitting}
              >
                {isEmailSubmitting ? "Mise à jour..." : "Mettre à jour l'e-mail"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Modifier le mot de passe</CardTitle>
          <CardDescription>
            Mettez à jour le mot de passe de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe actuel</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="mt-2" 
                disabled={isPasswordSubmitting}
              >
                {isPasswordSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
