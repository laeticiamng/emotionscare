# Système d'Audit Log pour les Rôles Utilisateurs

> **📋 Complément** : Voir aussi [SETUP_SUSPICIOUS_ACTIVITY_ALERTS.md](./SETUP_SUSPICIOUS_ACTIVITY_ALERTS.md) pour les alertes automatiques et le dashboard de statistiques.

## Vue d'ensemble

Le système d'audit log enregistre automatiquement tous les changements de rôles dans la table `role_audit_logs`, permettant une traçabilité complète des modifications.

---

## 1. Architecture

### Table `role_audit_logs`

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique du log |
| `user_id` | UUID | ID de l'utilisateur concerné |
| `action` | TEXT | Type d'action : `add`, `remove`, `update` |
| `role` | TEXT | Rôle concerné |
| `old_role` | TEXT | Ancien rôle (si `update` ou `remove`) |
| `new_role` | TEXT | Nouveau rôle (si `update` ou `add`) |
| `changed_by` | UUID | ID de l'utilisateur qui a effectué le changement |
| `changed_at` | TIMESTAMP | Date et heure du changement |
| `metadata` | JSONB | Métadonnées supplémentaires |
| `created_at` | TIMESTAMP | Date de création du log |

### Trigger automatique

Chaque opération sur `user_roles` (INSERT, UPDATE, DELETE) déclenche automatiquement :
1. La fonction `log_role_change()`
2. L'insertion d'un enregistrement dans `role_audit_logs`

```
user_roles (INSERT/UPDATE/DELETE)
    ↓
trigger_audit_role_changes
    ↓
log_role_change()
    ↓
role_audit_logs (INSERT)
```

---

## 2. Fonctionnalités

### 2.1 Enregistrement automatique

Tous les changements sont enregistrés sans intervention :

```sql
-- Exemple : Ajouter un rôle premium
INSERT INTO user_roles (user_id, role) VALUES ('xxx', 'premium');
-- → Crée automatiquement un log avec action='add'

-- Exemple : Retirer un rôle
DELETE FROM user_roles WHERE user_id='xxx' AND role='premium';
-- → Crée automatiquement un log avec action='remove'
```

### 2.2 Visualisation dans l'interface admin

**URL** : `/admin/user-roles` → Onglet "Historique d'audit"

**Fonctionnalités** :
- Affichage de tous les logs d'audit
- **Filtres avancés** :
  - Recherche par email utilisateur
  - Filtrage par action (ajouté, retiré, modifié)
  - Sélection de période (date de début et date de fin)
  - Bouton "Réinitialiser les filtres"
- **Export CSV** avec filtres appliqués
- Pagination (50 résultats par page)
- Actualisation en temps réel (toutes les 30s)
- Affichage de l'email de l'utilisateur et de l'administrateur

**Colonnes affichées** :
- Date (relative : "il y a 5 minutes")
- Utilisateur concerné
- Action (badge coloré)
- Rôle
- Détails (ancien → nouveau)
- Changé par (email ou "Système")

### 2.3 Export CSV

**Bouton** : "Exporter CSV" en haut à droite

**Format du CSV** :
```csv
Date,Email Utilisateur,Action,Rôle,Ancien Rôle,Nouveau Rôle,Modifié Par
2025-01-13 14:30:00,user@example.com,add,premium,-,-,admin@example.com
2025-01-13 15:45:00,user2@example.com,remove,premium,-,-,Système
```

**Fonctionnalités** :
- Respect des filtres actifs (date, action, email)
- Encodage UTF-8 avec BOM (compatible Excel)
- Nom de fichier automatique : `audit-logs_2025-01-13_14-30-00.csv`
- Toast de confirmation avec nombre de logs exportés
- Limitation à 10 000 logs maximum

**Utilisation** :
1. Appliquer les filtres souhaités
2. Cliquer sur "Exporter CSV"
3. Le fichier se télécharge automatiquement
4. Ouvrir avec Excel, Numbers ou LibreOffice

### 2.4 Fonctions SQL disponibles

#### `get_user_role_audit_history(_user_id, _limit)`

Récupère l'historique d'un utilisateur spécifique :

```sql
SELECT * FROM get_user_role_audit_history('user-id-here', 50);
```

**Retourne** :
- `id`, `action`, `role`, `old_role`, `new_role`
- `changed_by_email`, `changed_at`, `metadata`

#### `get_all_role_audit_logs(_limit, _offset)`

Récupère tous les logs (admin uniquement) :

```sql
SELECT * FROM get_all_role_audit_logs(100, 0);
```

**Retourne** :
- `id`, `user_email`, `action`, `role`
- `old_role`, `new_role`, `changed_by_email`, `changed_at`

---

## 3. Cas d'usage pratiques

