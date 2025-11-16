# Configuration de la Queue Musicale

## Vue d'ensemble

Le système de file d'attente pour la génération musicale permet de gérer les demandes lorsque l'API Suno est surchargée ou indisponible. Les demandes sont automatiquement mises en queue et traitées dès que le service redevient disponible.

**✨ Nouveauté : Notifications en temps réel** - Les utilisateurs reçoivent maintenant des notifications instantanées via WebSocket quand leur génération musicale est terminée !

## Architecture

### Composants

1. **Tables Supabase** :
   - `music_generation_queue` : Stocke toutes les demandes de génération
   - `suno_api_status` : Suit le statut de l'API Suno en temps réel

2. **Edge Functions** :
   - `emotion-music-ai` : Point d'entrée principal, ajoute à la queue si nécessaire
   - `music-queue-worker` : Traite les demandes en attente (max 5 à la fois)
   - `suno-status-check` : Vérifie périodiquement le statut de l'API Suno

3. **Frontend** :
   - `SunoServiceStatus` : Indicateur visuel du statut de l'API
   - `MusicQueueAdmin` : Panneau d'administration complet à `/admin/music-queue`
   - `useMusicQueueNotifications` : Hook pour notifications en temps réel

4. **Notifications en Temps Réel** :
   - Utilise **Supabase Realtime** (WebSocket)
   - Les utilisateurs sont notifiés instantanément quand :
     - Leur génération est ajoutée à la queue
     - Le traitement commence
     - La génération est terminée avec succès
     - Une erreur survient

## Installation

### 1. Activer le Cron Job

Le worker de la queue doit être exécuté automatiquement toutes les minutes. Pour cela :

1. Allez dans **Supabase Dashboard** > **SQL Editor**
2. Exécutez le script `database/sql/SETUP_MUSIC_QUEUE_CRON.sql`
3. Vérifiez que le job est créé :

```sql
SELECT * FROM cron.job WHERE jobname = 'music-queue-worker-every-minute';
```

### 2. Accéder au Panneau d'Administration

Le panneau d'administration est accessible à l'URL : **`/admin/music-queue`**

**Protection** : Cette route est protégée par authentification et nécessite le rôle `manager` ou `admin`.

### 3. Notifications en Temps Réel

Les notifications sont **automatiquement activées** pour tous les utilisateurs connectés. Elles utilisent Supabase Realtime pour envoyer des mises à jour instantanées via WebSocket.

**Aucune configuration supplémentaire n'est nécessaire** - le système est prêt à l'emploi !

## Fonctionnement

### Flux Normal

1. Un utilisateur demande une génération musicale
2. Si l'API Suno est disponible, génération immédiate
3. Si l'API Suno est indisponible (503, 502, etc.), ajout à la queue
   - 🔔 **Notification** : "Demande ajoutée à la file"
4. Le cron job exécute le worker toutes les minutes
5. Le worker traite jusqu'à 5 demandes en attente
   - 🔔 **Notification** : "Génération en cours..."
6. Rate limiting : 2 secondes entre chaque génération
7. Quand terminé :
   - 🎵 **Notification** : "Votre musique est prête !" avec bouton "Écouter"

### Notifications en Temps Réel

Le système envoie 4 types de notifications :

1. **Ajout à la queue** (toast info, 4s) :
   ```
   🎼 Demande ajoutée à la file
   Émotion : joie - En attente de traitement
   ```

2. **Début du traitement** (toast info, 4s) :
   ```
   ⏳ Génération en cours...
   Émotion : joie
   ```

3. **Génération réussie** (toast success, 8s) :
   ```
   🎵 Votre musique est prête !
   Émotion : joie - Intensité : 8
   [Bouton : Écouter]
   ```

4. **Erreur** (toast error, 6s) :
   ```
   ❌ Génération échouée
   Une erreur s'est produite
   [Bouton : Réessayer]
   ```

### Système de Retry

- Chaque demande peut être tentée jusqu'à 3 fois
- En cas d'échec définitif, un fallback propose un morceau existant
- Les administrateurs peuvent relancer manuellement les demandes échouées

### Gestion du Statut

Le système vérifie automatiquement le statut de l'API Suno :
- Toutes les 30 secondes côté frontend
- Avant chaque traitement de la queue
- Indicateur visuel en temps réel pour les utilisateurs

## Panneau d'Administration

### Accès

**URL** : `/admin/music-queue`

**Permissions** : Rôle `manager` ou `admin` requis

### Fonctionnalités

1. **Vue d'ensemble** :
   - Statistiques en temps réel (pending, processing, completed, failed)
   - Statut de l'API Suno avec temps de réponse
   - Taux de réussite sur 24h

2. **Gestion des demandes** :
   - Liste de toutes les demandes avec filtres par statut
   - Détails de chaque demande (émotion, intensité, contexte)
   - Historique complet avec timestamps

3. **Actions disponibles** :
   - Lancer manuellement le worker
   - Relancer une demande échouée
   - Annuler une demande en attente ou en cours

4. **Statistiques de performance** :
   - Taux de réussite global
   - Temps moyen de traitement
   - Détection des pics d'erreur

### Actions Manuelles

#### Lancer le Worker

Utilisez le bouton "Lancer le Worker" pour traiter immédiatement les demandes en attente sans attendre le prochain cycle du cron job.

#### Relancer une Demande

