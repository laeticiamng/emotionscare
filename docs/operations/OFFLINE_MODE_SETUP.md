# Phase 4 - Mode Hors-Ligne (PWA) Setup Guide

## Vue d'ensemble

EmotionsCare Phase 4 implémente un **mode hors-ligne complet (PWA)** permettant à l'application de fonctionner pleinement sans connexion Internet. Les modifications sont stockées localement dans une queue et synchronisées automatiquement dès que la connexion revient.

## Architecture

### Composants clés

1. **Service Worker** (`public/sw-offline.js`)
   - Gère le cache avec plusieurs stratégies (Cache-First, Network-First, Stale-While-Revalidate)
   - Persiste les assets (HTML, JS, CSS, images, audio)
   - Gère les notifications push

2. **Offline Queue** (`src/lib/offlineQueue.ts`)
   - Persiste les mutations (émotions, journal, playlists) en IndexedDB
   - Gère les retries automatiques et les conflits
   - Priorise les changements (high > normal > low)

3. **Context React** (`src/contexts/OfflineContext.tsx`)
   - Partage l'état offline à travers l'app
   - Gère la synchronisation automatique

4. **Composants UI**
   - `OfflineIndicator`: Affiche le statut de connexion
   - `OfflineQueueStatus`: Détails de la synchronisation

## Intégration

### 1. Wrapper le composant App avec OfflineProvider

```tsx
import { OfflineProvider } from '@/contexts/OfflineContext';
import { OfflineIndicator } from '@/components/offline/OfflineIndicator';

function App() {
  return (
    <OfflineProvider>
      <YourAppContent />
      <OfflineIndicator />
    </OfflineProvider>
  );
}
```

### 2. Utiliser le hook useOffline dans les composants

```tsx
import { useOffline } from '@/contexts/OfflineContext';

function MyComponent() {
  const { isOnline, queueStats, addToQueue } = useOffline();

  const handleSaveEmotion = async () => {
    try {
      const emotionData = { /* ... */ };

      // Ajouter à la queue (sera sauvegardé localement si offline)
      await addToQueue(
        'emotion',
        emotionData,
        '/api/emotions',
        'POST',
        'normal'
      );
    } catch (error) {
      console.error('Failed to save emotion:', error);
    }
  };

  return (
    <div>
      <p>Status: {isOnline ? 'Online' : 'Offline'}</p>
      <p>Pending items: {queueStats.pending}</p>
      <button onClick={handleSaveEmotion}>Save Emotion</button>
    </div>
  );
}
```

### 3. Utiliser les helpers de service

```tsx
import { saveEmotionOffline, triggerOfflineSync } from '@/lib/offlineServices';

// Sauvegarder une émotion (avec support offline)
async function handleEmotionSave(emotionData) {
  try {
    const result = await saveEmotionOffline(emotionData);
    console.log('Saved:', result);
  } catch (error) {
    console.error('Failed to save emotion:', error);
  }
}

// Déclencher la synchronisation manuelle
async function handleManualSync() {
  try {
    const { synced, failed } = await triggerOfflineSync();
    console.log(`Synced: ${synced}, Failed: ${failed}`);
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
```

## Comportement offline

### Quand offline:
- Les mutations (POST, PUT, DELETE) sont sauvegardées dans la queue (IndexedDB)
- Les GET requests utilisent le cache si disponible
- L'UI affiche un indicateur offline
- Les modifications sont visibles localement immédiatement

### Quand online:
- La queue est synchronisée automatiquement (toutes les 30 secondes ou au retour de connexion)
- Les modifications sont envoyées au serveur
- En cas de conflit, un statut 409 est retourné et l'item passe à `conflict`
- La synchronisation est transparent pour l'utilisateur

## Configuration

### Service Worker

Le service worker est enregistré automatiquement. Pour tester en développement:

```bash
# Activiver le SW en dev
VITE_SW_DEV=true npm run dev
```

### Manifest.json

Mis à jour automatiquement par Vite PWA. Includes:
- Icons (192x192, 512x512)
- Screenshots
- Shortcuts (Dashboard, Coach IA)
- Thème color et background

### Vite Config

Configuré dans `vite.config.ts` avec:
- Workbox pour le cache
- Runtime caching pour les APIs
- Manifest generation

## Cas d'usage

### 1. Enregistrement d'une émotion offline

