
import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import anim from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        wellness: {
          purple: "#9b87f5",
          darkPurple: "#7E69AB", 
          softPurple: "#E5DEFF",
          coral: "#FF6B6B",
          mint: "#4ECDC4",
          softBlue: "#D3E4FD",
          dark: "#1F2430",
          darkGlass: "rgba(31, 36, 48, 0.8)",
        },
        dark: {
          DEFAULT: "#1F2430",
          950: "#181C24",
          900: "#1F2430",
          800: "#353A47",
          700: "#454B5A",
          600: "#5A6173",
          500: "#6E7387",
          400: "#9095A4",
          300: "#B8BCC7",
          200: "#D6D9E0",
          100: "#F1F2F5",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 6px 12px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 20px rgba(0, 0, 0, 0.1)',
        'dark-soft': '0 6px 16px rgba(0, 0, 0, 0.2)',
        'dark-medium': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'premium': '0 20px 40px rgba(0, 0, 0, 0.1)',
        'premium-dark': '0 20px 40px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ["Inter var", "SF Pro Display", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to bottom right, #1F2430, #353A47)',
        'light-gradient': 'linear-gradient(to bottom right, #FFFFFF, #F0F4F8)',
        'pastel-gradient': 'linear-gradient(to bottom right, #F0F8FF, #E0F0FF)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [anim],
} satisfies Config;

export default config;
