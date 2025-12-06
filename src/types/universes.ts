// @ts-nocheck
export interface Universe {
  id: string;
  name: string;
  description: string;
  ambiance: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
    sounds?: {
      ambient: string;
      interaction: string;
      completion: string;
    };
    metaphor: string;
  };
  artifacts: {
    type: 'aura' | 'sticker' | 'constellation' | 'flower' | 'bubble' | 'flame' | 'pearl' | 'crystal' | 'lantern';
    name: string;
    description: string;
  };
}

export interface UniverseContext {
  universe: Universe;
  isEntering: boolean;
  isExiting: boolean;
  artifacts: string[];
}

export const UNIVERSES: Record<string, Universe> = {
  home: {
    id: 'home',
    name: 'Le Hall de Lumière',
    description: 'Marbre clair, vitraux lumineux, musique feutrée',
    ambiance: {
      colors: {
        primary: 'hsl(43, 74%, 66%)', // Gold lumineux
        secondary: 'hsl(210, 40%, 95%)', // Marbre clair
        accent: 'hsl(270, 50%, 85%)', // Vitraux violets
        background: 'linear-gradient(135deg, hsl(210, 40%, 98%), hsl(43, 20%, 96%))'
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
        primary: 'hsl(180, 70%, 60%)', // Cyan fluide
        secondary: 'hsl(300, 40%, 70%)', // Violet reflet
        accent: 'hsl(45, 80%, 75%)', // Or liquide
        background: 'linear-gradient(45deg, hsl(180, 20%, 95%), hsl(300, 15%, 94%))'
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
        primary: 'hsl(200, 70%, 65%)', // Bleu souffle
        secondary: 'hsl(120, 50%, 75%)', // Vert apaisant
        accent: 'hsl(40, 60%, 80%)', // Doré chaleur
        background: 'linear-gradient(180deg, hsl(200, 30%, 96%), hsl(120, 20%, 95%))'
      },
      metaphor: 'Un espace où ton souffle fait vibrer l\'univers'
    },
    artifacts: {
      type: 'pearl',
      name: 'Perle de souffle',
      description: 'Cristallise ton cycle respiratoire parfait'
    }
  },
  flashGlow: {
    id: 'flash-glow',
    name: 'Le Dôme d\'Étincelles',
    description: 'Voûte électrique, scintillements apaisants',
    ambiance: {
      colors: {
        primary: 'hsl(30, 80%, 65%)', // Orange étincelle
        secondary: 'hsl(270, 30%, 25%)', // Violet sombre
        accent: 'hsl(60, 90%, 80%)', // Jaune électrique
        background: 'linear-gradient(radial, hsl(270, 20%, 8%), hsl(30, 30%, 15%))'
      },
      metaphor: 'Les étincelles se calment à ton rythme'
    },
    artifacts: {
      type: 'flame',
      name: 'Bougie zen',
      description: 'Flamme éternelle de sérénité intérieure'
    }
  },
  journal: {
    id: 'journal',
    name: 'Le Jardin des Mots',
    description: 'Pergola aux lanternes, mots qui fleurissent',
    ambiance: {
      colors: {
        primary: 'hsl(320, 60%, 70%)', // Rose fleur
        secondary: 'hsl(140, 40%, 65%)', // Vert feuillage
        accent: 'hsl(50, 70%, 75%)', // Or lanterne
        background: 'linear-gradient(135deg, hsl(140, 30%, 94%), hsl(320, 20%, 96%))'
      },
      metaphor: 'Chaque mot devient une fleur qui s\'illumine'
    },
    artifacts: {
      type: 'flower',
      name: 'Fleur de mots',
      description: 'Ta pensée transformée en beauté vivante'
    }
  },
  vrBreath: {
    id: 'vr-breath',
    name: 'La Galaxie du Souffle',
    description: 'Cosmos infini, constellations respirantes',
    ambiance: {
      colors: {
        primary: 'hsl(240, 80%, 60%)', // Bleu cosmos
        secondary: 'hsl(280, 70%, 50%)', // Violet nébuleuse
        accent: 'hsl(50, 90%, 70%)', // Or étoile
        background: 'linear-gradient(radial-circle, hsl(240, 30%, 5%) 0%, hsl(280, 20%, 10%) 50%, hsl(0, 0%, 2%) 100%)'
      },
      metaphor: 'Ton souffle fait vibrer les étoiles de l\'univers'
    },
    artifacts: {
      type: 'constellation',
      name: 'Constellation Personnelle',
      description: 'Étoiles alignées selon ton rythme respiratoire'
    }
  }
};