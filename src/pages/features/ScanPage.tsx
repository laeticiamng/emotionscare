
import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Camera, Upload, History } from 'lucide-react';
import PremiumCard from '@/components/ui/PremiumCard';
import PremiumButton from '@/components/ui/PremiumButton';

const ScanPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Scanner Émotionnel
          </h1>
          <p className="text-lg text-muted-foreground">
            Analysez vos émotions grâce à l'intelligence artificielle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <PremiumCard>
            <div className="text-center">
              <Camera className="h-16 w-16 mx-auto mb-6 text-blue-500" />
              <h3 className="text-2xl font-bold mb-4">Scan en Direct</h3>
              <p className="text-muted-foreground mb-6">
                Utilisez votre caméra pour analyser vos émotions en temps réel
              </p>
              <PremiumButton variant="primary" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Démarrer le scan
              </PremiumButton>
            </div>
          </PremiumCard>

          <PremiumCard>
            <div className="text-center">
              <Upload className="h-16 w-16 mx-auto mb-6 text-green-500" />
              <h3 className="text-2xl font-bold mb-4">Analyser une Photo</h3>
              <p className="text-muted-foreground mb-6">
                Importez une photo pour analyser les émotions capturées
              </p>
              <PremiumButton variant="secondary" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Importer une photo
              </PremiumButton>
            </div>
          </PremiumCard>
        </div>

        <PremiumCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Historique des Scans</h3>
            <History className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <Scan className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Aucun scan effectué pour le moment</p>
            <p className="text-sm">Vos analyses apparaîtront ici</p>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default ScanPage;
