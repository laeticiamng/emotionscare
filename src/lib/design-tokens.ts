/**
 * Design Tokens - Couleurs centralisées pour remplacer les valeurs hardcodées
 * Migration des 206 fichiers contenant des couleurs en dur
 */

// === PALETTE PRINCIPALE ===
export const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    50: 'hsl(221 83% 95%)',
    100: 'hsl(221 83% 90%)',
    200: 'hsl(221 83% 80%)',
    300: 'hsl(221 83% 70%)',
    400: 'hsl(221 83% 60%)',
    500: 'hsl(221 83% 53%)', // Main
    600: 'hsl(221 83% 45%)',
    700: 'hsl(221 83% 35%)',
    800: 'hsl(221 83% 25%)',
    900: 'hsl(221 83% 15%)',
  },

  // Accent colors
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
    violet: 'hsl(262 83% 58%)',
    purple: 'hsl(280 80% 55%)',
    pink: 'hsl(330 80% 60%)',
  },

  // Semantic colors
  semantic: {
    success: 'hsl(142 76% 36%)',
    successLight: 'hsl(142 76% 90%)',
    warning: 'hsl(38 92% 50%)',
    warningLight: 'hsl(38 92% 90%)',
    error: 'hsl(0 84% 60%)',
    errorLight: 'hsl(0 84% 95%)',
    info: 'hsl(199 89% 48%)',
    infoLight: 'hsl(199 89% 95%)',
  },

  // Emotion colors (pour AR filters, scans, etc.)
  emotions: {
    joy: 'hsl(45 100% 51%)', // #FFD700 gold
    calm: 'hsl(199 92% 63%)', // #4FC3F7 light blue
    energy: 'hsl(16 100% 60%)', // #FF6B35 coral
    focus: 'hsl(291 64% 42%)', // #9C27B0 purple
    peace: 'hsl(262 52% 73%)', // #B39DDB lavender
    clarity: 'hsl(187 100% 42%)', // #00BCD4 cyan
    love: 'hsl(339 82% 51%)', // #E91E63 pink
    gratitude: 'hsl(27 100% 55%)', // #FF8A50 orange
  },

  // Chart colors
  chart: {
    palette: [
      'hsl(234 89% 74%)', // #818cf8 indigo
      'hsl(160 84% 64%)', // #34d399 emerald
      'hsl(43 96% 56%)', // #fbbf24 amber
      'hsl(330 81% 71%)', // #f472b6 pink
      'hsl(199 89% 60%)', // #38bdf8 sky
      'hsl(350 89% 72%)', // #fb7185 rose
    ],
  },

  // Dark mode navy
  navy: {
    DEFAULT: 'hsl(222 47% 23%)', // #1B365D
    light: 'hsl(212 80% 70%)', // #4A90E2
    dark: 'hsl(222 47% 15%)',
  },

  // Neutral/Muted
  neutral: {
    mint: 'hsl(150 70% 80%)', // #A8E6CF
    coral: 'hsl(6 100% 69%)', // #FF6F61
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
  },

  // Social media
  social: {
    twitter: 'hsl(203 89% 53%)', // #1DA1F2
    facebook: 'hsl(214 89% 52%)', // #1877F2
    linkedin: 'hsl(210 96% 40%)', // #0A66C2
    instagram: 'hsl(330 75% 55%)', // #E4405F
    youtube: 'hsl(0 100% 50%)', // #FF0000
    whatsapp: 'hsl(142 70% 49%)', // #25D366
  },
} as const;

// === GRADIENTS ===
export const gradients = {
  primary: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
  hero: 'linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))',
  success: 'linear-gradient(135deg, hsl(142 76% 36%), hsl(160 84% 64%))',
  warning: 'linear-gradient(135deg, hsl(38 92% 50%), hsl(43 96% 56%))',
  error: 'linear-gradient(135deg, hsl(0 84% 60%), hsl(350 89% 72%))',
  calm: 'linear-gradient(135deg, hsl(199 92% 63%), hsl(187 100% 42%))',
  energy: 'linear-gradient(135deg, hsl(16 100% 60%), hsl(27 100% 55%))',
  focus: 'linear-gradient(135deg, hsl(291 64% 42%), hsl(262 52% 73%))',
  night: 'linear-gradient(135deg, hsl(256 37% 26%), hsl(261 52% 31%))', // #2A1B69 -> #5E35B1
} as const;

// === SHADOWS ===
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px hsl(var(--primary) / 0.3)',
  glowAccent: '0 0 20px hsl(var(--accent) / 0.3)',
} as const;

// === ACCESSIBILITY ===
export const a11y = {
  focusOutline: '2px solid hsl(211 100% 50%)', // #0066cc equivalent
  focusOffset: '2px',
  minTouchTarget: '44px',
  reducedMotion: 'prefers-reduced-motion: reduce',
} as const;

// === HELPER: Convert hex to HSL (for migration) ===
export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `hsl(${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

// === EXPORT DEFAULT ===
export default {
  colors,
  gradients,
  shadows,
  a11y,
  hexToHsl,
};
