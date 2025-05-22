
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Mail, Building, User } from 'lucide-react';
import Shell from '@/Shell';
import { useToast } from '@/hooks/use-toast';

const CollaboratorRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'une demande d'accès
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande d'accès a été enregistrée. Vous recevrez un email lorsque votre compte sera activé."
      });
      
      navigate('/login-collaborateur');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande d'accès. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-center">Demande d'accès</CardTitle>
              <CardDescription className="text-center">
                Remplissez ce formulaire pour obtenir un accès collaborateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email professionnel</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean.dupont@entreprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Nom de votre entreprise"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full relative" 
                  disabled={isLoading}
                  variant="default"
                >
                  {isLoading ? (
                    <>
                      <span>Envoi en cours...</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : "Demander un accès"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Vous avez déjà un compte ?{' '}
                <a
                  className="text-primary underline-offset-4 hover:underline cursor-pointer"
                  onClick={() => navigate('/login-collaborateur')}
                >
                  Se connecter
                </a>
              </div>
              <Button variant="ghost" className="mt-2" onClick={() => navigate('/')}>
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default CollaboratorRegisterPage;
