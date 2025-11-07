# Guide du Système d'Alertes RGPD

## Vue d'ensemble

Le système d'alertes RGPD d'EmotionsCare détecte automatiquement les anomalies et situations urgentes liées à la gestion des données personnelles. Il notifie les administrateurs en temps réel via le tableau de bord.

## Types d'alertes

### 1. **Export Urgent** (`export_urgent`)
- **Sévérité**: Critical
- **Déclencheur**: Demande d'export de données marquée comme urgente
- **Action requise**: Traiter la demande dans les 72h (délai RGPD)

### 2. **Suppression Urgente** (`deletion_urgent`)
- **Sévérité**: Critical
- **Déclencheur**: Demande de suppression de données marquée comme urgente
- **Action requise**: Traiter la demande dans les 30 jours (délai RGPD)

### 3. **Anomalie de Consentements** (`consent_anomaly`)
- **Sévérité**: Warning
- **Déclencheur**: Taux de refus de consentements > 70% sur 24h
- **Action requise**: Analyser la cause des refus (problème UX, clarté du texte, etc.)

### 4. **Demandes Multiples** (`multiple_requests`)
- **Sévérité**: Warning
- **Déclencheur**: 
  - Plus de 3 demandes d'export en 24h
  - Plus de 2 demandes de suppression en 24h
- **Action requise**: Vérifier si c'est un comportement légitime ou suspect

### 5. **Activité Suspecte** (`suspicious_activity`)
- **Sévérité**: Critical
- **Déclencheur**: Patterns inhabituels (suppressions répétées, etc.)
- **Action requise**: Investigation immédiate

## Utilisation du système

### Déclencher la détection manuellement

```typescript
import { triggerGDPRAlertDetection } from '@/lib/gdpr-alerts';

// Lors d'une demande d'export
await triggerGDPRAlertDetection('export', userId, {
  urgent: true,
  reason: 'Demande expresse du DPO'
});

// Lors d'une demande de suppression
await triggerGDPRAlertDetection('deletion', userId, {
  urgent: false
});

// Lors d'un changement de consentement
await triggerGDPRAlertDetection('consent', userId);
```

### Intégration dans les edge functions existantes

#### gdpr-data-export/index.ts
```typescript
// Après création de la demande d'export
const { error: exportError } = await supabase
  .from('data_export_requests')
  .insert({ user_id: userId, status: 'pending' });

if (!exportError) {
  // Déclencher la détection d'alertes
  await supabase.functions.invoke('gdpr-alert-detector', {
    body: { 
      type: 'export', 
      userId,
      metadata: { urgent: isUrgent }
    }
  });
}
```

#### gdpr-data-deletion/index.ts
```typescript
// Après enregistrement de la demande de suppression
await supabase.functions.invoke('gdpr-alert-detector', {
  body: { 
    type: 'deletion', 
    userId,
    metadata: { urgent: isUrgent }
  }
});
```

### Détection automatique

Le système détecte automatiquement certaines anomalies via des triggers SQL :

- **Anomalies de consentements** : Trigger sur `user_consents` qui analyse les taux de refus
- **Demandes multiples** : Analysé par l'edge function lors de chaque demande

## Résolution des alertes

### Via l'interface utilisateur

Les administrateurs peuvent résoudre les alertes directement depuis le tableau de bord RGPD :
1. Accéder à `/gdpr-monitoring`
2. Onglet "Alertes"
3. Cliquer sur "Résoudre" pour chaque alerte traitée

### Programmatiquement

```typescript
import { resolveGDPRAlert } from '@/lib/gdpr-alerts';

await resolveGDPRAlert(alertId);
```

## Notifications en temps réel

Le composant `GDPRAlerts` utilise Supabase Realtime pour afficher les nouvelles alertes instantanément :

```typescript
// Écoute automatique des nouvelles alertes
const channel = supabase
  .channel('gdpr-alerts-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'gdpr_alerts',
  }, (payload) => {
    // Notification toast automatique
    toast.warning(`Nouvelle alerte: ${payload.new.title}`);
  })
  .subscribe();
```

## Sécurité et permissions

- **RLS activé** : Seuls les admins peuvent voir et résoudre les alertes
- **Audit trail** : Chaque résolution est tracée (`resolved_by`, `resolved_at`)
- **Métadonnées protégées** : Les données sensibles sont stockées en JSONB chiffré

## Exemple de workflow complet

```typescript
// 1. Utilisateur demande un export urgent
const requestExport = async () => {
  const { data } = await supabase
    .from('data_export_requests')
    .insert({
      user_id: currentUser.id,
      status: 'pending',
      urgent: true
    })
    .select()
    .single();

  // 2. Déclencher la détection d'alertes
  await triggerGDPRAlertDetection('export', currentUser.id, {
    urgent: true,
    reason: 'Demande utilisateur'
  });
};

// 3. Admin reçoit notification en temps réel
// 4. Admin traite la demande
// 5. Admin résout l'alerte
await resolveGDPRAlert(alertId);
```

## Monitoring et métriques

Le tableau de bord RGPD affiche :
- Nombre d'alertes actives par type
- Historique des alertes résolues
- Temps moyen de résolution
- Alertes critiques vs warnings

## Bonnes pratiques

1. **Traiter les alertes critiques en priorité** : < 24h
2. **Analyser les patterns** : Si beaucoup d'alertes similaires, problème systémique
3. **Documenter les résolutions** : Ajouter des notes dans les métadonnées
4. **Review hebdomadaire** : Analyser les tendances et améliorer le système

## Maintenance

### Nettoyage des anciennes alertes

```sql
-- Supprimer les alertes résolues > 6 mois
DELETE FROM gdpr_alerts 
WHERE resolved = true 
AND resolved_at < NOW() - INTERVAL '6 months';
```

### Ajuster les seuils de détection

Modifier la fonction SQL `detect_consent_anomaly()` :
```sql
-- Modifier le seuil de 70% à 60%
IF denial_rate > 60 THEN
  -- Créer alerte
END IF;
```

## Troubleshooting

### Les alertes ne s'affichent pas
- Vérifier que l'utilisateur a le rôle `admin`
- Vérifier les RLS policies sur `gdpr_alerts`
- Consulter les logs de l'edge function `gdpr-alert-detector`

### Faux positifs
- Ajuster les seuils de détection
- Ajouter des exceptions pour certains utilisateurs (ex: tests)
- Améliorer la logique de détection d'anomalies

### Performance
- Les indexes sont créés automatiquement
- Limiter le nombre d'alertes actives à 50 max
- Archiver les anciennes alertes régulièrement
