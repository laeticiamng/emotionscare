# EmotionsCare - Architecture CTO & Backlog V2

## Vue d'ensemble projet

**Statut actuel**: Production-ready (MVP+)
- 1,674+ composants React
- 429+ tables PostgreSQL
- 218 Edge Functions Supabase
- 46 tests E2E

---

## 1. ARCHITECTURE CIBLE

### Stack validée

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  React 18 + TypeScript + Vite + Tailwind + shadcn/ui            │
│  PWA (offline-first) | iOS/Android via Capacitor (roadmap)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY                                  │
│  Supabase Edge Functions (Deno) + Supabase REST/GraphQL         │
│  Rate limiting | Auth middleware | CORS                          │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   SUPABASE    │   │  AI SERVICES  │   │    STORAGE    │
│  PostgreSQL   │   │  OpenAI GPT-4 │   │  Supabase S3  │
│  + RLS        │   │  Hume AI      │   │  CDN Audio    │
│  + pg_cron    │   │  Suno API     │   │  Assets       │
└───────────────┘   └───────────────┘   └───────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│                    JOBS ASYNC (pg_cron + Edge)                 │
│  • Génération musique (queue Suno)                             │
│  • Rapports hebdo email                                        │
│  • Cleanup données expirées                                    │
│  • Calcul analytics agrégés                                    │
│  • Monitoring santé système                                    │
└───────────────────────────────────────────────────────────────┘
```

### Points d'attention architecture

| Composant | Actuel | Recommandation |
|-----------|--------|----------------|
| State mgmt | Zustand + Recoil (40+ stores) | **Consolider sur Zustand seul** |
| DB Tables | 429 tables | **Audit + merge tables redondantes** |
| Edge Functions | 218 fonctions | **Regrouper par domaine** |
| Tests | 46 E2E | **Ajouter 80% coverage unit tests** |

---

## 2. MODÈLE DE DONNÉES CONSOLIDÉ

### Schéma minimal recommandé (tables clés)

```sql
-- =====================
-- CORE: Users & Profiles
-- =====================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    encrypted_password TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_sign_in_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'hr', 'therapist'))
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Europe/Paris',
    locale TEXT DEFAULT 'fr' CHECK (locale IN ('fr', 'en')),
    onboarding_completed BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}',
    -- Données sensibles chiffrées
    health_context_encrypted TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- SESSIONS ÉMOTIONNELLES
-- =====================
CREATE TABLE emotion_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Input utilisateur
    input_type TEXT NOT NULL CHECK (input_type IN ('text', 'voice', 'choice', 'scan')),
    raw_input TEXT, -- texte libre ou transcription
    voice_file_url TEXT, -- si input vocal

    -- Analyse IA
    detected_emotions JSONB NOT NULL DEFAULT '[]',
    -- Format: [{"label": "anxiété", "intensity": 0.7, "valence": -0.5}]
    primary_emotion TEXT,
    intensity DECIMAL(3,2) CHECK (intensity BETWEEN 0 AND 1),
    valence DECIMAL(3,2) CHECK (valence BETWEEN -1 AND 1), -- négatif/positif
    arousal DECIMAL(3,2) CHECK (arousal BETWEEN 0 AND 1), -- calme/excité

    -- Contexte (optionnel)
    context_tags TEXT[] DEFAULT '{}', -- ['travail', 'famille', 'santé']
    location TEXT, -- 'home', 'work', 'commute'
    time_of_day TEXT, -- 'morning', 'afternoon', 'evening', 'night'

    -- Metadata
    ai_model_version TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_emotion_sessions_user_date ON emotion_sessions(user_id, created_at DESC);

