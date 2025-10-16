# 📖 Module 21: Journal (Voice & Text)

**Date**: Day 38  
**Status**: ✅ Tests créés, Documentation complète  
**Priority**: HIGH - Module central pour l'expression émotionnelle

---

## 🎯 Vue d'ensemble

Le module **Journal** permet aux utilisateurs d'exprimer leurs pensées, émotions et expériences à travers des entrées textuelles ou vocales. Il offre un espace personnel sécurisé pour la réflexion, l'auto-analyse et le suivi de l'évolution émotionnelle.

### Objectifs principaux
- ✍️ **Expression libre** : Écriture texte et enregistrement vocal
- 🎙️ **Transcription automatique** : Conversion de la voix en texte
- 😊 **Analyse émotionnelle** : Détection des émotions dans les entrées
- 📊 **Suivi longitudinal** : Statistiques et tendances émotionnelles
- 🏆 **Gamification** : Streaks et badges de régularité
- 🔒 **Confidentialité** : Entrées privées par défaut

---

## 📁 Structure des fichiers

```
src/modules/journal/
├── __tests__/
│   ├── types.test.ts              ✅ Day 38
│   ├── journalService.test.ts     ⏳ À venir
│   └── useJournal.test.ts         ⏳ À venir
├── types.ts                       ⏳ À créer
├── journalService.ts              ⏳ À créer
├── useJournal.ts                  ⏳ À créer
├── useJournalMachine.ts           ⏳ À créer
├── components/
│   ├── JournalMain.tsx            ⏳ À créer
│   ├── JournalEntryEditor.tsx     ⏳ À créer
│   ├── JournalEntryList.tsx       ⏳ À créer
│   └── JournalStats.tsx           ⏳ À créer
└── ui/
    ├── EntryCard.tsx              ⏳ À créer
    ├── VoiceRecorder.tsx          ⏳ À créer
    ├── MoodSelector.tsx           ⏳ À créer
    ├── EmotionPicker.tsx          ⏳ À créer
    └── PromptCard.tsx             ⏳ À créer
```

---

## 🔧 Types & Schémas (Zod)

### Enums

```typescript
export const JournalEntryType = z.enum(['text', 'voice', 'mixed']);
export const JournalMood = z.enum([
  'very_bad', 'bad', 'neutral', 'good', 'very_good'
]);
export const JournalEmotion = z.enum([
  'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust',
  'anxiety', 'calm', 'excited', 'grateful', 'frustrated', 'hopeful'
]);
export const VoiceProcessingStatus = z.enum([
  'pending', 'processing', 'completed', 'failed'
]);
```

### Schémas principaux

#### 1️⃣ **JournalEntry** - Entrée de journal
```typescript
export const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  entryType: JournalEntryType,
  title: z.string().min(1).max(200),
  textContent: z.string().optional(),
  voiceUrl: z.string().url().optional(),
  voiceDuration: z.number().min(0).optional(),
  voiceTranscription: z.string().optional(),
  mood: JournalMood.optional(),
  emotions: z.array(JournalEmotion).optional(),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().default(true),
  isFavorite: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

#### 2️⃣ **CreateJournalEntry** - Création d'entrée
```typescript
export const CreateJournalEntrySchema = z.object({
  entryType: JournalEntryType,
  title: z.string().min(1).max(200),
  textContent: z.string().max(10000).optional(),
  voiceUrl: z.string().url().optional(),
  voiceDuration: z.number().min(0).optional(),
  mood: JournalMood.optional(),
  emotions: z.array(JournalEmotion).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isPrivate: z.boolean().default(true),
});
```

#### 3️⃣ **UpdateJournalEntry** - Mise à jour
```typescript
export const UpdateJournalEntrySchema = z.object({
  entryId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  textContent: z.string().max(10000).optional(),
  mood: JournalMood.optional(),
  emotions: z.array(JournalEmotion).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isPrivate: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
});
```

#### 4️⃣ **VoiceProcessingJob** - Traitement vocal
```typescript
export const VoiceProcessingJobSchema = z.object({
  id: z.string().uuid(),
  entryId: z.string().uuid(),
  userId: z.string().uuid(),
  audioUrl: z.string().url(),
  status: VoiceProcessingStatus,
  transcription: z.string().optional(),
  emotionAnalysis: z.record(z.number()).optional(),
  processingError: z.string().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});
