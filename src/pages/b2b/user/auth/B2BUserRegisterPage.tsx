
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Building, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BUserRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setUserMode } = useUserMode();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    position: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      setUserMode('b2b_user');
      
      await register(formData.email, formData.password, formData.name, {
        company: formData.company,
        position: formData.position,
        role: 'b2b_user'
      });
      
      toast({
        title: "Compte créé avec succès !",
        description: "Bienvenue dans votre espace collaborateur",
        variant: "success"
      });
      
      navigate('/b2b/user/dashboard');
    } catch (error: any) {
      console.error("Register error:", error);
      setError("Erreur lors de la création du compte. Veuillez réessayer.");
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte",
        variant: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Créer un compte collaborateur</CardTitle>
          <CardDescription>
            Rejoignez votre organisation sur EmotionsCare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Prénom</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Poste</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Votre poste"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Nom de votre entreprise"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre.email@entreprise.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 caractères"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmer votre mot de passe"
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer un compte"
              )}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link 
                to="/b2b/user/login"
                className="text-sm text-primary hover:underline"
              >
                Déjà un compte ? Se connecter
              </Link>
            </div>
            
            <div className="flex items-center justify-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/b2b/selection')}
                className="flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la sélection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserRegisterPage;
