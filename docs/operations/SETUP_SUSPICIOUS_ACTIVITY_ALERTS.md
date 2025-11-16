# 🚨 Configuration des Alertes d'Activité Suspecte

## Vue d'ensemble

Système d'alertes automatiques qui détecte les activités suspectes liées aux changements de rôles et envoie des emails aux administrateurs.

---

## 🎯 Fonctionnalités

### Détection Automatique
- ✅ Surveille les changements de rôles en temps réel
- ✅ Détecte plus de 10 ajouts de rôles premium en 1 heure
- ✅ Détecte plus de 10 suppressions de rôles premium en 1 heure
- ✅ Analyse les logs d'audit automatiquement

### Notifications Email
- ✅ Envoi automatique aux super-admins
- ✅ Détails complets de l'activité suspecte
- ✅ Recommandations d'actions
- ✅ Template HTML professionnel

---

## 📁 Architecture

### Edge Function : `check-suspicious-role-changes`
**Emplacement** : `supabase/functions/check-suspicious-role-changes/index.ts`

**Responsabilités** :
- Analyse des logs d'audit de la dernière heure
- Détection des patterns suspects
- Récupération des emails admin
- Envoi des alertes via Resend

**Variables d'environnement requises** :
```bash
RESEND_API_KEY=re_xxx        # Clé API Resend
FROM_EMAIL=noreply@...       # Email expéditeur
SUPABASE_URL=https://...     # URL Supabase (auto)
SUPABASE_SERVICE_ROLE_KEY=   # Clé service (auto)
```

---

## 🔧 Configuration Cron

Pour activer la surveillance automatique, configurez un cron job :

```sql
-- Exécuter toutes les heures
SELECT cron.schedule(
  'check-suspicious-role-changes',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/check-suspicious-role-changes',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU"}'::jsonb
  ) AS request_id;
  $$
);
```

### Configuration manuelle

1. **Activer les extensions** (si pas déjà fait) :
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

2. **Créer le cron job** avec la commande ci-dessus

3. **Vérifier le statut** :
```sql
SELECT * FROM cron.job WHERE jobname = 'check-suspicious-role-changes';
```

---

## 📊 Dashboard de Statistiques

### Service : `auditStatsService.ts`
**Emplacement** : `src/services/auditStatsService.ts`

**Fonctions exposées** :
```typescript
getAuditStats(): Promise<AuditStats>
```

**Données retournées** :
- `weeklyEvolution` : Évolution sur 8 semaines (ajouts, suppressions, modifications)
- `topAdmins` : Top 5 admins les plus actifs (30 jours)
- `actionDistribution` : Répartition des actions (30 jours)
- `totalChanges` : Total des changements (30 jours)

### Composant : `AuditStatsDashboard`
**Emplacement** : `src/components/admin/AuditStatsDashboard.tsx`

**Graphiques Chart.js** :
1. **Line Chart** : Évolution hebdomadaire des changements
2. **Bar Chart** : Top 5 admins actifs
3. **Doughnut Chart** : Répartition des actions

**KPIs affichés** :
- Total changements (30 jours)
- Nombre d'admins actifs
- Tendance de la semaine en cours

---

## 🎨 Intégration UI

### Onglet Statistiques
Accessible depuis **Administration > Gestion des Rôles > Statistiques**

Le dashboard est intégré dans `UserRolesManager.tsx` avec 3 onglets :
1. **Utilisateurs** : Gestion des rôles
2. **Historique d'audit** : Logs détaillés
3. **Statistiques** : Dashboard visuel (nouveau)

---

## 📧 Format des Emails d'Alerte

### Sujet
```
🚨 Alerte Sécurité - Activité Suspecte Détectée
```

### Contenu
- Titre avec emoji d'alerte
- Détails de chaque activité suspecte :
  - Type d'action
  - Nombre d'occurrences
  - Période concernée