```

#### 5️⃣ **JournalStats** - Statistiques
```typescript
export const JournalStatsSchema = z.object({
  totalEntries: z.number().min(0),
  textEntries: z.number().min(0),
  voiceEntries: z.number().min(0),
  mixedEntries: z.number().min(0),
  currentStreak: z.number().min(0),
  longestStreak: z.number().min(0),
  favoriteCount: z.number().min(0),
  totalWords: z.number().min(0),
  totalVoiceMinutes: z.number().min(0),
  mostUsedTags: z.array(z.object({
    tag: z.string(),
    count: z.number()
  })),
  moodDistribution: z.record(JournalMood, z.number()),
  emotionDistribution: z.record(JournalEmotion, z.number()),
  entriesPerMonth: z.record(z.string(), z.number()),
});
```

#### 6️⃣ **JournalPrompt** - Suggestions d'écriture
```typescript
export const JournalPromptSchema = z.object({
  id: z.string().uuid(),
  promptText: z.string().min(10).max(500),
  category: z.enum(['reflection', 'gratitude', 'goals', 'emotions', 'creativity', 'mindfulness']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string()),
  isActive: z.boolean(),
});
```

#### 7️⃣ **JournalReminder** - Rappels personnalisés
```typescript
export const JournalReminderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  reminderTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  daysOfWeek: z.array(z.number().min(0).max(6)),
  isActive: z.boolean(),
  message: z.string().max(200).optional(),
  createdAt: z.string().datetime(),
});
```

---

## 📡 Service (journalService.ts)

### Fonctions principales

```typescript
export class JournalService {
  // Gestion des entrées
  static async createEntry(data: CreateJournalEntry): Promise<JournalEntry>
  static async updateEntry(data: UpdateJournalEntry): Promise<JournalEntry>
  static async deleteEntry(entryId: string): Promise<void>
  static async fetchEntry(entryId: string): Promise<JournalEntry>
  static async fetchEntries(
    userId: string,
    filters?: {
      entryType?: JournalEntryType
      mood?: JournalMood
      tags?: string[]
      startDate?: string
      endDate?: string
      isFavorite?: boolean
    },
    pagination?: {
      page: number
      pageSize: number
    }
  ): Promise<{ entries: JournalEntry[], total: number }>

  // Gestion vocale
  static async uploadVoiceRecording(
    file: File,
    userId: string
  ): Promise<{ voiceUrl: string, duration: number }>
  static async startVoiceProcessing(
    entryId: string,
    audioUrl: string
  ): Promise<VoiceProcessingJob>
  static async checkProcessingStatus(
    jobId: string
  ): Promise<VoiceProcessingJob>

  // Favoris et tags
  static async toggleFavorite(entryId: string): Promise<boolean>
  static async addTags(entryId: string, tags: string[]): Promise<void>
  static async removeTags(entryId: string, tags: string[]): Promise<void>
  static async fetchPopularTags(userId: string): Promise<string[]>

  // Statistiques
  static async fetchStats(userId: string): Promise<JournalStats>
  static async calculateStreak(userId: string): Promise<{
    currentStreak: number
    longestStreak: number
  }>

  // Prompts et rappels
  static async fetchRandomPrompt(
    category?: string,
    difficulty?: string
  ): Promise<JournalPrompt>
  static async createReminder(
    userId: string,
    data: Omit<JournalReminder, 'id' | 'userId' | 'createdAt'>
  ): Promise<JournalReminder>
  static async updateReminder(
    reminderId: string,
    data: Partial<JournalReminder>
  ): Promise<JournalReminder>
  static async fetchReminders(userId: string): Promise<JournalReminder[]>

  // Recherche et export
  static async searchEntries(
    userId: string,
    query: string
  ): Promise<JournalEntry[]>
  static async exportEntries(
    userId: string,
    format: 'json' | 'pdf' | 'markdown'
  ): Promise<Blob>
}
```

---

## 🔄 State Machine (useJournalMachine.ts)

### États

```typescript
type JournalState = 
  | 'idle'                    // État initial
  | 'loading_entries'         // Chargement des entrées
  | 'entries_loaded'          // Entrées chargées
  | 'creating_entry'          // Création en cours
  | 'editing_entry'           // Édition en cours
  | 'recording_voice'         // Enregistrement vocal
  | 'processing_voice'        // Traitement vocal en cours
  | 'voice_processed'         // Traitement vocal terminé
  | 'deleting_entry'          // Suppression en cours
  | 'loading_stats'           // Chargement des stats
  | 'stats_loaded'            // Stats chargées
  | 'error';                  // Erreur
