/**
 * Feature: Accessibility
 * Accessibilité et personnalisation UI - WCAG AA compliant
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { AccessibilityPanel } from './components';

// ============================================================================
// HOOKS
// ============================================================================

export { useAccessibility } from '@/hooks/useAccessibility';
export { useReducedMotion } from '@/hooks/useReducedMotion';
export { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

// ============================================================================
// TYPES
// ============================================================================

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSizeScale: number;
  dyslexiaFriendlyFont: boolean;
  screenReaderOptimized: boolean;
  keyboardOnlyNavigation: boolean;
  focusIndicatorsEnhanced: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}
