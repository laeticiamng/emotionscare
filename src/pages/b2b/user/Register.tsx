
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [companyCode, setCompanyCode] = React.useState('');
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !companyCode) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Attention",
        description: "Vous devez accepter les conditions d'utilisation",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulation d'inscription réussie
      await new Promise(resolve => setTimeout(resolve, 1000));
      await register({ 
        name, 
        email, 
        password, 
        role: 'b2b_user',
        company_code: companyCode,
        job_title: 'Collaborateur',
        department: 'Non spécifié'
      });
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur l'espace collaborateur !",
      });
      navigate('/b2b/user/dashboard');
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50/80 to-white dark:from-slate-950 dark:to-slate-900/50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Créer un compte collaborateur</CardTitle>
            <CardDescription className="text-center">
              Rejoignez votre entreprise sur EmotionsCare
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  placeholder="Jean Dupont" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email professionnelle</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="prenom.nom@entreprise.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyCode">Code d'invitation entreprise</Label>
                <Input 
                  id="companyCode" 
                  placeholder="ABC123" 
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms} 
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} 
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte les conditions d'utilisation et la politique de confidentialité
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer mon compte"}
              </Button>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Déjà un compte? </span>
                <Button 
                  variant="link" 
                  className="p-0 text-sm text-blue-600 dark:text-blue-400" 
                  onClick={() => navigate('/b2b/user/login')}
                  type="button"
                >
                  Se connecter
                </Button>
              </div>
              <Button 
                variant="ghost" 
                type="button"
                className="mt-2" 
                onClick={() => navigate('/b2b/selection')}
              >
                Retour à la sélection
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Shell>
  );
};

export default Register;