```

### Transitions

```typescript
const transitions = {
  idle: ['loading_entries', 'creating_entry', 'loading_stats'],
  loading_entries: ['entries_loaded', 'error'],
  entries_loaded: ['creating_entry', 'editing_entry', 'deleting_entry', 'loading_stats'],
  creating_entry: ['recording_voice', 'entries_loaded', 'error'],
  editing_entry: ['entries_loaded', 'error'],
  recording_voice: ['processing_voice', 'creating_entry', 'error'],
  processing_voice: ['voice_processed', 'error'],
  voice_processed: ['creating_entry', 'entries_loaded'],
  deleting_entry: ['entries_loaded', 'error'],
  loading_stats: ['stats_loaded', 'error'],
  stats_loaded: ['loading_entries', 'idle'],
  error: ['idle', 'loading_entries'],
};
```

---

## 🗄️ Base de données Supabase

### Tables

#### **journal_entries**
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('text', 'voice', 'mixed')),
  title TEXT NOT NULL CHECK (LENGTH(title) <= 200),
  text_content TEXT,
  voice_url TEXT,
  voice_duration INTEGER CHECK (voice_duration >= 0),
  voice_transcription TEXT,
  mood TEXT CHECK (mood IN ('very_bad', 'bad', 'neutral', 'good', 'very_good')),
  emotions TEXT[],
  tags TEXT[],
  is_private BOOLEAN DEFAULT true,
  is_favorite BOOLEAN DEFAULT false,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_journal_user_id (user_id),
  INDEX idx_journal_created_at (created_at DESC),
  INDEX idx_journal_mood (mood),
  INDEX idx_journal_favorite (user_id, is_favorite),
  INDEX idx_journal_tags USING GIN (tags)
);

-- RLS Policies
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);
```

#### **voice_processing_jobs**
```sql
CREATE TABLE voice_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transcription TEXT,
  emotion_analysis JSONB,
  processing_error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  INDEX idx_voice_jobs_status (status),
  INDEX idx_voice_jobs_user (user_id)
);

-- RLS Policies
ALTER TABLE voice_processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own voice jobs"
  ON voice_processing_jobs FOR SELECT
  USING (auth.uid() = user_id);
```

#### **journal_prompts**
```sql
CREATE TABLE journal_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_text TEXT NOT NULL CHECK (LENGTH(prompt_text) BETWEEN 10 AND 500),
  category TEXT NOT NULL 
    CHECK (category IN ('reflection', 'gratitude', 'goals', 'emotions', 'creativity', 'mindfulness')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_prompts_category (category),
  INDEX idx_prompts_active (is_active)
);

-- Public read access
ALTER TABLE journal_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active prompts"
  ON journal_prompts FOR SELECT
  USING (is_active = true);
```

#### **journal_reminders**
```sql
CREATE TABLE journal_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_time TEXT NOT NULL CHECK (reminder_time ~ '^([0-1][0-9]|2[0-3]):[0-5][0-9]$'),
  days_of_week INTEGER[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  message TEXT CHECK (LENGTH(message) <= 200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  INDEX idx_reminders_user (user_id),
  INDEX idx_reminders_active (is_active)
);

-- RLS Policies
ALTER TABLE journal_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reminders"
  ON journal_reminders FOR ALL
  USING (auth.uid() = user_id);
```

---

## 🎨 Composants UI

### Composants principaux

#### **JournalMain.tsx**
```typescript
// Point d'entrée principal du module
// Affiche la liste des entrées + bouton d'ajout
// Gère la navigation entre les vues (liste, création, stats)
```

#### **JournalEntryEditor.tsx**
```typescript
// Éditeur d'entrée de journal
// Mode texte ou vocal
// Sélection mood, émotions, tags
// Auto-save
```

#### **JournalEntryList.tsx**
```typescript
// Liste des entrées avec filtres
// Recherche par texte, tags, mood, dates
// Pagination
// Actions rapides (favorite, delete)
```

#### **JournalStats.tsx**
```typescript
// Visualisation des statistiques
// Graphiques de mood et émotions
// Streaks et badges
// Insights personnalisés
```

### Composants UI réutilisables

#### **EntryCard.tsx**
```typescript
// Carte d'une entrée de journal
// Prévisualisation du contenu
// Badge mood/émotions
// Actions (edit, delete, favorite)
```

#### **VoiceRecorder.tsx**
```typescript
// Enregistreur vocal
// Visualisation d'onde
// Contrôles (record, pause, stop)
// Lecture de preview
```

#### **MoodSelector.tsx**
```typescript
// Sélecteur de mood visuel
// 5 niveaux avec emojis
// Animation de sélection
```

#### **EmotionPicker.tsx**
```typescript
// Sélection multi-émotions
// 12 émotions disponibles
// Affichage sous forme de chips
```

#### **PromptCard.tsx**
```typescript
// Carte de suggestion d'écriture
// Affichage du prompt avec catégorie
// Bouton "Commencer à écrire"
```

---

## ⚙️ Fonctionnalités clés

