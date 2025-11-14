# 🚀 Production Deployment - Quick Checklist

**Temps estimé:** 45-60 minutes
**Pré-requis:** Accès admin Supabase + Node.js installé

---

## ⚡ SETUP RAPIDE (45 min)

### 1. VAPID Keys (5 min)
```bash
npx web-push generate-vapid-keys

# Copier les clés générées:
# Public Key → .env (VITE_VAPID_PUBLIC_KEY)
# Private Key → Supabase Secrets (VAPID_PRIVATE_KEY)
```

### 2. Email Provider (10 min)
**Recommandé:** Resend (gratuit jusqu'à 3000 emails/mois)

```bash
# 1. Créer compte: https://resend.com
# 2. Obtenir API Key
# 3. Configurer:
supabase secrets set EMAIL_PROVIDER="resend"
supabase secrets set RESEND_API_KEY="re_xxxxx"
supabase secrets set EMAIL_FROM="noreply@emotionscare.com"
```

### 3. Supabase Secrets (5 min)
```bash
supabase secrets set VAPID_PRIVATE_KEY="UUxI4..."
supabase secrets set VAPID_PUBLIC_KEY="BEl62..."
supabase secrets set VAPID_SUBJECT="mailto:support@emotionscare.com"
supabase secrets set FRONTEND_URL="https://app.emotionscare.com"

# Vérifier
supabase secrets list
```

### 4. Frontend .env (2 min)
```bash
VITE_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Storage Bucket (2 min)
**Via Supabase Dashboard:**
- Storage → Create bucket → `gdpr-exports`
- Public: ❌ (Private)
- Max size: 10 MB

### 6. Migrations SQL (10 min)
**Via Supabase Dashboard → SQL Editor**

Copier-coller et exécuter dans l'ordre:
1. `20251114120000_gdpr_storage_support.sql`
2. `20251114120100_audit_notifications_tracking.sql`
3. `20251114120200_invitations_error_tracking.sql`
4. `20251114120300_vr_weekly_materialized_views.sql`
5. `20251114120400_breath_weekly_aggregates_refresh.sql`
6. `20251114120500_push_subscriptions_table.sql`
7. `20251114120600_onboarding_goals_table.sql`
8. `20251114120700_help_article_feedback_table.sql`

### 7. Initial Refresh (2 min)
```sql
SELECT refresh_vr_weekly_views();
SELECT refresh_breath_weekly_metrics();
```

### 8. Tests Validation (10 min)
```bash
# Test email
curl -X POST https://xxx.supabase.co/functions/v1/send-invitation \
  -H "Authorization: Bearer ANON_KEY" \
  -d '{"email":"test@example.com","role":"b2b_user","organizationId":"uuid"}'

# ✅ Vérifier email reçu
```

---

## ✅ CHECKLIST FINALE

### Configuration
- [ ] VAPID keys générées et configurées
- [ ] Email provider configuré (Resend)
- [ ] 7 Supabase secrets définis
- [ ] 2 vars frontend (.env)
- [ ] Bucket `gdpr-exports` créé

### Base de Données
- [ ] 8 migrations appliquées
- [ ] Vues matérialisées créées (4)
- [ ] Initial refresh exécuté
- [ ] RLS policies actives

### Tests
- [ ] Email envoyé et reçu
- [ ] Push notification testée
- [ ] KPIs VR affichés
- [ ] KPIs Breath affichés
- [ ] Onboarding goals fonctionnel

---

## 🚨 TROUBLESHOOTING RAPIDE

### Email non reçu
```bash
# Vérifier secrets
supabase secrets list | grep EMAIL

# Vérifier logs
# Dashboard → Functions → scheduled-audits → Logs
```

### Push notifications échouent
```javascript
// Console browser
console.log(import.meta.env.VITE_VAPID_PUBLIC_KEY); // Doit être défini
console.log(Notification.permission); // Doit être 'granted' ou 'default'
```

### Vues vides
```sql
-- Vérifier données source
SELECT COUNT(*) FROM vr_nebula_sessions;

-- Refresh manuel
SELECT refresh_vr_weekly_views();
```

---

## 📊 MONITORING POST-DÉPLOIEMENT

### Jour 1
- [ ] Email delivery rate >95%
- [ ] Push registration >50%
- [ ] Aucune erreur dans logs edge functions
- [ ] Vues matérialisées peuplées

### Semaine 1
- [ ] Configurer pg_cron pour auto-refresh
- [ ] Monitorer taux d'onboarding
- [ ] Analyser feedback help center
- [ ] Vérifier performance queries

---

## 📞 SUPPORT

**Documentation complète:** `docs/AUDIT_COMPLETION_FINAL_REPORT.md`
**VAPID Setup:** `docs/VAPID_KEYS_SETUP.md`

**En cas de problème:**
1. Vérifier logs Supabase (Dashboard → Functions)
2. Vérifier secrets (supabase secrets list)
3. Consulter troubleshooting guide dans rapport final
