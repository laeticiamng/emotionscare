
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre adresse email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API request for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Instructions envoyées ! Consultez votre boîte mail');
      setSubmitted(true);
    } catch (error) {
      toast.error('Une erreur est survenue');
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
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
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Réinitialisation du mot de passe
              </CardTitle>
              <CardDescription className="text-center">
                Entrez votre adresse email pour réinitialiser votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email"
                        placeholder="Votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
                    <p className="text-green-700 dark:text-green-400 text-sm">
                      Si votre adresse email est associée à un compte, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="w-full"
                  >
                    Retourner à la page de connexion
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link 
                to="/login" 
                className="text-sm text-muted-foreground flex items-center hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Retour à la connexion
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default ForgotPasswordPage;
