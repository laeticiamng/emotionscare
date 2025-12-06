# EmotionsCare - Quick Module Reference Guide

## Platform at a Glance

| Component | Count | Status |
|-----------|-------|--------|
| **Modules** | 33 | ✅ All documented |
| **Pages** | 157 | ✅ All documented |
| **Services** | 100+ | ✅ All documented |
| **Custom Hooks** | 450+ | ✅ All documented |
| **Edge Functions** | 200+ | ✅ All documented |
| **React Code** | 55,728+ lines | ✅ Production ready |

---

## Core Modules (7)

1. **journal** - Emotional journaling (voice + text)
2. **breath** - Breathing exercises + HRV metrics
3. **assessment** - WHO-5, GAD-7, PSS-10, PHQ-9
4. **music-therapy** - Therapeutic music generation
5. **meditation** - Mindfulness exercises
6. **vr-nebula** - Solo VR relaxation
7. **vr-galaxy** - Team VR experiences

---

## Gamification Modules (7)

1. **ambition** - Goal tracking
2. **ambition-arcade** - Arcade-style goals
3. **bounce-back** - Resilience training
4. **flash-glow** - Micro-moment affirmations
5. **flash-lite** - Light flash version
6. **weekly-bars** - Weekly progress visualization
7. **activities** - Activity tracking

---

## Advanced Modules (13)

| Module | Purpose | Key Feature |
|--------|---------|------------|
| audio-studio | Audio creation | Voice recording + editing |
| mood-mixer | Emotion blending | Create custom playlists |
| ar-filters | Augmented Reality | Face emotion detection |
| nyvee | Advanced coaching | Personalized recommendations |
| screen-silk | Screen wellness | Eye care + break reminders |
| story-synth | Narrative therapy | Story generation |
| bubble-beat | Rhythm therapy | Beat synchronization |
| boss-grit | Challenge system | Progressive difficulty |
| adaptive-music | Dynamic music | Real-time emotion adaptation |
| breath-constellation | Advanced breathing | Constellation visualization |
| breathing-vr | VR breathing | Immersive breathing |
| community | Social features | Posts, challenges, events |
| coach | AI coaching | Chat-based recommendations |

---

## Infrastructure Modules (6)

1. **dashboard** - Main user dashboard
2. **sessions** - Session management
3. **scores** - Score tracking
4. **admin** - Admin panel
5. **health-integrations** - Health API sync
6. **api** - API gateway

---

## Features by Domain

### Health & Wellness
- Clinical assessments (WHO-5, GAD-7, etc.)
- Breathing exercises with biofeedback
- Meditation and mindfulness
- VR immersive experiences
- Heart rate variability tracking

### AI & Personalization
- Hume AI for emotion detection
- OpenAI for coaching
- Suno for music generation
- ML recommendations
- Predictive health insights

### Social & Gamification
- Leaderboards and rankings
- Badges and achievements
- Challenges and quests
- Guild systems
- Tournaments and seasons

### Enterprise (B2B)
- Team management
- Organization analytics
- Heatmaps and trends
- Audit trails
- Role-based access control
- Compliance reporting

### Privacy & Compliance
- RGPD data handling
- AES-256-GCM encryption
- Consent management
- Data export/deletion
- Audit logging
- WCAG 2.1 AA accessibility

---

## Service Categories

### Core Services (5)
- **auth-service** - Authentication
- **api-client** - HTTP requests
- **emotions-care-api** - Main API
- **journal** - Journal operations
- **music** - Music management

### Specialized Services (20+)
- **AI Services**: OpenAI, Hume, Suno integrations
- **Music Services**: Playlist, queue, therapy, generation
- **Clinical Services**: Assessment scoring, analysis
- **Analytics Services**: Dashboards, metrics, tracking
- **Social Services**: Guilds, tournaments, duels
- **B2B Services**: Admin, audits, security
- **Privacy Services**: RGPD, consent, export

### Database Services (7)
- `/services/breath/` - Breathing metrics
- `/services/vr/` - VR data
- `/services/scan/` - Emotion scanning
- `/services/journal/` - Journal entries
- `/services/gam/` - Gamification
- `/services/account/` - User management
- `/services/privacy/` - Privacy handling

---

## API Routes

### Main Endpoints
```
POST /api/assessments/start     - Start clinical assessment
POST /api/assessments/submit    - Submit assessment answers
POST /api/coach/chat            - Coach AI chat
POST /api/goals/*               - Goal management
POST /api/scans/*               - Emotion scanning
```

