
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useUserMode } from '@/contexts/UserModeContext';

const B2BUserLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { changeUserMode } = useUserMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      changeUserMode('b2b_user');
      toast.success('Connexion réussie !');
      navigate('/b2b/user/dashboard');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError('Identifiants incorrects. Veuillez réessayer.');
      toast.error('Échec de la connexion', {
        description: 'Identifiants incorrects. Veuillez réessayer.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Connexion Collaborateur</CardTitle>
            <CardDescription className="text-center">
              Accédez à votre espace collaborateur
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="collaborateur@entreprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-xs"
                    onClick={() => navigate('/b2b/user/reset-password')}
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">
                      {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              
              <div className="text-center text-sm">
                Vous n'avez pas de compte ? {" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0"
                  onClick={() => navigate('/b2b/user/register')}
                >
                  Créer un compte
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <Link to="/b2b/selection" className="text-primary hover:underline">
                  Changer de type d'accès
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BUserLogin;
