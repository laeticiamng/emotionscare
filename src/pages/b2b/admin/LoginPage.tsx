
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, Lock, ArrowLeft, Shield, Key } from 'lucide-react';

const B2BAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation
      if (!email || !password || !adminCode) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      if (adminCode.length < 6) {
        throw new Error('Le code administrateur doit contenir au moins 6 caractères');
      }

      // Simulation d'authentification admin
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirection vers le dashboard admin
      navigate('/b2b/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">EmotionsCare</h1>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Accès Administrateur</CardTitle>
            <CardDescription>
              Connexion sécurisée pour les administrateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Accès sécurisé</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Cet espace est réservé aux administrateurs autorisés
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email administrateur</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminCode">Code administrateur</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="adminCode"
                    type="password"
                    placeholder="••••••••"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Vérification...' : 'Accéder au dashboard'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Link to={Routes.login()} className="text-sm text-red-600 hover:underline">
                Mot de passe oublié ?
              </Link>
              
              <div className="text-xs text-gray-500">
                Besoin d'aide ? Contactez le support technique
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to={Routes.b2bLanding()} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux options B2B
          </Link>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminLoginPage;
