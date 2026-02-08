/**
 * Hume AI Real-time Emotion Scanning Page
 * Currently Coming Soon - uses the ComingSoon component
 */

import React from 'react';
import { ComingSoon } from '@/components/coming-soon/ComingSoon';
import { Sparkles } from 'lucide-react';

export default function HumeAIRealtimePage() {
  return (
    <ComingSoon
      moduleName="Hume AI – Analyse Émotionnelle"
      description="Analyse émotionnelle avancée par IA multimodale : détection faciale, vocale et textuelle en temps réel."
      icon={<Sparkles className="h-16 w-16 text-primary" />}
      features={[
        'Détection faciale des émotions en temps réel',
        'Analyse de la prosodie vocale',
        'Compréhension du langage naturel',
        'Plus de 30 émotions détectées avec scores de confiance',
        'Historique et suivi dans le temps',
      ]}
      estimatedRelease="Courant 2026"
      notifyEnabled
    />
  );
}
