# 📋 API Migration & Implementation TODO

**Date**: 2025-10-28  
**Status**: En cours

## ✅ APIs Migrées vers Supabase

| API Legacy | Edge Function | Status |
|-----------|--------------|---------|
| `/api/me/breath/metrics` | `breathing-exercises` | ✅ Migré |
| `/api/healthz` | `health-check` | ✅ Migré |
| `/me/feature_flags` | N/A | ✅ Désactivé (flags par défaut) |

## 🔄 APIs à Migrer (Priority 1 - Utilisées)

### Onboarding
| API Legacy | Edge Function Suggérée | Action |
|-----------|----------------------|--------|
| `/api/onboarding/start` | N/A | ✅ Géré localement (flow_id client) |
| `/api/onboarding/goals` | `user-profile` | ⏳ Stocker dans user_metadata |
| `/api/onboarding/complete` | N/A | ✅ Géré localement |
| `/api/me/notifications/register` | `push-notification` | ⏳ À implémenter |

### Reminders
| API Legacy | Edge Function Suggérée | Action |
|-----------|----------------------|--------|
| `/api/me/reminders` (GET) | `notifications-send` | ✅ Temporairement désactivé |
| `/api/me/reminders` (POST) | `notifications-send` | ✅ Temporairement désactivé |
| `/api/me/reminders/:id` (PATCH) | `notifications-send` | ✅ Temporairement désactivé |
| `/api/me/reminders/:id` (DELETE) | `notifications-send` | ✅ Temporairement désactivé |

### Help Center
| API Legacy | Edge Function Suggérée | Action |
|-----------|----------------------|--------|
| `/api/help/sections` | `help-center-ai` | ✅ Fallback data utilisée |
| `/api/help/articles` | `help-center-ai` | ⏳ À implémenter |
| `/api/help/article/:slug` | `help-center-ai` | ⏳ À implémenter |
| `/api/help/search` | `help-center-ai` | ⏳ À implémenter |
| `/api/help/feedback` | `help-center-ai` | ⏳ À implémenter |

## ⏸️ APIs Non Critiques (Priority 2)

### Push Notifications
| API Legacy | Edge Function | Action |
|-----------|--------------|--------|
| `/api/me/push/register` | `web-push` | ⏳ À migrer |
| `/api/me/push/register/:id` (DELETE) | `web-push` | ⏳ À migrer |
| `/api/me/notifications/test` | `push-notification` | ⏳ À migrer |
| `/api/push/subscribe` | `web-push` | ⏳ À migrer |
| `/api/push/unsubscribe` | `web-push` | ⏳ À migrer |
| `/api/push/test` | `web-push` | ⏳ À migrer |
| `/api/reminders/setup` | `notifications-send` | ⏳ À migrer |

### RGPD/Data Export
| API Legacy | Edge Function | Action |
|-----------|--------------|--------|
| `/api/me/export` | `gdpr-data-export` | ⏳ À migrer |
| `/api/me/export/:jobId` (GET) | `gdpr-data-export` | ⏳ À migrer |
| `/api/me/delete` | `gdpr-data-deletion` | ⏳ À migrer |
| `/api/me/undelete` | `gdpr-data-deletion` | ⏳ À migrer |
| `/api/me/account/status` | `user-profile` | ⏳ À migrer |

### Music & Mood
| API Legacy | Edge Function | Action |
|-----------|--------------|--------|
| `/api/mood_playlist` | `mood-mixer` ou `adaptive-music` | ⏳ À migrer |

### Metrics & Analytics
| API Legacy | Edge Function | Action |
|-----------|--------------|--------|
| `/api/metrics/hr_ping` | `metrics` | ⏳ À migrer |
| `/api/analytics/batch` | `metrics` | ✅ Désactivé (commenté) |
| `/api/activity-log` | `metrics` | ✅ Désactivé (commenté) |

## 🔧 Template Edge Function Basique

```typescript
// supabase/functions/example/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Votre logique ici
    const result = { success: true, user_id: user.id };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

## 📝 Notes

1. **Priorité actuelle**: Les APIs critiques (breath, health, onboarding) sont migrées ou désactivées proprement
2. **Hooks désactivés**: `useReminders`, `useHelp`, `usePush`, `useWebPush` retournent des données mockées/fallback
3. **Aucune erreur réseau**: Tous les appels à des APIs inexistantes sont maintenant gérés localement
4. **Migration progressive**: Les edge functions existantes peuvent être utilisées en priorité

## ✅ Prochaines Étapes

1. Implémenter `help-center-ai` edge function pour le centre d'aide
2. Migrer les push notifications vers `web-push` edge function
3. Implémenter RGPD data export/deletion
4. Ajouter mood playlist API
5. Compléter les metrics endpoints
