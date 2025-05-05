
import type { Config } from "tailwindcss";

export default {
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
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        cocoon: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        wellness: {
          green: '#7ED321',
          yellow: '#F5A623',
          orange: '#F5A623',
          blue: '#4A90E2',
          violet: '#6B5B95',
          mint: '#96DEC8',
          coral: '#FF7F7F',
          lavender: '#D8BFD8',
          apricot: '#FBCEB1',
          skyblue: '#87CEEB',
        },
        pastel: {
          blue: '#E6F2FF',
          green: '#E8F5E9',
          pink: '#FCE4EC',
          yellow: '#FFF9C4',
          purple: '#F3E5F5',
        },
        neon: {
          pink: '#FF1493',
          blue: '#00BFFF',
          green: '#39FF14',
          orange: '#FF4500',
          purple: '#9D00FF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'hover-lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(160, 89, 255, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(160, 89, 255, 0.6)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-subtle': 'pulse-subtle 3s infinite',
        'hover-lift': 'hover-lift 0.2s ease-out forwards',
        'slide-up': 'slide-up 0.3s ease-out',
        'glow': 'glow 2s infinite'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'medium': '0 6px 16px rgba(0, 0, 0, 0.1)',
        'apple': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'apple-hover': '0 6px 16px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 15px rgba(124, 58, 237, 0.5)',
        'glow-light': '0 0 8px rgba(124, 58, 237, 0.3)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
