
# EmotionsCare - Plateforme de bien-être émotionnel

## Configuration des API

La plateforme EmotionsCare s'intègre avec plusieurs API tierces pour fournir ses fonctionnalités d'IA, d'analyse émotionnelle, de génération de musique et d'images.

### APIs intégrées

Voici la liste des API nécessaires pour activer toutes les fonctionnalités :

1. **OpenAI** - Pour GPT-4, DALL-E et Whisper
   - Utilisation : Conseils IA, génération de texte et d'images, transcription audio
   - Variable d'environnement : `NEXT_PUBLIC_OPENAI_API_KEY`
   - [Obtenir une clé API](https://platform.openai.com/api-keys)

2. **Hume AI** - Pour l'analyse émotionnelle avancée
   - Utilisation : Détection d'émotions dans le texte, la voix et les expressions faciales
   - Variable d'environnement : `NEXT_PUBLIC_HUME_API_KEY`
   - [Obtenir une clé API](https://hume.ai/dashboard)

3. **MusicGen** - Pour la génération de musique personnalisée
   - Utilisation : Création de musique adaptée aux émotions
   - Gérée par le backend, pas besoin de clé directe

### Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_HUME_API_KEY=hume_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

### Architecture des services API

Tous les appels API sont centralisés dans le répertoire `/src/services/` :

- `/src/services/openai.ts` - Service OpenAI pour GPT-4, DALL-E, etc.
- `/src/services/musicgen.ts` - Service MusicGen pour la génération musicale
- `/src/services/whisper.ts` - Service Whisper pour la transcription vocale
- `/src/services/humeai.ts` - Service Hume AI pour l'analyse émotionnelle
- `/src/services/dalle.ts` - Service DALL-E pour la génération d'images
- `/src/services/index.ts` - Point d'entrée central pour tous les services API

### React Hooks

Pour faciliter l'utilisation des API dans les composants React, des hooks personnalisés sont disponibles dans `/src/hooks/api/` :

- `useOpenAI` - Pour les fonctionnalités OpenAI
- `useWhisper` - Pour la transcription vocale
- `useMusicGen` - Pour la génération de musique
- `useDalle` - Pour la génération d'images
- `useHumeAI` - Pour l'analyse émotionnelle

### Exemple d'utilisation

```tsx
import { useOpenAI } from '@/hooks/api';

function MyComponent() {
  const { generateText, isLoading, error } = useOpenAI();

  const handleSubmit = async (prompt) => {
    const response = await generateText(prompt);
    console.log(response);
  };

  return (
    <div>
      {/* Votre interface */}
    </div>
  );
}
```

### Gestion des erreurs et fallbacks

Chaque service API inclut une gestion des erreurs et des mécanismes de fallback pour assurer la disponibilité des fonctionnalités même en cas de problème avec les API externes.

Pour plus d'informations sur l'intégration spécifique de chaque API, consultez la documentation dans les fichiers de service correspondants.

## Démarrage rapide

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

## Build et déploiement

```bash
# Construction de l'application
npm run build

# Démarrage en mode production
npm start
```
