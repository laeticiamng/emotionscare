# EmotionsCare – AI Rules & Tech Stack

This document defines the canonical tech stack and clear usage rules to keep implementations consistent, secure, and maintainable.

## Tech stack (overview)

- React 18 + TypeScript with Vite, Tailwind CSS, and shadcn/ui for design system and components
- React Router v6 for routing, with route components under src/pages/
- Supabase (Auth, Postgres with RLS, Storage, Edge Functions) as the backend
- TanStack Query for server state; lightweight local state with React Context or Zustand when needed
- i18n with i18next/react-i18next and locale resources in public/locales and src/i18n
- OpenAI, Hume AI, and Suno integrations via Supabase Edge Functions (never call raw APIs from the browser)
- Charts with Chart.js via react-chartjs-2; icons with lucide-react
- Testing with Vitest and Playwright; monitoring with Sentry
- Notifications with shadcn/ui toast/use-toast and sonner (see rules below)

## Rules by domain

### UI and styling
- Use shadcn/ui components as the default building blocks; do not fork or edit shadcn/ui files—compose or wrap in new components instead.
- Use Tailwind CSS utility classes for all styling; avoid CSS-in-JS and inline style objects except for dynamic widths/heights.
- Ensure responsive layouts by default (mobile-first); prefer grid/flex utilities and gap utilities for spacing.

### Routing and pages
- Put all route-level views in src/pages/ and keep routing in the app’s router (React Router v6).
- Pages should remain thin: lift complex UI into src/components/ and business logic into hooks/services.

### Icons
- Use lucide-react for all icons; keep sizes consistent (h-4/w-4 or h-5/w-5) and color via Tailwind text-* classes.

### Forms and validation
- Use react-hook-form for all non-trivial forms.
- Use zod schemas for runtime validation; keep schemas colocated with the feature or in a shared types/ area when reused.

### State management
- Server state: use TanStack Query (src/providers/queryClient.ts). Configure query keys and cache times explicitly.
- Client/local state: use React useState/useReducer; scale up to Context or Zustand only for cross-tree state that must persist.
- Do not mix multiple global state managers for the same concern.

### Data access and API rules
- Supabase is the single source of truth for authentication and data, protected by RLS policies.
- All third-party AI calls (OpenAI, Hume, Suno, etc.) must go through Supabase Edge Functions; never call those providers directly from the browser or include secrets in client code.
- For DB access, use the Supabase JS client (src/integrations/supabase/client.ts). Keep SQL on the backend or in migrations; avoid complex filters in the client.
- For cross-service orchestration, prefer existing services under src/services/ and hooks under src/hooks/, keeping interfaces small and typed.

### AI and ML usage
- OpenAI:
  - Use Supabase functions openai-chat, openai-tts, openai-transcribe, openai-embeddings, openai-moderate.
  - In the frontend, prefer service wrappers like src/services/api/openai.ts or openai-client helpers in src/lib/ai/openai-client.ts.
  - Model config: use src/lib/ai/openai-config.ts (canonical) for selecting models and defaults; treat src/config/ai-models.ts as feature-specific presets only.
- Emotion analysis:
  - Visual: use mood-camera (Hume AI via Edge Function).
  - Voice: use analyze-voice-hume or voice-analysis endpoints.
  - Text: use analyze-emotion-text or openai-emotion-analysis where appropriate.
- Music generation:
  - Use Suno endpoints via Supabase functions (e.g., suno-music-generation, suno-music).
- Moderation:
  - Use openai-moderate (via function) before persisting or displaying UGC where needed.

### Media and real-time
- Audio/video capture uses Web APIs + feature-specific components; persist only through secure functions.
- Use the existing mood event bus (features/mood) for broadcasting mood updates across components.

### Charts and data visualization
- Use Chart.js via react-chartjs-2 for all charts.
- Keep chart options in small, reusable helpers; avoid bespoke chart libraries.

### Notifications and toasts
- Default in-app toasts: shadcn/ui use-toast (src/components/ui/use-toast.ts) for contextual feedback within flows and dialogs.
- Global, cross-page toasts: sonner is allowed for simple global notifications (success/error/info) where shadcn context is not available.
- Do not introduce additional toast libraries.

### Internationalization
- Use i18next/react-i18next; keep copy in locale files, not inline in components.
- Prefer French copy by default; provide English translations where required.

### Testing and quality
- Unit and integration tests with Vitest/@testing-library; E2E with Playwright.
- Keep Sentry instrumentation in place for production error and performance monitoring.

### File structure
- Components: src/components/ (small, focused, <100 lines when possible).
- Pages (routes): src/pages/.
- Hooks: src/hooks/ (one hook per file; typed API).
- Services (API and business logic): src/services/.
- Feature modules live under src/features/ or src/modules/ with their own components/hooks/services when the surface area is larger.

### Performance
- Use Suspense/lazy for heavy components and route-based code splitting where sensible.
- Memoize derived values and callbacks; avoid unnecessary re-renders in list-heavy UIs.
- Prefer server-side aggregation (Edge Functions) for large datasets.

### Security and privacy
- Never expose secret keys in client code; all paid AI calls go through Supabase Edge Functions.
- RLS must guard all user data; service-role operations stay server-side only.
- Follow the clinical consent gates and feature flags where required (e.g., scan/SAM flows).

## Do’s and Don’ts

- Do:
  - Reuse shadcn/ui components and Tailwind utilities.
  - Use TanStack Query for all network/server state.
  - Centralize AI calls through Supabase functions and existing service wrappers.
  - Keep components small and accessible (keyboard/focus/ARIA).
- Don’t:
  - Call OpenAI/Hume/Suno directly from the browser or commit API keys.
  - Introduce new UI or toast libraries.
  - Add complex logic to pages; move it into hooks/services.
  - Duplicate configuration—prefer src/lib/ai/openai-config.ts for model defaults.