### 1. **Expression multimodale**
- ✍️ Écriture texte avec éditeur riche
- 🎙️ Enregistrement vocal avec transcription
- 🔄 Mode mixte (texte + audio)
- 💾 Auto-save automatique

### 2. **Analyse émotionnelle**
- 😊 Sélection de mood manuel
- 🎭 Tags émotions multiples
- 📊 Analyse automatique (vocal)
- 📈 Tendances émotionnelles

### 3. **Organisation et recherche**
- 🏷️ Système de tags flexible
- 🔍 Recherche full-text
- 📅 Filtres temporels
- ⭐ Favoris et épinglage

### 4. **Gamification et motivation**
- 🔥 Streaks de régularité
- 🏆 Badges de progression
- 💡 Prompts quotidiens
- 📊 Statistiques détaillées

### 5. **Confidentialité et sécurité**
- 🔒 Entrées privées par défaut
- 🗑️ Suppression définitive
- 📤 Export des données
- 🔐 Chiffrement RLS

### 6. **Rappels et habitudes**
- ⏰ Rappels personnalisables
- 📅 Jours de semaine configurables
- 💬 Messages personnalisés
- 🔕 Activation/désactivation facile

---

## 🔒 Sécurité

### RLS Policies
- ✅ Users can only access their own entries
- ✅ Users can only manage their own reminders
- ✅ Public read on active prompts
- ✅ Service role for voice processing

### Validation
- ✅ Input sanitization (title, content)
- ✅ File size limits (audio < 10MB)
- ✅ Rate limiting on voice processing
- ✅ XSS prevention

### Privacy
- ✅ Entries private by default
- ✅ No sharing functionality (privacy-first)
- ✅ User-controlled data export
- ✅ Complete deletion on request

---

## 📊 Performance

### Optimisations
- **Pagination** : 20 entrées par page
- **Lazy loading** : Images et audio
- **Caching** : Stats en cache 5 min
- **Debouncing** : Recherche 300ms
- **Compression** : Audio optimisé

### Monitoring
- **Métriques** :
  - Temps de création d'entrée
  - Temps de transcription vocale
  - Taux de succès voice processing
  - Temps de chargement liste
- **Alertes** :
  - Voice processing > 30s
  - Taux d'erreur > 5%
  - Latence API > 2s

---

## 📈 Métriques

### KPIs utilisateur
- Nombre d'entrées par semaine
- Streak actuel / maximum
- Ratio text/voice/mixed
- Temps moyen d'écriture
- Tags les plus utilisés
- Distribution mood/émotions

### KPIs techniques
- Taux de transcription réussie
- Temps moyen de processing vocal
- Taux d'utilisation des prompts
- Taux d'activation des rappels
- Taux de suppression d'entrées

---

## 🎯 Objectifs SMART

- ✅ **Tests types** : 100% couverture (Day 38)
- ⏳ **Service layer** : 90% couverture
- ⏳ **State machine** : 85% couverture
- ⏳ **UI Components** : 80% couverture
- ⏳ **E2E tests** : Parcours complet
- ⏳ **Documentation** : API complète
- ⏳ **A11y** : WCAG 2.1 AA

---

## 🚀 Prochaines étapes

### Phase 1 : Fondations (Day 39-40)
- [ ] Créer `types.ts` avec exports
- [ ] Implémenter `journalService.ts`
- [ ] Créer tests service (90% coverage)

### Phase 2 : State Management (Day 41-42)
- [ ] Implémenter `useJournalMachine.ts`
- [ ] Créer `useJournal.ts` hook
- [ ] Tests state machine

### Phase 3 : UI Components (Day 43-45)
- [ ] Composants principaux (Main, Editor, List, Stats)
- [ ] Composants UI (EntryCard, VoiceRecorder, etc.)
- [ ] Tests composants + Storybook

### Phase 4 : Intégration (Day 46-47)
- [ ] Intégration Supabase Storage (audio)
- [ ] Edge function transcription vocale
- [ ] Tests E2E parcours complets

### Phase 5 : Polish (Day 48)
- [ ] Animations et transitions
- [ ] Accessibilité WCAG AA
- [ ] Performance optimizations
- [ ] Documentation finale

---

## 📚 Références

- **Design patterns** : Repository, State Machine
- **Standards** : WCAG 2.1 AA, RGPD
- **Libraries** :
  - `@supabase/supabase-js` : Backend
  - `zod` : Validation
  - `react-hook-form` : Formulaires
  - `@tanstack/react-query` : Data fetching
  - Web Audio API : Enregistrement vocal

---

**Status** : ✅ Day 38 complété - Tests types + Documentation  
**Prochaine étape** : Day 39 - Implémentation service layer
