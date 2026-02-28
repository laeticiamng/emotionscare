# Politique de rétention des données — EmotionsCare

> **Date** : 28/02/2026  
> **Version** : 1.0

---

## 1. Objectif

Définir les durées de conservation des données personnelles et sensibles conformément au RGPD (article 5.1.e — limitation de la conservation).

## 2. Durées de rétention

| Catégorie | Tables concernées | Durée de rétention | Justification |
|-----------|-------------------|-------------------|---------------|
| **Compte utilisateur** | `profiles` | Durée de vie du compte + 30 jours après suppression | Période de grâce pour restauration |
| **Journal émotionnel** | `journal_entries`, `mood_entries` | 2 ans après dernière connexion | Utilité limitée au-delà |
| **Sessions coaching IA** | `ai_coach_sessions`, `ai_chat_messages` | 1 an | Pas de valeur à long terme |
| **Analyses émotionnelles** | `emotion_scans`, `activity_sessions` | 1 an | Données sensibles, minimisation |
| **Gamification** | `achievements`, `activity_streaks` | Durée de vie du compte | Lié à l'expérience utilisateur |
| **Analytics** | `analytics_events` | 90 jours | Anonymisé après 30 jours |
| **Logs d'audit** | `admin_changelog` | 3 ans | Obligation de traçabilité |
| **Exports DSAR** | Fichiers générés | 7 jours après génération | Auto-suppression |

## 3. Mécanismes de purge

### 3.1. Suppression de compte (RGPD Art. 17)
1. L'utilisateur demande la suppression via l'interface
2. Le compte passe en statut `pending_deletion`
3. **Période de grâce : 30 jours** (restauration possible)
4. Après 30 jours : purge définitive de toutes les données associées
5. Confirmation envoyée par email

### 3.2. Purge automatique
- **Prévu** : Job planifié (cron) pour supprimer les données expirées
- **Statut** : ⚠️ À implémenter
- **Fréquence cible** : Hebdomadaire

### 3.3. Anonymisation
- Les `analytics_events` sont anonymisés (suppression `user_id`) après 30 jours
- **Statut** : ⚠️ À implémenter

## 4. Droit à la portabilité (RGPD Art. 20)

- Export disponible via le mécanisme DSAR (Data Subject Access Request)
- Format : JSON structuré
- Inclut : profil, journal, scores, sessions
- Exclut : données dérivées IA (non portables)

## 5. Actions requises

| # | Action | Priorité | Statut |
|---|--------|----------|--------|
| 1 | Implémenter le job de purge automatique | P1 | ⏳ À faire |
| 2 | Ajouter l'anonymisation analytics post-30j | P2 | ⏳ À faire |
| 3 | Documenter la procédure de purge manuelle | P1 | ⏳ À faire |
| 4 | Tester le flow complet suppression → purge | P0 | ✅ Tests existants |
