
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft } from 'lucide-react';

const B2CLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement authentication logic
    console.log('B2C Login:', { email, password });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center" data-testid="page-root">
      <div className="w-full max-w-md p-4">
        <Link to="/choose-mode" className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Changer de profil
        </Link>

        <Card>
          <CardHeader className="text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Connexion Particulier</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
            
            <div className="mt-4 text-center space-y-2">
              <Link to="/b2c/register" className="text-sm text-primary hover:underline block">
                Créer un compte
              </Link>
              <Link to="/forgot-password" className="text-sm text-muted-foreground hover:underline block">
                Mot de passe oublié ?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CLoginPage;
