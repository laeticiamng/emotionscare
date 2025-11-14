# 🔐 VAPID Keys Setup Guide

**Date:** 2025-11-14
**Purpose:** Configure Web Push Notifications with VAPID (Voluntary Application Server Identification)

---

## What are VAPID Keys?

VAPID keys are cryptographic key pairs used to authenticate your server when sending web push notifications. They ensure that push notifications come from a trusted source.

**Requirements:**
- Node.js and npm installed
- Access to your `.env` file (never commit this!)
- Access to Supabase Edge Functions environment variables

---

## Step 1: Install web-push CLI

```bash
npm install -g web-push
```

Or use npx without installing globally:

```bash
npx web-push generate-vapid-keys
```

---

## Step 2: Generate VAPID Keys

Run the following command:

```bash
npx web-push generate-vapid-keys
```

**Output example:**
```
=======================================

Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U

Private Key:
UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls

=======================================
```

**⚠️ CRITICAL:**
- **Never share your private key publicly**
- **Never commit private key to git**
- Store private key only in secure environment variables

---

## Step 3: Configure Frontend (.env file)

Add the **public key** to your `.env` file:

```bash
# Web Push Notifications - VAPID Public Key
VITE_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U
```

**Note:** The `VITE_` prefix makes it available to the frontend via `import.meta.env.VITE_VAPID_PUBLIC_KEY`

---

## Step 4: Configure Supabase Edge Functions

Add the **private key** to your Supabase project secrets:

### Option A: Via Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
2. Navigate to "Edge Function Secrets" section
3. Add the following secrets:

| Name | Value |
|------|-------|
| `VAPID_PRIVATE_KEY` | Your generated private key |
| `VAPID_PUBLIC_KEY` | Your generated public key |
| `VAPID_SUBJECT` | `mailto:support@emotionscare.com` |

### Option B: Via Supabase CLI

```bash
# Set private key
supabase secrets set VAPID_PRIVATE_KEY="UUxI4O8-FbRouAevSmBQ6o18hgE4nSG3qwvJTfKc-ls"

# Set public key
supabase secrets set VAPID_PUBLIC_KEY="BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"

# Set subject (your email or website URL)
supabase secrets set VAPID_SUBJECT="mailto:support@emotionscare.com"

# Verify secrets are set
supabase secrets list
```

---

## Step 5: Create push_subscriptions Table

Run this SQL migration in Supabase:

```sql
-- Create table for storing push subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own push subscriptions"
  ON public.push_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
  ON public.push_subscriptions(user_id);

COMMENT ON TABLE public.push_subscriptions IS
'Stores web push notification subscriptions for users (VAPID)';
```

---

## Step 6: Test Push Notifications

### Test in Browser Console

```javascript
// Check if service worker is ready
navigator.serviceWorker.ready.then(async (registration) => {
  console.log('Service Worker ready:', registration);

  // Get VAPID public key from env
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  console.log('VAPID key:', vapidKey);

  // Request notification permission
  const permission = await Notification.requestPermission();
  console.log('Permission:', permission);

  if (permission === 'granted') {
    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey)
    });

    console.log('Push subscription:', JSON.stringify(subscription));
  }
});

// Helper function (copy from useOnboarding.ts)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

### Test Sending a Push Notification

Use the `send-push-notification` edge function:

```bash
curl -X POST https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/send-push-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_UUID_HERE",
    "title": "Test Notification",
    "body": "This is a test push notification!",
    "icon": "/logo.png"
  }'
```

---

## Step 7: Verify Configuration

### Check Frontend

```javascript
// Should NOT be undefined
console.log(import.meta.env.VITE_VAPID_PUBLIC_KEY);
```

### Check Edge Functions

In your edge function code:

```typescript
const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY');
const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY');
const vapidSubject = Deno.env.get('VAPID_SUBJECT');

if (!vapidPrivate || !vapidPublic || !vapidSubject) {
  throw new Error('VAPID keys not configured');
}

console.log('VAPID configured:', {
  hasPrivate: !!vapidPrivate,
  hasPublic: !!vapidPublic,
  subject: vapidSubject
});
```

---

## Troubleshooting

### "applicationServerKey is invalid"
- Make sure you're using the correct base64 conversion function
- Verify the VAPID key doesn't have extra whitespace
- Check the key is in URL-safe base64 format

### "VAPID keys not configured" error
- Verify `.env` file is loaded (`VITE_VAPID_PUBLIC_KEY`)
- Check Supabase secrets are set (`supabase secrets list`)
- Restart dev server after changing `.env`

### Push subscription fails silently
- Check browser console for errors
- Verify service worker is registered and active
- Ensure HTTPS (required for service workers)
- Check notification permissions

### Notifications not received
- Verify subscription is saved to `push_subscriptions` table
- Check edge function logs in Supabase Dashboard
- Test with browser DevTools → Application → Service Workers

---

## Security Best Practices

✅ **DO:**
- Store private key in environment variables only
- Use different VAPID keys for dev/staging/production
- Rotate keys periodically (every 6-12 months)
- Monitor failed push attempts

❌ **DON'T:**
- Commit private key to git
- Share private key in Slack/email
- Use same keys across multiple projects
- Hardcode keys in source code

---

## References

- [Web Push Protocol](https://datatracker.ietf.org/doc/html/rfc8030)
- [VAPID Specification](https://datatracker.ietf.org/doc/html/rfc8292)
- [web-push npm package](https://www.npmjs.com/package/web-push)
- [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

---

## Next Steps

After configuring VAPID keys:

1. ✅ Test push notifications in development
2. ✅ Create notification templates for different event types
3. ✅ Set up notification preferences in user settings
4. ✅ Monitor notification delivery rates
5. ✅ Implement notification analytics

**Status:** Ready for Production ✨
