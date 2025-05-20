# Point 17 - Audit de la stratégie de communication immersive

Ce document analyse la mise en oeuvre actuelle de la communication (notifications, chat et intégrations API) dans le projet **EmotionsCare**. Il identifie les points forts et les lacunes, puis propose des améliorations premium centrées sur la structure métier et la conformité RGPD.

## 1. Centralisation des endpoints et typage

- Les appels aux principales APIs sont regroupés dans `src/services/index.ts` qui expose `openai`, `musicGen`, `whisper`, `humeAI`, `dalle` et `innovation`.
- Les options de génération et les paramètres API sont strictement typés dans les services comme `openai.ts`.
- Les notifications sont gérées via `src/lib/notifications.ts` avec des méthodes `addNotification`, `getNotifications`, `getUnreadCount` et `markAsRead`. Les fonctions Supabase `add-notification`, `get-notifications`, etc., sont appelées via `supabase.functions.invoke`.

## 2. Modularité et extensibilité

- Un `NotificationService` simplifié permet d'ajouter de nouveaux canaux via des appels Supabase, mais il n'existe pas encore d'interface commune pour d'autres médias (email, SMS, push).
- Les actions du coach utilisent un registre d'handlers (`action-handler-registry.ts`) permettant d'étendre les types d'événements à notifier.
- Les services API sont instanciés dans `APIServices` ce qui facilite l'ajout d'autres intégrations.

## 3. Logs et monitoring

- Le hook `useLogger` fournit un système de logs contextualisés avec différents niveaux et stockage du niveau en localStorage.
- Sentry est initialisé dans `src/monitoring.ts` si la variable `NEXT_PUBLIC_SENTRY_DSN` est définie.
- Les notifications et les activités enregistrent uniquement des logs console ; il n'existe pas encore de traçabilité complète avec `correlationId` ou `eventId`.

## 4. Sécurité et conformité RGPD

- Les clés d'accès sont centralisées via `src/env.mjs` qui valide la présence des variables critiques et alerte via Sentry en cas de manquant.
- Les notifications stockent potentiellement un `userId` mais aucun mécanisme de purge ou d'export n'est prévu en cas de demande RGPD.
- Les messages de chat et les logs d'activité sont simulés et ne disposent pas de politique d'effacement ou d'anonymisation.

## 5. Résilience et scalabilité

- Aucun mécanisme de retry ou de `dead letter queue` n'est implémenté pour les appels Supabase ou les intégrations externes.
- Les notifications en temps réel sont simulées localement (`useNotifications.tsx`) sans websocket ou file de messages.

## 6. Testabilité

- Les services et hooks ne sont pas systématiquement couverts par des tests unitaires. La commande `npm run test` est prévue mais peu de tests existent.

## 7. Propositions d'amélioration premium

1. **Service unifié de communication**
   - Créer un `communicationService` regroupant `sendEmail`, `sendPush`, `sendWebhook` et `sendInAppNotification` avec une interface unique. Chaque méthode utiliserait un provider spécifique (SMTP, FCM, Supabase, etc.).
   - Prévoir un système de plugins pour intégrer facilement de nouveaux canaux (WhatsApp, Discord, SMS…).

2. **Gestion des échecs et file d'attente**
   - Intégrer une file (Redis, RabbitMQ ou Supabase Realtime) pour mettre en file les notifications et permettre des retries automatiques.
   - Ajouter une `dead letter queue` pour investiguer les échecs répétés.

3. **Traçabilité et logs d'audit**
   - Associer un `correlationId` à chaque envoi pour tracer le parcours complet d'un message. Les logs devraient être stockés dans Supabase ou un backend dédié.
   - Enrichir `useLogger` pour envoyer les erreurs critiques vers Sentry avec contexte (user, action, payload anonymisé).

4. **Conformité RGPD**
   - Conserver un historique des consentements et proposer une API pour l'export ou l'effacement des notifications d'un utilisateur.
   - Éviter toute donnée sensible (email, contenu personnel) dans les logs. Prévoir un chiffrement ou un masquage avant journalisation.

5. **Monitoring et tableau de bord**
   - Mettre en place un dashboard technique affichant taux de succès, temps de réponse, et volume de messages par canal.
   - Déclencher des alertes (Sentry, Slack) en cas de dépassement de seuils d'erreur ou d'indisponibilité d'un provider.

6. **Automatisation et campagnes**
   - Prévoir un système de tâches planifiées (cron/worker) pour envoyer des rapports ou rappels récurrents via le `communicationService`.

7. **Tests et CI**
   - Écrire des tests unitaires simulant les appels au `communicationService` et aux webhooks externes.
   - Intégrer `npm run lint`, `npm run type-check` et `npm run test` dans la CI pour garantir la qualité.

---

Cette analyse sert de base pour améliorer la **stratégie de communication immersive** d'EmotionsCare. Les suggestions ci-dessus renforcent la modularité, la conformité RGPD et la résilience du système de notifications et d'échanges avec les utilisateurs.
