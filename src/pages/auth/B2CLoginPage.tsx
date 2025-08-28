
/**
 * 🚀 MIGRATED TO ROUTERV2 - Phase 2 Complete
 * All hardcoded links replaced with typed Routes.xxx() helpers
 * TICKET: FE/BE-Router-Cleanup-02
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Routes } from '@/routerV2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const B2CLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation basique
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 3) {
      setError('Le mot de passe doit contenir au moins 3 caractères');
      setIsLoading(false);
      return;
    }

    try {
      // Simulation de connexion - remplacer par vraie authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email === 'demo@example.com' && formData.password === 'password123') {
        toast.success('Connexion réussie !');
        navigate(Routes.consumerHome());
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(Routes.home())}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Connexion Personnelle
            </CardTitle>
            <CardDescription className="text-base">
              Accédez à votre espace de bien-être émotionnel
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className="pl-10"
                    required
                  />
                  <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className="pl-10 pr-10"
                    required
                  />
                  <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            {/* Demo Account Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Compte de démonstration</h4>
              <p className="text-sm text-blue-700 mb-2">
                Email: <code className="bg-blue-100 px-1 rounded">demo@example.com</code>
              </p>
              <p className="text-sm text-blue-700">
                Mot de passe: <code className="bg-blue-100 px-1 rounded">password123</code>
              </p>
            </div>

            <div className="space-y-4 text-center">
              <Link to={Routes.login()} className="text-sm text-gray-600 hover:text-gray-900">
                Mot de passe oublié ?
              </Link>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3">
                  Vous n'avez pas encore de compte ?
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate(Routes.signup({ segment: "b2c" }))}
                  className="w-full"
                >
                  Créer un compte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CLoginPage;