-- =====================
-- OUTPUTS IA: Plans personnalisés
-- =====================
CREATE TABLE emotion_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES emotion_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Plan généré
    plan_type TEXT NOT NULL CHECK (plan_type IN ('immediate', 'daily', 'weekly')),
    recommendations JSONB NOT NULL,
    -- Format: [
    --   {"type": "breathing", "exercise_id": "...", "priority": 1, "duration_min": 5},
    --   {"type": "music", "playlist_id": "...", "priority": 2},
    --   {"type": "light", "settings": {...}, "priority": 3}
    -- ]

    -- Suivi
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    completion_rate DECIMAL(3,2) DEFAULT 0,
    user_feedback INTEGER CHECK (user_feedback BETWEEN 1 AND 5),
    feedback_note TEXT,

    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- =====================
-- MODULE: Musicothérapie IA
-- =====================
CREATE TABLE music_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES emotion_sessions(id),

    -- Paramètres génération
    prompt TEXT NOT NULL,
    target_emotion TEXT,
    target_energy TEXT CHECK (target_energy IN ('calming', 'neutral', 'energizing')),
    duration_seconds INTEGER DEFAULT 60,
    style_tags TEXT[] DEFAULT '{}', -- ['ambient', 'piano', 'nature']

    -- Résultat Suno
    suno_request_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    audio_url TEXT,

    -- Métadonnées audio
    bpm INTEGER,
    key_signature TEXT,
    waveform_data JSONB,

    -- Analytics
    play_count INTEGER DEFAULT 0,
    total_listen_seconds INTEGER DEFAULT 0,
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),

    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_music_user_status ON music_generations(user_id, status);

-- =====================
-- MODULE: Luminothérapie
-- =====================
CREATE TABLE light_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES emotion_sessions(id),

    -- Paramètres lumière
    color_hex TEXT NOT NULL, -- '#4A90D9'
    brightness DECIMAL(3,2) CHECK (brightness BETWEEN 0 AND 1),
    rhythm_pattern TEXT, -- 'steady', 'pulse_slow', 'pulse_fast', 'sunrise'
    cycle_duration_seconds INTEGER,

    -- Contexte
    target_effect TEXT CHECK (target_effect IN ('calm', 'focus', 'energize', 'sleep')),
    ambient_light_level TEXT, -- 'dark', 'dim', 'bright'

    -- Suivi
    duration_minutes INTEGER,
    user_feedback INTEGER CHECK (user_feedback BETWEEN 1 AND 5),

    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ
);

-- =====================
-- MODULE: Exercices guidés
-- =====================
CREATE TABLE exercise_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Contenu
    type TEXT NOT NULL CHECK (type IN ('breathing', 'relaxation', 'meditation', 'routine')),
    name JSONB NOT NULL, -- {"fr": "Respiration carrée", "en": "Box Breathing"}
    description JSONB,
    instructions JSONB, -- Étapes détaillées

    -- Paramètres
    duration_seconds INTEGER NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    target_emotions TEXT[] DEFAULT '{}', -- Émotions ciblées

    -- Assets
    audio_url TEXT,
    animation_config JSONB,

    -- Metadata
    is_premium BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE exercise_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercise_library(id),
    session_id UUID REFERENCES emotion_sessions(id),

    -- Résultat
    completed BOOLEAN DEFAULT false,
    duration_actual_seconds INTEGER,

    -- Biométrie (optionnel)
    heart_rate_before INTEGER,
    heart_rate_after INTEGER,
    coherence_score DECIMAL(3,2),

    -- Feedback
    mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
    mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),

    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- FICHIERS AUDIO
-- =====================
CREATE TABLE audio_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Référence fichier
    storage_path TEXT NOT NULL, -- Chemin Supabase Storage
    public_url TEXT,

    -- Type
    file_type TEXT NOT NULL CHECK (file_type IN (
        'voice_input', 'generated_music', 'exercise_audio', 'ambient'
    )),

    -- Métadonnées
    duration_seconds INTEGER,
    file_size_bytes INTEGER,
    mime_type TEXT,
    sample_rate INTEGER,
    channels INTEGER,

    -- Traitement
    transcription TEXT,
    analysis_result JSONB,

    -- Lifecycle
    is_temporary BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- GDPR: Consentements & Logs
