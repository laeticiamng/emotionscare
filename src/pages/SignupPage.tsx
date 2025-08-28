/**
 * SignupPage - Page d'inscription unifiée
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Routes } from '@/routerV2/helpers';
import { Heart, Mail, Lock, User, ArrowLeft } from 'lucide-react';

const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment') as 'b2c' | 'b2b' | null;

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempt:', { ...formData, segment });
    // TODO: Implémentation signup
  };

  const getTitle = () => {
    switch (segment) {
      case 'b2c': return 'Créer votre compte personnel';
      case 'b2b': return 'Créer votre compte professionnel';
      default: return 'Créer votre compte';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
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
              <CardTitle className="text-center">Choisissez votre profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={Routes.signup({ segment: 'b2c' })}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Particulier - Usage personnel
                </Button>
              </Link>
              <Link to={Routes.signup({ segment: 'b2b' })}>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Professionnel - Usage en équipe
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{getTitle()}</CardTitle>
            {segment && (
              <p className="text-center text-sm text-gray-600">
                Mode {segment === 'b2c' ? 'Particulier' : 'Professionnel'}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-9"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Créer mon compte
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link 
                  to={segment ? Routes.login({ segment }) : Routes.login()} 
                  className="text-primary hover:underline font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>

            {segment && (
              <div className="mt-4 text-center">
                <Link 
                  to={Routes.signup()} 
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Changer de profil
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          En créant un compte, vous acceptez nos{' '}
          <a href="#" className="underline">Conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="underline">Politique de confidentialité</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;