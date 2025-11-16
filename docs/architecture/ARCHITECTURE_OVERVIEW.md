# 🏗️ Architecture Overview

Complete technical architecture guide for EmotionsCare production system.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│  ┌─────────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Web Browser    │  │  Mobile App  │  │  Native Desktop     │   │
│  │  (React/Vite)   │  │  (React Native)│ │  (Electron)        │   │
│  └────────┬────────┘  └──────┬───────┘  └──────────┬──────────┘   │
│           │                   │                      │              │
│           └───────────────────┼──────────────────────┘              │
│                               │                                     │
└───────────────────────────────┼─────────────────────────────────────┘
                                │ HTTPS/WSS
                    ┌───────────▼──────────┐
                    │   CDN / Load         │
                    │   Balancer           │
                    │  (Vercel/Netlify)    │
                    └───────────┬──────────┘
                                │
┌───────────────────────────────┼─────────────────────────────────────┐
│                      APPLICATION LAYER                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           Next.js / Vite Frontend                            │  │
│  │  ┌─────────────┐  ┌──────────┐  ┌────────────────────────┐  │  │
│  │  │ Components  │  │ Hooks    │  │ State Management       │  │  │
│  │  │ (shadcn/ui) │  │ (Supabase)│ │ (Zustand/TanStack)   │  │  │
│  │  └─────────────┘  └──────────┘  └────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │           Supabase Edge Functions                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │  │
│  │  │ AI Endpoints │  │ Auth Handler │  │ Integrations       │ │  │
│  │  │ (GPT, Hume)  │  │ (JWT/JWKS)   │  │ (Spotify, Zoom)    │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ REST API / GraphQL
                    ┌──────────▼──────────┐
                    │   Supabase          │
                    │   (PostgreSQL)      │
                    │   Auth              │
                    │   Storage           │
                    │   Realtime          │
                    └──────────┬──────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                      DATA LAYER                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ PostgreSQL   │  │ Object        │  │ Cache                    │ │
│  │ Database     │  │ Storage (S3)  │  │ (Redis/Memory)           │ │
│  │ - Users      │  │ - Documents   │  │ - Sessions               │ │
│  │ - Journal    │  │ - Images      │  │ - Frequently Used Data   │ │
│  │ - Meditation │  │ - Audio       │  │                          │ │
│  │ - Settings   │  │ - Reports     │  │                          │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                            │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ AI Services │  │ Music APIs  │  │ Calendar & Meeting       │  │
│  │ ┌─────────┐ │  │ ┌────────┐  │  │ ┌────────────────────┐  │  │
│  │ │OpenAI   │ │  │ │Spotify │  │  │ │Zoom               │  │  │
│  │ │(GPT-4)  │ │  │ │(Oauth) │  │  │ │(Video Meetings)   │  │  │
│  │ │Whisper  │ │  │ │Apple   │  │  │ │Google Calendar    │  │  │
│  │ │Vision   │ │  │ │Music   │  │  │ │(Event Management) │  │  │
│  │ │Hume     │ │  │ │Suno    │  │  │ │                   │  │  │
│  │ │(Emotions)│ │  │ │(Gen AI)│  │  │                    │  │  │
│  │ └─────────┘ │  │ └────────┘  │  │ └────────────────────┘  │  │
│  └─────────────┘  └─────────────┘  └──────────────────────────┘  │
│                                                                     │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Notifications  │  │ Email        │  │ Monitoring             │ │
│  │ ┌────────────┐ │  │ ┌──────────┐ │  │ ┌──────────────────┐  │ │
│  │ │Firebase    │ │  │ │Resend    │ │  │ │Sentry            │  │ │
│  │ │FCM         │ │  │ │(SMTP)    │ │  │ │(Error Tracking)  │  │ │
│  │ │(Push)      │ │  │ │Sendgrid  │ │  │ │Slack (Alerts)    │  │ │
│  │ └────────────┘ │  │ │AWS SES   │ │  │ │PagerDuty (On-call)
│  │                │  │ └──────────┘ │  │ │Lighthouse (Perf) │  │ │
│  │                │  │              │  │ └──────────────────┘  │ │
│  └────────────────┘  └──────────────┘  └────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18.x + TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Routing**: React Router v6
- **Date/Time**: Date-fns
- **Maps**: Leaflet / Mapbox

### Backend
- **Database**: PostgreSQL 15+ (Supabase)
- **Auth**: Supabase Auth (JWT-based)
- **API**: REST + Real-time Subscriptions
- **Edge Functions**: Deno + TypeScript
- **File Storage**: Supabase Storage (S3-compatible)
- **Realtime**: PostgreSQL LISTEN/NOTIFY

