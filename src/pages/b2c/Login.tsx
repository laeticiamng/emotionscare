
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedFormField from '@/components/auth/AnimatedFormField';
import B2CAuthLayout from '@/components/auth/B2CAuthLayout';
import MagicLinkAuth from '@/components/auth/MagicLinkAuth';
import AnimatedButton from '@/components/auth/AnimatedButton';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const B2CLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password, rememberMe);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace personnel",
      });
      
      navigate('/b2c/dashboard');
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Vérifiez vos identifiants et réessayez",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <B2CAuthLayout
      title="Bienvenue"
      subtitle="Connectez-vous à votre espace personnel"
      backgroundImage="/lovable-uploads/033892e2-fdd7-440d-8a6f-7adfc4957c78.png"
    >
      {showMagicLink ? (
        <MagicLinkAuth onCancel={() => setShowMagicLink(false)} />
      ) : (
        <Card className="border-none shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                <AnimatedFormField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  icon={<Mail className="h-4 w-4" />}
                />
                
                <AnimatedFormField
                  id="password"
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={<Lock className="h-4 w-4" />}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe} 
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Se souvenir de moi
                    </Label>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/b2c/forgot-password')}
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <AnimatedButton 
                  type="submit" 
                  className="w-full" 
                  isLoading={loading}
                  loadingText="Connexion en cours..."
                >
                  <span className="flex items-center justify-center">
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </AnimatedButton>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowMagicLink(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Se connecter avec un lien magique
                </Button>
                
                <div className="text-sm text-center mt-2 text-muted-foreground">
                  Pas encore inscrit ?{" "}
                  <button 
                    type="button"
                    onClick={() => navigate('/b2c/register')}
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Créer un compte
                  </button>
                </div>
              </CardFooter>
            </form>
          </motion.div>
        </Card>
      )}
    </B2CAuthLayout>
  );
};

export default B2CLoginPage;
