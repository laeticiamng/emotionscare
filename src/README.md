
# Projet d'intégration API

Ce projet intègre plusieurs API externes pour fournir des fonctionnalités avancées:

## APIs intégrées

### OpenAI
- **Fonctionnalités**: Génération de texte, chat, analyse d'émotion, génération d'images avec DALL-E
- **Fichier de service**: `/src/services/openai.ts`
- **Hook React**: `/src/hooks/api/useOpenAI.tsx`
- **Variables d'environnement**: `NEXT_PUBLIC_OPENAI_API_KEY`

### MusicGen
- **Fonctionnalités**: Génération de musique basée sur des descriptions textuelles ou des émotions
- **Fichier de service**: `/src/services/musicgen.ts`
- **Hook React**: `/src/hooks/api/useMusicGen.tsx`
- **API Endpoint**: Via proxy backend sécurisé

### Whisper
- **Fonctionnalités**: Transcription vocale, enregistrement et conversion parole-texte
- **Fichier de service**: `/src/services/whisper.ts`
- **Hook React**: `/src/hooks/api/useWhisper.tsx`
- **Variables d'environnement**: Utilise `NEXT_PUBLIC_OPENAI_API_KEY`

### Hume AI
- **Fonctionnalités**: Analyse émotionnelle voix, texte et expressions faciales
- **Fichier de service**: `/src/services/humeai.ts`
- **Hook React**: `/src/hooks/api/useHumeAI.tsx`
- **Variables d'environnement**: `NEXT_PUBLIC_HUME_API_KEY`

### DALL-E
- **Fonctionnalités**: Génération d'images basée sur des descriptions textuelles
- **Fichier de service**: `/src/services/dalle.ts`
- **Hook React**: Utilise `useOpenAI` pour DALL-E
- **Variables d'environnement**: Utilise `NEXT_PUBLIC_OPENAI_API_KEY`

## Configuration

Créez un fichier `.env.local` avec les variables nécessaires:

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_OPENAI_API_KEY=votre-clé-openai
NEXT_PUBLIC_HUME_API_KEY=votre-clé-hume-ai
```

## Utilisation

Pour utiliser une API, importez le hook correspondant:

```jsx
import { useOpenAI } from '@/hooks/api';

function MyComponent() {
  const { generateText, isLoading } = useOpenAI();

  const handleGenerate = async () => {
    const result = await generateText("Bonjour, comment ça va?");
    console.log(result);
  };

  return (
    <button onClick={handleGenerate} disabled={isLoading}>
      Générer du texte
    </button>
  );
}
```

## Monitoring

Un tableau de bord de monitoring des API est disponible pour les administrateurs:

```jsx
import ApiUsageMonitor from '@/components/admin/ApiUsageMonitor';

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ApiUsageMonitor />
    </div>
  );
}
```

## Configuration des API

Un panneau de configuration des API est disponible pour définir les clés et paramètres:

```jsx
import ApiConfigPanel from '@/components/ApiConfigPanel';

function Settings() {
  const handleUpdate = async (keys) => {
    // Sauvegarde des clés dans un backend sécurisé
  };

  return (
    <div>
      <h1>Paramètres</h1>
      <ApiConfigPanel onUpdate={handleUpdate} />
    </div>
  );
}
```

## Sécurité

- Les clés API ne sont jamais exposées côté client
- Les appels sensibles passent par un proxy côté serveur
- Toutes les erreurs sont gérées de manière élégante avec feedback utilisateur
