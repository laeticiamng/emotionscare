import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wind, Palette, Music, Leaf, Book, Cloud, Star, Lightbulb, Waves, Mirror, Flask, Sword, Sliders, Users, Trophy, Theater, Sprout } from 'lucide-react';
import { ParkAttraction } from '@/components/park/ParkAttraction';

/**
 * Carte du Parc Émotionnel — Monde des Modules
 * Chaque module = une attraction immersive
 */
export default function EmotionalPark() {
  const attractions = [
    {
      id: 'home',
      title: 'La Salle des Cartes Vivantes',
      subtitle: 'Point de départ du parc',
      description: 'Tu pioche une carte mood hebdomadaire avec animation cosmique et son cristallin.',
      icon: Sparkles,
      route: '/app/home',
      gradient: 'from-violet-500/20 to-purple-500/20',
      collection: 'Grimoire de cartes vivantes',
      zone: 'hub'
    },
    {
      id: 'nyvee',
      title: 'La Bulle Respirante',
      subtitle: 'Mini-jeu de respiration',
      description: 'Bulle qui gonfle/dégonfle révélant des constellations cachées.',
      icon: Wind,
      route: '/app/nyvee',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      collection: 'Cocons rares (cristal, cosmos, nature)',
      zone: 'calm'
    },
    {
      id: 'scan',
      title: 'La Galerie des Masques',
      subtitle: 'Scan émotionnel',
      description: 'Chaque choix crée un masque vivant qui flotte autour de ton avatar.',
      icon: Palette,
      route: '/app/scan',
      gradient: 'from-pink-500/20 to-rose-500/20',
      collection: 'Skins de masques moods',
      zone: 'creative'
    },
    {
      id: 'music',
      title: 'La Forêt Sonore',
      subtitle: 'Thérapie musicale',
      description: 'Forêt magique où les arbres vibrent avec la musique. Chaque session = fragment mélodique rare.',
      icon: Music,
      route: '/app/music',
      gradient: 'from-green-500/20 to-emerald-500/20',
      collection: 'Playlist secrète de la forêt',
      zone: 'creative'
    },
    {
      id: 'coach',
      title: 'Le Jardin des Pensées',
      subtitle: 'Coach IA',
      description: 'Bulles translucides avec haïkus qui s\'évaporent avec sons zen.',
      icon: Leaf,
      route: '/app/coach',
      gradient: 'from-teal-500/20 to-green-500/20',
      collection: 'Grimoire des pensées',
      zone: 'wisdom'
    },
    {
      id: 'journal',
      title: 'La Bibliothèque des Émotions',
      subtitle: 'Journal voix/texte',
      description: 'Tes textes deviennent des pages volantes colorées. Chaque semaine, un nouveau chapitre s\'anime.',
      icon: Book,
      route: '/app/journal',
      gradient: 'from-amber-500/20 to-orange-500/20',
      collection: 'Livre émotionnel magique',
      zone: 'wisdom'
    },
    {
      id: 'vr-breath',
      title: 'Le Temple de l\'Air',
      subtitle: 'VR Breath',
      description: 'Temple suspendu dans les nuages. Ton souffle peint une fresque murale unique.',
      icon: Cloud,
      route: '/app/vr-breath',
      gradient: 'from-sky-500/20 to-blue-500/20',
      collection: 'Fresques de souffle personnelles',
      zone: 'calm'
    },
    {
      id: 'vr-galaxy',
      title: 'La Constellation Émotionnelle',
      subtitle: 'VR Galaxy',
      description: 'Voyage cosmique où chaque émotion allume une étoile dans ta carte stellaire.',
      icon: Star,
      route: '/app/vr-galaxy',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      collection: 'Constellations émotionnelles',
      zone: 'explore'
    },
    {
      id: 'flash-glow',
      title: 'La Chambre des Lumières',
      subtitle: 'Flash Glow',
      description: 'Salle obscure qui s\'illumine par tes cycles. Chaque respiration allume une lampe magique.',
      icon: Lightbulb,
      route: '/app/flash-glow',
      gradient: 'from-yellow-500/20 to-amber-500/20',
      collection: 'Mur de lumière + mantras',
      zone: 'energy'
    },
    {
      id: 'breath',
      title: 'L\'Océan Intérieur',
      subtitle: 'Breathwork',
      description: 'Océan vivant qui réagit à ton souffle. Surfer sur ses vagues internes.',
      icon: Waves,
      route: '/app/breath',
      gradient: 'from-blue-500/20 to-teal-500/20',
      collection: 'Badges respiratoires',
      zone: 'calm'
    },
    {
      id: 'face-ar',
      title: 'La Chambre des Reflets',
      subtitle: 'AR Filters',
      description: 'Miroirs magiques, stickers réactifs. Clin d\'œil = pluie d\'étoiles.',
      icon: Mirror,
      route: '/app/face-ar',
      gradient: 'from-fuchsia-500/20 to-pink-500/20',
      collection: 'Avatars rares issus de tes reflets',
      zone: 'creative'
    },
    {
      id: 'bubble-beat',
      title: 'Le Labo des Bulles',
      subtitle: 'Bubble Beat',
      description: 'Laboratoire fun de bulles colorées. Fais flotter les bulles le plus longtemps possible.',
      icon: Flask,
      route: '/app/bubble-beat',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      collection: 'Bulles spéciales (couleurs rares)',
      zone: 'energy'
    },
    {
      id: 'boss-grit',
      title: 'L\'Arène de la Persévérance',
      subtitle: 'Boss Level Grit',
      description: 'Mode RPG émotionnel. Chaque défi = mini-level avec feedback sonore.',
      icon: Sword,
      route: '/app/boss-grit',
      gradient: 'from-red-500/20 to-orange-500/20',
      collection: 'Transformation avatar de persévérance',
      zone: 'challenge'
    },
    {
      id: 'mood-mixer',
      title: 'Le Studio DJ des Émotions',
      subtitle: 'Mood Mixer',
      description: 'Deviens DJ de ton propre mood avec sliders musique + lumières en direct.',
      icon: Sliders,
      route: '/app/mood-mixer',
      gradient: 'from-purple-500/20 to-pink-500/20',
      collection: 'Mixes rares sauvegardés',
      zone: 'creative'
    },
    {
      id: 'community',
      title: 'Le Village Bienveillant',
      subtitle: 'Communauté',
      description: 'Chaque message = lumière dans une maison du village. Plus tu participes, plus ton maison-avatar s\'illumine.',
      icon: Users,
      route: '/app/community',
      gradient: 'from-emerald-500/20 to-green-500/20',
      collection: 'Badges de soutien',
      zone: 'social'
    },
    {
      id: 'leaderboard',
      title: 'Le Ciel des Auras',
      subtitle: 'Pas de classement',
      description: 'Ton aura flotte dans le ciel, change de couleur au fil des semaines.',
      icon: Star,
      route: '/app/leaderboard',
      gradient: 'from-indigo-500/20 to-violet-500/20',
      collection: 'Couleurs rares débloquées',
      zone: 'hub'
    },
    {
      id: 'ambition-arcade',
      title: 'La Salle des Défis',
      subtitle: 'Ambition Arcade',
      description: 'Salle arcade futuriste. Objectifs = mini-jeux rapides avec confettis et trophées.',
      icon: Trophy,
      route: '/app/ambition-arcade',
      gradient: 'from-orange-500/20 to-red-500/20',
      collection: 'Galerie de trophées émotionnels',
      zone: 'challenge'
    },
    {
      id: 'story-synth',
      title: 'Le Théâtre des Histoires',
      subtitle: 'Story Synth Lab',
      description: 'Théâtre vivant où chaque choix change la scène. Finir une histoire = fragment de conte.',
      icon: Theater,
      route: '/app/story-synth',
      gradient: 'from-violet-500/20 to-purple-500/20',
      collection: 'Bibliothèque de contes animés',
      zone: 'wisdom'
    },
    {
      id: 'activity',
      title: 'Le Jardin des Saisons',
      subtitle: 'Activité hebdomadaire',
      description: 'Chaque semaine = une plante pousse. Après plusieurs semaines → jardin complet.',
      icon: Sprout,
      route: '/app/activity',
      gradient: 'from-green-500/20 to-lime-500/20',
      collection: 'Galerie de plantes rares',
      zone: 'hub'
    }
  ];

  const zones = {
    hub: { name: 'Hub Central', color: 'violet' },
    calm: { name: 'Zone de Sérénité', color: 'blue' },
    creative: { name: 'Quartier Créatif', color: 'pink' },
    wisdom: { name: 'Jardin de Sagesse', color: 'emerald' },
    explore: { name: 'Espace Exploration', color: 'indigo' },
    energy: { name: 'Zone d\'Énergie', color: 'amber' },
    challenge: { name: 'Arène des Défis', color: 'red' },
    social: { name: 'Village Social', color: 'green' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Le Parc Émotionnel
              </h1>
              <p className="text-sm text-muted-foreground">Explore tes mondes intérieurs</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map Grid */}
      <div className="container mx-auto px-4 py-8">
        {Object.entries(zones).map(([zoneKey, zone]) => {
          const zoneAttractions = attractions.filter(a => a.zone === zoneKey);
          if (zoneAttractions.length === 0) return null;

          return (
            <motion.section
              key={zoneKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {zone.name}
                </h2>
                <div className={`h-1 w-20 bg-gradient-to-r from-${zone.color}-500 to-${zone.color}-300 rounded-full`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zoneAttractions.map((attraction, index) => (
                  <ParkAttraction
                    key={attraction.id}
                    {...attraction}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