### 3.1 Audit de conformité RGPD

**Scénario** : Prouver qui a accédé aux données d'un utilisateur spécifique

1. Aller sur `/admin/user-roles` → Onglet "Historique d'audit"
2. Saisir l'email de l'utilisateur dans la recherche
3. Sélectionner la période (ex: dernier trimestre)
4. Cliquer sur "Exporter CSV"
5. Fournir le rapport aux autorités

### 3.2 Détection d'activités suspectes

**Scénario** : Identifier les suppressions massives de rôles

1. Filtrer par action : "Retiré"
2. Sélectionner période : dernières 24h
3. Vérifier si un admin a retiré plus de 10 rôles
4. Si suspect → exporter CSV et investiguer

### 3.3 Rapport mensuel pour la direction

**Scénario** : Statistiques des changements de rôles du mois

1. Sélectionner date de début : 1er du mois
2. Sélectionner date de fin : dernier jour du mois
3. Exporter CSV
4. Analyser dans Excel :
   - Nombre de rôles premium ajoutés
   - Nombre de rôles retirés
   - Admins les plus actifs

### 3.4 Vérification de la conformité Stripe

**Scénario** : S'assurer que les webhooks Stripe fonctionnent

1. Rechercher par email d'un utilisateur qui a payé
2. Vérifier présence d'une ligne :
   - Action : "Ajouté"
   - Rôle : "premium"
   - Modifié par : "Système"
3. Vérifier la date correspond au paiement

---

## 4. Sécurité RLS

### Politiques activées

1. **Lecture personnelle** : Les utilisateurs peuvent voir leurs propres logs
   ```sql
   USING (auth.uid() = user_id)
   ```

2. **Lecture admin** : Les admins/modérateurs peuvent tout voir
   ```sql
   USING (
     EXISTS (
       SELECT 1 FROM user_roles
       WHERE user_id = auth.uid()
       AND role IN ('admin', 'moderator')
     )
   )
   ```

3. **Insertion admin** : Seuls les admins peuvent insérer (via trigger)
   ```sql
   WITH CHECK (
     EXISTS (
       SELECT 1 FROM user_roles
       WHERE user_id = auth.uid()
       AND role IN ('admin', 'moderator')
     )
   )
   ```

---

---

## 5. API d'export programmatique

### Service `roleAuditExportService.ts`

#### `fetchAuditLogsWithFilters(filters, limit)`

Récupère les logs avec filtres :

```typescript
import { fetchAuditLogsWithFilters } from '@/services/roleAuditExportService';

const logs = await fetchAuditLogsWithFilters({
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  action: 'add',
  userEmail: 'user@example.com'
}, 1000);
```

#### `exportAuditLogsToCSV(filters)`

Exporte directement en CSV :

```typescript
import { exportAuditLogsToCSV } from '@/services/roleAuditExportService';

await exportAuditLogsToCSV({
  startDate: new Date('2025-01-01'),
  action: 'remove'
});
// Télécharge automatiquement le CSV
```

#### `getAuditLogsStats(filters)`

Récupère les statistiques :

```typescript
import { getAuditLogsStats } from '@/services/roleAuditExportService';

const stats = await getAuditLogsStats({
  startDate: new Date('2025-01-01')
});

console.log(stats);
// {
//   total: 150,
//   byAction: { add: 100, remove: 50 },
//   byRole: { premium: 120, moderator: 30 },
//   dateRange: { start: '2025-01-01', end: '2025-01-31' }
// }
```

---

## 6. Cas d'usage SQL

### 4.1 Suivre qui a donné le rôle premium

```sql
SELECT 
  u.email as user_email,
  ral.action,
  ral.role,
  admin.email as admin_email,
  ral.changed_at
FROM role_audit_logs ral
JOIN auth.users u ON ral.user_id = u.id
LEFT JOIN auth.users admin ON ral.changed_by = admin.id
WHERE ral.role = 'premium'
  AND ral.action = 'add'
ORDER BY ral.changed_at DESC;
```

### 4.2 Détecter les suppressions massives

```sql
SELECT 
  changed_by,
  COUNT(*) as deletions_count,
  MIN(changed_at) as first_deletion,
  MAX(changed_at) as last_deletion
FROM role_audit_logs
WHERE action = 'remove'
  AND changed_at > NOW() - INTERVAL '1 hour'
GROUP BY changed_by
HAVING COUNT(*) > 10;
```

### 4.3 Historique complet d'un utilisateur

```typescript
import { useUserRoleAuditHistory } from '@/hooks/useRoleAuditLogs';

const UserHistory = ({ userId }: { userId: string }) => {
  const { data: history, isLoading } = useUserRoleAuditHistory(userId, 50);
  
  return (
    <div>
      {history?.map(log => (
        <div key={log.id}>
          {log.action} - {log.role} - {log.changed_by_email}
        </div>
      ))}
    </div>
  );
};
```

