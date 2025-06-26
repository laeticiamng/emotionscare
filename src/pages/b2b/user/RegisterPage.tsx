
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, Lock, User, ArrowLeft, Users } from 'lucide-react';

const B2BUserRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.company) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (formData.password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setTimeout(() => navigate('/b2b/user/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Demande envoyée !</h2>
            <p className="text-gray-600 mb-4">
              Votre demande d'accès a été transmise à votre administrateur.
              Vous recevrez un email de confirmation sous peu.
            </p>
            <p className="text-sm text-gray-500">Redirection vers la connexion...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">EmotionsCare</h1>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Demande d'accès collaborateur</CardTitle>
            <CardDescription>
              Créez votre compte collaborateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@entreprise.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company"
                    placeholder="Nom de votre entreprise"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Envoi en cours...' : 'Demander un accès'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link to="/b2b/user/login" className="text-blue-600 hover:underline font-medium">
                  Se connecter
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/b2b/selection" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux options B2B
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BUserRegisterPage;
