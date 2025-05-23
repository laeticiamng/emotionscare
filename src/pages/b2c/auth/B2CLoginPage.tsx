
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Brain, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2CLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement Supabase authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email.endsWith('@exemple.fr')) {
        // Demo account
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace de démo"
        });
        navigate('/b2c/dashboard');
      } else {
        // Real account - should integrate with Supabase
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace bien-être"
        });
        navigate('/b2c/dashboard');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">EmotionsCare</span>
            </div>
            <CardTitle className="text-2xl">Connexion Particulier</CardTitle>
            <CardDescription>
              Retrouvez votre espace bien-être personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
            
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => navigate('/b2c/reset-password')}
                  className="text-sm"
                >
                  Mot de passe oublié ?
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Pas encore de compte ?{' '}
                  <Button
                    variant="link"
                    onClick={() => navigate('/b2c/register')}
                    className="p-0 h-auto font-semibold"
                  >
                    Créer un compte
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/choose-mode')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au choix du mode
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default B2CLoginPage;
