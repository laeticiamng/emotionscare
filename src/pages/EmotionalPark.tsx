// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, Palette, Music, Leaf, Book, Cloud, Star, Lightbulb, Waves, Scan, Beaker, Sword, Sliders, Users, Trophy, Theater, Sprout, Filter, Zap, Home, Brain, Calendar, Heart, Monitor, Camera, Shield, MessageSquare, BarChart3, Grid3X3, Settings, Bell } from 'lucide-react';
import { ParkAttraction } from '@/components/park/ParkAttraction';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Carte du Parc Émotionnel — Monde des Modules
 * Chaque module = une attraction immersive
 */
export default function EmotionalPark() {
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const attractions = [
    {
      id: 'dashboard',
      title: 'Le Hall d\'Accueil',
      subtitle: 'Dashboard principal',
      description: 'Centre de contrôle de ton voyage émotionnel avec vue d\'ensemble personnalisée.',
      icon: Home,
      route: '/app/consumer/home',
      gradient: 'from-violet-500/20 to-indigo-500/20',
      collection: 'Tableau de bord personnalisé',
      zone: 'hub'
    },
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
      id: 'voice-journal',
      title: 'L\'Écho des Paroles',
      subtitle: 'Journal vocal',
      description: 'Exprime-toi librement à voix haute, tes mots deviennent des vagues sonores.',
      icon: MessageSquare,
      route: '/app/voice-journal',
      gradient: 'from-orange-500/20 to-yellow-500/20',
      collection: 'Archives vocales',
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
      id: 'meditation',
      title: 'Le Sanctuaire du Silence',
      subtitle: 'Méditation guidée',
      description: 'Espace sacré de silence et méditation guidée avec ambiances zen.',
      icon: Heart,
      route: '/app/meditation',
      gradient: 'from-rose-500/20 to-pink-500/20',
      collection: 'Collection de méditations',
      zone: 'calm'
    },
    {
      id: 'vr-standard',
      title: 'Le Portail Immersif',
      subtitle: 'VR Standard',
      description: 'Réalité virtuelle thérapeutique pour une immersion totale.',
      icon: Monitor,
      route: '/app/vr',
      gradient: 'from-purple-500/20 to-indigo-500/20',
      collection: 'Expériences VR premium',
      zone: 'calm'
    },
    {
      id: 'face-ar',
      title: 'La Chambre des Reflets',
      subtitle: 'AR Filters',
      description: 'Miroirs magiques, stickers réactifs. Clin d\'œil = pluie d\'étoiles.',
      icon: Camera,
      route: '/app/face-ar',
      gradient: 'from-fuchsia-500/20 to-pink-500/20',
      collection: 'Avatars rares issus de tes reflets',
      zone: 'creative'
    },
    {
      id: 'emotion-scan',
      title: 'L\'Analyseur d\'Émotions',
      subtitle: 'Scan facial avancé',
      description: 'IA de reconnaissance faciale qui lit tes émotions en temps réel.',
      icon: Scan,
      route: '/app/emotion-scan',
      gradient: 'from-blue-500/20 to-purple-500/20',
      collection: 'Historique de scans',
      zone: 'creative'
    },
    {
      id: 'bubble-beat',
      title: 'Le Labo des Bulles',
      subtitle: 'Bubble Beat',
      description: 'Laboratoire fun de bulles colorées. Fais flotter les bulles le plus longtemps possible.',
      icon: Beaker,
      route: '/app/bubble-beat',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      collection: 'Bulles spéciales (couleurs rares)',
      zone: 'energy'
    },
    {
      id: 'screen-silk',
      title: 'Le Cocon Digital',
      subtitle: 'Pause écran',
      description: 'Protège tes yeux avec des pauses intelligentes et des visuels apaisants.',
      icon: Shield,
      route: '/app/screen-silk',
      gradient: 'from-teal-500/20 to-cyan-500/20',
      collection: 'Thèmes de pause',
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
      id: 'bounce-back',
      title: 'Le Rebond Résilient',
      subtitle: 'Bounce Back Battle',
      description: 'Combat l\'adversité dans ce jeu de résilience émotionnelle.',
      icon: Shield,
      route: '/app/bounce-back',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      collection: 'Médailles de résilience',
      zone: 'challenge'
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
    },
    {
      id: 'scores',
      title: 'La Carte des Humeurs',
      subtitle: 'Scores & vibes',
      description: 'Courbes d\'humeur et heatmap quotidienne de ton état émotionnel.',
      icon: Grid3X3,
      route: '/app/scores',
      gradient: 'from-purple-500/20 to-pink-500/20',
      collection: 'Historique d\'humeurs',
      zone: 'hub'
    },
    {
      id: 'insights',
      title: 'L\'Observatoire des Patterns',
      subtitle: 'Analyses approfondies',
      description: 'Découvre les patterns cachés de ton bien-être émotionnel.',
      icon: BarChart3,
      route: '/app/insights',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      collection: 'Rapports détaillés',
      zone: 'hub'
    },
    {
      id: 'settings',
      title: 'Le Pavillon de Configuration',
      subtitle: 'Paramètres',
      description: 'Personnalise ton expérience dans le parc émotionnel.',
      icon: Settings,
      route: '/app/settings/general',
      gradient: 'from-gray-500/20 to-slate-500/20',
      collection: 'Préférences personnelles',
      zone: 'hub'
    },
    {
      id: 'profile',
      title: 'Le Miroir de l\'Identité',
      subtitle: 'Profil personnel',
      description: 'Ton identité dans le parc, tes informations et ton avatar.',
      icon: Users,
      route: '/app/profile',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      collection: 'Profil personnalisé',
      zone: 'hub'
    },
    {
      id: 'privacy',
      title: 'Le Coffre-Fort des Secrets',
      subtitle: 'Confidentialité',
      description: 'Contrôle total sur tes données personnelles et ta vie privée.',
      icon: Shield,
      route: '/app/settings/privacy',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      collection: 'Paramètres de confidentialité',
      zone: 'hub'
    },
    {
      id: 'notifications',
      title: 'La Tour des Messages',
      subtitle: 'Notifications',
      description: 'Gère tes alertes et rappels pour ne rien manquer.',
      icon: Bell,
      route: '/app/notifications',
      gradient: 'from-yellow-500/20 to-orange-500/20',
      collection: 'Centre de notifications',
      zone: 'hub'
    }
  ];

  const zones = {
    hub: { name: 'Hub Central', color: 'violet', emoji: '🌌' },
    calm: { name: 'Zone de Sérénité', color: 'blue', emoji: '🫧' },
    creative: { name: 'Quartier Créatif', color: 'pink', emoji: '🎨' },
    wisdom: { name: 'Jardin de Sagesse', color: 'emerald', emoji: '🌿' },
    explore: { name: 'Espace Exploration', color: 'indigo', emoji: '🌠' },
    energy: { name: 'Zone d\'Énergie', color: 'amber', emoji: '⚡' },
    challenge: { name: 'Arène des Défis', color: 'red', emoji: '⚔️' },
    social: { name: 'Village Social', color: 'green', emoji: '🤝' }
  };

  const filteredAttractions = selectedZone === 'all' 
    ? attractions 
    : attractions.filter(a => a.zone === selectedZone);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/90 border-b border-border/50 shadow-lg"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Le Parc Émotionnel
                </h1>
                <p className="text-sm text-muted-foreground">{attractions.length} attractions pour explorer tes mondes intérieurs</p>
              </div>
            </div>

            {/* Zone Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <Button
                variant={selectedZone === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedZone('all')}
                className="shrink-0"
              >
                Toutes
              </Button>
              {Object.entries(zones).map(([key, zone]) => (
                <Button
                  key={key}
                  variant={selectedZone === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedZone(key)}
                  className="shrink-0"
                >
                  {zone.emoji} {zone.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Map Grid */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedZone === 'all' ? (
            Object.entries(zones).map(([zoneKey, zone]) => {
              const zoneAttractions = attractions.filter(a => a.zone === zoneKey);
              if (zoneAttractions.length === 0) return null;

              return (
                <motion.section
                  key={zoneKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-4xl">{zone.emoji}</span>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-1">
                        {zone.name}
                      </h2>
                      <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {zoneAttractions.length} {zoneAttractions.length === 1 ? 'attraction' : 'attractions'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {zoneAttractions.map((attraction, index) => (
                      <ParkAttraction
                        key={attraction.id}
                        {...attraction}
                        delay={index * 0.05}
                      />
                    ))}
                  </div>
                </motion.section>
              );
            })
          ) : (
            <motion.section
              key={selectedZone}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 text-center">
                <span className="text-6xl mb-4 inline-block">
                  {zones[selectedZone as keyof typeof zones].emoji}
                </span>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {zones[selectedZone as keyof typeof zones].name}
                </h2>
                <p className="text-muted-foreground">
                  {filteredAttractions.length} {filteredAttractions.length === 1 ? 'attraction disponible' : 'attractions disponibles'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttractions.map((attraction, index) => (
                  <ParkAttraction
                    key={attraction.id}
                    {...attraction}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