### Infrastructure
- **Hosting**: Vercel / Netlify (Frontend)
- **Database Hosting**: Supabase Cloud
- **CDN**: Built-in via hosting
- **DNS**: Cloudflare / Route53
- **SSL/TLS**: Let's Encrypt (automated)

### Monitoring & DevOps
- **Error Tracking**: Sentry
- **Logging**: Supabase Functions Logs + CloudWatch
- **Performance**: Sentry Performance
- **Uptime Monitoring**: Ping Service / Grafana
- **CI/CD**: GitHub Actions
- **Container**: Docker (optional, for local dev)
- **Load Testing**: K6 / Locust

## Data Flow Architecture

### User Registration Flow
```
1. Frontend: User fills signup form
   └─→ TanStack Query invalidates cache

2. API Request: POST /auth/register
   └─→ Supabase Auth validates

3. Database: Create user record
   └─→ RLS policies enforce security

4. Email: Send confirmation email
   └─→ Resend API

5. Frontend: Redirect to dashboard
   └─→ Auth token stored in secure cookie
```

### Journal Entry Creation
```
1. Frontend: User writes journal entry
   └─→ Auto-save every 30 seconds

2. Image/Audio Upload (Optional)
   └─→ POST to Supabase Storage
   └─→ Call Vision/Whisper edge functions

3. AI Analysis: GPT-4 Vision + Whisper
   └─→ Extract emotions, mood, tags

4. Database Insert: journal_entries table
   └─→ RLS: User can only see own entries

5. Realtime: Broadcast update to UI
   └─→ Supabase Realtime subscription

6. Notifications: Send push notification
   └─→ Firebase FCM
```

### Meditation Session Flow
```
1. Frontend: User starts meditation
   └─→ Timer begins
   └─→ Background music streams (if enabled)

2. During Session:
   └─→ Track elapsed time
   └─→ Monitor for interruptions
   └─→ Update UI in real-time

3. Session Complete:
   └─→ Auto-save to database
   └─→ Log metrics (duration, mood before/after)
   └─→ Show completion badge
   └─→ Send push notification

4. Analytics: Update user statistics
   └─→ Total sessions, streak, duration
   └─→ Trigger achievements/rewards
```

## Database Schema (Key Tables)

### users
```sql
id (UUID, PK)
email (VARCHAR, unique)
encrypted_password (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
last_login (TIMESTAMP)
preferences (JSONB)
```

### journal_entries
```sql
id (UUID, PK)
user_id (UUID, FK → users)
title (VARCHAR)
content (TEXT)
mood (VARCHAR)
emotions (JSONB[])  -- From Hume API
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
visibility (VARCHAR)  -- private, shared, public
ai_summary (TEXT)     -- From GPT-4
image_urls (TEXT[])
audio_url (VARCHAR)
RLS: user_id = auth.uid()
```

### meditation_sessions
```sql
id (UUID, PK)
user_id (UUID, FK → users)
program_id (UUID, FK → programs)
duration (INTEGER)  -- seconds
mood_before (VARCHAR)
mood_after (VARCHAR)
created_at (TIMESTAMP)
completed (BOOLEAN)
notes (TEXT)
RLS: user_id = auth.uid()
```

### music_tracks
```sql
id (UUID, PK)
user_id (UUID, FK → users)
title (VARCHAR)
artist (VARCHAR)
emotion (VARCHAR)
source (VARCHAR)  -- spotify, apple_music, suno
source_id (VARCHAR)  -- external ID
created_at (TIMESTAMP)
duration (INTEGER)  -- seconds
is_saved (BOOLEAN)
RLS: user_id = auth.uid() OR is_saved = true
```

### notifications
```sql
id (UUID, PK)
user_id (UUID, FK → users)
type (VARCHAR)  -- push, email, in-app
title (VARCHAR)
body (TEXT)
data (JSONB)
sent_at (TIMESTAMP)
read_at (TIMESTAMP)
RLS: user_id = auth.uid()
```

## Authentication Flow

### OAuth Flow (Spotify/Google)
```
1. Frontend: User clicks "Login with Spotify"
2. Redirect to Spotify auth endpoint
3. User authorizes app
4. Spotify redirects to callback URL with code
5. Backend: Exchange code for access token
6. Store token in secure database
7. Refresh token automatically when expired
8. Use token for API calls to Spotify
```

### Session Management
```
1. JWT issued by Supabase Auth
2. Stored in httpOnly cookie (secure)
3. Automatically sent with each request
4. Server validates on each request
5. Refresh token rotates every 7 days
6. Expired sessions redirect to login
```

## Security Architecture

