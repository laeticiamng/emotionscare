
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan, Mic, Type, Camera } from 'lucide-react';

const ScanPage: React.FC = () => {
  const scanMethods = [
    {
      title: 'Scan vocal',
      description: 'Analysez vos émotions par la voix',
      icon: Mic,
      color: 'bg-blue-500'
    },
    {
      title: 'Scan textuel',
      description: 'Exprimez vos ressentis par écrit',
      icon: Type,
      color: 'bg-green-500'
    },
    {
      title: 'Scan visuel',
      description: 'Expression faciale et gestuelle',
      icon: Camera,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <Scan className="h-16 w-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Scanner émotionnel</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Analysez vos émotions en temps réel avec notre IA avancée
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {scanMethods.map((method, index) => (
          <motion.div
            key={method.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle>{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Commencer le scan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Comment ça marche ?</h3>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              Notre IA analyse vos expressions, votre voix ou vos mots pour identifier vos émotions 
              et vous proposer des recommandations personnalisées pour améliorer votre bien-être.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                <span className="font-semibold">1. Scan</span><br />
                Choisissez votre méthode préférée
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                <span className="font-semibold">2. Analyse</span><br />
                L'IA traite vos données en temps réel
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                <span className="font-semibold">3. Recommandations</span><br />
                Recevez des conseils personnalisés
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScanPage;
