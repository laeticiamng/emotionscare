# Guide d'Amélioration TypeScript - Module Scan

## État actuel

### Problèmes identifiés

- ❌ **27 utilisations de `any`** dans les composants scan
- ❌ **`// @ts-nocheck`** sur certains fichiers
- ❌ **Types union complexes** (`number | EmotionConfidence`)
- ❌ **Props optionnelles non gérées**
- ⚠️ **Manque de validation runtime** (pas de Zod/io-ts)

### Coverage TypeScript actuel

```
Scan module total files: 77
Files avec types stricts: ~70 (91%)
Files avec @ts-nocheck: 2 (2.6%)
Files avec 'any': 27 (35%)
```

## Plan d'amélioration

### Phase 1 : Éliminer `@ts-nocheck`

#### Fichiers concernés

```typescript
// src/components/scan/FacialEmotionScanner.tsx
// @ts-nocheck  ← À SUPPRIMER

// src/components/scan/EmojiEmotionScanner.tsx
// @ts-nocheck  ← À SUPPRIMER
```

#### Actions

1. **Identifier les erreurs masquées**
```bash
# Temporairement commenter @ts-nocheck et lancer tsc
npx tsc --noEmit
```

2. **Fixer les erreurs une par une**
```typescript
// ❌ Avant
// @ts-nocheck
const handleAnalyze = (data: any) => {
  return data.result.emotion;
};

// ✅ Après
interface AnalysisData {
  result: {
    emotion: string;
    confidence: number;
  };
}

const handleAnalyze = (data: AnalysisData): string => {
  return data.result.emotion;
};
```

### Phase 2 : Remplacer `any` par types précis

#### Pattern 1 : Props de composants

```typescript
// ❌ Avant
interface ScannerProps {
  onComplete: (result: any) => void;
  config?: any;
}

// ✅ Après
import { EmotionResult, EmotionAnalysisConfig } from '@/types/emotion-unified';

interface ScannerProps {
  onComplete: (result: EmotionResult) => void;
  config?: Partial<EmotionAnalysisConfig>;
}
```

#### Pattern 2 : Event handlers

```typescript
// ❌ Avant
const handleChange = (e: any) => {
  setValue(e.target.value);
};

// ✅ Après
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

#### Pattern 3 : API responses

```typescript
// ❌ Avant
const analyzeEmotion = async (text: string): Promise<any> => {
  const response = await fetch('/api/analyze', { body: text });
  return response.json();
};

// ✅ Après
interface AnalysisResponse {
  emotion: string;
  confidence: number;
  valence: number;
  arousal: number;
  summary?: string;
}

const analyzeEmotion = async (text: string): Promise<AnalysisResponse> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<AnalysisResponse>;
};
```

#### Pattern 4 : State générique

```typescript
// ❌ Avant
const [data, setData] = useState<any>(null);

// ✅ Après
const [data, setData] = useState<EmotionResult | null>(null);
```

### Phase 3 : Unifier les types complexes

#### Problème : `confidence` multiple types

```typescript
// État actuel (incohérent)
interface EmotionResult {
  confidence: number | EmotionConfidence;  // ← Problématique
}

interface EmotionConfidence {
  overall: number;
  valence: number;
  arousal: number;
}
```

#### Solution 1 : Type guards

```typescript
// Type guard
function isEmotionConfidence(
  conf: number | EmotionConfidence
): conf is EmotionConfidence {
  return typeof conf === 'object' && 'overall' in conf;
}

// Utilisation
function getConfidenceValue(result: EmotionResult): number {
  if (isEmotionConfidence(result.confidence)) {
    return result.confidence.overall;
  }
  return result.confidence;
}
```

#### Solution 2 : Normalisation (recommandé)

```typescript
// Toujours utiliser la forme objet
interface EmotionResult {
  confidence: EmotionConfidence;  // Toujours objet
}

interface EmotionConfidence {
  overall: number;
  valence?: number;
  arousal?: number;
}

// Helper pour convertir ancien format
function normalizeConfidence(
  conf: number | EmotionConfidence
): EmotionConfidence {
  if (typeof conf === 'number') {
    return { overall: conf };
  }
  return conf;
}
```

### Phase 4 : Validation runtime avec Zod

#### Installation

```bash
npm install zod
```

#### Schémas de validation

```typescript
import { z } from 'zod';

