# ⚠️ DEPRECATED - hume-ws-proxy

**Date de deprecation**: 29 octobre 2025  
**Raison**: Utilise l'endpoint Batch API inapproprié pour le temps réel

## Problème

Cette fonction utilise `https://api.hume.ai/v0/batch/jobs` qui est un endpoint **asynchrone** 
pour l'analyse de gros volumes, pas adapté au streaming temps réel de frames vidéo.

```typescript
// ❌ INCORRECT: Batch API (asynchrone)
const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
  method: 'POST',
  headers: { 'X-Hume-Api-Key': humeApiKey },
  body: formData,
});

// Retourne: { job_id: "...", status: "QUEUED" }
// Nécessite polling pour récupérer les résultats
```

## Utilisation actuelle

Cette fonction **N'EST PAS UTILISÉE** dans `/app/scan`. 
- `B2CScanPage` utilise `mood-camera` (endpoint synchrone)
- `useHumeVision` appelle cette fonction mais n'est pas utilisé dans /app/scan

## Alternatives

### Option 1: Supprimer cette fonction
```bash
rm -rf supabase/functions/hume-ws-proxy/
```

### Option 2: Migrer vers WebSocket Streaming (recommandé par Hume)
```typescript
// ✅ CORRECT: WebSocket Streaming
const ws = new WebSocket('wss://api.hume.ai/v0/stream/models');

ws.send(JSON.stringify({
  data: base64Image,
  models: { 
    face: {
      fps_pred: 1,
      prob_threshold: 0.5
    }
  }
}));

ws.onmessage = (event) => {
  const result = JSON.parse(event.data);
  // result.face.predictions[0].emotions
};
```

## Documentation

- [Hume WebSocket Streaming](https://dev.hume.ai/docs/expression-measurement/websocket)
- [API Reference - Stream](https://dev.hume.ai/reference/expression-measurement-api/stream/models)

## Décision requise

- [ ] Supprimer complètement la fonction
- [ ] Réécrire avec WebSocket
- [ ] Migrer useHumeVision vers mood-camera

**Voir**: `AUDIT_HUME_AI_INTEGRATION.md` pour détails complets
