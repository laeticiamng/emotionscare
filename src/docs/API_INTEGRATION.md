
# Documentation d'intégration des APIs

## Introduction

EmotionsCare s'intègre avec plusieurs APIs externes pour fournir ses fonctionnalités avancées d'analyse émotionnelle, de génération de contenu et de traitement vocal. Ce document détaille comment ces APIs sont intégrées et utilisées dans l'application.

## OpenAI

### Configuration

- **API Key** : Stockée dans `NEXT_PUBLIC_OPENAI_API_KEY`
- **Services utilisés** : GPT-4, DALL-E 3, Whisper
- **Fichier de configuration** : `src/services/openai.ts`

### Fonctionnalités

#### GPT-4 (Génération de texte)

Utilisé pour:
- Analyse émotionnelle des textes
- Génération de conseils personnalisés
- Interprétation des résultats d'analyse

```typescript
import { useOpenAI } from '@/hooks/api';

// Dans un composant React
const { generateText, isLoading } = useOpenAI();

const handleAnalyze = async (text) => {
  const result = await generateText(
    `Analyze the emotional tone of this text: "${text}"`
  );
  console.log(result);
};
```

#### DALL-E (Génération d'images)

Utilisé pour:
- Création d'images liées aux émotions
- Visualisations personnalisées pour le journal

```typescript
import { useDalle } from '@/hooks/api';

// Dans un composant React
const { generateImage, isLoading } = useDalle();

const handleGenerateVisual = async (emotion) => {
  const result = await generateImage(
    `A calming abstract representation of ${emotion} emotion, soft colors`
  );
  return result.url;
};
```

#### Whisper (Reconnaissance vocale)

Utilisé pour:
- Transcription des entrées vocales
- Analyse d'émotion à partir de la voix

```typescript
import { useWhisper } from '@/hooks/api';

// Dans un composant React
const { transcribeAudio, isLoading } = useWhisper();

const handleVoiceRecording = async (audioBlob) => {
  const transcript = await transcribeAudio(audioBlob);
  return transcript.text;
};
```

## Hume AI

### Configuration

- **API Key** : Stockée dans `NEXT_PUBLIC_HUME_API_KEY`
- **Fichier de configuration** : `src/services/humeai.ts`

### Fonctionnalités

#### Analyse émotionnelle

Utilisé pour:
- Détection d'émotions dans le texte
- Analyse des expressions faciales
- Analyse de la voix et du ton

```typescript
import { useHumeAI } from '@/hooks/api';

// Dans un composant React
const { analyzeEmotion, isLoading } = useHumeAI();

const handleAnalyzeVoice = async (audioBlob) => {
  const result = await analyzeEmotion('voice', audioBlob);
  return result.emotions;
};

const handleAnalyzeText = async (text) => {
  const result = await analyzeEmotion('text', text);
  return result.emotions;
};

const handleAnalyzeFacial = async (imageBlob) => {
  const result = await analyzeEmotion('facial', imageBlob);
  return result.emotions;
};
```

## MusicGen

### Configuration

- Accès via API proxy sécurisé
- **Fichier de configuration** : `src/services/musicgen.ts`

### Fonctionnalités

#### Génération de musique

Utilisé pour:
- Création de musiques adaptées aux émotions
- Personnalisation sonore selon l'humeur

```typescript
import { useMusicGen } from '@/hooks/api';

// Dans un composant React
const { generateMusic, isLoading } = useMusicGen();

const handleCreateMusic = async (emotion, intensity) => {
  const result = await generateMusic({
    emotion,
    intensity,
    duration: 60, // en secondes
    style: 'ambient'
  });
  
  return result.audioUrl;
};
```

## Gestion des erreurs et limites

Chaque intégration API inclut:

1. **Gestion des erreurs**:
   - Capture et log des erreurs
   - Retours utilisateur via toasts
   - Fallbacks en cas d'échec

2. **Limites de taux**:
   - Suivi des quotas API
   - Throttling pour éviter les dépassements
   - Mécanismes de file d'attente pour les demandes importantes

3. **Mise en cache**:
   - Cache des résultats fréquents
   - Optimisation des appels répétés
   - Persistance locale quand possible

## Sécurité

1. Les clés API ne sont jamais exposées côté client
2. Les appels sensibles passent par des fonctions Edge Supabase
3. Validation des entrées et des sorties
4. Obfuscation des données sensibles dans les logs

## Extension et maintenance

Pour ajouter une nouvelle API:

1. Créer un fichier de service dans `src/services/`
2. Développer un hook React dans `src/hooks/api/`
3. Ajouter la configuration dans les variables d'environnement
4. Documenter l'intégration dans ce fichier
