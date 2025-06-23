
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const B2CLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Connexion Personnelle</CardTitle>
          <CardDescription>
            Accédez à votre espace de bien-être personnel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Se connecter
          </Button>
          <div className="text-center space-y-2">
            <Link to="/reset-password" className="text-sm text-blue-600 hover:underline">
              Mot de passe oublié ?
            </Link>
            <div className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/b2c/register" className="text-blue-600 hover:underline">
                S'inscrire
              </Link>
            </div>
          </div>
          <div className="text-center">
            <Link to="/choose-mode">
              <Button variant="ghost" size="sm">
                ← Changer de mode
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CLoginPage;
