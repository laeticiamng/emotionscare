
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BusinessPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 flex flex-col items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Espace Entreprise</h1>
          <p className="text-muted-foreground">Veuillez sélectionner votre type d'accès</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/login')} 
            className="w-full h-16 text-lg bg-blue-500 hover:bg-blue-600 shadow-md transition-all duration-300"
          >
            <User className="mr-3 h-6 w-6" />
            Collaborateur
            <ArrowRight className="ml-auto h-5 w-5" />
          </Button>
          
          <Button 
            onClick={() => navigate('/admin-login')} 
            className="w-full h-16 text-lg bg-gray-800 hover:bg-gray-900 shadow-md transition-all duration-300"
            variant="default"
          >
            <Shield className="mr-3 h-6 w-6" />
            Administration / RH
            <ArrowRight className="ml-auto h-5 w-5" />
          </Button>
          
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="w-full mt-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessPage;