// Schéma EmotionResult
export const EmotionResultSchema = z.object({
  emotion: z.string().min(1),
  confidence: z.union([
    z.number().min(0).max(100),
    z.object({
      overall: z.number().min(0).max(100),
      valence: z.number().min(0).max(100).optional(),
      arousal: z.number().min(0).max(100).optional(),
    }),
  ]),
  valence: z.number().min(-1).max(1),
  arousal: z.number().min(0).max(1),
  timestamp: z.coerce.date(),
  source: z.enum(['text', 'voice', 'facial', 'emoji', 'manual']).optional(),
  summary: z.string().optional(),
  recommendations: z.array(z.unknown()).optional(),
});

// Inférer le type TypeScript
export type EmotionResult = z.infer<typeof EmotionResultSchema>;

// Validation
function validateEmotionResult(data: unknown): EmotionResult {
  return EmotionResultSchema.parse(data);
}

// Validation safe (pas d'exception)
function safeValidateEmotionResult(data: unknown) {
  return EmotionResultSchema.safeParse(data);
}
```

#### Utilisation dans API calls

```typescript
const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  // Validation avec Zod
  const result = safeValidateEmotionResult(data);

  if (!result.success) {
    console.error('Validation failed:', result.error);
    throw new Error('Invalid API response format');
  }

  return result.data;
};
```

### Phase 5 : Types stricts pour Edge Functions

#### Config TypeScript

```json
// tsconfig.json (deno/edge functions)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Edge Function typée

```typescript
// supabase/functions/emotion-analysis/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts';

// Request schema
const RequestSchema = z.object({
  text: z.string().min(1).max(1000),
  language: z.enum(['fr', 'en']).default('fr'),
});

type RequestBody = z.infer<typeof RequestSchema>;

// Response schema
const ResponseSchema = z.object({
  emotion: z.string(),
  confidence: z.number().min(0).max(100),
  valence: z.number().min(0).max(1),
  arousal: z.number().min(0).max(1),
  summary: z.string().optional(),
});

type ResponseBody = z.infer<typeof ResponseSchema>;

serve(async (req: Request): Promise<Response> => {
  try {
    // Parse and validate request
    const body = await req.json();
    const validatedRequest = RequestSchema.parse(body);

    // Process
    const result = await analyzeText(validatedRequest.text);

    // Validate response
    const validatedResponse = ResponseSchema.parse(result);

    return new Response(
      JSON.stringify(validatedResponse),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: error.errors }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500 }
    );
  }
});
```

## Best Practices

### 1. Préférer les types stricts

```typescript
// ❌ Éviter
let value: string | number | boolean | null | undefined;

// ✅ Préférer
type PrimitiveValue = string | number | boolean;
let value: PrimitiveValue | null = null;
```

### 2. Utiliser `unknown` au lieu de `any`

```typescript
// ❌ Éviter
function process(data: any) {
  return data.value;  // Pas de vérification
}

// ✅ Préférer
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: unknown }).value;
  }
  throw new Error('Invalid data format');
}
```

### 3. Types discriminés

```typescript
// Union discriminée pour les différents modes de scan
type ScanResult =
  | { source: 'text'; transcription?: never; image?: never }
  | { source: 'voice'; transcription: string; image?: never }
  | { source: 'facial'; transcription?: never; image: string }
  | { source: 'emoji'; transcription?: never; image?: never };

function processScanResult(result: ScanResult) {
  switch (result.source) {
    case 'text':
      // TypeScript sait que transcription et image sont undefined
      break;
    case 'voice':
      // TypeScript sait que transcription existe
      console.log(result.transcription);
      break;
    case 'facial':
      // TypeScript sait que image existe
      console.log(result.image);
      break;
    case 'emoji':
      // Pas de champs supplémentaires
      break;
  }
}
```

### 4. Utility Types

```typescript
// Partial pour props optionnelles
type ScannerConfig = {
  duration: number;
  sensitivity: number;
  mode: 'quick' | 'standard' | 'detailed';
};

function updateConfig(current: ScannerConfig, updates: Partial<ScannerConfig>) {
  return { ...current, ...updates };
}

// Pick pour extraire des propriétés
type ScanSummary = Pick<EmotionResult, 'emotion' | 'confidence' | 'timestamp'>;

// Omit pour exclure des propriétés
type PublicEmotionResult = Omit<EmotionResult, 'userId' | 'sessionId'>;

// Required pour rendre tout obligatoire
type CompleteConfig = Required<ScannerConfig>;
```

