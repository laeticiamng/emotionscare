
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2CRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation d'inscription puis connexion automatique
      await login(formData.email, formData.password, 'b2c');
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue sur EmotionsCare !",
      });
      navigate('/b2c/dashboard');
    } catch (error) {
      toast({
        title: "Erreur lors de la création du compte",
        description: "Une erreur est survenue, veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/b2c/login')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-pink-100 dark:bg-pink-900 rounded-full w-fit">
              <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
            <CardTitle className="text-2xl">Créer un compte personnel</CardTitle>
            <CardDescription>
              Rejoignez EmotionsCare pour votre bien-être
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer mon compte'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Déjà un compte ?{' '}
                <Button 
                  variant="link" 
                  onClick={() => navigate('/b2c/login')}
                  className="p-0 h-auto text-pink-600"
                >
                  Se connecter
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CRegisterPage;
