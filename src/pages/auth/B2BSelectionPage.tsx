
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelection = (type: 'user' | 'admin') => {
    if (type === 'user') {
      navigate('/b2b/user/login');
    } else {
      navigate('/b2b/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/choose-mode')}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-3xl font-bold">Accès Entreprise</CardTitle>
            <CardDescription className="text-lg mt-2">
              Choisissez votre type d'accès à la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                onClick={() => handleSelection('user')}
                variant="outline"
                className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all w-full"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Collaborateur</h3>
                  <p className="text-sm text-muted-foreground">
                    Accès collaborateur avec fonctionnalités de bien-être personnel et d'équipe
                  </p>
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                onClick={() => handleSelection('admin')}
                variant="outline"
                className="h-auto flex flex-col items-center gap-4 p-8 border-2 hover:border-primary hover:bg-primary/5 transition-all w-full"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">Administrateur</h3>
                  <p className="text-sm text-muted-foreground">
                    Gestion complète de l'entreprise avec analytics et administration
                  </p>
                </div>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BSelectionPage;
