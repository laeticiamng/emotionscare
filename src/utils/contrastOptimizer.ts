/**
 * Color Contrast Optimizer - WCAG AAA Compliance
 * Automatically fixes contrast issues and validates accessibility
 */

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface ContrastResult {
  ratio: number;
  level: 'fail' | 'aa' | 'aaa';
  isValid: boolean;
  suggestion?: string;
}

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex: string): ColorRGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert RGB to hex
 */
const rgbToHex = (rgb: ColorRGB): string => {
  return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
};

/**
 * Calculate relative luminance of a color
 */
const getLuminance = (rgb: ColorRGB): number => {
  const { r, g, b } = rgb;
  
  const getRGBValue = (value: number) => {
    const normalizedValue = value / 255;
    return normalizedValue <= 0.03928
      ? normalizedValue / 12.92
      : Math.pow((normalizedValue + 0.055) / 1.055, 2.4);
  };
  
  return 0.2126 * getRGBValue(r) + 0.7152 * getRGBValue(g) + 0.0722 * getRGBValue(b);
};

/**
 * Calculate contrast ratio between two colors
 */
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast meets WCAG standards
 */
export const checkContrast = (foreground: string, background: string): ContrastResult => {
  const ratio = calculateContrastRatio(foreground, background);
  
  let level: 'fail' | 'aa' | 'aaa' = 'fail';
  let isValid = false;
  let suggestion = '';
  
  if (ratio >= 7.0) {
    level = 'aaa';
    isValid = true;
  } else if (ratio >= 4.5) {
    level = 'aa';
    isValid = true;
  } else {
    suggestion = ratio >= 3.0 ? 'Consider for large text only' : 'Contrast too low - needs adjustment';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    isValid,
    suggestion
  };
};

/**
 * Automatically fix contrast by adjusting lightness
 */
export const fixContrast = (
  foreground: string, 
  background: string, 
  targetRatio: number = 4.5
): { foreground: string; background: string; ratio: number } => {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  
  if (!fgRgb || !bgRgb) {
    return { foreground, background, ratio: 0 };
  }
  
  // Try adjusting foreground first
  let adjustedFg = { ...fgRgb };
  let currentRatio = calculateContrastRatio(rgbToHex(adjustedFg), background);
  
  // If ratio is too low, make foreground darker or lighter
  if (currentRatio < targetRatio) {
    const bgLuminance = getLuminance(bgRgb);
    
    // If background is light, make foreground darker
    if (bgLuminance > 0.5) {
      while (currentRatio < targetRatio && (adjustedFg.r > 0 || adjustedFg.g > 0 || adjustedFg.b > 0)) {
        adjustedFg.r = Math.max(0, adjustedFg.r - 10);
        adjustedFg.g = Math.max(0, adjustedFg.g - 10);
        adjustedFg.b = Math.max(0, adjustedFg.b - 10);
        currentRatio = calculateContrastRatio(rgbToHex(adjustedFg), background);
      }
    } else {
      // If background is dark, make foreground lighter
      while (currentRatio < targetRatio && (adjustedFg.r < 255 || adjustedFg.g < 255 || adjustedFg.b < 255)) {
        adjustedFg.r = Math.min(255, adjustedFg.r + 10);
        adjustedFg.g = Math.min(255, adjustedFg.g + 10);
        adjustedFg.b = Math.min(255, adjustedFg.b + 10);
        currentRatio = calculateContrastRatio(rgbToHex(adjustedFg), background);
      }
    }
  }
  
  return {
    foreground: rgbToHex(adjustedFg),
    background,
    ratio: currentRatio
  };
};

/**
 * Generate accessible color palette
 */
export const generateAccessiblePalette = (baseColor: string) => {
  const baseRgb = hexToRgb(baseColor);
  if (!baseRgb) return null;
  
  return {
    // Text colors with proper contrast
    textOnLight: fixContrast('#000000', '#ffffff', 7.0).foreground,
    textOnDark: fixContrast('#ffffff', '#000000', 7.0).foreground,
    
    // Primary variations with accessible contrast
    primary: baseColor,
    primaryLight: fixContrast(baseColor, '#ffffff', 4.5).foreground,
    primaryDark: fixContrast(baseColor, '#000000', 4.5).foreground,
    
    // Status colors
    success: fixContrast('#22c55e', '#ffffff', 4.5).foreground,
    warning: fixContrast('#f59e0b', '#ffffff', 4.5).foreground,
    error: fixContrast('#ef4444', '#ffffff', 4.5).foreground,
    
    // Neutral colors
    neutral100: '#f8fafc',
    neutral200: '#e2e8f0',
    neutral300: '#cbd5e1',
    neutral400: '#94a3b8',
    neutral500: '#64748b',
    neutral600: '#475569',
    neutral700: '#334155',
    neutral800: '#1e293b',
    neutral900: '#0f172a'
  };
};

/**
 * Validate entire page for contrast issues
 */
export const validatePageContrast = (): Array<{
  element: Element;
  foreground: string;
  background: string;
  ratio: number;
  isValid: boolean;
}> => {
  const issues: any[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // Get all text elements
  const textElements = document.querySelectorAll('*');
  
  textElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    // Skip transparent or inherit values
    if (color === 'rgba(0, 0, 0, 0)' || backgroundColor === 'rgba(0, 0, 0, 0)') {
      return;
    }
    
    // Convert to hex for calculation
    const fgHex = colorToHex(color);
    const bgHex = colorToHex(backgroundColor);
    
    if (fgHex && bgHex) {
      const result = checkContrast(fgHex, bgHex);
      
      if (!result.isValid) {
        issues.push({
          element,
          foreground: fgHex,
          background: bgHex,
          ratio: result.ratio,
          isValid: result.isValid
        });
      }
    }
  });
  
  return issues;
};

/**
 * Convert computed color to hex
 */
const colorToHex = (color: string): string | null => {
  if (color.startsWith('#')) return color;
  
  if (color.startsWith('rgb')) {
    const values = color.match(/\d+/g);
    if (values && values.length >= 3) {
      const r = parseInt(values[0]);
      const g = parseInt(values[1]);
      const b = parseInt(values[2]);
      return rgbToHex({ r, g, b });
    }
  }
  
  return null;
};

/**
 * Apply contrast fixes to problematic elements
 */
export const applyContrastFixes = () => {
  const issues = validatePageContrast();
  
  issues.forEach(issue => {
    const fixed = fixContrast(issue.foreground, issue.background, 4.5);
    const element = issue.element as HTMLElement;
    
    // Apply the fix
    element.style.color = fixed.foreground;
    
    // Add data attribute to track the fix
    element.setAttribute('data-contrast-fixed', 'true');
    element.setAttribute('data-original-color', issue.foreground);
    element.setAttribute('data-fixed-ratio', fixed.ratio.toString());
  });
  
  return issues.length;
};