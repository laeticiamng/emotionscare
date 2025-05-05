
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Shield } from 'lucide-react';
import { isAdminRole } from '@/utils/roleUtils';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      
      // Check if the user has admin privileges
      if (!isAdminRole(user?.role)) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration nécessaires",
          variant: "destructive"
        });
        navigate('/'); // Redirect to home if not admin
      }
      // If admin, navigation is handled in the auth context
      
    } catch (error) {
      // Error is handled in the auth context
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
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Retour à l'accueil
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-1 text-[#1B365D]">
              EmotionsCare<span className="text-xs align-super">™</span>
            </h1>
            <p className="text-slate-600 flex items-center justify-center">
              par ResiMax<span className="text-xs align-super">™</span> - <Shield size={16} className="mx-1 text-[#1B365D]" /> Espace Direction
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-[#E8F1FA]">
          <CardHeader>
            <CardTitle>Administration</CardTitle>
            <CardDescription>
              Identifiez-vous pour accéder aux indicateurs de bien-être
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white hover:shadow-[0_0_15px_rgba(168,230,207,0.3)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Connexion...' : 'Connexion Admin'}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground mt-4">
                * Pour la démo, utilisez: admin@example.com (mot de passe : admin)
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