---

## 5. Navigation

### Liens ajoutés dans l'interface

1. **AppSidebar** (sidebar B2C/Admin)
   - Section "Administration" (affichée si URL contient `/admin`)
   - Lien "Gestion des Rôles" avec icône Shield

2. **RoleBasedNavigation** (navigation B2B Admin)
   - Section "Outils RH"
   - Lien "Gestion des Rôles" avec description "Attribution rôles"

### Accès direct

```typescript
import { routes } from '@/lib/routes';

// Gestion des rôles (avec onglet historique d'audit)
routes.b2b.admin.userRoles() // → /admin/user-roles
```

---

---

## 7. Métriques et analyses

### Requêtes utiles

**Actions par jour (7 derniers jours)** :
```sql
SELECT 
  DATE(changed_at) as date,
  action,
  COUNT(*) as count
FROM role_audit_logs
WHERE changed_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(changed_at), action
ORDER BY date DESC, action;
```

**Top administrateurs les plus actifs** :
```sql
SELECT 
  u.email,
  COUNT(*) as actions_count,
  COUNT(DISTINCT ral.user_id) as users_affected
FROM role_audit_logs ral
JOIN auth.users u ON ral.changed_by = u.id
WHERE ral.changed_at > NOW() - INTERVAL '30 days'
GROUP BY u.email
ORDER BY actions_count DESC
LIMIT 10;
```

**Rôles les plus modifiés** :
```sql
SELECT 
  role,
  action,
  COUNT(*) as count
FROM role_audit_logs
GROUP BY role, action
ORDER BY count DESC;
```

---

---

## 8. Performance

### Index créés

```sql
-- Index pour rechercher par utilisateur
CREATE INDEX idx_role_audit_logs_user_id ON role_audit_logs(user_id);

-- Index pour rechercher par administrateur
CREATE INDEX idx_role_audit_logs_changed_by ON role_audit_logs(changed_by);

-- Index pour rechercher par date (DESC pour tri récent)
CREATE INDEX idx_role_audit_logs_changed_at ON role_audit_logs(changed_at DESC);

-- Index pour filtrer par action
CREATE INDEX idx_role_audit_logs_action ON role_audit_logs(action);
```

### Estimations

- **INSERT** : ~5ms (via trigger)
- **SELECT (50 logs)** : ~10ms (avec index)
- **SELECT (historique utilisateur)** : ~5ms (index user_id)

---

---

## 9. Maintenance

### Purge des anciens logs (optionnel)

Si vous souhaitez supprimer les logs de plus d'1 an :

```sql
-- À exécuter manuellement ou via cron
DELETE FROM role_audit_logs
WHERE changed_at < NOW() - INTERVAL '1 year';
```

### Export CSV (via l'interface)

L'interface admin permet d'exporter l'historique d'audit en CSV :
- **Bouton "Exporter CSV"** en haut à droite de l'onglet "Historique d'audit"
- **Filtrage avancé** : période, action, email utilisateur
- **Format standardisé** : Compatible Excel, Numbers, LibreOffice
- **Encodage UTF-8** avec BOM pour compatibilité maximale
- **Limite** : 10 000 logs par export

**Workflow recommandé pour audit de conformité** :
1. Sélectionner la période concernée (ex: dernier trimestre)
2. Appliquer les filtres pertinents (ex: action = "remove")
3. Exporter en CSV
4. Analyser dans Excel avec tableaux croisés dynamiques

---

## 10. Webhooks Stripe et Audit

Les changements effectués automatiquement par le webhook Stripe (`stripe-webhook`) sont également enregistrés :

```
Stripe Event → stripe-webhook
    ↓
INSERT/DELETE user_roles
    ↓
trigger_audit_role_changes
    ↓
role_audit_logs (changed_by = NULL → "Système")
```

**Dans l'interface**, ces logs apparaissent avec "Système" dans la colonne "Changé par".

---

## Résumé

✅ **Enregistrement automatique** de tous les changements de rôles  
✅ **Interface admin complète** avec onglet dédié et filtres avancés  
✅ **Export CSV** avec sélection de période et filtres multiples  
✅ **Sécurité RLS** stricte (users voient leurs logs, admins voient tout)  
✅ **Fonctions SQL** pour analyses avancées  
✅ **Navigation améliorée** avec liens Shield dans les menus admin  
✅ **Performance optimisée** avec index appropriés  
✅ **Intégration Stripe** automatique via webhooks  
✅ **Conformité RGPD** : traçabilité complète pour audits  

Le système d'audit est maintenant opérationnel et accessible à `/admin/user-roles` (onglet "Historique d'audit") avec export CSV complet.
