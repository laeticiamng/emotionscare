# 🔔 Configuration des Notifications Push Navigateur

## Vue d'ensemble

Le système de notifications push permet d'alerter les admins instantanément sur les événements critiques, même lorsque le navigateur est en arrière-plan.

## Événements Notifiés

- 🎯 **Tests A/B significatifs** : Quand un test atteint la significativité statistique
- 🚨 **Alertes critiques** : Détection d'erreurs critiques dans le système
- 🎫 **Tickets créés** : Création automatique de tickets Jira/Linear
- ⚠️ **Escalades élevées** : Escalades importantes nécessitant une attention

## Architecture

### 1. Service Worker (`public/sw.js`)

Le service worker gère :
- Réception des notifications push
- Affichage des notifications natives
- Gestion des clics sur les notifications
- Redirection vers les pages appropriées

**Déjà configuré** : Le service worker est automatiquement enregistré lors de l'activation des notifications.

### 2. Hook React (`src/hooks/usePushNotifications.ts`)

Fournit l'API pour gérer les notifications :
```typescript
const {
  permission,        // 'default' | 'granted' | 'denied'
  isSupported,       // Navigateur supporte les notifications
  isSubscribed,      // Utilisateur abonné aux notifications
  subscribe,         // Activer les notifications
  unsubscribe,       // Désactiver les notifications
  sendTestNotification // Tester les notifications
} = usePushNotifications();
```

### 3. Composant UI (`src/components/monitoring/NotificationSettings.tsx`)

Interface utilisateur pour :
- Demander la permission de notification
- Activer/désactiver les notifications
- Tester les notifications
- Voir les événements notifiés

## Activation des Notifications

### Pour les Admins

1. Aller sur `/admin/escalation/monitoring`
2. Cliquer sur l'onglet **"Notifications"**
3. Activer le toggle **"Activer les notifications push"**
4. Accepter la permission dans la popup du navigateur
5. Tester avec le bouton **"Envoyer une notification de test"**

### Permissions Navigateur

| État | Description | Action |
|------|-------------|--------|
| **Default** | Permission non demandée | Cliquer sur le toggle pour demander |
| **Granted** | ✅ Notifications activées | Fonctionnelles |
| **Denied** | ❌ Notifications refusées | Modifier dans les paramètres du navigateur |

## Intégration Temps Réel

Les notifications sont déclenchées automatiquement via **Supabase Realtime** :

```typescript
// Écoute des mises à jour de tests A/B
supabase
  .channel('ab-test-notifications')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'ab_test_configurations',
    filter: 'status=eq.completed'
  }, (payload) => {
    // Envoi notification si test significatif
  })
  .subscribe();
```

## Navigateurs Supportés

| Navigateur | Support | Notes |
|------------|---------|-------|
| Chrome | ✅ Complet | Recommandé |
| Firefox | ✅ Complet | Recommandé |
| Edge | ✅ Complet | Recommandé |
| Safari | ⚠️ Partiel | Requiert macOS 13+ ou iOS 16.4+ |
| Opera | ✅ Complet | - |

## Comportement

### Notification Affichée

Quand une notification est envoyée :
- 📱 **Badge** avec icône EmotionsCare
- 🔔 **Son** (si autorisé par l'utilisateur)
- 📳 **Vibration** (sur mobile)
- ⏰ **Persistante** : reste affichée jusqu'à action de l'utilisateur

### Actions Disponibles

Chaque notification propose :
1. **Voir** : Ouvre la page concernée
2. **Ignorer** : Ferme la notification

### Clic sur la Notification

- Si une fenêtre avec l'URL est déjà ouverte → Focus sur cette fenêtre
- Sinon → Ouvre une nouvelle fenêtre avec l'URL appropriée

## Données des Notifications

Chaque notification contient :
```typescript
{
  title: string,      // Titre affiché
  body: string,       // Message principal
  icon: string,       // Icône (logo EmotionsCare)
  badge: string,      // Badge notification
  tag: string,        // ID unique pour regroupement
  data: {             // Métadonnées
    type: string,     // Type d'événement
    url: string,      // URL de destination
    ...metadata       // Données contextuelles
  }
}
```

## Stockage des Abonnements

Les abonnements push sont stockés dans la table `push_subscriptions` :
```sql
- user_id: Identifiant utilisateur
- endpoint: URL endpoint push
- p256dh_key: Clé publique
- auth_key: Clé d'authentification
- is_active: Statut de l'abonnement
```

## Dépannage

### Permission Refusée

**Solution** :
1. Cliquer sur l'icône 🔒 dans la barre d'adresse
2. Trouver "Notifications" dans les paramètres du site
3. Changer de "Bloquer" à "Autoriser"
4. Recharger la page

### Notifications Ne S'affichent Pas

**Vérifications** :
- ✅ Permission accordée (`Notification.permission === 'granted'`)
- ✅ Service Worker enregistré
- ✅ Abonnement actif dans la base de données
- ✅ Paramètres système : notifications autorisées pour le navigateur
- ✅ Mode "Ne pas déranger" désactivé (OS)

### Debug Console

Ouvrez la console navigateur (F12) pour voir les logs :
```javascript
// Vérifier le service worker
navigator.serviceWorker.getRegistration()

// Vérifier l'abonnement push
registration.pushManager.getSubscription()

// Vérifier la permission
Notification.permission
```

## Sécurité

- 🔐 **VAPID Key** : Clés publiques/privées pour authentifier les notifications
- 🛡️ **Endpoint unique** : Chaque abonnement a un endpoint unique
- 🔒 **HTTPS requis** : Les notifications push nécessitent HTTPS

## Maintenance

### Nettoyer les Abonnements Inactifs

```sql
-- Désactiver les abonnements de plus de 30 jours sans activité
UPDATE push_subscriptions
SET is_active = false
WHERE last_active < NOW() - INTERVAL '30 days';
```

### Statistiques d'Utilisation

```sql
-- Nombre d'utilisateurs avec notifications actives
SELECT COUNT(DISTINCT user_id) 
FROM push_subscriptions 
WHERE is_active = true;

-- Abonnements par navigateur
SELECT user_agent, COUNT(*) 
FROM push_subscriptions 
WHERE is_active = true
GROUP BY user_agent;
```

## Limites

- **Taux** : Maximum ~100 notifications/jour par utilisateur (recommandation)
- **Taille** : Titre max 65 caractères, corps max 240 caractères
- **Durée** : Notifications non délivrées expirées après 4 semaines
- **iOS Safari** : Limitations spécifiques, nécessite ajout à l'écran d'accueil

## Ressources

- [Web Push API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker Lifecycle](https://web.dev/service-worker-lifecycle/)
- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

---

**Note** : Les notifications push sont une fonctionnalité puissante mais doivent être utilisées avec parcimonie pour ne pas surcharger les utilisateurs. Privilégiez les événements vraiment critiques.
