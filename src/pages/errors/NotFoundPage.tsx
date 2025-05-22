
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Home, Search, HelpCircle, Heart, User, MapPin } from 'lucide-react';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <Shell hideNav hideFooter>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/30">
        <motion.div 
          className="max-w-md w-full text-center bg-background rounded-lg p-8 shadow-lg border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AlertCircle className="h-12 w-12 text-primary" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
            <p className="text-muted-foreground mb-8">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Retour
            </Button>
            
            <Button asChild className="flex items-center gap-2">
              <Link to="/">
                <Home size={16} />
                Page d'accueil
              </Link>
            </Button>
            
            {isAuthenticated && (
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Search size={16} />
                  Tableau de bord
                </Link>
              </Button>
            )}
          </motion.div>
          
          <motion.div 
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link to="/support" className="block p-4 border rounded-lg hover:bg-muted transition-colors group">
              <HelpCircle className="h-6 w-6 mx-auto mb-2 text-primary transition-transform duration-300 group-hover:scale-110" />
              <p className="font-medium">Support</p>
              <p className="text-sm text-muted-foreground">Contactez notre équipe</p>
            </Link>
            
            {isAuthenticated ? (
              <Link to="/scan" className="block p-4 border rounded-lg hover:bg-muted transition-colors group">
                <Heart className="h-6 w-6 mx-auto mb-2 text-red-500 transition-transform duration-300 group-hover:scale-110" />
                <p className="font-medium">Scan émotionnel</p>
                <p className="text-sm text-muted-foreground">Analysez vos émotions</p>
              </Link>
            ) : (
              <Link to="/register" className="block p-4 border rounded-lg hover:bg-muted transition-colors group">
                <User className="h-6 w-6 mx-auto mb-2 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <p className="font-medium">Créer un compte</p>
                <p className="text-sm text-muted-foreground">Rejoignez-nous</p>
              </Link>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            <p className="flex items-center justify-center gap-1">
              <MapPin size={14} />
              Vous cherchez quelque chose en particulier ?
            </p>
            <Button variant="link" asChild size="sm">
              <Link to="/sitemap">Consultez notre plan du site</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default NotFoundPage;
