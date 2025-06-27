
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

const B2CLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulation de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue dans votre espace personnel EmotionsCare.",
      });
      
      navigate('/b2c/dashboard');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Connexion sociale",
      description: `La connexion via ${provider} sera bientôt disponible !`,
    });
  };

  return (
    <B2CAuthLayout
      title="Connexion Personnelle"
      subtitle="Accédez à votre espace de bien-être émotionnel"
    >
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Se connecter</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte EmotionsCare
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Boutons de connexion sociale */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('Google')}
              className="w-full"
            >
              <FcGoogle className="w-4 h-4 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('Facebook')}
              className="w-full"
            >
              <FaFacebook className="w-4 h-4 mr-2 text-blue-600" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('Apple')}
              className="w-full"
            >
              <FaApple className="w-4 h-4 mr-2" />
              Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>

          {/* Formulaire de connexion */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/auth/reset-password"
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Pas encore de compte ? </span>
            <Link
              to="/b2c/register"
              className="text-primary hover:underline font-medium"
            >
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </B2CAuthLayout>
  );
};

export default B2CLoginPage;
