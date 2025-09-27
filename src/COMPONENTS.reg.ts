// ============================================================================
//  EmotionsCare – UI Component Registry (UI pur uniquement)
//  Utilisez `npm run generate:ui-registry` après toute modification.
// ============================================================================

// --- Layout & marketing -----------------------------------------------------
export { default as PageHeader } from './components/ui/PageHeader';
export { LoadingSpinner } from './components/ui/LoadingSpinner.tsx';
export { NavBar } from '@/components/ui/nav-bar';
export { Footer } from '@/components/ui/footer';
export { GlowSurface } from '@/components/ui/glow-surface';
export { CookieConsent, hasConsent } from '@/components/ui/cookie-consent';
export { SeoHead } from '@/lib/seo/SeoHead';

// --- shadcn / UI primitives -------------------------------------------------
export { Button } from './components/ui/button.tsx';
export { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card.tsx';
export { Input } from './components/ui/input.tsx';
export { Textarea } from './components/ui/textarea.tsx';
export { Label } from './components/ui/label.tsx';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.tsx';
export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog.tsx';
export { Badge } from './components/ui/badge.tsx';
export { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar.tsx';
export { Progress } from './components/ui/progress.tsx';

// --- Animation & motion -----------------------------------------------------
export { FadeIn } from '@/components/ui/motion/FadeIn';
export { SlideIn } from '@/components/ui/motion/SlideIn';

// --- Thème & i18n -----------------------------------------------------------
export { ThemeProvider, useTheme, ThemeToggle } from '@/theme/ThemeProvider';
export { I18nProvider, useI18n, t } from '@/lib/i18n/i18n';

// --- Hooks UI ---------------------------------------------------------------
export { usePrefetchOnHover } from '@/hooks/usePrefetchOnHover';
export { usePulseClock } from '@/components/ui/hooks/usePulseClock';
export { useTimer } from '@/components/ui/hooks/useTimer';
export { useSound } from '@/components/ui/hooks/useSound';
export { useAudioBus } from '@/components/ui/hooks/useAudioBus';
export { useCrossfade } from '@/components/ui/hooks/useCrossfade';
export { useRaf } from '@/components/ui/hooks/useRaf';
export { useDebounce } from '@/components/ui/hooks/useDebounce';
export { useThrottle } from '@/components/ui/hooks/useThrottle';

// --- Composants UI spécialisés ---------------------------------------------
export { ProgressBar } from '@/components/ui/progress-bar-custom';
export { Sparkline } from '@/components/ui/sparkline';
export { BadgeLevel } from '@/components/ui/badge-level';
export { AudioPlayer } from '@/components/ui/audio-player';
export { FeedbackForm } from '@/components/ui/feedback-form';
export { ConstellationCanvas } from '@/components/ui/constellation-canvas';
export { CommandPalette, useCommandPalette } from '@/components/ui/command-palette';

// --- Notifications & overlays ----------------------------------------------
export { NotificationProvider } from '@/components/ui/notification-system';
export { TooltipProvider } from '@/components/ui/tooltip';

// --- Feature flags ---------------------------------------------------------
export { flagActive, inCohort, setOverride, clearOverride, getOverrides } from '@/lib/flags/rollout';

// --- Providers additionnels -------------------------------------------------
export { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
export { ThemeProvider as LegacyThemeProvider } from '@/providers/ThemeProvider';
