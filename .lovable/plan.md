

# Analyse Complète et Plan de Complétion — EmotionsCare

## Constat actuel

| Métrique | Valeur |
|----------|--------|
| Pages | 347 fichiers |
| Components | 1960 fichiers |
| Hooks | 626 fichiers |
| Tests | 320 (~7% couverture vs 90% cible) |
| Modules "Complets" | 10/26 |
| **Modules "Partiels"** | **16/26** |
| i18n FR | 18 lignes — complet |
| i18n EN/ES/DE | 167 lignes chacun — **stubs incomplets** |

---

## Les 16 modules partiels — Diagnostic et Actions

### Groupe A — Modules fonctionnels mais incomplets (complétion rapide)

| # | Module | Lignes | Ce qui manque | Action |
|---|--------|--------|---------------|--------|
| 1 | **Protocole Reset** (flash-glow) | 668 | Marqué "partial" mais le code est riche (3D, timers, stats). Il manque un protocole standardisé 3 min. | Ajouter un mode "Reset Express 3 min" structuré + passer en "complete" |
| 2 | **Musicothérapie Hub** | 306 | Le mixer et le journal vocal sont des stubs visuels sans logique réelle | Connecter le mixer à des pistes audio réelles, ajouter enregistrement vocal fonctionnel |
| 3 | **Écoute thérapeutique** | (dans Music) | Pas de mode auto-play contextuel | Ajouter un mode "Auto selon humeur" basé sur le dernier scan |
| 4 | **VR thérapeutique** | 462 | 3 scènes existent mais pas unifiées, pas d'indicateurs tolérance | Ajouter sélecteur de scène + timer de tolérance |
| 5 | **FAQ interactive** | 423 | FAQ statique, pas de recherche contextuelle | Ajouter recherche full-text et catégorisation dynamique |
| 6 | **Export RGPD** | 515 | L'export fonctionne mais n'est pas centralisé (2 pages : ExportPage + DataExportPage) | Fusionner en un seul parcours avec sélection des données |

### Groupe B — Modules B2B à structurer

| # | Module | Lignes | Ce qui manque | Action |
|---|--------|--------|---------------|--------|
| 7 | **Dashboard B2B RH** | 437 | KPIs non structurés, pas de vrais indicateurs bien-être | Ajouter 5 KPIs standards (charge, tension, récupération, engagement, absentéisme) |
| 8 | **Rapports anonymisés** | 158 | Stub minimal, pas de template exportable | Créer templates hebdo/mensuels avec graphiques et export PDF |
| 9 | **Alertes RH** | 352 | Alertes affichées mais pas de seuils configurables | Ajouter panneau de configuration des seuils par établissement |

### Groupe C — Modules transversaux

| # | Module | Ce qui manque | Action |
|---|--------|---------------|--------|
| 10 | **Parc émotionnel** (1091 lignes) | Pas relié au scan ni au plan personnalisé | Connecter les zones aux résultats du scanner pour guider le parcours |
| 11 | **Méditation** (1060 lignes) | Pas de bibliothèque audio réelle | Créer 6 méditations guidées textuelles avec timer intégré |
| 12 | **Récits Thérapeutiques** (369 lignes) | Bibliothèque vide, génération IA non connectée | Ajouter 8 récits prédéfinis + connecter à l'edge function existante |
| 13 | **Wearables** (560 lignes) | UI complète mais aucune intégration réelle (Apple Health/Google Fit) | Ajouter Web Bluetooth API pour capteurs HR basiques |
| 14 | **Mode PWA** (sw.js 366 lignes) | Service worker existe mais cache minimal | Étendre le cache offline aux protocoles essentiels (respiration, journal) |
| 15 | **Support multilingue** | FR complet (18 clés), EN/ES/DE = stubs (167 lignes identiques) | Compléter les traductions EN/ES/DE avec les mêmes clés que FR |
| 16 | **Accessibilité WCAG** | Audit en cours (72→95 cible) | Passe aria-label sur les composants hub restants |

---

## Éléments manquants hors modules

### 1. Notifications push réelles
`NotificationsCenterPage.tsx` = 124 lignes avec des données mockées. Aucune notification réelle n'est envoyée.
**Action** : Connecter aux événements Supabase Realtime (nouveau défi, rappel respiration, alerte scan).

### 2. Onboarding post-inscription
`OnboardingPage.tsx` existe (469 lignes) mais le contexte `OnboardingContext` a été réécrit récemment.
**Action** : Vérifier que le flux post-signup redirige bien vers l'onboarding et que les étapes sont persistées.

### 3. Système de rappels/notifications planifiées
Aucun système de rappels quotidiens (ex: "C'est l'heure de votre scan", "Défi du jour").
**Action** : Ajouter un composant de rappels dans les paramètres + logique côté service worker.

---

## Plan d'implémentation (5 phases)

### Phase 1 — Compléter les 6 modules les plus proches de "complete" (Groupe A)
1. **Flash-Glow** : Ajouter mode "Reset Express 3 min" (inhale 4s → hold 4s → exhale 6s × 12 cycles)
2. **Music Hub** : Connecter les boutons play à des pistes audio réelles (URL depuis Supabase storage ou CDN), ajouter enregistrement MediaRecorder au journal vocal
3. **VR** : Ajouter sélecteur de scène unifié + timer de tolérance avec alerte
4. **FAQ** : Ajouter recherche full-text avec filtrage par catégorie
5. **Export RGPD** : Fusionner ExportPage et DataExportPage en un flux unique
6. **Écoute thérapeutique** : Ajouter mode auto-play basé sur le dernier scan

### Phase 2 — B2B complet (Groupe B)
7. **Dashboard RH** : 5 KPIs cards avec sparklines, données depuis `gam_weekly_org`
8. **Rapports** : Templates mensuels avec 4 sections (synthèse, tendances, alertes, recommandations) + export PDF
9. **Alertes RH** : Panneau admin pour configurer seuils (stress > 7, sommeil < 5h, etc.)

### Phase 3 — Modules transversaux (Groupe C)
10. **Parc émotionnel** : Connecter zones aux résultats scan
11. **Méditation** : 6 sessions guidées textuelles avec gong/timer
12. **Récits thérapeutiques** : 8 récits prédéfinis (relaxation, résilience, gratitude, etc.)
13. **i18n** : Compléter EN avec toutes les clés FR

### Phase 4 — Infrastructure manquante
14. **Notifications réelles** : Connecter Supabase Realtime pour notifications in-app
15. **PWA offline** : Étendre le cache du service worker aux pages respiration et journal
16. **Accessibilité** : Passe aria-label sur les hubs créés récemment

### Phase 5 — Mise à jour ModulesDashboard
17. Passer tous les modules complétés de "partial" à "complete"
18. Score cible : 100% complete (26/26)

---

## Détails techniques

- Toutes les données audio/méditation utilisent des URLs Supabase Storage ou des timers Web Audio API (pas de fichiers locaux lourds)
- Les traductions EN réutilisent la structure exacte du fichier FR avec substitution des valeurs
- Les exports PDF utilisent `window.print()` avec CSS `@media print` (déjà en place dans `print-b2b.css`)
- Les notifications in-app utilisent Supabase Realtime `postgres_changes` sur une table `notifications`
- Les KPIs B2B agrègent les données anonymisées depuis les tables `emotion_scan_results` et `gam_weekly_org`
- Le service worker étendu pré-cache les protocoles respiration (données JSON statiques, pas de réseau requis)