### 5. Const assertions

```typescript
// Inférence de type littéral
const EMOTIONS = ['happy', 'sad', 'angry', 'fearful'] as const;
type Emotion = typeof EMOTIONS[number];  // 'happy' | 'sad' | 'angry' | 'fearful'

// Objets immuables
const CONFIG = {
  maxDuration: 300,
  minDuration: 5,
  defaultSensitivity: 70,
} as const;

type Config = typeof CONFIG;  // Readonly avec types littéraux
```

## Checklist de migration

### Fichier par fichier

```typescript
// Pour chaque fichier :
☐ Supprimer @ts-nocheck (si présent)
☐ Remplacer tous les 'any' par types précis
☐ Ajouter types pour props de composants
☐ Typer les event handlers
☐ Typer les hooks (useState, useEffect, etc.)
☐ Ajouter JSDoc pour fonctions complexes
☐ Valider avec `npx tsc --noEmit`
☐ Tester le composant/fonction
```

### Priorités

1. **HIGH** : Composants avec @ts-nocheck
   - `FacialEmotionScanner.tsx`
   - `EmojiEmotionScanner.tsx`

2. **MEDIUM** : Services avec 'any'
   - `emotionService.ts`
   - `analyzeService.ts`

3. **LOW** : Composants UI simples
   - Cartes, boutons, displays

## Outils utiles

### VS Code extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "zod.zod-validation"
  ]
}
```

### ESLint rules

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/strict-boolean-expressions": "warn"
  }
}
```

### Scripts NPM

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "lint:types": "eslint --ext .ts,.tsx src/ --rule '@typescript-eslint/no-explicit-any: error'"
  }
}
```

## Exemple complet : Avant/Après

### Avant (avec problèmes)

```typescript
// @ts-nocheck
import React, { useState } from 'react';

const EmotionScanner = ({ onComplete, config }: any) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setResult(result);
      onComplete(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {result && <p>{result.emotion}</p>}
    </div>
  );
};

export default EmotionScanner;
```

### Après (types stricts)

```typescript
import React, { useState } from 'react';
import { z } from 'zod';
import { EmotionResult, EmotionAnalysisConfig } from '@/types/emotion-unified';

// Schémas de validation
const ScanRequestSchema = z.object({
  mode: z.enum(['text', 'voice', 'facial', 'emoji']),
  input: z.string().min(1),
});

const ScanResponseSchema = z.object({
  emotion: z.string(),
  confidence: z.number().min(0).max(100),
  valence: z.number().min(-1).max(1),
  arousal: z.number().min(0).max(1),
});

// Props avec types stricts
interface EmotionScannerProps {
  onComplete: (result: EmotionResult) => void;
  config?: Partial<EmotionAnalysisConfig>;
  className?: string;
}

const EmotionScanner: React.FC<EmotionScannerProps> = ({
  onComplete,
  config,
  className = '',
}) => {
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (
    data: z.infer<typeof ScanRequestSchema>
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Validation de l'input
      const validatedData = ScanRequestSchema.parse(data);

      // API call
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Validation de la réponse
      const rawResult = await response.json();
      const validatedResult = ScanResponseSchema.parse(rawResult);

      // Conversion en EmotionResult complet
      const emotionResult: EmotionResult = {
        ...validatedResult,
        timestamp: new Date(),
        source: validatedData.mode,
      };

      setResult(emotionResult);
      onComplete(emotionResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {loading && (
        <p role="status" aria-live="polite">
          Analyse en cours...
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-500">
          Erreur : {error}
        </p>
      )}
      {result && (
        <p>
          Émotion détectée : <strong>{result.emotion}</strong>
        </p>
      )}
    </div>
  );
};

export default EmotionScanner;
```

## Résumé

### Objectifs

- ✅ 0 fichiers avec `@ts-nocheck`
- ✅ 0 utilisations de `any`
- ✅ 100% des fonctions avec return types
- ✅ Validation runtime avec Zod
- ✅ Types stricts activés

### Timeline

- **Semaine 1** : Phase 1 + 2 (éliminer @ts-nocheck et any)
- **Semaine 2** : Phase 3 (unifier types complexes)
- **Semaine 3** : Phase 4 (ajouter Zod)
- **Semaine 4** : Phase 5 (Edge Functions) + Tests

---

**Version** : 1.0.0
**Dernière mise à jour** : 14 novembre 2025
