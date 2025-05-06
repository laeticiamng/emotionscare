
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Shield } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Dans une vraie implémentation, nous appellerions une API ici
      // Mais nous simulons simplement un délai et un succès
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Toujours afficher ce message, que l'email existe ou non pour des raisons de sécurité
      setIsSubmitted(true);
      
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error);
      
      // Même en cas d'erreur, on affiche le même message pour des raisons de sécurité
      setIsSubmitted(true);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-[#E8F1FA]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Retour à la connexion
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-[#1B365D] mb-1">
              EmotionsCare<span className="text-xs align-super">™</span>
            </h1>
            <p className="text-slate-600">Réinitialisation de mot de passe sécurisée</p>
          </div>
        </div>

        <Card className="shadow-lg border-[#E8F1FA]">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Mot de passe oublié</CardTitle>
            </div>
            <CardDescription>
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>

          {isSubmitted ? (
            <CardContent className="space-y-4 py-6">
              <div className="bg-green-50 border border-green-100 rounded-md p-4">
                <h3 className="font-medium text-green-800 mb-1">Email envoyé</h3>
                <p className="text-green-700 text-sm">
                  Si votre adresse est correcte, vous recevrez rapidement un lien sécurisé 
                  par e-mail pour réinitialiser votre mot de passe.
                </p>
              </div>
              
              <div className="text-center mt-4">
                <Link 
                  to="/login" 
                  className="text-sm text-primary hover:underline"
                >
                  Retour à la page de connexion
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-muted"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-6">
                <Button 
                  type="submit" 
                  className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Recevoir mon lien de réinitialisation'}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Conforme RGPD - Aucune donnée personnelle n'est enregistrée</span>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
