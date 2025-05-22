
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate login for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo login - in production, this would be connected to a real auth system
      if (email === 'admin@exemple.fr' && password === 'admin') {
        toast.success('Connexion réussie! Redirection...');
        // Set login flag in session storage
        sessionStorage.setItem('just_logged_in', 'true');
        localStorage.setItem('auth_user', JSON.stringify({ 
          id: '1', 
          email: 'admin@exemple.fr',
          name: 'Admin',
          role: 'admin' 
        }));
        navigate('/dashboard');
      } else if (email === 'utilisateur@exemple.fr' && password === 'admin') {
        toast.success('Connexion réussie! Redirection...');
        // Set login flag in session storage
        sessionStorage.setItem('just_logged_in', 'true');
        localStorage.setItem('auth_user', JSON.stringify({ 
          id: '2', 
          email: 'utilisateur@exemple.fr',
          name: 'Utilisateur',
          role: 'user'
        }));
        navigate('/dashboard');
      } else if (email === 'collaborateur@exemple.fr' && password === 'admin') {
        toast.success('Connexion réussie! Redirection...');
        // Set login flag in session storage
        sessionStorage.setItem('just_logged_in', 'true');
        localStorage.setItem('auth_user', JSON.stringify({ 
          id: '3', 
          email: 'collaborateur@exemple.fr',
          name: 'Collaborateur',
          role: 'collaborator'
        }));
        navigate('/dashboard');
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Shell>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
              <CardDescription className="text-center">
                Accédez à votre espace personnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="email"
                      placeholder="Votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      </span>
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm w-full">
                <span className="text-muted-foreground">Pas encore de compte? </span>
                <Link to="/register" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </div>
              
              <div className="text-xs text-center text-muted-foreground w-full">
                <p>Demo: utilisez admin@exemple.fr / admin</p>
                <p>ou utilisateur@exemple.fr / admin</p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default LoginPage;
