
/**
 * LoginPage - Page de connexion unifiée
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Routes } from '@/routerV2/helpers';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { getFriendlyAuthError } from '@/lib/auth/authErrorService';
import { toast } from '@/hooks/use-toast';
import { Heart, Mail, Lock, User, ArrowLeft } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment') as 'b2c' | 'b2b' | null;

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const { login, isLoading } = useAuth();
  const { navigateAfterLogin } = useAuthNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
      
      // Redirection automatique après connexion
      navigateAfterLogin();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Utilisation du service d'erreur pour des messages UX-friendly
      const { message } = getFriendlyAuthError(error);
      
      toast({
        title: "Erreur de connexion",
        description: message,
        variant: "destructive",
      });
    }
  };

  const getTitle = () => {
    switch (segment) {
      case 'b2c': return 'Connexion Particulier';
      case 'b2b': return 'Connexion Professionnelle';
      default: return 'Connexion';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={Routes.home()} className="inline-flex items-center space-x-2 mb-6 text-gray-600 hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'accueil</span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">EmotionsCare</h1>
          </div>
        </div>

        {/* Segment Selection */}
        {!segment && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Comment souhaitez-vous vous connecter ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={Routes.login({ segment: 'b2c' })}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Compte Particulier
                </Button>
              </Link>
              <Link to={Routes.login({ segment: 'b2b' })}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Compte Professionnel
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{getTitle()}</CardTitle>
            {segment && (
              <p className="text-center text-sm text-gray-600">
                Connectez-vous à votre espace {segment === 'b2c' ? 'personnel' : 'professionnel'}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link 
                  to={segment ? Routes.signup({ segment }) : Routes.signup()} 
                  className="text-primary hover:underline font-medium"
                >
                  S'inscrire
                </Link>
              </p>
            </div>

            {segment && (
              <div className="mt-4 text-center">
                <Link 
                  to={Routes.login()} 
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Changer de profil
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
