
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  User, 
  Eye, 
  EyeOff,
  Google,
  Facebook,
  Apple
} from 'lucide-react';

const B2CLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de connexion
    console.log('Connexion avec:', { email, password });
    navigate('/b2c/dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Connexion avec ${provider}`);
    navigate('/b2c/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 flex items-center justify-center p-4" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 w-fit mx-auto">
              Espace Particulier
            </Badge>
            <CardTitle className="text-2xl font-bold">
              <h1>Connexion Particulier</h1>
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-300">
              Accédez à votre espace personnel de bien-être
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Connexion sociale */}
            <div className="space-y-3">
              <Button
                onClick={() => handleSocialLogin('Google')}
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 border-gray-300"
              >
                <Google className="mr-2 h-4 w-4" />
                Continuer avec Google
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSocialLogin('Facebook')}
                  variant="outline"
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleSocialLogin('Apple')}
                  variant="outline"
                  className="flex-1 bg-black text-white hover:bg-gray-800 border-black"
                >
                  <Apple className="mr-2 h-4 w-4" />
                  Apple
                </Button>
              </div>
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-2 text-sm text-slate-500">
                ou
              </span>
            </div>

            {/* Formulaire de connexion */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-normal text-blue-600 hover:text-blue-700"
                  onClick={() => navigate('/reset-password')}
                >
                  Mot de passe oublié ?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
              >
                Se connecter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              Pas encore de compte ?{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-blue-600 hover:text-blue-700"
                onClick={() => navigate('/b2c/register')}
              >
                S'inscrire
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CLoginPage;