### Data Protection
```
In Transit:
- All requests over HTTPS/TLS 1.3
- HSTS headers enforced
- Certificate pinning (optional)

At Rest:
- Database encrypted (AES-256)
- Sensitive fields encrypted (passwords)
- Files encrypted in object storage
- Backups encrypted

PII Handling:
- Strict RLS policies
- No user data in logs
- Sentry PII scrubbing enabled
- GDPR compliance
```

### Access Control
```
Row Level Security (RLS):
- All tables have RLS enabled
- Policies enforce user isolation
- Admin overrides for support/recovery
- Audit trail for privileged access

Rate Limiting:
- API: 100 requests/minute per user
- Auth: 5 failed attempts → lockout
- File upload: 100MB/day per user
- Realtime: 1000 messages/minute

CORS:
- Whitelist authorized domains
- credentials: include for cookies
- specific headers allowed
```

## Scalability Considerations

### Horizontal Scaling
```
Frontend:
- CDN caching (static assets)
- Service Worker for offline mode
- Dynamic imports for code splitting
- Lazy loading for images/videos

Backend:
- Stateless edge functions
- Database connection pooling
- Horizontal pod autoscaling (Kubernetes optional)
- Multi-region deployment ready

Database:
- Read replicas for analytics
- Sharding strategy for large datasets
- Connection pooling (PgBouncer)
- Caching layer (Redis optional)
```

### Performance Optimization
```
Frontend:
- Lighthouse score > 0.85
- Core Web Vitals tracking
- LCP < 2.5s, CLS < 0.1, FID < 100ms
- Code splitting by route
- Image optimization (WebP, lazy loading)

Backend:
- Database query optimization
- Index strategy
- N+1 query prevention
- Batch operations for bulk updates
- Caching (browser, CDN, application)
```

## Disaster Recovery

### Backup Strategy
```
Database:
- Daily automated snapshots
- 7-day retention
- Geo-redundant storage
- Point-in-time recovery available

Files:
- S3 versioning enabled
- Cross-region replication
- 30-day delete protection
- Lifecycle policies for old data
```

### Failover Procedure
```
If primary database down:
1. Automatic failover to read replica
2. Promote replica to primary
3. Update connection strings
4. Verify replication lag < 1 second
5. Scale up compute resources if needed

If service completely down:
1. Switch DNS to backup region
2. Restore from latest snapshot
3. Run migration scripts
4. Verify data integrity
5. Monitor closely for 24 hours
```

## Monitoring & Observability

### Key Metrics
```
Application:
- Request rate (req/sec)
- Error rate (%)
- Response time (P50, P95, P99)
- User sessions (concurrent)
- API endpoint latency

Infrastructure:
- CPU usage
- Memory usage
- Disk usage
- Network I/O
- Database connections

Business:
- Daily active users
- Feature usage
- Conversion rates
- Error impact (users affected)
```

### Alerting Strategy
```
Critical (P1):
- Error rate > 5%
- Service unavailable
- Database connection lost
- Memory exhausted

High (P2):
- Error rate > 2%
- Response time P95 > 3s
- Database CPU > 80%

Medium (P3):
- Error rate > 1%
- Response time P95 > 1s
- Disk usage > 80%
```

## Development Workflow

### Local Development
```
1. Clone repository
2. npm install
3. Create .env.local with development keys
4. npm run dev (frontend + Supabase)
5. Open localhost:5173

Database:
- Supabase local development setup
- supabase start (Docker required)
- supabase db reset (for testing)
```

### Deployment Pipeline
```
1. Feature branch created
2. Code review (PR required)
3. Tests pass (GitHub Actions)
4. Merge to main
5. CI/CD deploys to staging
6. Manual validation in staging
7. Approve for production
8. Deploy to production (blue-green)
9. Monitor for 24 hours
```

## Cost Optimization

### Database
- Compute: Auto-scaling (sleep mode < 1 req/day)
- Storage: Tiered pricing (hot/cold data)
- Backups: 7-day retention (optimal for recovery)

### API Calls
- Cache API responses (1 hour default)
- Batch operations where possible
- Use webhooks instead of polling
- Rate limit high-cost operations

### Storage
- Image optimization (WebP, sizes)
- Audio compression (MP3, 128kbps)
- Lifecycle policies (delete old exports)
- Deduplication for duplicate uploads

### Observability
- Sample traces (20% in production)
- Aggregate logs (hourly)
- Only alert on P1/P2 issues
- Archive logs after 30 days

## References

- [Supabase Architecture](https://supabase.com/docs/guides/platform/architecture)
- [React Best Practices](https://react.dev/learn)
- [PostgreSQL Performance](https://www.postgresql.org/docs/)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

---

**Created**: 2025-11-14
**Version**: 1.0.0
**Status**: Production Architecture