-- =====================
CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    consent_type TEXT NOT NULL CHECK (consent_type IN (
        'terms_of_service',
        'privacy_policy',
        'health_data_processing',
        'ai_analysis',
        'voice_recording',
        'marketing_emails',
        'analytics_tracking'
    )),

    granted BOOLEAN NOT NULL,
    version TEXT NOT NULL, -- Version du document accepté
    ip_address INET,
    user_agent TEXT,

    granted_at TIMESTAMPTZ DEFAULT now(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_consent_user ON consent_records(user_id, consent_type);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    action TEXT NOT NULL, -- 'data_export', 'data_deletion', 'consent_change'
    resource_type TEXT,
    resource_id UUID,

    details JSONB,
    ip_address INET,

    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- ANALYTICS: Suivi progression
-- =====================
CREATE TABLE user_metrics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,

    -- Agrégats journaliers
    sessions_count INTEGER DEFAULT 0,
    avg_emotion_valence DECIMAL(3,2),
    avg_emotion_intensity DECIMAL(3,2),
    dominant_emotion TEXT,

    exercises_completed INTEGER DEFAULT 0,
    total_exercise_minutes INTEGER DEFAULT 0,

    music_sessions INTEGER DEFAULT 0,
    music_minutes INTEGER DEFAULT 0,

    -- Scores bien-être
    wellbeing_score DECIMAL(3,2), -- 0-1
    stress_level DECIMAL(3,2),

    created_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(user_id, date)
);

CREATE INDEX idx_metrics_user_date ON user_metrics_daily(user_id, date DESC);

-- =====================
-- RLS POLICIES (exemples)
-- =====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON emotion_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON emotion_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Diagramme relations

```
users (1) ─────────────── (1) profiles
  │
  ├── (1) ─────────── (N) emotion_sessions
  │                         │
  │                         ├── (1) ─── (N) emotion_plans
  │                         ├── (1) ─── (N) music_generations
  │                         ├── (1) ─── (N) light_sessions
  │                         └── (1) ─── (N) exercise_completions
  │
  ├── (1) ─────────── (N) consent_records
  ├── (1) ─────────── (N) audit_logs
  └── (1) ─────────── (N) user_metrics_daily
```

---

## 3. USER FLOWS DÉTAILLÉS

### Flow 1: Onboarding (5-7 min)

```
┌────────────────────────────────────────────────────────────────┐
│ ÉTAPE 1: Splash + Value Prop (10s)                             │
│ • Animation logo premium                                        │
│ • "Prenez soin de vos émotions avec l'IA"                      │
│ • CTA: "Commencer" / "J'ai déjà un compte"                     │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ ÉTAPE 2: Inscription (30s)                                     │
│ • Email + mot de passe                                          │
│ • OU: Sign in with Apple/Google                                 │
│ • Checkbox CGU obligatoire                                      │
│ → INSERT users + profiles (onboarding_completed = false)        │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ ÉTAPE 3: Consentements explicites (60s)                        │
│ • Écran 1: "Nous analysons vos émotions avec l'IA"             │
│   - Toggle: J'accepte le traitement IA [obligatoire]            │
│ • Écran 2: "Option: enregistrement vocal"                      │
│   - Toggle: J'autorise l'enregistrement [optionnel]             │
│ • Écran 3: Disclaimer santé                                     │
│   - "Cette app ne remplace pas un suivi médical"                │
│   - Checkbox: "J'ai compris" [obligatoire]                      │
│ → INSERT consent_records (3+ entrées)                           │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ ÉTAPE 4: Personnalisation (2 min)                              │
│ • "Comment vous sentez-vous aujourd'hui?"                       │
│   - Roue des émotions (tap)                                     │
│ • "Qu'est-ce qui vous amène?"                                   │
│   - [ ] Gérer le stress                                         │
│   - [ ] Mieux dormir                                            │
│   - [ ] Améliorer ma concentration                              │
│   - [ ] Explorer mes émotions                                   │
│ • "Préférence de durée?"                                        │
│   - 5 min / 10 min / 15 min / Pas de limite                    │
│ → UPDATE profiles.preferences                                    │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ ÉTAPE 5: Premier exercice guidé (3 min)                        │
│ • "Essayons ensemble un exercice de respiration"                │
│ • Animation breathing circle                                    │
│ • 3 cycles de respiration carrée                                │
│ • Feedback: "Comment vous sentez-vous?"                         │
│ → INSERT exercise_completions                                   │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ ÉTAPE 6: Bienvenue Dashboard (10s)                             │
│ • "Votre espace personnel est prêt!"                            │
│ • Notification push optionnelle                                 │
│ • Redirect → Dashboard                                          │
│ → UPDATE profiles (onboarding_completed = true)                 │
└────────────────────────────────────────────────────────────────┘
```

