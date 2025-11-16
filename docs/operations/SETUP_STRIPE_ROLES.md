# Configuration Stripe + Gestion des Rôles Premium

## Vue d'ensemble

Ce système permet :
1. **Attribution automatique du rôle premium** après paiement Stripe
2. **Retrait automatique du rôle** en cas d'annulation d'abonnement
3. **Interface admin complète** pour gérer manuellement les rôles utilisateurs

---

## 1. Configuration Stripe Webhook

### Étape 1 : Déployer la fonction webhook

La fonction `stripe-webhook` est déjà créée dans `supabase/functions/stripe-webhook/`.

Déployez-la :
```bash
supabase functions deploy stripe-webhook
```

### Étape 2 : Configurer le webhook dans Stripe

1. Allez sur [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur **"Add endpoint"**
3. URL de l'endpoint :
   ```
   https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/stripe-webhook
   ```
4. Sélectionnez ces événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Cliquez sur **"Add endpoint"**

### Étape 3 : Récupérer le signing secret

Après la création du webhook, Stripe affiche un **Signing secret** (commence par `whsec_...`).

### Étape 4 : Ajouter la clé dans Supabase

```bash
# Via CLI
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici

# Ou via Dashboard
# Allez dans Project Settings > Edge Functions > Secrets
# Ajoutez STRIPE_WEBHOOK_SECRET
```

### Étape 5 : Vérifier que STRIPE_SECRET_KEY est configurée

```bash
# Vérifier
supabase secrets list

# Si manquante, ajouter
supabase secrets set STRIPE_SECRET_KEY=sk_test_votre_cle_ici
```

---

## 2. Fonctionnement des webhooks

### Événements gérés

#### `checkout.session.completed`
- Déclenché quand un utilisateur termine un paiement
- **Action** : Attribue le rôle `premium` à l'utilisateur via `user_id` dans les métadonnées

#### `customer.subscription.created` / `customer.subscription.updated`
- Déclenché lors de la création/mise à jour d'un abonnement
- **Action** : Si statut = `active`, attribue le rôle `premium`

#### `customer.subscription.deleted`
- Déclenché lors de l'annulation d'un abonnement
- **Action** : Retire le rôle `premium` de l'utilisateur

### Flux technique

```
Stripe Event → Webhook → Supabase Function → user_roles table
                                           → Trigger set_queue_priority
                                           → music_generation_queue.priority mis à jour
```

---

## 3. Interface Admin de Gestion des Rôles

### Accès

**URL** : `/admin/user-roles`

**Protection** : Rôle `manager` ou `admin` requis

### Fonctionnalités

#### Tableau des utilisateurs
- Email, rôles actuels, date d'inscription
- Badges visuels (Admin = rouge, Moderator = violet, Premium = or)
- Sélection multiple avec checkbox

#### Recherche
- Recherche par email ou rôle
- Filtrage en temps réel

#### Actions individuelles
- **Ajouter un rôle** : Menu déroulant pour assigner `premium`, `moderator` ou `admin`
- **Retirer un rôle** : Menu déroulant listant les rôles actuels

#### Actions en masse
1. Sélectionner plusieurs utilisateurs (checkbox)
2. Choisir le rôle dans le dropdown
3. Cliquer sur **"Ajouter"** ou **"Retirer"**
4. Confirmer l'action dans le dialog

#### Statistiques
- Total utilisateurs
- Nombre de Premium
- Nombre de Modérateurs
- Nombre d'Admins

---

## 4. Hiérarchie des rôles

```
admin (100) > moderator (75) > premium (50) > user (0)
```

### Priorités dans la queue musicale

- **Admin** : priorité 100 (traitement immédiat)
- **Moderator** : priorité 75
- **Premium** : priorité 50
- **User** : priorité 0 (traitement standard)

---

## 5. Tests

### Tester l'attribution automatique

1. Créer une session de paiement via `/app/premium`
2. Compléter le paiement en mode test Stripe
3. Vérifier que le rôle `premium` est ajouté dans `/admin/user-roles`
4. Tester la création d'une musique → vérifier que la priorité = 50

### Tester le retrait automatique

1. Depuis le [Stripe Dashboard](https://dashboard.stripe.com/subscriptions), annuler un abonnement
2. Vérifier que le rôle `premium` est retiré automatiquement
3. Tester la création d'une musique → vérifier que la priorité = 0

### Tester l'interface admin

1. Se connecter en tant qu'admin/manager
2. Aller sur `/admin/user-roles`
3. Rechercher un utilisateur
4. Ajouter le rôle `premium` manuellement
5. Vérifier dans la base de données :
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'xxx';
   ```

---

## 6. Logs et Debugging

### Vérifier les logs du webhook

```bash
supabase functions logs stripe-webhook
```

### Vérifier les événements Stripe

Dans le [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks), cliquez sur l'endpoint pour voir :
- Les événements reçus
- Les réponses (200, 400, 500)
- Les erreurs éventuelles

### Requêtes SQL utiles

```sql
-- Vérifier les rôles d'un utilisateur
SELECT u.email, ur.role, ur.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'test@example.com';

-- Compter les utilisateurs premium
SELECT COUNT(DISTINCT user_id) 
FROM user_roles 
WHERE role = 'premium';

-- Voir les items de queue avec priorité
SELECT u.email, mq.prompt, mq.priority, mq.status
FROM music_generation_queue mq
JOIN auth.users u ON mq.user_id = u.id
ORDER BY mq.priority DESC, mq.created_at ASC;
```

---

## 7. Sécurité

### RLS (Row Level Security)

La table `user_roles` a des politiques RLS strictes :
- **Lecture** : Tous les utilisateurs authentifiés peuvent voir leurs propres rôles
- **Écriture/Suppression** : Uniquement via les fonctions sécurisées ou les admins

### Service Role Key

Le webhook utilise `SUPABASE_SERVICE_ROLE_KEY` pour :
- Lister tous les utilisateurs (`auth.admin.listUsers()`)
- Modifier la table `user_roles` sans restrictions RLS

⚠️ **Ne jamais exposer cette clé côté client**

---

## 8. Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Stripe                           │
│  (Paiement/Annulation) → Webhook Event              │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│        Supabase Edge Function: stripe-webhook       │
│  - Vérifie signature                                │
│  - Trouve user_id via email                         │
│  - INSERT/DELETE dans user_roles                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Table: user_roles                      │
│  - Trigger: set_queue_priority                      │
│  - Met à jour priority dans music_generation_queue  │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│       Worker: music-queue-worker                    │
│  - Tri par priority DESC, created_at ASC            │
│  - Traitement prioritaire des premium/admins        │
└─────────────────────────────────────────────────────┘
```

---

## 9. Navigation Admin

Pour accéder facilement aux différents panneaux admin :

```typescript
import { routes } from '@/lib/routes';

// Gestion de la queue musicale
routes.b2bRoutes.admin.musicQueue() // → /admin/music-queue

// Métriques et analytics
routes.b2bRoutes.admin.musicMetrics() // → /admin/music-metrics

// Gestion des rôles utilisateurs
routes.b2bRoutes.admin.userRoles() // → /admin/user-roles
```

---

## Prochaines étapes suggérées

1. **Ajouter un lien vers `/admin/user-roles`** dans le menu admin
2. **Créer des notifications** pour les admins lors de l'attribution/retrait de rôles
3. **Exporter CSV** de la liste des utilisateurs premium
4. **Audit log** des changements de rôles (qui a changé quoi et quand)
