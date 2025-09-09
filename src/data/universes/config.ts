import { Universe } from '@/types/universes';

// Optimized universe configurations with performance-minded settings
export const UNIVERSE_CONFIGS: Record<string, Universe> = {
  home: {
    id: 'home',
    name: 'Le Hall de Lumière',
    description: 'Marbre clair, vitraux lumineux, musique feutrée',
    ambiance: {
      colors: {
        primary: 'hsl(43, 74%, 66%)',
        secondary: 'hsl(210, 40%, 95%)',
        accent: 'hsl(270, 50%, 85%)',
        background: 'linear-gradient(135deg, hsl(210, 40%, 98%), hsl(43, 20%, 96%))'
      },
      sounds: {
        ambient: '/audio/hall-ambience.mp3',
        interaction: '/audio/chime-soft.mp3',
        completion: '/audio/success-warm.mp3'
      },
      metaphor: 'Un hall d\'accueil prestigieux qui t\'attendait'
    },
    artifacts: {
      type: 'aura',
      name: 'Lumière du jour',
      description: 'Aura dorée qui réchauffe ta journée'
    }
  },

  scan: {
    id: 'scan',
    name: 'L\'Atelier des Reflets',
    description: 'Fluides colorés, miroir liquide, art vivant',
    ambiance: {
      colors: {
        primary: 'hsl(180, 70%, 60%)',
        secondary: 'hsl(300, 40%, 70%)',
        accent: 'hsl(45, 80%, 75%)',
        background: 'linear-gradient(45deg, hsl(180, 20%, 95%), hsl(300, 15%, 94%))'
      },
      sounds: {
        ambient: '/audio/fluid-ambient.mp3',
        interaction: '/audio/ripple.mp3',
        completion: '/audio/crystallize.mp3'
      },
      metaphor: 'Une œuvre d\'art vivante qui te reflète'
    },
    artifacts: {
      type: 'sticker',
      name: 'Reflet du moment',
      description: 'Capture de ton état intérieur en couleurs'
    }
  },

  breath: {
    id: 'breath',
    name: 'La Salle des Souffles',
    description: 'Sphères translucides, respiration cosmique',
    ambiance: {
      colors: {
        primary: 'hsl(200, 70%, 65%)',
        secondary: 'hsl(120, 50%, 75%)',
        accent: 'hsl(40, 60%, 80%)',
        background: 'linear-gradient(180deg, hsl(200, 30%, 96%), hsl(120, 20%, 95%))'
      },
      sounds: {
        ambient: '/audio/breath-ambient.mp3',
        interaction: '/audio/breath-in.mp3',
        completion: '/audio/breath-complete.mp3'
      },
      metaphor: 'Un espace où ton souffle fait vibrer l\'univers'
    },
    artifacts: {
      type: 'pearl',
      name: 'Perle de souffle',
      description: 'Cristallise ton cycle respiratoire parfait'
    }
  },

  vrBreath: {
    id: 'vr-breath',
    name: 'La Galaxie du Souffle',
    description: 'Cosmos infini, constellations respirantes',
    ambiance: {
      colors: {
        primary: 'hsl(240, 80%, 60%)',
        secondary: 'hsl(280, 70%, 50%)',
        accent: 'hsl(50, 90%, 70%)',
        background: 'radial-gradient(ellipse at center, hsl(240, 30%, 5%) 0%, hsl(280, 20%, 10%) 50%, hsl(0, 0%, 2%) 100%)'
      },
      sounds: {
        ambient: '/audio/cosmic-ambient.mp3',
        interaction: '/audio/stellar-breath.mp3',
        completion: '/audio/constellation-align.mp3'
      },
      metaphor: 'Ton souffle fait vibrer les étoiles de l\'univers'
    },
    artifacts: {
      type: 'constellation',
      name: 'Constellation Personnelle',
      description: 'Étoiles alignées selon ton rythme respiratoire'
    }
  },

  flashGlow: {
    id: 'flash-glow',
    name: 'Le Dôme d\'Étincelles',
    description: 'Voûte électrique, scintillements apaisants',
    ambiance: {
      colors: {
        primary: 'hsl(30, 80%, 65%)',
        secondary: 'hsl(270, 30%, 25%)',
        accent: 'hsl(60, 90%, 80%)',
        background: 'radial-gradient(circle, hsl(270, 20%, 8%), hsl(30, 30%, 15%))'
      },
      sounds: {
        ambient: '/audio/electric-ambient.mp3',
        interaction: '/audio/spark.mp3',
        completion: '/audio/glow-calm.mp3'
      },
      metaphor: 'Les étincelles se calment à ton rythme'
    },
    artifacts: {
      type: 'flame',
      name: 'Bougie zen',
      description: 'Flamme éternelle de sérénité intérieure'
    }
  },

  music: {
    id: 'music',
    name: 'Le Studio des Ondes',
    description: 'Salle bois clair + vinyles en apesanteur',
    ambiance: {
      colors: {
        primary: 'hsl(25, 60%, 55%)',
        secondary: 'hsl(35, 40%, 85%)',
        accent: 'hsl(200, 60%, 70%)',
        background: 'linear-gradient(135deg, hsl(35, 40%, 96%), hsl(25, 30%, 94%))'
      },
      sounds: {
        ambient: '/audio/studio-ambient.mp3',
        interaction: '/audio/vinyl-spin.mp3',
        completion: '/audio/harmony-complete.mp3'
      },
      metaphor: 'Ton studio personnel où naissent les harmonies'
    },
    artifacts: {
      type: 'crystal',
      name: 'Cristal sonore',
      description: 'Capture l\'essence de ta mélodie parfaite'
    }
  },

  journal: {
    id: 'journal',
    name: 'Le Jardin des Mots',
    description: 'Pergola aux lanternes, mots qui fleurissent',
    ambiance: {
      colors: {
        primary: 'hsl(320, 60%, 70%)',
        secondary: 'hsl(140, 40%, 65%)',
        accent: 'hsl(50, 70%, 75%)',
        background: 'linear-gradient(135deg, hsl(140, 30%, 94%), hsl(320, 20%, 96%))'
      },
      sounds: {
        ambient: '/audio/garden-ambient.mp3',
        interaction: '/audio/pen-write.mp3',
        completion: '/audio/flower-bloom.mp3'
      },
      metaphor: 'Chaque mot devient une fleur qui s\'illumine'
    },
    artifacts: {
      type: 'flower',
      name: 'Fleur de mots',
      description: 'Ta pensée transformée en beauté vivante'
    }
  }
};

// Performance settings per universe
export const UNIVERSE_PERFORMANCE_CONFIG = {
  enableParticles: true,
  enableAmbientSound: false, // Disabled by default for performance
  enableComplexAnimations: true,
  maxParticleCount: 8,
  animationQuality: 'high' as 'low' | 'medium' | 'high',
};

// Get universe with performance optimizations
export const getOptimizedUniverse = (universeId: string): Universe => {
  const universe = UNIVERSE_CONFIGS[universeId];
  if (!universe) {
    throw new Error(`Universe ${universeId} not found`);
  }
  return universe;
};