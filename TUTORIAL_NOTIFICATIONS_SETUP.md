# Configuration du Tutoriel Interactif et Notifications Automatiques

## 🎓 Tutoriel Interactif

Un tutoriel guidé pas-à-pas a été ajouté au dashboard de monitoring pour former les admins à l'utilisation du chatbot IA, des tests A/B et de la gestion des tickets.

### Accès au Tutoriel

1. Allez sur `/admin/escalation/monitoring`
2. Cliquez sur le bouton **"Tutoriel interactif"** en haut à droite
3. Suivez les 11 étapes guidées avec conseils pratiques

### Contenu du Tutoriel

- **Introduction** au système de monitoring avancé
- **Chatbot IA** : comment poser des questions et interpréter les réponses
- **Tests A/B** : création, analyse et sélection automatique du gagnant
- **Tickets automatiques** : configuration Jira/Linear et assignation intelligente
- **Notifications** : configuration Slack/Discord
- **Meilleures pratiques** : conseils d'utilisation optimale

## 🔔 Notifications Slack/Discord

### Configuration des Webhooks

1. **Créer un webhook dans Slack/Discord** :
   - **Slack** : Settings > Apps > Incoming Webhooks
   - **Discord** : Server Settings > Integrations > Webhooks

2. **Configurer dans EmotionsCare** :
   ```
   Aller à : /admin/escalation/webhooks
   Cliquer : "Nouveau Webhook"
   Remplir :
   - Nom : "Production Alerts"
   - Type : Slack ou Discord
   - URL : coller l'URL du webhook
   - Canal : #alerts (optionnel)
   - Événements : sélectionner les notifications désirées
   ```

### Événements Notifiés

- ✅ **Test A/B significatif** : quand un test atteint la significativité statistique
- 🎫 **Ticket créé automatiquement** : création d'un ticket Jira/Linear
- 🚨 **Alerte critique** : détection d'une erreur critique
- ⚠️ **Escalade niveau élevé** : escalade importante d'une alerte

### Format des Notifications

**Slack** :
- Blocs formatés avec emojis
- Champs structurés (métadonnées)
- Support des couleurs et styles

**Discord** :
- Embeds avec couleurs selon la sévérité
- Champs inline pour les métadonnées
- Timestamp automatique

### Intégration Automatique

Les notifications sont envoyées automatiquement par :

1. **ab-test-manager** : lors de la significativité d'un test A/B
2. **create-ticket** : lors de la création automatique d'un ticket

Pas besoin de configuration supplémentaire, l'intégration est transparente.

## 🧪 Exemple de Notification Test A/B

```json
{
  "title": "Test A/B Significatif: Optimisation Délais",
  "message": "Le test a atteint la significativité. Le variant montre une amélioration de 12.5%",
  "data": {
    "Test": "Optimisation Délais",
    "Gagnant": "variant",
    "Amélioration": "12.5%",
    "Taux contrôle": "75.2%",
    "Taux variant": "87.7%"
  }
}
```

## 🎫 Exemple de Notification Ticket

```json
{
  "title": "Ticket Créé Automatiquement",
  "message": "Un ticket a été créé dans JIRA pour l'alerte: TypeError in payment processor",
  "data": {
    "Ticket ID": "PROJ-123",
    "Assigné à": "john.doe@company.com",
    "Raison": "Expert en paiements (85% confiance)",
    "Intégration": "Jira Production",
    "URL": "https://company.atlassian.net/browse/PROJ-123"
  }
}
```

## 🔍 Vérification

Pour tester les notifications :

1. Créer un webhook de test
2. Lancer une analyse ML ou créer un ticket
3. Vérifier la réception dans Slack/Discord
4. Ajuster les événements si nécessaire

---

**Note** : Les webhooks inactifs ne reçoivent pas de notifications. Assurez-vous que le toggle "Webhook actif" est activé.
