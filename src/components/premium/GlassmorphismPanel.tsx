
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Heart } from 'lucide-react';

const GlassmorphismPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl" />
      
      <Card className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5" />
            Glassmorphism Design
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-white/80">
            Interface avec effet de verre transparent, arrière-plan flou et bordures subtiles 
            pour un look moderne et élégant.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <Zap className="h-8 w-8 text-yellow-400 mb-3" />
              <h4 className="font-semibold text-white mb-2">Performance</h4>
              <p className="text-sm text-white/70">
                Optimisé pour les performances maximales
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <Heart className="h-8 w-8 text-red-400 mb-3" />
              <h4 className="font-semibold text-white mb-2">Bien-être</h4>
              <p className="text-sm text-white/70">
                Interface apaisante et bienveillante
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
            >
              <Sparkles className="h-8 w-8 text-purple-400 mb-3" />
              <h4 className="font-semibold text-white mb-2">Premium</h4>
              <p className="text-sm text-white/70">
                Expérience utilisateur exceptionnelle
              </p>
            </motion.div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Découvrir
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
            >
              Activer Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GlassmorphismPanel;