- Actions recommandées :
  - Vérifier les logs d'audit
  - Contacter les admins concernés
  - Vérifier l'intégrité des données

### Destinataires
Tous les utilisateurs ayant le rôle `admin` dans la table `user_roles`

---

## 🔍 Tests et Monitoring

### Test Manuel de l'Edge Function
```bash
curl -X POST \
  https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/check-suspicious-role-changes \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### Vérification des Logs
- **Edge Function Logs** : Dashboard Supabase > Functions > check-suspicious-role-changes > Logs
- **Email Logs** : Table `email_logs` (si configurée)

### Simulation d'Activité Suspecte (Dev)
```sql
-- Créer 11 ajouts de rôles premium
DO $$
BEGIN
  FOR i IN 1..11 LOOP
    INSERT INTO user_roles (user_id, role)
    VALUES (gen_random_uuid(), 'premium')
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
```

Puis appeler manuellement l'edge function pour tester l'alerte.

---

## 📈 Métriques de Performance

### Dashboard
- Rafraîchissement automatique : **5 minutes**
- Période d'analyse : **30 jours** (actions) / **8 semaines** (évolution)
- Top admins : **Top 5**

### Edge Function
- Fréquence d'exécution : **1 fois par heure** (configurable)
- Fenêtre d'analyse : **60 minutes**
- Seuil d'alerte : **> 10 changements premium**

---

## 🔐 Sécurité

### Permissions Requises
- Edge function utilise `SUPABASE_SERVICE_ROLE_KEY` pour accéder aux données auth
- RLS policies actives sur `role_audit_logs` et `user_roles`
- Emails envoyés uniquement aux admins confirmés

### Bonnes Pratiques
- ✅ Vérifier régulièrement les logs d'alerte
- ✅ Investiguer toute alerte déclenchée
- ✅ Ajuster les seuils si trop d'alertes
- ✅ Surveiller les emails de spam/bounces

---

## 🚀 Utilisation

### Consultation des Statistiques
1. Connectez-vous en tant qu'admin
2. Navigation : **Administration > Gestion des Rôles**
3. Onglet **Statistiques**
4. Visualiser les graphiques et KPIs

### Réception des Alertes
1. Les alertes sont envoyées automatiquement
2. Vérifier votre boîte email admin
3. Consulter les logs d'audit pour détails
4. Prendre les actions recommandées

### Personnalisation des Seuils
Modifier dans `check-suspicious-role-changes/index.ts` :
```typescript
// Ligne ~40-50
if (premiumAdds.length > 10) {  // Changer le seuil ici
  alerts.push({...});
}
```

---

## 📝 Changelog

### Version 1.0 (Initial)
- ✅ Edge function de détection
- ✅ Envoi d'emails via Resend
- ✅ Dashboard de statistiques
- ✅ Graphiques Chart.js (Line, Bar, Doughnut)
- ✅ Intégration dans UserRolesManager
- ✅ Configuration cron recommandée

---

## 🆘 Dépannage

### Aucune alerte reçue
- Vérifier que le cron job est actif
- Vérifier les logs de l'edge function
- Vérifier que RESEND_API_KEY est configuré
- Vérifier que des admins existent dans user_roles

### Emails non reçus
- Vérifier le domaine d'envoi dans Resend
- Vérifier les spams
- Consulter les logs Resend
- Vérifier FROM_EMAIL est validé

### Graphiques vides
- Vérifier qu'il y a des logs dans role_audit_logs
- Vérifier la période (30 derniers jours)
- Consulter la console navigateur pour erreurs
- Vérifier les permissions RLS

---

## 📚 Liens Utiles

- **Supabase Edge Functions** : https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions
- **Supabase Cron Jobs** : https://supabase.com/docs/guides/database/extensions/pg_cron
- **Resend Dashboard** : https://resend.com/emails
- **Chart.js Docs** : https://www.chartjs.org/docs/