```tsx
const { addToQueue, isOnline } = useOffline();

const handleRecordEmotion = async (emotionData) => {
  // Ajouter à la queue (offline-safe)
  const item = await addToQueue(
    'emotion',
    emotionData,
    '/api/emotions',
    'POST',
    'high' // Haute priorité
  );

  if (isOnline) {
    toast.success('Émotion enregistrée');
  } else {
    toast.info('Émotion sauvegardée localement - sync quand connecté');
  }

  return item;
};
```

### 2. Consultation du journal offline

```tsx
// Afficher le journal + les entrées en queue
const emotions = await getEmotionsWithOfflineQueue(serverEmotions);

emotions.forEach((emotion) => {
  if (emotion._offlineQueue) {
    // Afficher avec un badge "En attente de sync"
  }
});
```

### 3. Gestion des erreurs de synchronisation

```tsx
const { queueStats, syncError, hasConflicts } = useOffline();

if (hasConflicts) {
  // Afficher un dialog pour résoudre les conflits
  showConflictResolutionDialog();
}

if (queueStats.failed > 0) {
  // Afficher une notification pour les items échoués
  showFailedItemsNotification();
}
```

## Limitation et considérations

### Quota de stockage

- IndexedDB: ~50MB par domaine (pour la queue)
- Cache API: ~100MB+ (pour les assets)
- Configurable par le navigateur

### Conflit de données

Si une modification locale conflicte avec le serveur:
- L'item passe à `conflict`
- L'utilisateur doit choisir: Keep Local ou Use Server
- À implémenter selon vos besoins

### Authentification

Les items en queue sont synchronisés avec le token de l'utilisateur. Si l'utilisateur se déconnecte:
- Les items restent en queue
- Ils peuvent être resynchronisés après reconnexion

## Monitoring et debugging

### Console messages

Tous les logs offline sont préfixés par `[OFFLINE]` ou `[SW]`:

```javascript
logger.info('Item added to queue', { type, id }, 'OFFLINE');
logger.warn('Network request failed', error, 'OFFLINE');
```

### Devtools

Ouvrir Chrome DevTools:
- **Application > Service Workers**: Voir l'état du SW
- **Application > Cache Storage**: Voir les caches
- **Application > IndexedDB > EmotionsCareOfflineDB**: Voir la queue

### Event listeners

```typescript
// Écouter les événements de synchronisation
window.addEventListener('offline:sync-complete', (event) => {
  console.log('Sync complete:', event.detail);
});
```

## Performance

### Cache strategies appliquées

| Resource Type | Strategy | TTL |
|---|---|---|
| Images | Cache-First | 30 jours |
| Audio | Cache-First | 30 jours |
| Fonts | Cache-First | 60 jours |
| Assets (JS/CSS) | Cache-First | - |
| Supabase API | Network-First | 5 min |
| OpenAI API | Network-First | 24h |

### Taille du cache

- Images cache: max 50 entries (150-200MB)
- Audio cache: max 50 entries
- API cache: max 32 entries

## Tests

### Test offline manuellement

1. Ouvrir DevTools (F12)
2. Network tab > Throttling > Offline
3. Utiliser l'app normalement
4. Vérifier que les modifications sont en queue
5. Repasser en Online
6. Vérifier que la synchronisation se déclenche

### Test service worker

```bash
# En production build
npm run build
npm run preview

# Vérifier /sw.js dans Network tab
```

## Roadmap Phase 4+

- [ ] Gestion avancée des conflits (merge automatique)
- [ ] Sync prioritization par type
- [ ] Compression des données locales
- [ ] Backup/Restore from cloud
- [ ] Sync progress streaming UI
- [ ] Custom sync hooks pour les services

## Support et troubleshooting

### Le SW ne s'enregistre pas

```bash
# Vérifier qu'il est activé en dev
VITE_SW_DEV=true npm run dev

# Vérifier la console pour les erreurs
```

### Offline mode ne fonctionne pas

- Vérifier que `/offline.html` existe
- Vérifier que le SW est enregistré (DevTools > Application > SW)
- Vérifier que manifest.json est valide

### Synchronisation échouée

- Vérifier la console (logs OFFLINE)
- Vérifier le statut des items en queue
- Vérifier que l'authentification est valide

---

**Phase 4 - Innovation - Mode Hors-Ligne Complet**
Implémentation PWA avec gestion offline-first, queue persistante et synchronisation intelligente.