### Flow 2: Session émotionnelle complète

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: RECUEIL ÉMOTION (1-2 min)                              │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── Option A: Texte libre ───────────────────────────────┐
         │    • Input: "Je me sens..."                             │
         │    • Autocomplete suggestions émotionnelles              │
         │    • Max 500 caractères                                  │
         │                                                          │
         ├─── Option B: Choix guidé ────────────────────────────────┤
         │    • Roue émotions Plutchik (8 émotions base)           │
         │    • Slider intensité (1-10)                             │
         │    • Tags contexte optionnels                            │
         │                                                          │
         └─── Option C: Input vocal ────────────────────────────────┤
              • "Appuyez et parlez..."                              │
              • Transcription temps réel                            │
              • Analyse prosodique Hume AI                          │
                                                                    │
         → INSERT emotion_sessions (input_type, raw_input)          │
         → CALL Edge Function: analyze-emotion                      │
              └── OpenAI GPT-4 + Hume AI                           │
         → UPDATE emotion_sessions (detected_emotions, valence...)  │
                                                                    │
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: FEEDBACK ANALYSE (30s)                                 │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│ Écran résultat:                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  "Je détecte de l'anxiété (7/10) avec une touche         │   │
│ │   de fatigue. C'est lié à votre travail?"                 │   │
│ │                                                            │   │
│ │   ● Anxiété ████████░░ 80%                                │   │
│ │   ● Fatigue █████░░░░░ 50%                                │   │
│ │   ○ Tristesse ██░░░░░░░ 20%                               │   │
│ │                                                            │   │
│ │   [Corriger] [C'est exact ✓]                              │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ → Si correction: UPDATE emotion_sessions + feedback loop         │
│                                                                  │
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: GÉNÉRATION PLAN PERSONNALISÉ (15s)                     │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│ Loading: "Je prépare votre parcours..."                          │
│                                                                  │
│ → CALL Edge Function: generate-plan                              │
│   Input: emotion_session + user_preferences + history            │
│   Output: 3-5 recommandations priorisées                         │
│                                                                  │
│ → INSERT emotion_plans                                           │
│                                                                  │
│ Écran plan:                                                      │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Votre parcours anti-anxiété                              │   │
│ │                                                            │   │
│ │  1. 🫁 Respiration 4-7-8 (5 min)          [Commencer]     │   │
│ │  2. 🎵 Musique apaisante IA               [Générer]       │   │
│ │  3. 💡 Lumière bleue relaxante            [Activer]       │   │
│ │  4. 📝 Mini-journal gratitude             [Plus tard]     │   │
│ │                                                            │   │
│ │  ⏱️ Durée totale estimée: 15 min                          │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: EXÉCUTION MODULES (5-20 min)                           │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│ A. MODULE RESPIRATION                                            │
│    → Écran immersif, animation cercle                           │
│    → Haptic feedback sur rythme                                  │
│    → Timer, progression                                          │
│    → INSERT exercise_completions                                 │
│                                                                  │
│ B. MODULE MUSIQUE IA                                             │
│    → Prompt auto-généré depuis émotion                          │
│    → INSERT music_generations (status: pending)                  │
│    → CALL Suno API (async)                                       │
│    → Affichage player quand prêt                                │
│    → UPDATE music_generations (status: completed)                │
│                                                                  │
│ C. MODULE LUMINOTHÉRAPIE                                        │
│    → Écran couleur adaptative                                   │
│    → Instructions: "Regardez doucement l'écran"                 │
│    → Rythme progressif                                          │
│    → INSERT light_sessions                                       │
│                                                                  │
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: CLÔTURE & FEEDBACK (1 min)                             │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│ "Comment vous sentez-vous maintenant?"                           │
│    ● Beaucoup mieux 😊                                          │
│    ● Un peu mieux 🙂                                            │
│    ● Pareil 😐                                                  │
│    ● Moins bien 😕                                              │
│                                                                  │
│ → UPDATE emotion_plans (user_feedback, completed_at)             │
│ → UPDATE user_metrics_daily                                      │
│                                                                  │
│ "Souhaitez-vous un rappel demain à la même heure?"              │
│    [Oui, 8h] [Non merci]                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Flow 3: Suivi & Progression

```
┌─────────────────────────────────────────────────────────────────┐
│ ÉCRAN: Dashboard Progression                                     │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Bonjour Marie 👋                                         │   │
│ │                                                            │   │
│ │  Votre semaine en un coup d'œil                           │   │
│ │  ┌────────────────────────────────────────────────────┐   │   │
│ │  │     Bien-être         Stress          Séances      │   │   │
│ │  │       7.2/10           3/10            12          │   │   │
│ │  │       ↑ +0.8           ↓ -2            ↑ +4        │   │   │
│ │  └────────────────────────────────────────────────────┘   │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ Source données:                                                  │
│ → SELECT * FROM user_metrics_daily                               │
│   WHERE user_id = $1 AND date >= now() - interval '7 days'      │
│                                                                  │
┌─────────────────────────────────────────────────────────────────┐
│ SECTION: Graphique évolution émotionnelle                        │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│ Timeline 30 jours:                                               │
│                                                                  │
│  Valence                                                         │
│    1 │    ╭─╮      ╭──╮    ╭─╮                                  │
│  0.5 │ ╭──╯ ╰──╮ ╭─╯  ╰────╯ ╰──╮                              │
│    0 │─╯       ╰─╯              ╰─╮                              │
│ -0.5 │                            ╰──                            │
│   -1 └─────────────────────────────────                         │
│       1    7    14    21    28   Jours                          │
│                                                                  │
│ Insights IA:                                                     │
│ "Vos lundis sont souvent plus difficiles.                       │
│  Les exercices de respiration du matin semblent vous aider."    │
│                                                                  │
│ → Généré par Edge Function: generate-weekly-insights             │
│                                                                  │
┌─────────────────────────────────────────────────────────────────┐
│ SECTION: Patterns & Recommandations                              │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│ Vos patterns détectés:                                           │
│ • ⏰ Peak stress: 9h-11h (travail)                              │
│ • 🎵 Musique efficace: ambient, piano                           │
│ • 🫁 Exercice préféré: Cohérence cardiaque                      │
│ • 📈 Meilleure progression: Anxiété (-40% en 3 semaines)        │
│                                                                  │
│ Recommandation de la semaine:                                   │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  💡 Essayez la routine matinale                           │   │
│ │  5 min de respiration + lumière énergisante avant 9h     │   │
│ │                                                            │   │
│ │  [Programmer un rappel]                                    │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
┌─────────────────────────────────────────────────────────────────┐
│ SECTION: Historique détaillé                                    │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│ Liste scrollable sessions:                                       │
│                                                                  │
│ 📅 Aujourd'hui                                                   │
│ └─ 09:15 │ Anxiété (6/10) │ Respiration ✓ Musique ✓            │
│                                                                  │
│ 📅 Hier                                                          │
│ ├─ 22:30 │ Fatigue (7/10) │ Luminothérapie ✓                   │
│ └─ 08:45 │ Stress (5/10)  │ Respiration ✓                       │
│                                                                  │
│ [Voir tout l'historique]                                        │
│                                                                  │
│ [Exporter mes données] ← GDPR: data portability                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. RISQUES & GARDE-FOUS

### Matrice des risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| **Fuite données santé** | Moyenne | Critique | Chiffrement AES-256, RLS strict, audit logs |
| **Dépendance utilisateur** | Haute | Élevé | Limites d'usage, redirections pro, disclaimers |
| **Erreur diagnostic IA** | Moyenne | Élevé | Jamais de diagnostic, langage probabiliste |
| **Usage mineurs** | Faible | Élevé | Vérification âge, accord parental |
| **Données vocales sensibles** | Moyenne | Élevé | Consentement explicite, suppression auto 24h |
| **Non-conformité RGPD** | Faible | Critique | DPO, registre traitements, droit à l'oubli |

### Garde-fous UX obligatoires

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. DISCLAIMERS PERMANENTS                                        │
└─────────────────────────────────────────────────────────────────┘

A. Footer toutes pages:
   "EmotionsCare est un outil de bien-être et ne remplace pas
    un suivi médical ou psychologique professionnel."

B. Onboarding (obligatoire, non-skippable):
   ┌──────────────────────────────────────────────────────────┐
   │ ⚠️ Information importante                                │
   │                                                          │
   │ EmotionsCare propose des exercices de relaxation et      │
   │ de régulation émotionnelle basés sur l'intelligence      │
   │ artificielle.                                            │
   │                                                          │
   │ Cette application:                                       │
   │ ✗ Ne pose PAS de diagnostic médical                     │
   │ ✗ Ne remplace PAS une thérapie                          │
   │ ✗ Ne traite PAS les troubles mentaux                    │
   │                                                          │
   │ Si vous êtes en détresse, contactez un professionnel:   │
   │ 📞 3114 (numéro national prévention suicide)            │
   │                                                          │
   │ ☐ J'ai lu et compris ces informations                   │
   │                                                          │
   │               [Continuer]                                │
   └──────────────────────────────────────────────────────────┘

C. Avant chaque session:
   Note discrète: "Ceci est un exercice de bien-être,
   pas un traitement médical."

┌─────────────────────────────────────────────────────────────────┐
│ 2. ESCALADE AUTOMATIQUE                                          │
└─────────────────────────────────────────────────────────────────┘

Trigger: Détection mots-clés sensibles dans input utilisateur
- "suicide", "mourir", "me faire du mal", "plus envie de vivre"
- Intensité négative > 9/10 pendant 3+ sessions consécutives

Action immédiate:
┌──────────────────────────────────────────────────────────────┐
│ 🆘 Nous sommes là pour vous                                  │
│                                                              │
│ Vos mots m'indiquent que vous traversez un moment           │
│ particulièrement difficile.                                   │
│                                                              │
│ Je vous encourage à contacter un professionnel:             │
│                                                              │
│ 📞 3114 - Numéro national de prévention du suicide          │
│    Disponible 24h/24, 7j/7                                   │
│                                                              │
│ 📱 Fil Santé Jeunes: 0 800 235 236                          │
│                                                              │
│ [Appeler le 3114]  [Continuer dans l'app]                   │
└──────────────────────────────────────────────────────────────┘

→ LOG audit_logs (type: 'crisis_escalation')
→ Optionnel: Email contact urgence (si configuré)

┌─────────────────────────────────────────────────────────────────┐
│ 3. LIMITES D'USAGE                                              │
└─────────────────────────────────────────────────────────────────┘

A. Anti-dépendance:
   - Max 5 sessions émotionnelles / jour
   - Après 3ème session: "Vous avez beaucoup utilisé l'app
     aujourd'hui. Peut-être qu'un moment de pause serait
     bénéfique?"
   - Rappel hebdo: "Cette app est un outil, pas une solution.
     Avez-vous pensé à parler à quelqu'un?"

B. Temps d'écran:
   - Rappel après 30 min d'usage continu
   - Mode nuit automatique après 23h (pas de notifications)

C. Mineurs:
   - Vérification âge >= 16 ans
   - Si 13-16: Consentement parental requis
   - < 13: Accès refusé

┌─────────────────────────────────────────────────────────────────┐
│ 4. SÉCURITÉ DONNÉES                                             │
└─────────────────────────────────────────────────────────────────┘

A. Chiffrement:
   - Données santé: AES-256-GCM côté serveur
   - Fichiers audio: Chiffrés au repos
   - Transit: TLS 1.3 obligatoire

B. Rétention:
   - Audio vocal: Suppression auto 24h après transcription
   - Sessions: Conservation 2 ans (configurable)
   - Logs: 1 an puis anonymisation

C. Droits utilisateur (RGPD):
   - Export JSON 1-click
   - Suppression compte complète < 72h
   - Modification données à tout moment

D. Audit:
   - Log de tout accès aux données sensibles
   - Alerte admin si accès anormal
   - Revue trimestrielle des accès
```

---

## 5. BACKLOG SPRINTS

### Sprint 1: MVP Consolidation (2 semaines)

| ID | User Story | Critères d'acceptation | Priorité |
|----|------------|------------------------|----------|
| **S1-01** | En tant qu'utilisateur, je peux compléter un onboarding clair avec consentements | - 6 étapes max<br>- Consentements IA + vocal obligatoires<br>- Disclaimer santé non-skippable<br>- Durée < 5 min | P0 |
| **S1-02** | En tant qu'utilisateur, je peux exprimer mon émotion via texte ou choix guidé | - Input texte libre fonctionnel<br>- Roue émotions 8 émotions<br>- Slider intensité 1-10<br>- Sauvegarde en BDD | P0 |
| **S1-03** | En tant qu'utilisateur, je reçois une analyse IA de mon émotion | - Appel OpenAI GPT-4 < 3s<br>- Affichage émotions détectées + %<br>- Option "corriger" si erreur<br>- Langage non-médical | P0 |
| **S1-04** | En tant qu'utilisateur, je reçois un plan personnalisé post-analyse | - 3-5 recommandations générées<br>- Priorisation intelligente<br>- Boutons action directs<br>- Sauvegarde plan en BDD | P0 |
| **S1-05** | En tant qu'utilisateur, je peux faire un exercice de respiration guidé | - 3 exercices disponibles (4-7-8, carré, cohérence)<br>- Animation cercle fluide<br>- Timer + progression<br>- Feedback fin d'exercice | P0 |
| **S1-06** | En tant qu'utilisateur, je vois un disclaimer santé permanent | - Footer toutes pages<br>- Popup premier lancement<br>- Numéro 3114 accessible | P0 |
| **S1-07** | En tant qu'utilisateur, je peux voir mon historique de sessions | - Liste chronologique<br>- Détail session au tap<br>- Filtre par émotion | P1 |
| **S1-08** | En tant que système, je détecte les situations de crise et escalade | - Mots-clés sensibles détectés<br>- Popup ressources affiché<br>- Log audit créé | P0 |
| **S1-09** | En tant qu'utilisateur, je peux supprimer mon compte et mes données | - Bouton suppression settings<br>- Confirmation double<br>- Suppression < 72h<br>- Email confirmation | P0 |
| **S1-10** | Tests E2E des flows critiques | - Onboarding flow: 100%<br>- Session émotionnelle: 100%<br>- Escalade crise: 100%<br>- Suppression compte: 100% | P0 |

**Definition of Done Sprint 1:**
- ✅ Tous les P0 livrés et testés
- ✅ 0 bug bloquant
- ✅ Disclaimers légaux validés
- ✅ RGPD compliance vérifiée
- ✅ Tests E2E passent à 100%

---

### Sprint 2: V1 Features (2 semaines)

| ID | User Story | Critères d'acceptation | Priorité |
|----|------------|------------------------|----------|
| **S2-01** | En tant qu'utilisateur, je peux exprimer mon émotion par la voix | - Enregistrement audio < 60s<br>- Transcription temps réel<br>- Analyse Hume AI prosodique<br>- Consentement explicite pré-enregistrement | P0 |
| **S2-02** | En tant qu'utilisateur, je peux générer une musique IA adaptée à mon émotion | - Intégration Suno API<br>- Prompt auto-généré depuis émotion<br>- Player audio intégré<br>- Sauvegarde favoris | P0 |
| **S2-03** | En tant qu'utilisateur, je peux utiliser le mode luminothérapie | - 4 presets (calm, focus, energize, sleep)<br>- Écran plein adaptatif<br>- Rythme configurable<br>- Timer session | P1 |
| **S2-04** | En tant qu'utilisateur, je vois ma progression sur 7/30 jours | - Graphique évolution valence<br>- KPIs: bien-être, stress, sessions<br>- Comparaison semaine précédente | P0 |
| **S2-05** | En tant qu'utilisateur, je reçois des insights IA sur mes patterns | - Génération hebdo automatique<br>- Patterns temporels détectés<br>- Recommandations personnalisées | P1 |
| **S2-06** | En tant qu'utilisateur, je peux exporter mes données au format JSON | - Bouton export settings<br>- Téléchargement immédiat<br>- Format RGPD-compliant | P0 |
| **S2-07** | En tant qu'utilisateur, je reçois des notifications push de rappel | - Permission demandée post-onboarding<br>- Rappel configurable (heure, fréquence)<br>- Mode nuit (pas après 23h) | P1 |
| **S2-08** | En tant qu'utilisateur, je peux accéder à une bibliothèque d'exercices | - 10+ exercices catégorisés<br>- Filtre par durée/émotion<br>- Preview avant lancement | P1 |
| **S2-09** | Tests E2E modules V1 | - Input vocal: 100%<br>- Génération musique: 100%<br>- Dashboard progression: 100% | P0 |
| **S2-10** | Optimisation performance | - LCP < 2.5s<br>- TTI < 3.5s<br>- Bundle size < 500KB initial | P1 |

**Definition of Done Sprint 2:**
- ✅ Tous les P0 livrés et testés
- ✅ Modules musique + vocal fonctionnels
- ✅ Dashboard progression complet
- ✅ Performance scores Lighthouse > 90
- ✅ Prêt pour beta users

---

## Récapitulatif livraison

```
SPRINT 1 (MVP)           SPRINT 2 (V1)
─────────────────────    ─────────────────────
✓ Onboarding complet     ✓ Input vocal + Hume AI
✓ Input texte/choix      ✓ Musicothérapie Suno
✓ Analyse IA basique     ✓ Luminothérapie
✓ Plan personnalisé      ✓ Dashboard progression
✓ Respiration guidée     ✓ Insights IA
✓ Disclaimers légaux     ✓ Export données RGPD
✓ Escalade crise         ✓ Notifications push
✓ Historique basique     ✓ Bibliothèque exercices
✓ Suppression compte     ✓ Optimisation perf
✓ Tests E2E critiques    ✓ Tests E2E complets
─────────────────────    ─────────────────────
Durée: 2 semaines        Durée: 2 semaines
```

---

*Document généré le 2025-12-20 - EmotionsCare CTO Architecture*
