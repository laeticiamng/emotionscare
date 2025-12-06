/**
 * AR Experience Selector - Phase 4.5
 * Menu to select AR experience type
 */

import React from 'react';
import { Sparkles, Wind, Wand2, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ARExperienceSelectorProps {
  onSelect?: (experience: 'aura' | 'breathing' | 'bubbles' | 'music') => void;
  className?: string;
}

interface Experience {
  id: 'aura' | 'breathing' | 'bubbles' | 'music';
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  emoji: string;
}

const experiences: Experience[] = [
  {
    id: 'aura',
    label: 'Aura Émotionnelle',
    description: 'Visualisez votre aura émotionnelle en réalité augmentée',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-purple-600 to-pink-600',
    emoji: '✨'
  },
  {
    id: 'breathing',
    label: 'Respiration Guidée',
    description: 'Guidage respiratoire immersif avec 4 patterns',
    icon: <Wind className="w-6 h-6" />,
    color: 'from-blue-600 to-cyan-600',
    emoji: '🌬️'
  },
  {
    id: 'bubbles',
    label: 'Bulles Interactives',
    description: 'Éclatez des bulles de gratitude et d\'affirmations',
    icon: <Wand2 className="w-6 h-6" />,
    color: 'from-green-600 to-emerald-600',
    emoji: '🫧'
  },
  {
    id: 'music',
    label: 'Thérapie Musicale AR',
    description: 'Immersion musicale avec visualisations 3D',
    icon: <Music className="w-6 h-6" />,
    color: 'from-orange-600 to-red-600',
    emoji: '🎵'
  }
];

export function ARExperienceSelector({ onSelect, className }: ARExperienceSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Expériences AR</h2>
        <p className="text-gray-600">Sélectionnez une expérience pour commencer</p>
      </div>

      {/* Experience grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {experiences.map((experience) => (
          <button
            key={experience.id}
            onClick={() => onSelect?.(experience.id)}
            className={cn(
              'relative overflow-hidden rounded-lg p-6 text-left transition-all duration-300 hover:shadow-lg hover:scale-105',
              'bg-gradient-to-br',
              experience.color
            )}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 opacity-20 bg-black" />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon and label */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-white text-3xl">{experience.emoji}</div>
                  <div className="flex items-center gap-2">
                    <div className="text-white opacity-80">{experience.icon}</div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2">{experience.label}</h3>

              {/* Description */}
              <p className="text-sm text-white opacity-90 mb-4">{experience.description}</p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                Commencer
                <span>→</span>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Features info */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <p className="text-sm text-indigo-900">
          <span className="font-semibold">💡 Conseil:</span> Les expériences AR fonctionnent au mieux
          sur des appareils mobiles supportant WebXR. Pour une meilleure expérience, assurez-vous que
          la caméra est autorisée.
        </p>
      </div>
    </div>
  );
}
