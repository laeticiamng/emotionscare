import type { Config } from 'tailwindcss';

const config: Config = {
  // Mode JIT pour des builds ultra-rapides
  mode: 'jit',
  
  // Purge optimisé pour réduire la taille du CSS
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{vue,svelte}',
  ],
  
  // Mode sombre par défaut
  darkMode: ['class'],
  
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // Couleurs optimisées avec variables CSS
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          900: 'hsl(var(--primary-900))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Couleurs émotionnelles spécifiques
        emotion: {
          joy: 'hsl(var(--emotion-joy))',
          calm: 'hsl(var(--emotion-calm))',
          energy: 'hsl(var(--emotion-energy))',
          focus: 'hsl(var(--emotion-focus))',
          stress: 'hsl(var(--emotion-stress))',
        },
        // Gradients optimisés
        gradient: {
          primary: 'var(--gradient-primary)',
          secondary: 'var(--gradient-secondary)',
          accent: 'var(--gradient-accent)',
        }
      },
      
      // Animations optimisées avec GPU
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 30px hsl(var(--primary) / 0.6)' 
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'pulse-soft': 'pulse-soft 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      
      // Typographie optimisée
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'monospace',
        ],
      },
      
      // Espacements optimisés
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      
      // Ombres optimisées
      boxShadow: {
        'soft': '0 2px 8px hsl(var(--primary) / 0.1)',
        'medium': '0 4px 16px hsl(var(--primary) / 0.15)',
        'large': '0 8px 32px hsl(var(--primary) / 0.2)',
        'glow': '0 0 20px hsl(var(--primary) / 0.3)',
        'glow-lg': '0 0 40px hsl(var(--primary) / 0.4)',
      },
      
      // Transitions optimisées
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      
      // Backdrop blur optimisé
      backdropBlur: {
        xs: '2px',
      },
      
      // Border radius optimisé
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
      
      // Z-index système
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
      
      // Breakpoints personnalisés
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  
  plugins: [
    require('tailwindcss-animate'),
    
    // Plugin personnalisé pour les utilitaires optimisés
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        // Utilitaires de performance
        '.gpu-accelerated': {
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
        },
        
        // Utilitaires d'accessibilité
        '.focus-visible-ring': {
          '&:focus-visible': {
            outline: '2px solid hsl(var(--ring))',
            outlineOffset: '2px',
          },
        },
        
        // Utilitaires de performance d'image
        '.image-optimized': {
          imageRendering: 'auto',
          imageRendering: 'crisp-edges',
          imageRendering: '-webkit-optimize-contrast',
        },
        
        // Utilitaires de scroll optimisé
        '.scroll-smooth': {
          scrollBehavior: 'smooth',
          scrollPaddingTop: '2rem',
        },
        
        // Utilitaires de text rendering
        '.text-optimized': {
          textRendering: 'optimizeLegibility',
          fontSmooth: 'antialiased',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        
        // Utilitaires de backdrop
        '.backdrop-optimized': {
          backdropFilter: 'blur(8px) saturate(120%)',
          backgroundColor: 'hsl(var(--background) / 0.8)',
        },
        
        // Gradients personnalisés
        '.gradient-primary': {
          background: 'var(--gradient-primary)',
        },
        '.gradient-secondary': {
          background: 'var(--gradient-secondary)',
        },
        '.gradient-accent': {
          background: 'var(--gradient-accent)',
        },
      };
      
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    
    // Plugin pour les composants de base optimisés
    function({ addComponents, theme }: any) {
      const components = {
        '.btn-primary': {
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          
          '&:hover': {
            backgroundColor: 'hsl(var(--primary) / 0.9)',
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.medium'),
          },
          
          '&:focus': {
            outline: '2px solid hsl(var(--ring))',
            outlineOffset: '2px',
          },
          
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
            transform: 'none',
          },
        },
        
        '.card-optimized': {
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.soft'),
          transition: 'all 0.2s ease-in-out',
          
          '&:hover': {
            boxShadow: theme('boxShadow.medium'),
            transform: 'translateY(-2px)',
          },
        },
      };
      
      addComponents(components);
    },
  ],
  
  // Optimisations de performance
  experimental: {
    optimizeUniversalDefaults: true,
  },
  
  // Configuration du purging pour la production
  safelist: [
    // Classes toujours conservées
    'dark',
    'light',
    'animate-spin',
    'animate-pulse',
    // Classes d'émotion dynamiques
    {
      pattern: /^(emotion|gradient|glow)-.*/,
      variants: ['hover', 'focus', 'active'],
    },
  ],
  
  // Variables de performance
  corePlugins: {
    // Désactiver les plugins non utilisés
    preflight: true,
    container: true,
    accessibility: true,
    pointerEvents: true,
    visibility: true,
    position: true,
    inset: true,
    isolation: true,
    zIndex: true,
    order: true,
    gridColumn: true,
    gridColumnStart: true,
    gridColumnEnd: true,
    gridRow: true,
    gridRowStart: true,
    gridRowEnd: true,
    float: false, // Désactivé - utilise flexbox/grid à la place
    clear: false, // Désactivé - utilise flexbox/grid à la place
  },
};

export default config;