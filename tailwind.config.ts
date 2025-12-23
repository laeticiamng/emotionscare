import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        'xs': '475px',
        'xxs': '320px',
        'sm-h': { 'raw': '(min-height: 600px)' },
        'md-h': { 'raw': '(min-height: 768px)' },
        'lg-h': { 'raw': '(min-height: 1024px)' },
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.75rem' }],
        'fluid-xs': 'clamp(0.75rem, 2vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'fluid-base': 'clamp(1rem, 3vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3.5vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 4vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 5vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 6vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 7vw, 3rem)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        'fluid-1': 'clamp(0.25rem, 1vw, 0.5rem)',
        'fluid-2': 'clamp(0.5rem, 2vw, 1rem)',
        'fluid-4': 'clamp(1rem, 3vw, 2rem)',
        'fluid-8': 'clamp(2rem, 4vw, 4rem)',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--primary) / 0.05)",
          100: "hsl(var(--primary) / 0.1)",
          200: "hsl(var(--primary) / 0.2)",
          300: "hsl(var(--primary) / 0.3)",
          400: "hsl(var(--primary) / 0.4)",
          500: "hsl(var(--primary) / 0.5)",
          600: "hsl(var(--primary) / 0.6)",
          700: "hsl(var(--primary) / 0.7)",
          800: "hsl(var(--primary) / 0.8)",
          900: "hsl(var(--primary) / 0.9)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        glow: {
          low: "hsl(var(--glow-low))",
          medium: "hsl(var(--glow-medium))",
          high: "hsl(var(--glow-high))"
        },
        glass: {
          bg: "hsl(var(--glass-bg))",
          border: "hsl(var(--glass-border))",
        },
        landing: {
          cream: "hsl(var(--landing-cream))",
          beige: "hsl(var(--landing-beige))",
          sage: {
            DEFAULT: "hsl(var(--landing-sage))",
            dark: "hsl(var(--landing-sage-dark))",
          },
          sky: {
            DEFAULT: "hsl(var(--landing-sky))",
            dark: "hsl(var(--landing-sky-dark))",
          },
          text: {
            DEFAULT: "hsl(var(--landing-text))",
            muted: "hsl(var(--landing-text-muted))",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'fluid': 'clamp(0.5rem, 2vw, 1.5rem)',
      },
      boxShadow: {
        'glow': '0 0 20px hsl(var(--primary) / 0.3)',
        'glow-lg': '0 0 40px hsl(var(--primary) / 0.4)',
        'premium': '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        'premium-lg': '0 32px 64px -20px rgba(0, 0, 0, 0.25)',
        'premium-xl': '0 40px 80px -24px rgba(0, 0, 0, 0.35)',
        'inner-lg': 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsl(var(--primary) / 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(var(--accent) / 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(var(--secondary) / 0.3) 0px, transparent 50%)',
      },
      keyframes: {
        // Enhanced Accordion Animations
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" }
        },
        
        // Enhanced Fade Animations
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },

        // Enhanced Scale Animations
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" }
        },
        "scale-in-center": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },

        // Enhanced Slide Animations
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" }
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" }
        },
        "slide-in-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" }
        },
        "slide-in-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" }
        },

        // Premium Animations
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--primary) / 0.6)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-20px) rotate(1deg)" },
          "66%": { transform: "translateY(-10px) rotate(-1deg)" }
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" }
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" }
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" }
        },
      },
      animation: {
        // Basic Enhanced Animations
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.87, 0, 0.13, 1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.87, 0, 0.13, 1)",
        "fade-in": "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-out": "fade-out 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-down": "fade-in-down 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-left": "fade-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-right": "fade-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-out": "scale-out 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in-center": "scale-in-center 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-right": "slide-out-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-left": "slide-out-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-up": "slide-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-down": "slide-in-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        
        // Premium Animations
        "shimmer": "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "bounce-gentle": "bounce-gentle 2s infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        
        // Combined Animations
        "enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        "exit": "fade-out 0.3s ease-out, scale-out 0.2s ease-out",
        "slide-up-fade": "slide-in-up 0.4s ease-out, fade-in 0.5s ease-out",
        "slide-down-fade": "slide-in-down 0.4s ease-out, fade-in 0.5s ease-out",
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom utilities plugin
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Premium Glass Effects
        '.glass-effect': {
          'backdrop-filter': 'blur(24px)',
          'background-color': 'hsl(var(--glass-bg) / var(--glass-bg-opacity))',
          'border-width': '1px',
          'border-color': 'hsl(var(--glass-border) / var(--glass-border-opacity))',
        },
        '.glass-effect-strong': {
          'backdrop-filter': 'blur(40px)',
          'background-color': 'hsl(var(--glass-bg) / var(--glass-strong-bg-opacity))',
          'border-width': '1px',
          'border-color': 'hsl(var(--glass-border) / var(--glass-strong-border-opacity))',
        },
        '.glass-effect-dark': {
          'backdrop-filter': 'blur(24px)',
          'background-color': 'hsl(var(--glass-bg) / var(--glass-bg-opacity))',
          'border-width': '1px',
          'border-color': 'hsl(var(--glass-border) / var(--glass-border-opacity))',
        },
        
        // Interactive Elements
        '.hover-lift': {
          '@apply transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-premium-lg': {},
        },
        '.hover-glow': {
          '@apply transition-all duration-300 hover:shadow-glow': {},
        },
        '.press-effect': {
          '@apply transition-all duration-150 active:scale-95 active:brightness-95': {},
        },
        
        // Text Effects
        '.text-gradient': {
          '@apply bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent': {},
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
        
        // Layout Utilities
        '.safe-area': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)',
          'padding-right': 'env(safe-area-inset-right)',
        },
        '.container-fluid': {
          '@apply w-full max-w-none px-4 sm:px-6 lg:px-8': {},
        },
        
        // Custom Scrollbar
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.muted.DEFAULT'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.primary.DEFAULT'),
            borderRadius: '3px',
          },
        },
        
        // Performance Optimizations
        '.gpu-accelerated': {
          'transform': 'translateZ(0)',
          'backface-visibility': 'hidden',
          'perspective': '1000',
        },
        '.will-change-transform': {
          'will-change': 'transform',
        },
        '.will-change-opacity': {
          'will-change': 'opacity',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;

export default config;