
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { toast } from 'sonner';
import { UserRole } from '@/types/user';

interface RegisterProps {
  mode?: 'b2c' | 'b2b_user';
}

const getModeTitle = (mode: string) => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    default:
      return 'Utilisateur';
  }
};

const getModeColor = (mode: string) => {
  switch (mode) {
    case 'b2c':
      return 'text-primary bg-primary/10';
    case 'b2b_user':
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    default:
      return 'text-primary bg-primary/10';
  }
};

const getModeDashboardPath = (mode: string) => {
  switch (mode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    default:
      return '/dashboard';
  }
};

const Register: React.FC<RegisterProps> = ({ mode = 'b2c' }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setUserMode } = useUserMode();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call register function from AuthContext
      await register({
        email,
        password,
        firstName,
        lastName,
        role: mode as UserRole
      });
      
      // Set user mode after successful registration
      setUserMode(mode as UserRole);
      
      // Show success message
      toast.success('Inscription réussie', {
        description: `Bienvenue dans votre espace ${getModeTitle(mode)}`
      });
      
      // Navigate to the dashboard
      navigate(getModeDashboardPath(mode));
    } catch (error) {
      console.error('Registration error:', error);
      setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <div className={`mx-auto mb-4 w-12 h-12 rounded-full ${getModeColor(mode)} flex items-center justify-center`}>
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl text-center">
              Inscription {getModeTitle(mode)}
            </CardTitle>
            <CardDescription className="text-center">
              Créez votre compte pour accéder à EmotionsCare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
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
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms} 
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                />
                <Label 
                  htmlFor="terms" 
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  J'accepte les{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive p-2 bg-destructive/10 rounded-md"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="text-sm text-muted-foreground">
                <p>En vous inscrivant, vous bénéficiez de 5 jours d'essai gratuit.</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Inscription en cours...</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  </>
                ) : "S'inscrire"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link 
                to={`/${mode}/login`} 
                className="text-primary hover:underline"
              >
                Se connecter
              </Link>
            </div>
            
            <div className="flex space-x-4 mt-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                Accueil
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/choose-mode')}>
                Changer de mode
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