Pour les demandes échouées :
1. Cliquez sur "Relancer" à côté de la demande
2. La demande repasse en statut "pending"
3. Elle sera traitée lors du prochain cycle

#### Annuler une Demande

Pour les demandes en attente ou en cours :
1. Cliquez sur "Annuler" à côté de la demande
2. La demande passe en statut "failed"
3. Message : "Annulé manuellement par un administrateur"

## Monitoring

### Logs du Cron Job

Vérifier l'exécution du cron job :

```sql
SELECT 
  start_time,
  status,
  return_message
FROM cron.job_run_details 
WHERE jobid = (
  SELECT jobid 
  FROM cron.job 
  WHERE jobname = 'music-queue-worker-every-minute'
)
ORDER BY start_time DESC 
LIMIT 20;
```

### Logs des Edge Functions

1. Allez dans **Supabase Dashboard** > **Edge Functions**
2. Sélectionnez `music-queue-worker`
3. Consultez les logs en temps réel

### Logs des Notifications

Les notifications utilisent le système de logging standard :
- Catégorie : `MUSIC_QUEUE`
- Tous les événements WebSocket sont loggés
- Vérifiez la console du navigateur pour le debug

### Métriques Clés

- **Pending** : Nombre de demandes en attente
- **Processing** : Nombre de demandes en cours
- **Success Rate** : Taux de réussite sur 24h
- **Avg Processing Time** : Temps moyen de traitement

## Gestion des Erreurs

### Erreurs Courantes

1. **503 Service Unavailable** :
   - L'API Suno est temporairement indisponible
   - Les demandes sont automatiquement mises en queue
   - Action : Attendre que le service se rétablisse

2. **401 Unauthorized** :
   - Problème de clé API Suno
   - Action : Vérifier et mettre à jour la clé API

3. **Rate Limit** (429) :
   - Trop de requêtes simultanées
   - Le système met automatiquement en queue
   - Action : Aucune, le système gère automatiquement

### Dépannage

#### Le worker ne s'exécute pas

1. Vérifier que le cron job est actif :
```sql
SELECT * FROM cron.job WHERE jobname = 'music-queue-worker-every-minute';
```

2. Vérifier les logs du cron :
```sql
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

3. Lancer manuellement le worker depuis le panneau admin

#### Demandes bloquées en "processing"

Si des demandes restent en statut "processing" trop longtemps :

1. Identifiez-les dans le panneau admin
2. Utilisez le bouton "Annuler"
3. Puis "Relancer" si nécessaire

#### Les notifications ne fonctionnent pas

1. Vérifier que l'utilisateur est connecté
2. Vérifier la console du navigateur pour les erreurs WebSocket
3. Vérifier que Supabase Realtime est activé pour la table :
```sql
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'music_generation_queue';
```

#### Taux d'échec élevé

Si le taux d'échec dépasse 20% :

1. Vérifiez le statut de l'API Suno
2. Consultez les messages d'erreur dans le panneau admin
3. Vérifiez les logs des Edge Functions
4. Contactez le support Suno si le problème persiste

## Configuration Avancée

### Modifier la Fréquence du Cron

Pour changer la fréquence d'exécution du worker :

1. Désactiver le job actuel :
```sql
SELECT cron.unschedule('music-queue-worker-every-minute');
```

2. Recréer avec la nouvelle fréquence :
```sql
SELECT cron.schedule(
  'music-queue-worker-every-minute',
  '*/5 * * * *', -- Toutes les 5 minutes par exemple
  $$ ... $$
);
```

### Fréquences Recommandées

- **Toutes les minutes** : `* * * * *` (recommandé, équilibre charge/réactivité)
- **Toutes les 2 minutes** : `*/2 * * * *` (charge réduite)
- **Toutes les 5 minutes** : `*/5 * * * *` (charge minimale, moins réactif)

### Ajuster le Rate Limiting

Dans `supabase/functions/music-queue-worker/index.ts`, ligne 111 :

```typescript
await delay(2000); // 2 secondes entre chaque génération
```

Modifiez cette valeur selon vos besoins et les limites de l'API Suno.

### Personnaliser les Notifications

Dans `src/hooks/useMusicQueueNotifications.ts`, vous pouvez personnaliser :
- Les durées d'affichage des toasts
- Les messages de notification
- Les actions des boutons
- Les conditions de déclenchement

## Sécurité

- ✅ Le cron job utilise la clé `anon` (lecture/écriture limitée)
- ✅ Les Edge Functions vérifient les permissions
- ✅ Le panneau admin est protégé par authentification
- ✅ RLS activée sur `music_generation_queue` (filtre par `user_id`)
- ✅ Realtime filtre les événements par `user_id`
- ⚠️ Assurez-vous que les RLS policies sont correctement configurées

## Support

Pour toute question ou problème :

1. Consultez les logs dans Supabase Dashboard
2. Vérifiez le statut de l'API Suno : https://status.suno.ai
3. Consultez la documentation pg_cron : https://supabase.com/docs/guides/database/extensions/pg_cron
4. Consultez la documentation Supabase Realtime : https://supabase.com/docs/guides/realtime

## Prochaines Améliorations

- [x] Notifications en temps réel (WebSocket) pour les demandes terminées ✅
- [x] Route admin protégée pour gérer la queue ✅
- [ ] Export des statistiques en CSV
- [ ] Alertes automatiques si le taux d'échec dépasse un seuil
- [ ] Dashboard de métriques avancées avec graphiques
- [ ] Système de priorité pour les demandes
