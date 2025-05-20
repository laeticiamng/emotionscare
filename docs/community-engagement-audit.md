# Audit Technique – Engagement communautaire immersif (point 19)

Ce rapport fait le point sur la logique communautaire d'EmotionsCare et propose des améliorations pour créer un module d'engagement immersif, sécurisé et conforme RGPD.

## 1. Contexte et périmètre

- Trois profils d'utilisateur sont concernés : **B2C**, **B2B User** et **B2B Admin**.
- Les routes principales sont :
  - `/social-cocon`
  - `/groups`
  - `/events`
  - `/b2b/admin/dashboard`
  - `/b2b/user/dashboard`
  - `/b2c/dashboard`
- Les APIs utilisées incluent OpenAI, Supabase et Hume AI.

## 2. Modélisation des entités communautaires

- Centraliser les types `Group`, `Event`, `SocialPost`, `Badge`, `Challenge`, `LeaderboardEntry` et `Notification` dans `src/types/community.ts`.
- Différencier les groupes **public**, **privé** et **entreprise** par un champ `groupType`.
- Ajouter un flag de modération (`canModerate`) pour autoriser certains B2B Users à gérer un groupe.
- Factoriser la création d'événements pour permettre différents formats (atelier, défi, session live).
- Les badges sont rattachés à des actions précises et peuvent être édités par un Admin via une interface future.

## 3. Sécurité et gestion des droits

- Implémenter un middleware RBAC unique pour protéger les routes sensibles (création/suppression de groupe, déclenchement d'événement, gestion des posts).
- Définir des rôles clairs : `b2c_user`, `b2b_user`, `b2b_admin` et `super_admin`.
- Chaque appel d'API doit valider le rôle avant d'exécuter l'action et logguer l'opération.
- Prévoir une table `AccessLog` dans Supabase pour tracer les actions clés.

## 4. Modération et filtrage automatiques

- Utiliser OpenAI pour analyser chaque post et commentaire : détection de toxicité, spam ou incitation.
- Stocker un log de modération typé (`ModerationLog`) avec l'utilisateur, le contenu analysé et la décision.
- Fournir un système de signalement communautaire : `Report` avec workflow d'escalade (auto-ban après N signalements).
- Possibilité d'ajouter des listes noires de mots ou d'URL (à charger depuis Supabase).

## 5. Analytics et leaderboard

- Calculer côté backend les scores de participation (posts, likes, badges obtenus).
- Exposer des endpoints `/api/leaderboard` pour obtenir les classements par groupe ou individu.
- Enregistrer l'évolution du **mood** via Hume AI pour chaque groupe et proposer un indicateur agrégé dans `/b2b/admin/dashboard`.
- Prévoir des exports CSV/JSON des historiques pour analyses externes.

## 6. Notifications et événements

- Centraliser l'envoi de notifications dans `NotificationService`.
- Les notifications incluent : nouveau post, commentaire, badge gagné, invitation à un groupe et rappel d'événement.
- Schéma suggéré pour `Notification` :
  ```ts
  interface Notification {
    id: string;
    userId: string;
    type: 'post' | 'comment' | 'like' | 'badge' | 'event';
    read: boolean;
    payload: Record<string, unknown>;
    createdAt: string;
  }
  ```
- Prévoir un champ `readAt` pour tracer la consultation de la notification.

## 7. Scalabilité, modularité et tests

- Séparer les services `groupService`, `eventService`, `postService`, `notificationService` et `moderationService`.
- Mettre en place une pagination sur les posts et commentaires, avec index sur `createdAt` et `groupId`.
- Tests unitaires recommandés : création de groupe, adhésion, abandon, suppression, participation à un événement, modération d'un post.
- Pour les charges élevées, envisager un cache (Redis ou Supabase Edge functions) sur les leaderboard et notifications.

## 8. Checklist RGPD

- **Consentement explicite** pour la collecte des données communautaires.
- **Droit d'accès et d'export** : endpoint `/api/user/export` qui retourne posts, commentaires et badges de l'utilisateur.
- **Droit à l'effacement** : suppression en cascade des posts et anonymisation dans les statistiques.
- **Limitation de conservation** : archivage ou purge automatique des contenus inactifs (par exemple après 12 mois).
- **Journalisation** : table `AccessLog` et `ModerationLog` accessibles pour audit.

## 9. Suggestions premium Codex

- Interface "no code" pour créer des badges et des challenges personnalisés par les Admins.
- API d'intégration partenaire pour importer des challenges externes ou des événements en marque blanche.
- Module de "community health" analysant en temps réel le feed pour détecter les tendances et anomalies.
- Synchronisation automatique des analytics communautaires vers le dashboard RH.
- Archivage programmé des événements et posts inactifs pour maintenir les performances.
- Support futur d'un système de discussions en thread pour faciliter l'évolutivité des commentaires.
- Simulateur de leaderboard pour tester les différents scénarios de participation en QA.

Ce plan d'amélioration vise à rendre le module communautaire robuste, sécurisé et prêt à évoluer avec les besoins B2C et B2B.
