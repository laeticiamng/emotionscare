
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const VRPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/b2c/dashboard')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Eye className="h-12 w-12 text-cyan-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Réalité Virtuelle
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Immersion thérapeutique pour le bien-être
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold">Expérience VR Premium</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Plongez dans des environnements virtuels thérapeutiques conçus pour réduire le stress et améliorer votre bien-être mental.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-lg border">
                    <h3 className="font-medium mb-2">🏖️ Plage Tropicale</h3>
                    <p className="text-sm text-muted-foreground mb-3">Détente au bord de l'océan avec sons naturels</p>
                    <Button className="w-full" variant="outline">Démarrer</Button>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <h3 className="font-medium mb-2">🌲 Forêt Enchantée</h3>
                    <p className="text-sm text-muted-foreground mb-3">Méditation guidée en pleine nature</p>
                    <Button className="w-full" variant="outline">Démarrer</Button>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <h3 className="font-medium mb-2">⛰️ Montagne Zen</h3>
                    <p className="text-sm text-muted-foreground mb-3">Contemplation au sommet du monde</p>
                    <Button className="w-full" variant="outline">Démarrer</Button>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>🥽 Casque VR requis pour une expérience optimale</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VRPage;
