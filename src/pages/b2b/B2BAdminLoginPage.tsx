
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Mail, 
  Lock, 
  Crown,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BAdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        window.location.href = '/b2b/admin/dashboard';
      } else {
        setError('Veuillez remplir tous les champs');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4" data-testid="page-root">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Connexion Administrateur
            </h1>
          </div>
          <p className="text-gray-600">
            Accès privilégié aux outils de gestion RH
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-xl border-2 border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Identifiants administrateur
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email */}
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
                    className="pl-10 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe sécurisé</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-purple-200 focus:border-purple-400"
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
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authentification...
                  </div>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Accès Administrateur
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 space-y-2 text-center text-sm">
              <Link to="/admin/forgot-password" className="text-purple-600 hover:underline block">
                Récupération d'accès administrateur
              </Link>
              <div className="text-gray-500">
                Besoin d'aide ? Contactez le support technique
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retour */}
        <div className="mt-6 text-center">
          <Link to="/b2b/selection" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Retour à la sélection
          </Link>
        </div>

        {/* Informations de sécurité */}
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Sécurité renforcée</span>
            </div>
            <p className="text-xs text-purple-700">
              L'accès administrateur est soumis à une authentification à double facteur et un audit de sécurité complet.
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Responsabilités</span>
            </div>
            <p className="text-xs text-blue-700">
              En tant qu'administrateur, vous avez accès aux données agrégées et anonymisées de votre organisation selon les règles RGPD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminLoginPage;
