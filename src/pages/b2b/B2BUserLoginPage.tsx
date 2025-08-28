
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Mail, 
  Lock, 
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BUserLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation de connexion
    setTimeout(() => {
      if (email && password && companyCode) {
        // Redirection vers le dashboard collaborateur
        window.location.href = '/b2b/user/dashboard';
      } else {
        setError('Veuillez remplir tous les champs');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" data-testid="page-root">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Connexion Collaborateur</h1>
          </div>
          <p className="text-gray-600">
            Accédez à votre espace bien-être professionnel
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Identifiants collaborateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Code entreprise */}
              <div className="space-y-2">
                <Label htmlFor="companyCode">Code entreprise</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="companyCode"
                    type="text"
                    placeholder="ex: ACME-2024"
                    value={companyCode}
                    onChange={(e) => setCompanyCode(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connexion...
                  </div>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 space-y-2 text-center text-sm">
              <Link to={Routes.login()} className="text-blue-600 hover:underline block">
                Mot de passe oublié ?
              </Link>
              <div className="text-gray-500">
                Pas encore de compte ? Contactez votre administrateur RH
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retour */}
        <div className="mt-6 text-center">
          <Link to={Routes.b2bLanding()} className="text-gray-600 hover:text-gray-800 text-sm">
            ← Retour à la sélection
          </Link>
        </div>

        {/* Info sécurité */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Connexion sécurisée</span>
          </div>
          <p className="text-xs text-blue-700">
            Vos données sont protégées par un chiffrement de niveau bancaire et restent strictement confidentielles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default B2BUserLoginPage;
