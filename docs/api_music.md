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

Une erreur 401 est retournée si le JWT est manquant ou invalide.
Une erreur 422 est renvoyée si le payload ne correspond pas au schéma.