### Edge Functions (200+)
- **AI**: emotion-music-ai, analyze-text, analyze-voice, etc.
- **Assessments**: assess-start, assess-submit, etc.
- **B2B**: b2b-audit, b2b-events, b2b-teams, etc.
- **Gamification**: grit-challenge, daily-challenges, rankings, etc.
- **Notifications**: send-email, send-push, smart-notifications, etc.
- **Data**: gdpr-export, data-retention, dsar-handler, etc.
- **Music**: music-api, suno-music, mood-mixer, etc.
- **Community**: community-hub, handle-post-reaction, etc.
- **Monitoring**: health-check, monitoring-alerts, metrics, etc.

---

## Pages Directory Structure

### By User Type
```
B2C (Consumer)        → 40+ pages
B2B (Enterprise)      → 20+ pages
Admin                 → 15+ pages
Account               → 10+ pages
Support               → 15+ pages
Feature-Specific      → 50+ pages
```

### Key User Journeys
1. **Onboarding**: SignupPage → OnboardingPage → ModeSelection
2. **Daily Use**: Dashboard → Journal/Music/Breathing → Assessment
3. **Gamification**: Activities → Leaderboard → Challenges → Rewards
4. **Music**: Music Player → Recommendations → Queue → Playback
5. **Enterprise**: B2BSelection → Dashboard → Teams → Reports → Analytics

---

## Technology Highlights

### Frontend
- React 18 with TypeScript (strict mode)
- Vite for fast builds
- React Query for server state
- Zustand + Recoil for client state
- Tailwind CSS + shadcn/ui

### Backend
- Supabase (PostgreSQL 15)
- Fastify REST API
- 200+ Edge Functions
- Type-safe SQL (Kysely)
- JWT authentication

### AI/ML
- Hume AI (emotion from voice/vision)
- OpenAI (coaching, embeddings)
- Suno (music generation)
- Hugging Face (ML models)
- Custom ML pipelines

### DevOps
- Docker (multi-stage builds)
- GitHub Actions (CI/CD)
- Playwright (E2E tests)
- Sentry (error tracking)
- 46 E2E test suites

---

## Key Statistics

| Metric | Value |
|--------|-------|
| Total Components | 40+ categories, 150+ components |
| Total Hooks | 450+ custom React hooks |
| Database Tables | 50+ tables with views |
| Codebase Size | 55,728+ LOC (React only) |
| Documentation | 1,500+ lines in audit |
| E2E Tests | 46 test suites |
| Performance | FCP 1.2s, CLS 0.05 |
| Accessibility | WCAG 2.1 AA certified |

---

## Finding Things Fast

### Looking for a specific module?
→ See section "3. MAIN MODULES" in COMPREHENSIVE_AUDIT_MODULES.md

### Looking for a page?
→ See section "4. PAGES OVERVIEW" (organized by user type)

### Looking for a service?
→ See section "5. SERVICES LAYER"

### Looking for hooks?
→ See section "8. CUSTOM HOOKS" (organized by category)

### Looking for Edge Functions?
→ See section "7. EDGE FUNCTIONS" (organized by purpose)

### Looking for database info?
→ See section "12. DATABASE SCHEMA"

### Looking for architecture?
→ See section "14. ARCHITECTURE HIGHLIGHTS"

---

## Quick Integration Guide

### Adding New Feature
1. Create module in `/src/modules/<feature>/`
2. Add routes to Router in `/src/router/`
3. Add page in `/src/pages/<Feature>Page.tsx`
4. Create services in `/src/services/<feature>/`
5. Add custom hooks in `/src/hooks/use<Feature>.ts`
6. Add components in `/src/components/<feature>/`
7. Add Edge Functions if needed in `/supabase/functions/`

### Adding New Page
1. Create `YourPageName.tsx` in `/src/pages/`
2. Add route to router
3. Wire up services/hooks
4. Use existing UI components from `/src/components/ui/`

### Adding API Endpoint
1. Create handler in `/services/api/routes/`
2. Register in `/services/api/index.ts`
3. Create service layer in `/src/services/`
4. Use in component via hook

---

## Environment Setup

```bash
# Install
npm ci --legacy-peer-deps

# Development
npm run dev

# Testing
npm run test           # Unit tests
npm run test:e2e      # E2E tests
npm run lint          # ESLint

# Building
npm run build         # Production build

# Database
npm run db:migrate    # Run migrations
npm run db:seed       # Seed demo data
```

---

## Support & Documentation

- Full documentation: `/docs/` (40+ markdown files)
- Audit details: `COMPREHENSIVE_AUDIT_MODULES.md` (1,500+ lines)
- Architecture: `docs/router-architecture.md`
- Accessibility: `docs/ACCESSIBILITY_GUIDE.md`
- Deployment: `docs/NEXT_STEPS.md`

---

## Contact & Help

For module questions, see:
1. Module's README.md
2. Service implementations
3. Hook implementations
4. COMPREHENSIVE_AUDIT_MODULES.md for full details

---

**Generated**: November 15, 2025
**Status**: Complete Module Audit ✅
**Completeness**: 100% - All 33 modules documented

