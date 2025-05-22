
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserModeLabel } from '@/utils/userModeHelpers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RegisterPageProps {
  mode?: 'b2c' | 'b2b_user' | 'b2b_admin';
}

const RegisterPage: React.FC<RegisterPageProps> = ({ mode = 'b2c' }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Champs obligatoires", {
        description: "Veuillez remplir tous les champs"
      });
      return;
    }
    
    if (!acceptTerms) {
      toast.error("Conditions d'utilisation", {
        description: "Veuillez accepter les conditions d'utilisation"
      });
      return;
    }
    
    // Exemple d'inscription de démonstration. Dans une vraie application, il faudrait
    // s'authentifier auprès d'un backend
    register({
      id: '1',
      email,
      name,
      role: mode
    });
    
    toast.success("Inscription réussie", {
      description: "Redirection vers votre tableau de bord"
    });
    
    setTimeout(() => {
      if (mode === 'b2c') {
        navigate('/b2c/dashboard');
      } else if (mode === 'b2b_user') {
        navigate('/b2b/user/dashboard');
      } else if (mode === 'b2b_admin') {
        navigate('/b2b/admin/dashboard');
      }
    }, 1000);
  };
  
  const getModeIcon = () => {
    if (mode === 'b2c') return <User className="h-6 w-6" />;
    if (mode === 'b2b_user') return <Building2 className="h-6 w-6" />;
    return <ShieldCheck className="h-6 w-6" />;
  };
  
  const getModeColor = () => {
    if (mode === 'b2c') return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    if (mode === 'b2b_user') return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className={getModeColor()}>
            <div className="flex items-center gap-3">
              {getModeIcon()}
              <div>
                <CardTitle className="text-xl">Créer un compte</CardTitle>
                <CardDescription className="text-foreground/70">
                  Mode {getUserModeLabel(mode)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="votre@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <p className="text-xs text-muted-foreground">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    J'accepte les{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      conditions d'utilisation
                    </Link>
                  </label>
                </div>
                
                <Button type="submit" className="w-full">
                  Créer mon compte
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <div className="text-sm text-center text-muted-foreground">
              Déjà un compte ?{' '}
              <Link
                to={
                  mode === 'b2c'
                    ? '/b2c/login'
                    : mode === 'b2b_user'
                    ? '/b2b/user/login'
                    : '/b2b/admin/login'
                }
                className="text-primary hover:underline"
              >
                Se connecter
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/mode-switcher')}
              >
                Changer de mode
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
