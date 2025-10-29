// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles, Brain } from 'lucide-react';
import EmotionMusicPanel from '@/components/music/EmotionMusicPanel';
import ClinicalMusicGenerator from '@/components/music/ClinicalMusicGenerator';

const EmotionMusic: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Music className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Musique Émotionnelle
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transformez vos émotions en musique personnalisée grâce à l'intelligence artificielle
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg border bg-card"
          >
            <Brain className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Analyse Émotionnelle</h3>
            <p className="text-sm text-muted-foreground">
              Votre état émotionnel est analysé en temps réel pour créer une musique parfaitement adaptée
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border bg-card"
          >
            <Sparkles className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Génération IA</h3>
            <p className="text-sm text-muted-foreground">
              OpenAI et Suno créent une composition unique en ~40 secondes basée sur vos émotions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg border bg-card"
          >
            <Music className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Confidentialité</h3>
            <p className="text-sm text-muted-foreground">
              Vos données sont anonymisées et aucun audio brut n'est stocké (conforme RGPD)
            </p>
          </motion.div>
        </div>

        {/* Clinical Music Generator - Based on history */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ClinicalMusicGenerator />
        </motion.div>

        {/* Main Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <EmotionMusicPanel />
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground space-y-2"
        >
          <p>
            🎵 Architecture: Hume AI → OpenAI Structured Outputs → Suno API
          </p>
          <p>
            ⚡ Génération: ~30-40s streaming | 🎼 Durée: 2-3 minutes | 🔄 Extensible jusqu'à 6 minutes
          </p>
          <p className="text-xs">
            Powered by EmotionsCare © 2025 | Rate limit: 20 requêtes / 10 secondes
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EmotionMusic;
