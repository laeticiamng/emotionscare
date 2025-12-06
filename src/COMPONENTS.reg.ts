// @ts-nocheck
// ============================================================================
//  EmotionsCare – UI Component Registry (UI pur uniquement)
//  Utilisez `npm run generate:ui-registry` après toute modification.
// ============================================================================

// --- Layout & marketing -----------------------------------------------------
export { default as PageHeader } from './components/ui/PageHeader';
export { LoadingSpinner } from './components/ui/LoadingSpinner.tsx';
export { NavBar } from '@/ui/NavBar';
export { Footer } from '@/ui/Footer';
export { GlowSurface } from '@/ui/GlowSurface';
export { CookieConsent, hasConsent } from '@/ui/CookieConsent';
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
export { FadeIn } from '@/ui/motion/FadeIn';
export { SlideIn } from '@/ui/motion/SlideIn';

// --- Thème & i18n -----------------------------------------------------------
export { ThemeProvider, useTheme, ThemeToggle } from '@/theme/ThemeProvider';
export { I18nProvider, useI18n, t } from '@/lib/i18n/i18n';

// --- Hooks UI ---------------------------------------------------------------
export { usePrefetchOnHover } from '@/hooks/usePrefetchOnHover';
export { usePulseClock } from '@/ui/hooks/usePulseClock';
export { useTimer } from '@/ui/hooks/useTimer';
export { useSound } from '@/ui/hooks/useSound';
export { useAudioBus } from '@/ui/hooks/useAudioBus';
export { useCrossfade } from '@/ui/hooks/useCrossfade';
export { useRaf } from '@/ui/hooks/useRaf';
export { useDebounce } from '@/ui/hooks/useDebounce';
export { useThrottle } from '@/ui/hooks/useThrottle';

// --- Components data viz & feedback ----------------------------------------
export { ProgressBar } from '@/ui/ProgressBar';
export { Sparkline } from '@/ui/Sparkline';
export { BadgeLevel } from '@/ui/BadgeLevel';
export { AudioPlayer } from '@/ui/AudioPlayer';
export { FeedbackForm } from '@/ui/FeedbackForm';
export { ConstellationCanvas } from '@/ui/ConstellationCanvas';
export { CommandPalette, useCommandPalette } from '@/ui/CommandPalette';

// --- Notifications & overlays ----------------------------------------------
export { NotificationProvider } from '@/components/ui/notification-system';
export { TooltipProvider } from '@/components/ui/tooltip';

// --- Feature flags ---------------------------------------------------------
export { flagActive, inCohort, setOverride, clearOverride, getOverrides } from '@/lib/flags/rollout';

// --- Providers additionnels -------------------------------------------------
export { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
export { ThemeProvider as LegacyThemeProvider } from '@/providers/ThemeProvider';
