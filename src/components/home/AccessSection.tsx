
import React from 'react';
import { User, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AccessSection: React.FC = () => {
  return (
    <motion.section 
      className="mb-16 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Choisissez votre espace</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Accédez à l'environnement adapté à vos besoins, que vous soyez un particulier ou une entreprise
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* B2C Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-800/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="bg-blue-100 dark:bg-blue-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Particulier</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Accédez à votre espace personnel pour prendre soin de votre bien-être émotionnel
            </p>
            <Button 
              onClick={() => window.location.href = '/login'}
              size="lg" 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-md"
            >
              <User className="mr-2 h-5 w-5" />
              Espace Particulier
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* B2B Card */}
          <div className="bg-gradient-to-br from-gray-50 to-indigo-100 dark:from-gray-900/50 dark:to-indigo-900/30 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="bg-indigo-100 dark:bg-indigo-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Entreprise</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Solutions de bien-être émotionnel pour vos équipes et votre organisation
            </p>
            <Button 
              onClick={() => window.location.href = '/business'}
              size="lg" 
              variant="outline"
              className="w-full border-2 border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300 shadow-sm"
            >
              <Building className="mr-2 h-5 w-5" />
              Espace Entreprise
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AccessSection;
