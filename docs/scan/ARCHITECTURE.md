# Architecture du Module de Scan Émotionnel

## Vue d'ensemble système

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React + TypeScript)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ B2CScanPage  │  │ FacialScan   │  │ VoiceScan    │         │
│  │  (SAM Mode)  │  │    Page      │  │    Page      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  TextScan    │  │  EmojiScan   │  │ Components   │         │
│  │    Page      │  │    Page      │  │   Library    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│         └─────────────────┴─────────────────┘                  │
│                           │                                    │
│                  ┌────────▼─────────┐                          │
│                  │  Emotion Service │                          │
│                  │  (lib/scan/)     │                          │
│                  └────────┬─────────┘                          │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐     ┌───────▼────────┐
        │  Supabase      │     │  Fastify       │
        │  Edge Funcs    │     │  Service       │
        └───────┬────────┘     └───────┬────────┘
                │                       │
        ┌───────▼────────┐     ┌───────▼────────┐
        │   Hume AI      │     │  PostgreSQL    │
        │   Whisper      │     │  Analytics     │
        │   Gemini       │     └────────────────┘
        └────────────────┘
```

## Flux de données

### 1. Analyse Faciale (Facial Scan)

```
┌────────────────────┐
│ User               │
│ (autorise caméra)  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ FacialScanPage     │ ← Composant React
│ ┌────────────────┐ │
│ │ Camera Sampler │ │ ← Capture vidéo
│ └────────┬───────┘ │
│          │         │
│          ▼         │
│  Capture frame     │
│  (base64 image)    │
└────────┬───────────┘
         │
         ▼ POST /functions/v1/mood-camera
┌────────────────────┐
│ Edge Function      │
│ (Supabase)         │
│                    │
│ 1. Valide image    │
│ 2. Vérifie rate    │
│    limit (5/min)   │
│ 3. Appelle Hume AI │
└────────┬───────────┘
         │
         ▼ API call
┌────────────────────┐
│ Hume AI            │
│ (Analyse sync)     │
│                    │
│ - 48 émotions      │
│ - Micro-expressions│
│ - Valence/Arousal  │
└────────┬───────────┘
         │
         ▼ Response
┌────────────────────┐
│ Edge Function      │
│                    │
│ Map to EmotionResult
│ Store in DB        │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Supabase DB        │
│ - emotion_scans    │
│ - clinical_signals │
└────────┬───────────┘
         │
         ▼ Real-time broadcast
┌────────────────────┐
│ Frontend           │
│ - Update UI        │
│ - Show result      │
│ - Recommandations  │
└────────────────────┘
```

### 2. Analyse Vocale (Voice Scan)

```
┌────────────────────┐
│ User               │
│ (parle au micro)   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ VoiceScanPage      │
│ ┌────────────────┐ │
│ │LiveVoiceScanner│ │
│ │                │ │
│ │ - Record 10s   │ │
│ │ - Create blob  │ │
│ └────────┬───────┘ │
└──────────┼─────────┘
           │
           ▼ POST /voice-analysis
┌────────────────────┐
│ Edge Function      │
│                    │
│ 1. Decode audio    │
│ 2. Call Whisper    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Whisper API        │
│ (OpenAI)           │
│                    │
│ - Transcription    │
│ - Language detect  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Edge Function      │
│                    │
│ Forward to         │
│ emotion-analysis   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Gemini/Lovable     │
│ (Text Analysis)    │
│                    │
│ - Sentiment        │
│ - Emotions         │
│ - Context          │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Response to Client │
│                    │
│ - Transcription    │
│ - Emotion          │
│ - Confidence       │
│ - Recommendations  │
└────────────────────┘
```

### 3. Analyse Textuelle (Text Scan)

```
┌────────────────────┐
│ User               │
│ (écrit texte)      │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ TextScanPage       │
│ ┌────────────────┐ │
│ │ Textarea       │ │
│ │ (max 1000 ch.) │ │
│ └────────┬───────┘ │
│          │         │
│  useEmotionScan()  │
└────────┬───────────┘
         │
         ▼ scanEmotion('text', input)
┌────────────────────┐
│ emotionService     │
│                    │
│ - Validate input   │
│ - Call API         │
└────────┬───────────┘
         │
         ▼ POST /emotion-analysis
┌────────────────────┐
│ Edge Function      │
│                    │
│ - Parse text       │
│ - Detect language  │
│ - Call Gemini      │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Gemini/Lovable     │
│                    │
│ - NLP analysis     │
│ - Emotion mapping  │
│ - Generate summary │
│ - Recommendations  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Store + Return     │
│                    │
│ emotion_scans      │
│ + EmotionResult    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Frontend UI        │
│                    │
│ - Display emotion  │
│ - Show confidence  │
│ - Recommendations  │
└────────────────────┘
```

### 4. SAM Assessment

```
┌────────────────────┐
│ User               │
│ (ajuste sliders)   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ B2CScanPage        │
│ ┌────────────────┐ │
│ │  SamSliders    │ │
│ │                │ │
│ │  Valence: 1-9  │ │
│ │  Arousal: 1-9  │ │
│ └────────┬───────┘ │
│          │         │
│  useAssessment()   │
└────────┬───────────┘
         │
         ▼ submit(valence, arousal)
