
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const formSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

interface LoginForm {
  email: string;
  password: string;
}

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      
      // Si la connexion réussit, nous simulons la vérification du rôle administrateur
      // Dans un vrai cas d'utilisation, cette logique serait dans le contexte d'authentification
      const mockAdminCheck = async () => {
        // Simule une vérification de rôle admin
        return {
          role: UserRole.ADMIN,
          name: 'Admin User'
        };
      };
      
      const adminResult = await mockAdminCheck();
      
      if (adminResult.role === UserRole.ADMIN) {
        toast({
          title: 'Connexion réussie',
          description: `Bienvenue ${adminResult.name}`,
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Accès refusé',
          description: 'Vous n\'avez pas les droits administrateur nécessaires.',
        });
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: 'Identifiants invalides ou problème de connexion.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte administrateur pour accéder au tableau de bord
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm"
                  type="button"
                  onClick={() => navigate('/admin/reset-password')}
                >
                  Mot de passe oublié?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Retour
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
