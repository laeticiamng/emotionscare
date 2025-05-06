
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
          dark: "#1A1F2C",
          darkGlass: "rgba(26, 31, 44, 0.8)",
        },
        dark: {
          DEFAULT: "#1A1F2C",
          950: "#121722",
          900: "#1A1F2C",
          800: "#2C3340",
          700: "#3D4554",
          600: "#4E5769",
          500: "#616A7D",
          400: "#8990A0",
          300: "#B1B6C3",
          200: "#D3D6DF",
          100: "#F1F2F5",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 8px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'dark-soft': '0 4px 12px rgba(0, 0, 0, 0.2)',
        'dark-medium': '0 8px 24px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to bottom right, #1A1F2C, #2C3340)',
      },
    },
  },
  plugins: [anim],
} satisfies Config;

export default config;