┌────────────────────┐
│ Assessment Service │
│                    │
│ - Map scale 1-9    │
│ - Calculate score  │
│ - Get consent      │
└────────┬───────────┘
         │
         ▼ POST /assess-submit
┌────────────────────┐
│ Edge Function      │
│                    │
│ - Validate values  │
│ - Calculate level  │
│ - Generate summary │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ clinical_signals   │
│                    │
│ - user_id          │
│ - domain: VA       │
│ - level: 0-4       │
│ - instrument: SAM  │
│ - metadata         │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ MicroGestes        │
│                    │
│ - Get recommendations
│ - Based on V/A     │
│ - Personalized     │
└────────────────────┘
```

## Composants Architecture

### Hiérarchie des composants

```
Pages/
├── B2CScanPage
│   ├── CameraSampler
│   ├── SamSliders
│   ├── MicroGestes
│   ├── ScanHistory
│   └── MultiSourceChart
│
├── FacialScanPage
│   ├── FacialEmotionScanner
│   │   ├── VideoStream
│   │   ├── CaptureButton
│   │   └── PhotoPreview
│   ├── EmotionScanResult
│   ├── ScanHistory
│   └── MultiSourceChart
│
├── VoiceScanPage
│   ├── LiveVoiceScanner
│   │   ├── AudioProcessor
│   │   ├── RecordButton
│   │   ├── StatusIndicator
│   │   └── TranscriptDisplay
│   ├── EmotionScanResult
│   ├── ScanHistory
│   └── MultiSourceChart
│
├── TextScanPage
│   ├── Textarea
│   ├── EmotionScanResult
│   └── ScanHistory
│
└── EmojiScanPage
    ├── EmojiEmotionScanner
    │   ├── EmojiGrid
    │   ├── SelectedEmojis
    │   └── AnalyzeButton
    ├── EmotionScanResult
    ├── ScanHistory
    └── MultiSourceChart
```

### Composants réutilisables

```typescript
// Composants de base
EmotionScanResult     → Affiche résultat scan
ScanHistory           → 3 derniers scans
MultiSourceChart      → Graphique comparatif
EmotionVisualization  → Visualisation émotions

// Input components
TextEmotionScanner    → Saisie texte
AudioEmotionScanner   → Capture audio
FacialEmotionScanner  → Capture caméra
EmojiEmotionScanner   → Sélection emoji

// Analytics
EmotionTrendChart     → Tendances temporelles
TeamOverview          → Vue équipe (B2B)
TeamActivityChart     → Activité collective

// Utils
ScanOnboarding        → Tutoriel première visite
ScanExporter          → Export CSV/JSON
PrivacyNote           → Info RGPD
```

## Services Architecture

### Frontend Services

```typescript
// lib/scan/emotionService.ts
class EmotionService {
  // API publique
  analyzeText(text: string): Promise<EmotionResult>
  analyzeVoice(audio: Blob): Promise<EmotionResult>
  analyzeFacial(image: string): Promise<EmotionResult>
  analyzeEmoji(emojis: string[]): EmotionResult

  // Utils
  validateConfig(config: Config): boolean
  calculateWellbeingScore(scans: Scan[]): number

  // Private
  private callAPI(endpoint: string, data: any)
  private transformResponse(raw: any): EmotionResult
}

// lib/scan/scanValidation.ts
validateScanConfig(config: EmotionAnalysisConfig): ValidationResult
validateEmotionResult(result: EmotionResult): ValidationResult
sanitizeInput(input: string): string

// lib/scan/scanAggregation.ts
aggregateScans(scans: Scan[]): EmotionStatistics
calculateTrends(scans: Scan[]): Trend[]
detectPatterns(scans: Scan[]): Pattern[]
calculateWellbeingScore(scans: Scan[]): number
```

### Backend Services

```typescript
// services/scan/handlers/getWeeklyUser.ts
export async function getWeeklyUser(
  userId: string,
  since: Date
): Promise<WeeklyData[]> {
  // 1. Query DB
  // 2. Aggregate by week
  // 3. Calculate stats
  // 4. Return formatted data
}

// services/scan/handlers/getWeeklyOrg.ts
export async function getWeeklyOrg(
  orgId: string,
  since: Date
): Promise<WeeklyData[]> {
  // Same logic but org-level
}

// services/scan/lib/db.ts
export const queries = {
  getScans: (userId, range) => {...},
  getAggregates: (userId, range) => {...},
  storeResult: (scan) => {...},
}
```

## Patterns de conception

### 1. Composition over Inheritance

```typescript
// ✅ Bon : Composition
<EmotionScanner>
  <ScanInput mode={mode} />
  <ScanResult result={result} />
  <ScanHistory />
