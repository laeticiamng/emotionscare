# Musicothérapie API

Ces routes permettent d'enregistrer les sessions des widgets **BioTune** et **Neon Walk**.
Chaque appel requiert un JWT valide et renvoie les métriques calculées par la base de données.

## BioTune – `POST /api/biotune_session`
```bash
curl -X POST https://example.com/api/biotune_session \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"duration_s":300,"bpm_target":70,"hrv_pre":50,"hrv_post":80,"energy_mode":"calm"}'
```
Réponse :
```json
{
  "record_id": "<uuid>",
  "rmssd_delta": 30,
  "coherence": 50
}
```

## Neon Walk – `POST /api/neon_walk_session`
```bash
curl -X POST https://example.com/api/neon_walk_session \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"steps":3000,"avg_cadence":110,"hr_avg":98,"joy_idx":0.72}'
```
Réponse :
```json
{
  "record_id": "<uuid>",
  "mvpa_min": 27.5,
  "joy_idx": 0.72
}
```

## Mood Playlist – `POST /api/mood_playlist`
```bash
curl -X POST https://example.com/api/mood_playlist \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"mood":"calm","intensity":0.35,"duration_minutes":20,"context":{"activity":"relaxation"}}'
```
Réponse :
```json
{
  "ok": true,
  "data": {
    "playlist_id": "calm_relax",
    "mood": "calm",
    "requested_mood": "calm",
    "title": "Calm Relaxation Flow",
    "description": "Textures ambient, nappes aériennes et sons naturels pour apaiser le système nerveux.",
    "total_duration": 900,
    "unit": "seconds",
    "tracks": [
      {
        "id": "calm_relax_1",
        "title": "Forest Haze",
        "artist": "EmotionsCare Ensemble",
        "duration": 240,
        "url": "/audio/adaptive/calm-forest-haze.mp3",
        "mood": "calm",
        "energy": 0.15,
        "focus": "breathing"
      }
    ],
    "energy_profile": {
      "baseline": 0.2,
      "requested": 0.35,
      "recommended": 0.3,
      "alignment": 0.9,
      "curve": [
        { "track_id": "calm_relax_1", "start": 0, "end": 240, "energy": 0.15, "focus": "breathing" }
      ]
    },
    "recommendations": [
      "Synchronisez votre respiration 4-7-8 avec la première piste.",
      "Relâchez progressivement les épaules et la mâchoire durant la deuxième piste.",
      "Terminez la session en visualisant un lieu sûr et réconfortant."
    ],
    "guidance": {
      "focus": "Stabiliser le rythme cardiaque et induire une relaxation profonde.",
      "breathwork": "Respiration diaphragmatique lente, 4 secondes d’inspiration / 6 secondes d’expiration.",
      "activities": [
        "Écriture d’un journal apaisant",
        "Étirements doux",
        "Hydratation consciente"
      ]
    },
    "metadata": {
      "curated_by": "EmotionsCare Adaptive Engine",
      "tags": ["calm", "relax", "soothing", "adaptive"],
      "dataset_version": "2024.06-adaptive"
    }
  }
}
```

Une erreur 401 est retournée si le JWT est manquant ou invalide.
Une erreur 422 est renvoyée si le payload ne correspond pas au schéma.
