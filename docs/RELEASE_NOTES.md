# Release Notes — 1.2.0 (2025-06-07)

## À retenir côté produit
- Le tableau de bord de santé expose désormais la version, l'uptime et un battement Sentry : support et ops savent instantanément si quelque chose flanche.
- Les boutons d'appel à l'action de la landing sont taggés automatiquement (`utm_source=landing`, `utm_campaign=launch`) et ces paramètres disparaissent dès que l'on entre dans l'app.
- Une page de notes de version dédiée est prête à être partagée avec produit, support et partenaires.

## Ce que l'utilisateur ressent
- L'accès à l'app reste fluide : les liens marketing ouvrent directement l'espace adapté sans trainées de paramètres techniques.
- Le monitoring de fond rassure l'utilisateur : en cas de souci, l'équipe peut réagir plus vite et communiquer clairement.

## Confidentialité & conformité
- Les UTMs sont stoppés à la frontière `/app` : aucune information marketing ne se retrouve dans l'espace authentifié.
- La landing reste `noindex`, respecte le signal Do Not Track et Sentry continue de scrubber les payloads côté front & back.

## Points de vigilance post-déploiement
- Latence Edge : surveiller la réponse Supabase dans `/health` (budget < 350 ms) sur les premières heures.
- Quotas audio : vérifier les limites Hume/MusicGen si un pic de trafic survient après l'annonce.

## Post-deploy checklist
- [x] Bump version → `package.json` passe en 1.2.0.
- [x] Feature flags en place → `FF_VR`, `FF_COMMUNITY` et `FF_MANAGER_DASH` confirmés actifs sur l'environnement cible.
- [x] Lighthouse rapide Home & Dashboard (mode CI) → scores stables (>90) lors de la revue pré-release.
- [x] Surveillance Sentry : aucun « new issue » critique détecté sur les 24 h glissantes avant le go-live.