</EmotionScanner>

// ❌ Éviter : Héritage complexe
class FacialScanner extends BaseScanner {
  // Rigide, difficile à maintenir
}
```

### 2. Hooks personnalisés

```typescript
// Encapsulation logique réutilisable
function useEmotionScan() {
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanEmotion = async (mode, input) => {
    setIsScanning(true);
    try {
      const res = await emotionService.analyze(mode, input);
      setResult(res);
      return res;
    } finally {
      setIsScanning(false);
    }
  };

  return { result, isScanning, scanEmotion };
}
```

### 3. Error Boundaries

```typescript
// Isolation des erreurs par feature
<PageErrorBoundary route="/app/scan/facial" feature="facial-scan">
  <FacialScanPage />
</PageErrorBoundary>
```

### 4. Optimistic UI

```typescript
// Update UI immédiatement, rollback si erreur
const handleScan = async () => {
  // Optimistic update
  const tempResult = generateOptimisticResult();
  setResult(tempResult);

  try {
    // Réel appel API
    const realResult = await scanEmotion(input);
    setResult(realResult);
  } catch (error) {
    // Rollback
    setResult(null);
    showError(error);
  }
};
```

### 5. State Management

```typescript
// Local state pour UI
const [isOpen, setIsOpen] = useState(false);

// Context pour données partagées
const { user, preferences } = useAppContext();

// Supabase real-time pour sync
const scans = useRealtimeQuery('emotion_scans', filters);
```

## Sécurité

### Authentication flow

```
User → Login → Supabase Auth → JWT Token
                                    ↓
                            Store in localStorage
                                    ↓
                            Include in all API calls
                                    ↓
                            Edge Function validates
                                    ↓
                            Check RLS policies
                                    ↓
                            Return data if authorized
```

### Row Level Security (RLS)

```sql
-- Policy : users can only see their own scans
CREATE POLICY "Users view own scans"
  ON emotion_scans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy : users can insert their own scans
CREATE POLICY "Users insert own scans"
  ON emotion_scans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Data sanitization

```typescript
// Input validation
function sanitizeTextInput(text: string): string {
  // Remove HTML tags
  const stripped = text.replace(/<[^>]*>/g, '');

  // Limit length
  const truncated = stripped.slice(0, 1000);

  // Escape special chars
  return escapeHtml(truncated);
}

// XSS protection
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

## Performance

### Optimisations implémentées

1. **Lazy loading**
```typescript
// Routes avec code-splitting
const FacialScanPage = lazy(() => import('./pages/FacialScanPage'));
```

2. **Memoization**
```typescript
const expensiveCalculation = useMemo(() => {
  return calculateWellbeingScore(scans);
}, [scans]);
```

3. **Debouncing**
```typescript
const debouncedAnalyze = useDebounce((text) => {
  analyzeText(text);
}, 500);
```

4. **Caching**
```typescript
// Cache résultats récents
const cache = new Map<string, EmotionResult>();

function getCachedResult(key: string) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = performAnalysis(key);
  cache.set(key, result);
  return result;
}
```

### Métriques cibles

| Métrique | Target | Actuel | Status |
|----------|--------|--------|--------|
| Time to Interactive | <3s | 2.5s | ✅ |
| First Contentful Paint | <1.5s | 1.2s | ✅ |
| Largest Contentful Paint | <2.5s | 2.8s | ⚠️ |
| Cumulative Layout Shift | <0.1 | 0.05 | ✅ |
| Facial Analysis | <1s | 0.8s | ✅ |
| Voice Analysis | <5s | 3.5s | ✅ |
| Text Analysis | <3s | 2s | ✅ |

## Scalabilité

### Sharding strategy (future)

```
Users 0-999,999      → Shard 1 (US-East)
Users 1M-1,999,999   → Shard 2 (EU-West)
Users 2M-2,999,999   → Shard 3 (Asia-Pacific)
```

### Caching layers

```
Browser → CDN → Edge Cache → Origin Server → Database
 (5min)   (1h)    (15min)      (real-time)
```

### Rate limiting

```typescript
// Edge function level
const RATE_LIMITS = {
  'mood-camera': { requests: 5, window: 60 },      // 5/min
  'voice-analysis': { requests: 10, window: 60 },  // 10/min
  'text-analysis': { requests: 30, window: 60 },   // 30/min
};
```

## Monitoring

### Logs et métriques

```typescript
// Sentry breadcrumbs
Sentry.addBreadcrumb({
  category: 'scan',
  level: 'info',
  message: 'facial-scan:complete',
  data: { emotion, confidence }
});

// Analytics events
scanAnalytics.track('scan_completed', {
  mode: 'facial',
  duration: 0.8,
  confidence: 96,
});
```

### Alertes

- ❌ Taux d'erreur > 5%
- ❌ Latence > 5s (P95)
- ❌ Rate limit dépassé
- ✅ Scan réussi < 1s

---

**Version** : 2.0.0
**Dernière mise à jour** : 14 novembre 2025
